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
  const conduit = await deployCreate2Contract(wallet, "Conduit");
  const conduitController = await deployCreate2Contract(wallet, "ConduitController");
  const transferHelper = await deployCreate2Contract(wallet, "TransferHelper", [conduitController.address]);
  // const seaportValidatorHelper = await deployCreate2Contract(wallet, "SeaportValidatorHelper");
  
  // const seaport = await deployCreate2Contract(wallet, "Seaport", [conduitController.address]);

  // // Deploy navigator contracts

  // const seaportValidatorHelperArtifact = "SeaportValidatorHelper";
  // const seaportValidatorHelper = await deployContract(
  //   deployer,
  //   wallet,
  //   seaportValidatorHelperArtifact
  // );

  // TODO: This should be uncommented when deploySafeCreate2Contract its working
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

  // TODO: This should be uncommented when deploySafeCreate2Contract its working
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

  // TODO: This should be uncommented when deploySafeCreate2Contract its working
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

  // TODO: This should be uncommented when deploySafeCreate2Contract its working
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

  // TODO: This should be uncommented when deploySafeCreate2Contract its working
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

  // TODO: This should be uncommented when deploySafeCreate2Contract its working
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

  // TODO: This should be uncommented when deploySafeCreate2Contract its working
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

  // TODO: This should be uncommented when deploySafeCreate2Contract its working
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

  // TODO: This should be uncommented when deploySafeCreate2Contract its working
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

  // TODO: This should be uncommented when deploySafeCreate2Contract its working
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

  // TODO: This should be uncommented when deploySafeCreate2Contract its working
  // const seaportNavigator_address = await deploySafeCreate2Contract(
  //   provider,
  //   seaportNavigator,
  //   salt,
  //   immutableCreate2
  // );
}
