import { Address } from "zksync-web3/build/src/types";
import { deployContract, getProvider, getWallet} from "./utils";
import { ethers } from 'ethers';
import * as hre from "hardhat";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY) throw "⛔️ Private key not detected! Add it to the .env file!";

export function getSalt(sender: Address): string {
  const lastBytes = ethers.utils.keccak256("lambda").slice(0, 12);
  const salt = ethers.utils.concat([sender, lastBytes]);
  return ethers.utils.hexlify(salt);
}

export default async function () {
  const provider = getProvider();
  const wallet = getWallet();
  const deployer = new Deployer(hre, wallet);
  const salt = getSalt(wallet.address);

  const immutableCreate2 = await deployContract(deployer, wallet, "ImmutableCreate2Factory");

  // Deploy conduit-related contracts
  const coduitControllerArtifact = "ConduitController";
  const coduitController = await deployContract(deployer, wallet, coduitControllerArtifact);
  const conduitArtifact = "Conduit";
  await deployContract(deployer, wallet, conduitArtifact);

  // Deploy Helpers contract
  const transferHelperArtifact = "TransferHelper";
  const transferHelper = await deployContract(deployer, wallet, transferHelperArtifact, [coduitController.address]);

  // Deploy with safeCreate2
  const transactionTransferHelper = await provider.getTransaction(transferHelper.deployTransaction.hash);
  const creationCodeTransferHelper = transactionTransferHelper.data;
  
  const transferHelper_address = await immutableCreate2.safeCreate2(salt , creationCodeTransferHelper, {gasLimit: 1000000}); 
  
  // Deploy Seaport contract
  const seaportArtifact = "Seaport";
  const seaport = await deployContract(deployer, wallet, seaportArtifact, [coduitController.address]);

  // Deploy with safeCreate2
  const transaction = await provider.getTransaction(seaport.deployTransaction.hash);
  const creationCode = transaction.data;
  
  const seaport_address = await immutableCreate2.safeCreate2(salt , creationCode, {gasLimit: 1000000}); 
   
  // Deploy navigator contracts
  const seaportValidatorHelperArtifact = "SeaportValidatorHelper";
  const seaportValidatorHelper = await deployContract(deployer, wallet, seaportValidatorHelperArtifact);
  const transactionSeaportValidatorHelper = await provider.getTransaction(seaportValidatorHelper.deployTransaction.hash);
  const creationCodeSeaportValidatorHelper = transactionSeaportValidatorHelper.data;
  const seaportValidatorHelper_address = await immutableCreate2.safeCreate2(salt , creationCodeSeaportValidatorHelper, {gasLimit: 1000000}); 

  const readOnlyOrderValidatorArtifact = "ReadOnlyOrderValidator";
  const readOnlyOrderValidatorHelper = await deployContract(deployer, wallet, readOnlyOrderValidatorArtifact);
  const transactionReadOnlyOrderValidatorHelper = await provider.getTransaction(readOnlyOrderValidatorHelper.deployTransaction.hash);
  const creationCodeReadOnlyOrderValidatorHelper = transactionReadOnlyOrderValidatorHelper.data;
  const creationCodeReadOnlyOrderValidatorHelper_address = await immutableCreate2.safeCreate2(salt , creationCodeReadOnlyOrderValidatorHelper, {gasLimit: 1000000}); 

  const seaportValidatorArtifact = "SeaportValidator";
  const seaportValidator = await deployContract(deployer, wallet, seaportValidatorArtifact, [readOnlyOrderValidatorHelper.address, seaportValidatorHelper.address, coduitController.address]);
  const transactionSeaportValidator = await provider.getTransaction(seaportValidator.deployTransaction.hash);
  const creationCodeSeaportValidator = transactionSeaportValidator.data;
  const seaportValidator_address = await immutableCreate2.safeCreate2(salt , creationCodeSeaportValidator , {gasLimit: 1000000}); 

  const requestValidatorArtifact = "RequestValidator";
  const requestValidator = await deployContract(deployer, wallet, requestValidatorArtifact);
  const transactionRequestValidator = await provider.getTransaction(requestValidator.deployTransaction.hash);
  const creationCodeRequestValidator = transactionRequestValidator.data;
  const requestValidator_address = await immutableCreate2.safeCreate2(salt , creationCodeRequestValidator, {gasLimit: 1000000}); 

  const criteriaHelperArtifact = "CriteriaHelper";
  const criteriaHelper = await deployContract(deployer, wallet, criteriaHelperArtifact);
  const transactioncriteriaHelper = await provider.getTransaction(criteriaHelper.deployTransaction.hash);
  const creationCodecriteriaHelper = transactioncriteriaHelper.data;
  const criteriaHelper_address = await immutableCreate2.safeCreate2(salt , creationCodecriteriaHelper, {gasLimit: 1000000}); 

  const validatorHelperArtifact = "ValidatorHelper";
  const validatorHelper = await deployContract(deployer, wallet, validatorHelperArtifact);
  const transactionvalidatorHelper = await provider.getTransaction(validatorHelper.deployTransaction.hash);
  const creationCodevalidatorHelper = transactionvalidatorHelper.data;
  const validatorHelper_address = await immutableCreate2.safeCreate2(salt , creationCodevalidatorHelper, {gasLimit: 1000000}); 

  const orderDetailsHelperArtifact = "OrderDetailsHelper";
  const orderDetailsHelper = await deployContract(deployer, wallet, orderDetailsHelperArtifact);
  const transactionorderDetailsHelper = await provider.getTransaction(orderDetailsHelper.deployTransaction.hash);
  const creationCodeorderDetailsHelper = transactionorderDetailsHelper.data;
  const orderDetailsHelper_address = await immutableCreate2.safeCreate2(salt , creationCodeorderDetailsHelper, {gasLimit: 1000000}); 

  const fulfillmentsHelperArtifact = "FulfillmentsHelper";
  const fulfillmentsHelper = await deployContract(deployer, wallet, fulfillmentsHelperArtifact);
  const transactionfulfillmentsHelper = await provider.getTransaction(fulfillmentsHelper.deployTransaction.hash);
  const creationCodefulfillmentsHelper = transactionfulfillmentsHelper.data;
  const fulfillmentsHelperr_address = await immutableCreate2.safeCreate2(salt , creationCodefulfillmentsHelper, {gasLimit: 1000000}); 

  const suggestedActionHelperArtifact = "SuggestedActionHelper";
  const suggestedActionHelper = await deployContract(deployer, wallet, suggestedActionHelperArtifact);
  const transactionsuggestedActionHelper = await provider.getTransaction(suggestedActionHelper.deployTransaction.hash);
  const creationCodesuggestedActionHelper = transactionsuggestedActionHelper.data;
  const suggestedActionHelper_address = await immutableCreate2.safeCreate2(salt , creationCodesuggestedActionHelper, {gasLimit: 1000000}); 

  const executionsHelperArtifact = "ExecutionsHelper";
  const executionsHelper = await deployContract(deployer, wallet, executionsHelperArtifact);
  const transactionexecutionsHelper = await provider.getTransaction(executionsHelper.deployTransaction.hash);
  const creationCodeExecutionsHelper = transactionexecutionsHelper.data;
  const executionsHelper_address = await immutableCreate2.safeCreate2(salt , creationCodeExecutionsHelper, {gasLimit: 1000000}); 

  const seaportNavigatorArtifact = "SeaportNavigator";
  const seaportNavigator = await deployContract(deployer, wallet, seaportNavigatorArtifact, 
    [requestValidator.address, 
      criteriaHelper.address, 
      validatorHelper.address, 
      orderDetailsHelper.address,
      fulfillmentsHelper.address,
      suggestedActionHelper.address,
      executionsHelper.address
    ]);
    const transactionseaportNavigator = await provider.getTransaction(seaportNavigator.deployTransaction.hash);
    const creationCodeseaportNavigator = transactionseaportNavigator.data;
    const seaportNavigator_address = await immutableCreate2.safeCreate2(salt , creationCodeseaportNavigator, {gasLimit: 1000000}); 
  
   
}
