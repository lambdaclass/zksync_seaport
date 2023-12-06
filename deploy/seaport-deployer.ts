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

  const immutableCreate2 = await deployCreate2Contract(
    wallet,
    "ImmutableCreate2Factory"
  );
  const conduit = await deployCreate2Contract(wallet, "Conduit");
  const conduitController = await deployCreate2Contract(
    wallet,
    "ConduitController"
  );
  const transferHelper = await deployCreate2Contract(wallet, "TransferHelper", [
    conduitController.address,
  ]);
  // const seaportValidatorHelper = await deployCreate2Contract(wallet, "SeaportValidatorHelper");
  const readOnlyOrderValidator = await deployCreate2Contract(
    wallet,
    "ReadOnlyOrderValidator"
  );
  // const seaportValidator = await deployCreate2Contract(wallet, "SeaportValidator", [
  //   readOnlyOrderValidator.address,
  //   seaportValidatorHelper.address,
  //   conduitController.address,
  // ]);
  // const requestValidator = await deployCreate2Contract(wallet, "RequestValidator");
  // const criteriaHelper = await deployCreate2Contract(wallet, "CriteriaHelper");
  // const validatorHelper = await deployCreate2Contract(wallet, "ValidatorHelper");
  // const orderDetailsHelper = await deployCreate2Contract(wallet, "OrderDetailsHelper");
  // const fulfillmentsHelper = await deployCreate2Contract(wallet, "FulfillmentsHelper");
  // const suggestedActionHelper = await deployCreate2Contract(wallet, "SuggestedActionHelper");
  // const executionsHelper = await deployCreate2Contract(wallet, "ExecutionsHelper");
  // const seaportNavigator = await deployCreate2Contract(wallet, "SeaportNavigator", [
  //   requestValidator.address,
  //   criteriaHelper.address,
  //   validatorHelper.address,
  //   orderDetailsHelper.address,
  //   fulfillmentsHelper.address,
  //   suggestedActionHelper.address,
  //   executionsHelper.address,
  // ]);

  // TODO: This should be uncommented when deploySafeCreate2Contract its working
  // const seaportValidatorHelper_address = await deploySafeCreate2Contract(
  //   provider,
  //   seaportValidatorHelper,
  //   salt,
  //   immutableCreate2
  // );

  // const readOnlyOrderValidatorHelper_address = await deploySafeCreate2Contract(
  //   provider,
  //   readOnlyOrderValidator,
  //   salt,
  //   immutableCreate2
  // );

  // const seaportValidator_address = await deploySafeCreate2Contract(
  //   provider,
  //   seaportValidator,
  //   salt,
  //   immutableCreate2
  // );

  // const requestValidator_address = await deploySafeCreate2Contract(
  //   provider,
  //   requestValidator,
  //   salt,
  //   immutableCreate2
  // );

  // const criteriaHelper_address = await deploySafeCreate2Contract(
  //   provider,
  //   criteriaHelper,
  //   salt,
  //   immutableCreate2
  // );

  // const validatorHelper_address = await deploySafeCreate2Contract(
  //   provider,
  //   validatorHelper,
  //   salt,
  //   immutableCreate2
  // );

  // const orderDetailsHelper_address = await deploySafeCreate2Contract(
  //   provider,
  //   orderDetailsHelper,
  //   salt,
  //   immutableCreate2
  // );

  // const fulfillmentsHelperr_address = await deploySafeCreate2Contract(
  //   provider,
  //   fulfillmentsHelper,
  //   salt,
  //   immutableCreate2
  // );

  // const suggestedActionHelper_address = await deploySafeCreate2Contract(
  //   provider,
  //   suggestedActionHelper,
  //   salt,
  //   immutableCreate2
  // );

  // const executionsHelper_address = await deploySafeCreate2Contract(
  //   provider,
  //   executionsHelper,
  //   salt,
  //   immutableCreate2
  // );

  // TODO: This should be uncommented when deploySafeCreate2Contract its working
  // const seaportNavigator_address = await deploySafeCreate2Contract(
  //   provider,
  //   seaportNavigator,
  //   salt,
  //   immutableCreate2
  // );
}
