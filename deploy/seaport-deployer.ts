import { Address } from "zksync-web3/build/src/types";
import {
  deployContract,
  getProvider,
  getWallet,
  deploySafeCreate2Contract,
  deployCreate2Contract,
} from "./utils";
import { ethers } from "ethers";
import * as hre from "hardhat";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";

export function getSalt(sender: Address): string {
  const lastBytes = ethers.utils
    .keccak256(ethers.utils.toUtf8Bytes("lambda"))
    .slice(0, 26);
  const salt = ethers.utils.concat([sender, lastBytes]);
  return ethers.utils.hexlify(salt);
}

export default async function () {
  const wallet = getWallet();
  // const salt = getSalt(wallet.address);

  const immutableCreate2 = await deployCreate2Contract(wallet, "ImmutableCreate2Factory");
  // const conduitController = await deployCreate2Contract(wallet, "ConduitController");
  const conduit = await deployCreate2Contract(wallet, "Conduit");
  // TODO: This should be conduit controller address instead of conduit address.
  const transferHelper = await deployCreate2Contract(wallet, "TransferHelper", [conduit.address]);

  // // Deploy Helpers contract
  // const transferHelperArtifact = "TransferHelper";
  // const transferHelper = await deployContract(
  //   deployer,
  //   wallet,
  //   transferHelperArtifact,
  //   [coduitController.address]
  // );

  // // Deploy with safeCreate2
  // const transferHelper_address = await deploySafeCreate2Contract(
  //   provider,
  //   transferHelper,
  //   salt,
  //   immutableCreate2
  // );

  // // Deploy Seaport contract
  // const seaportArtifact = "Seaport";
  // const seaport = await deployContract(deployer, wallet, seaportArtifact, [
  //   coduitController.address,
  // ]);

  // // Deploy with safeCreate2
  // const seaport_address = await deploySafeCreate2Contract(
  //   provider,
  //   seaport,
  //   salt,
  //   immutableCreate2
  // );

  // // Deploy navigator contracts

  // const seaportValidatorHelperArtifact = "SeaportValidatorHelper";
  // const seaportValidatorHelper = await deployContract(
  //   deployer,
  //   wallet,
  //   seaportValidatorHelperArtifact
  // );
  // const seaportValidatorHelper_address = await deploySafeCreate2Contract(
  //   provider,
  //   seaportValidatorHelper,
  //   salt,
  //   immutableCreate2
  // );

  // const readOnlyOrderValidatorArtifact = "ReadOnlyOrderValidator";
  // const readOnlyOrderValidatorHelper = await deployContract(
  //   deployer,
  //   wallet,
  //   readOnlyOrderValidatorArtifact
  // );
  // const readOnlyOrderValidatorHelper_address = await deploySafeCreate2Contract(
  //   provider,
  //   readOnlyOrderValidatorHelper,
  //   salt,
  //   immutableCreate2
  // );

  // const seaportValidatorArtifact = "SeaportValidator";
  // const seaportValidator = await deployContract(
  //   deployer,
  //   wallet,
  //   seaportValidatorArtifact,
  //   [
  //     readOnlyOrderValidatorHelper.address,
  //     seaportValidatorHelper.address,
  //     coduitController.address,
  //   ]
  // );
  // const seaportValidator_address = await deploySafeCreate2Contract(
  //   provider,
  //   seaportValidator,
  //   salt,
  //   immutableCreate2
  // );

  // const requestValidatorArtifact = "RequestValidator";
  // const requestValidator = await deployContract(
  //   deployer,
  //   wallet,
  //   requestValidatorArtifact
  // );
  // const requestValidator_address = await deploySafeCreate2Contract(
  //   provider,
  //   requestValidator,
  //   salt,
  //   immutableCreate2
  // );

  // const criteriaHelperArtifact = "CriteriaHelper";
  // const criteriaHelper = await deployContract(
  //   deployer,
  //   wallet,
  //   criteriaHelperArtifact
  // );
  // const criteriaHelper_address = await deploySafeCreate2Contract(
  //   provider,
  //   criteriaHelper,
  //   salt,
  //   immutableCreate2
  // );

  // const validatorHelperArtifact = "ValidatorHelper";
  // const validatorHelper = await deployContract(
  //   deployer,
  //   wallet,
  //   validatorHelperArtifact
  // );
  // const validatorHelper_address = await deploySafeCreate2Contract(
  //   provider,
  //   validatorHelper,
  //   salt,
  //   immutableCreate2
  // );

  // const orderDetailsHelperArtifact = "OrderDetailsHelper";
  // const orderDetailsHelper = await deployContract(
  //   deployer,
  //   wallet,
  //   orderDetailsHelperArtifact
  // );
  // const orderDetailsHelper_address = await deploySafeCreate2Contract(
  //   provider,
  //   orderDetailsHelper,
  //   salt,
  //   immutableCreate2
  // );

  // const fulfillmentsHelperArtifact = "FulfillmentsHelper";
  // const fulfillmentsHelper = await deployContract(
  //   deployer,
  //   wallet,
  //   fulfillmentsHelperArtifact
  // );
  // const fulfillmentsHelperr_address = await deploySafeCreate2Contract(
  //   provider,
  //   fulfillmentsHelper,
  //   salt,
  //   immutableCreate2
  // );

  // const suggestedActionHelperArtifact = "SuggestedActionHelper";
  // const suggestedActionHelper = await deployContract(
  //   deployer,
  //   wallet,
  //   suggestedActionHelperArtifact
  // );
  // const suggestedActionHelper_address = await deploySafeCreate2Contract(
  //   provider,
  //   suggestedActionHelper,
  //   salt,
  //   immutableCreate2
  // );

  // const executionsHelperArtifact = "ExecutionsHelper";
  // const executionsHelper = await deployContract(
  //   deployer,
  //   wallet,
  //   executionsHelperArtifact
  // );
  // const executionsHelper_address = await deploySafeCreate2Contract(
  //   provider,
  //   executionsHelper,
  //   salt,
  //   immutableCreate2
  // );

  // const seaportNavigatorArtifact = "SeaportNavigator";
  // const seaportNavigator = await deployContract(
  //   deployer,
  //   wallet,
  //   seaportNavigatorArtifact,
  //   [
  //     requestValidator.address,
  //     criteriaHelper.address,
  //     validatorHelper.address,
  //     orderDetailsHelper.address,
  //     fulfillmentsHelper.address,
  //     suggestedActionHelper.address,
  //     executionsHelper.address,
  //   ]
  // );
  // const seaportNavigator_address = await deploySafeCreate2Contract(
  //   provider,
  //   seaportNavigator,
  //   salt,
  //   immutableCreate2
  // );
}
