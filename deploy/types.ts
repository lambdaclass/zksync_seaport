import type {
    BaseContract,
    BigNumber,
    BigNumberish,
    BytesLike,
    CallOverrides,
    ContractTransaction,
    Overrides,
    PayableOverrides,
    PopulatedTransaction,
    utils,
} from "ethers";

import type {
    TypedEventFilter,
    TypedEvent,
    TypedListener,
    OnEvent,
  } from "./common";
import { Provider, Signer} from "zksync-web3";
import type { Listener} from "@ethersproject/providers";

export type AdditionalRecipientStruct = {
    amount: BigNumberish;
    recipient: string;
  };

export type BasicOrderParametersStruct = {
    considerationToken: string;
    considerationIdentifier: BigNumberish;
    considerationAmount: BigNumberish;
    offerer: string;
    zone: string;
    offerToken: string;
    offerIdentifier: BigNumberish;
    offerAmount: BigNumberish;
    basicOrderType: BigNumberish;
    startTime: BigNumberish;
    endTime: BigNumberish;
    zoneHash: BytesLike;
    salt: BigNumberish;
    offererConduitKey: BytesLike;
    fulfillerConduitKey: BytesLike;
    totalOriginalAdditionalRecipients: BigNumberish;
    additionalRecipients: AdditionalRecipientStruct[];
    signature: BytesLike;
  };

export type FulfillmentStruct = {
    offerComponents: FulfillmentComponentStruct[];
    considerationComponents: FulfillmentComponentStruct[];
  };

export type FulfillmentComponentStruct = {
    orderIndex: BigNumberish;
    itemIndex: BigNumberish;
  };

export type CriteriaResolverStruct = {
    orderIndex: BigNumberish;
    side: BigNumberish;
    index: BigNumberish;
    identifier: BigNumberish;
    criteriaProof: BytesLike[];
  };

export type AdvancedOrderStruct = {
    parameters: OrderParametersStruct;
    numerator: BigNumberish;
    denominator: BigNumberish;
    signature: BytesLike;
    extraData: BytesLike;
  };

export type ConsiderationItemStruct = {
    itemType: BigNumberish;
    token: string;
    identifierOrCriteria: BigNumberish;
    startAmount: BigNumberish;
    endAmount: BigNumberish;
    recipient: string;
  };

export type OrderComponentsStruct = {
    offerer: string;
    zone: string;
    offer: OfferItemStruct[];
    consideration: ConsiderationItemStruct[];
    orderType: BigNumberish;
    startTime: BigNumberish;
    endTime: BigNumberish;
    zoneHash: BytesLike;
    salt: BigNumberish;
    conduitKey: BytesLike;
    counter: BigNumberish;
};

export type OfferItemStruct = {
itemType: BigNumberish;
token: string;
identifierOrCriteria: BigNumberish;
startAmount: BigNumberish;
endAmount: BigNumberish;
};

export type OrderParametersStruct = {
offerer: string;
zone: string;
offer: OfferItemStruct[];
consideration: ConsiderationItemStruct[];
orderType: BigNumberish;
startTime: BigNumberish;
endTime: BigNumberish;
zoneHash: BytesLike;
salt: BigNumberish;
conduitKey: BytesLike;
totalOriginalConsiderationItems: BigNumberish;
};

export type OrderStruct = {
parameters: OrderParametersStruct;
signature: BytesLike;
};

type MatchOrdersFulfillmentComponent = {
    orderIndex: number;
    itemIndex: number;
};

export type MatchOrdersFulfillment = {
offerComponents: MatchOrdersFulfillmentComponent[];
considerationComponents: MatchOrdersFulfillmentComponent[];
};

