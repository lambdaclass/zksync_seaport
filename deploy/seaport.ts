import type {
    SeaportConfig,
    CreateOrderAction,
    CreateOrderInput,
    DomainRegistryContract,
    OrderUseCase,
    OrderWithCounter,
    SeaportContract,
    Signer,
} from "./types";

import {
BigNumber,
BigNumberish,
Contract,
ethers,
PayableOverrides,
providers,
} from "ethers";

export class Seaport {
    // Provides the raw interface to the contract for flexibility
    public contract: SeaportContract;
  
    public domainRegistry: DomainRegistryContract;
  
    private provider: providers.Provider;
  
    private signer?: Signer;
  
    // Use the multicall provider for reads for batching and performance optimisations
    // NOTE: Do NOT await between sequential requests if you're intending to batch
    // instead, use Promise.all() and map to fetch data in parallel
    // https://www.npmjs.com/package/@0xsequence/multicall
    private multicallProvider: multicallProviders.MulticallProvider;
  
    private config: Required<Omit<SeaportConfig, "overrides">>;
  
    private defaultConduitKey: string;
  
    readonly OPENSEA_CONDUIT_KEY: string = OPENSEA_CONDUIT_KEY;
  
    /**
     * @param providerOrSigner - The provider or signer to use for web3-related calls
     * @param considerationConfig - A config to provide flexibility in the usage of Seaport
     */
    public constructor(
      providerOrSigner: providers.JsonRpcProvider | Signer,
      {
        overrides,
        // Five minute buffer
        ascendingAmountFulfillmentBuffer = 300,
        balanceAndApprovalChecksOnOrderCreation = true,
        conduitKeyToConduit,
        seaportVersion = "1.5",
      }: SeaportConfig = {},
    ) {
      const provider =
        providerOrSigner instanceof providers.Provider
          ? providerOrSigner
          : providerOrSigner.provider;
      this.signer = (providerOrSigner as Signer)._isSigner
        ? (providerOrSigner as Signer)
        : undefined;
  
      if (!provider) {
        throw new Error(
          "Either a provider or custom signer with provider must be provided",
        );
      }
  
      this.provider = provider;
  
      this.multicallProvider = new multicallProviders.MulticallProvider(
        this.provider,
      );
  
      this.contract = new Contract(
        overrides?.contractAddress ??
          (seaportVersion === "1.5"
            ? CROSS_CHAIN_SEAPORT_V1_5_ADDRESS
            : CROSS_CHAIN_SEAPORT_V1_4_ADDRESS),
        SeaportABIv14,
        this.multicallProvider,
      ) as SeaportContract;
  
      this.domainRegistry = new Contract(
        overrides?.domainRegistryAddress ?? DOMAIN_REGISTRY_ADDRESS,
        DomainRegistryABI,
        this.multicallProvider,
      ) as DomainRegistryContract;
  
      this.config = {
        ascendingAmountFulfillmentBuffer,
        balanceAndApprovalChecksOnOrderCreation,
        conduitKeyToConduit: {
          ...KNOWN_CONDUIT_KEYS_TO_CONDUIT,
          [NO_CONDUIT]: this.contract.address,
          ...conduitKeyToConduit,
        },
        seaportVersion,
      };
  
      this.defaultConduitKey = overrides?.defaultConduitKey ?? NO_CONDUIT;
    }
  
    /**
     * Returns a use case that will create an order.
     * The use case will contain the list of actions necessary to finish creating an order.
     * The list of actions will either be an approval if approvals are necessary
     * or a signature request that will then be supplied into the final Order struct, ready to be fulfilled.
     *
     * @param input
     * @param input.conduitKey The conduitKey key to derive where to source your approvals from. Defaults to 0 which refers to the Seaport contract.
     *                         Another special value is address(1) will refer to the legacy proxy. All other must derive to the specified address.
     * @param input.zone The zone of the order. Defaults to the zero address.
     * @param input.startTime The start time of the order. Defaults to the current unix time.
     * @param input.endTime The end time of the order. Defaults to "never end".
     *                      It is HIGHLY recommended to pass in an explicit end time
     * @param input.offer The items you are willing to offer. This is a condensed version of the Seaport struct OfferItem for convenience
     * @param input.consideration The items that will go to their respective recipients upon receiving your offer.
     * @param input.counter The counter from which to create the order with. Automatically fetched from the contract if not provided
     * @param input.allowPartialFills Whether to allow the order to be partially filled
     * @param input.restrictedByZone Whether the order should be restricted by zone
     * @param input.fees Convenience array to apply fees onto the order. The fees will be deducted from the
     *                   existing consideration items and then tacked on as new consideration items
     * @param input.domain An optional domain to be hashed and included in the first four bytes of the random salt.
     * @param input.salt Arbitrary salt. If not passed in, a random salt will be generated with the first four bytes being the domain hash or empty.
     * @param input.offerer The order's creator address. Defaults to the first address on the provider.
     * @param accountAddress Optional address for which to create the order with
     * @param exactApproval optional boolean to indicate whether the approval should be exact or not
     * @returns a use case containing the list of actions needed to be performed in order to create the order
     */
    public async createOrder(
      input: CreateOrderInput,
      accountAddress?: string,
      exactApproval?: boolean,
    ): Promise<OrderUseCase<CreateOrderAction>> {
      const signer = this._getSigner(accountAddress);
      const offerer = accountAddress ?? (await signer.getAddress());
  
      const { orderComponents, approvalActions } = await this._formatOrder(
        signer,
        offerer,
        Boolean(exactApproval),
        input,
      );
  
      const createOrderAction = {
        type: "create",
        getMessageToSign: () => {
          return this._getMessageToSign(orderComponents);
        },
        createOrder: async () => {
          const signature = await this.signOrder(orderComponents, offerer);
  
          return {
            parameters: orderComponents,
            signature,
          };
        },
      } as const;
  
      const actions = [...approvalActions, createOrderAction] as const;
  
      return {
        actions,
        executeAllActions: () =>
          executeAllActions(actions) as Promise<OrderWithCounter>,
      };
    }
}  