export interface Seaport extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
  
    //interface: SeaportInterface;
  
    queryFilter<TEvent extends TypedEvent>(
      event: TypedEventFilter<TEvent>,
      fromBlockOrBlockhash?: string | number | undefined,
      toBlock?: string | number | undefined
    ): Promise<Array<TEvent>>;
  
    listeners<TEvent extends TypedEvent>(
      eventFilter?: TypedEventFilter<TEvent>
    ): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(
      eventFilter: TypedEventFilter<TEvent>
    ): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
  
    functions: {
      cancel(
        orders: OrderComponentsStruct[],
        overrides?: Overrides & { from?: string }
      ): Promise<ContractTransaction>;
  
      fulfillAdvancedOrder(
        arg0: AdvancedOrderStruct,
        arg1: CriteriaResolverStruct[],
        fulfillerConduitKey: BytesLike,
        recipient: string,
        overrides?: PayableOverrides & { from?: string }
      ): Promise<ContractTransaction>;
  
      fulfillAvailableAdvancedOrders(
        arg0: AdvancedOrderStruct[],
        arg1: CriteriaResolverStruct[],
        arg2: FulfillmentComponentStruct[][],
        arg3: FulfillmentComponentStruct[][],
        fulfillerConduitKey: BytesLike,
        recipient: string,
        maximumFulfilled: BigNumberish,
        overrides?: PayableOverrides & { from?: string }
      ): Promise<ContractTransaction>;
  
      fulfillAvailableOrders(
        arg0: OrderStruct[],
        arg1: FulfillmentComponentStruct[][],
        arg2: FulfillmentComponentStruct[][],
        fulfillerConduitKey: BytesLike,
        maximumFulfilled: BigNumberish,
        overrides?: PayableOverrides & { from?: string }
      ): Promise<ContractTransaction>;
  
      fulfillBasicOrder(
        parameters: BasicOrderParametersStruct,
        overrides?: PayableOverrides & { from?: string }
      ): Promise<ContractTransaction>;
  
      fulfillBasicOrder_efficient_6GL6yc(
        parameters: BasicOrderParametersStruct,
        overrides?: PayableOverrides & { from?: string }
      ): Promise<ContractTransaction>;
  
      fulfillOrder(
        arg0: OrderStruct,
        fulfillerConduitKey: BytesLike,
        overrides?: PayableOverrides & { from?: string }
      ): Promise<ContractTransaction>;
  
      getContractOffererNonce(
        contractOfferer: string,
        overrides?: CallOverrides
      ): Promise<[BigNumber] & { nonce: BigNumber }>;
  
      getCounter(
        offerer: string,
        overrides?: CallOverrides
      ): Promise<[BigNumber] & { counter: BigNumber }>;
  
      getOrderHash(
        arg0: OrderComponentsStruct,
        overrides?: CallOverrides
      ): Promise<[string] & { orderHash: string }>;
  
      getOrderStatus(
        orderHash: BytesLike,
        overrides?: CallOverrides
      ): Promise<
        [boolean, boolean, BigNumber, BigNumber] & {
          isValidated: boolean;
          isCancelled: boolean;
          totalFilled: BigNumber;
          totalSize: BigNumber;
        }
      >;
  
      incrementCounter(
        overrides?: Overrides & { from?: string }
      ): Promise<ContractTransaction>;
  
      information(
        overrides?: CallOverrides
      ): Promise<
        [string, string, string] & {
          version: string;
          domainSeparator: string;
          conduitController: string;
        }
      >;
  
      matchAdvancedOrders(
        arg0: AdvancedOrderStruct[],
        arg1: CriteriaResolverStruct[],
        arg2: FulfillmentStruct[],
        recipient: string,
        overrides?: PayableOverrides & { from?: string }
      ): Promise<ContractTransaction>;
  
      matchOrders(
        arg0: OrderStruct[],
        arg1: FulfillmentStruct[],
        overrides?: PayableOverrides & { from?: string }
      ): Promise<ContractTransaction>;
  
      name(overrides?: CallOverrides): Promise<[string]>;
  
      validate(
        arg0: OrderStruct[],
        overrides?: Overrides & { from?: string }
      ): Promise<ContractTransaction>;
    };
  
}
// Overrides matchOrders types to fix fulfillments type which is generated
// by TypeChain incorrectly
export type SeaportContract = Seaport & {
    encodeFunctionData(
      functionFragment: "matchOrders",
      values: [OrderStruct[], MatchOrdersFulfillment[]],
    ): string;
  
    matchOrders(
      orders: OrderStruct[],
      fulfillments: MatchOrdersFulfillment[],
      overrides?: PayableOverrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;
  
    functions: Seaport["functions"] & {
      matchOrders(
        orders: OrderStruct[],
        fulfillments: MatchOrdersFulfillment[],
        overrides?: PayableOverrides & { from?: string | Promise<string> },
      ): Promise<ContractTransaction>;
    };
  
    callStatic: Seaport["callStatic"] & {
      matchOrders(
        orders: OrderStruct[],
        fulfillments: MatchOrdersFulfillment[],
        overrides?: PayableOverrides & { from?: string | Promise<string> },
      ): Promise<ContractTransaction>;
    };
  
    estimateGas: Seaport["estimateGas"] & {
      matchOrders(
        orders: OrderStruct[],
        fulfillments: MatchOrdersFulfillment[],
        overrides?: PayableOverrides & { from?: string | Promise<string> },
      ): Promise<BigNumber>;
    };
  
    populateTransaction: Seaport["populateTransaction"] & {
      matchOrders(
        orders: OrderStruct[],
        fulfillments: MatchOrdersFulfillment[],
        overrides?: PayableOverrides & { from?: string | Promise<string> },
      ): Promise<PopulatedTransaction>;
    };
  };
