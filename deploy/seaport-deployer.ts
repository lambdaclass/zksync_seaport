import { deployContract, getProvider} from "./utils";
import { ethers } from 'ethers';

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY) throw "⛔️ Private key not detected! Add it to the .env file!";

export default async function () {
  const provider = await getProvider();
  const salt = "0x00000000000000000000000000000000000000000000fcc21169b803f25d2210";
  const bytesFormat = ethers.utils.arrayify(salt);

  // Deploy CREATE2-related contracts
  const immutableCreate2FactoryInterfaceArtifact = "ImmutableCreate2Factory";
  const immutableCreate2 = await deployContract(immutableCreate2FactoryInterfaceArtifact);

  // Deploy conduit-related contracts
  const coduitControllerArtifact = "ConduitController";
  const coduitController = await deployContract(coduitControllerArtifact);
  const conduitArtifact = "Conduit";
  await deployContract(conduitArtifact);

  // Deploy Helpers contract
  const transferHelperArtifact = "TransferHelper";
  const transferHelper = await deployContract(transferHelperArtifact, [coduitController.address]);

  // Deploy with safeCreate2
  const transactionTransferHelper = await provider.getTransaction(transferHelper.deployTransaction.hash);
  const creationCodeTransferHelper = transactionTransferHelper.data;
  
  const transferHelper_address = await immutableCreate2.safeCreate2(bytesFormat , creationCodeTransferHelper, {gasLimit: 1000000}); 
  
  // Deploy Seaport contract
  const seaportArtifact = "Seaport";
  const seaport = await deployContract(seaportArtifact, [coduitController.address]);

  // Deploy with safeCreate2
  const transaction = await provider.getTransaction(seaport.deployTransaction.hash);
  const creationCode = transaction.data;
  
  const seaport_address = await immutableCreate2.safeCreate2(bytesFormat , creationCode, {gasLimit: 1000000}); 
   
  // Deploy navigator contracts
  const seaportValidatorHelperArtifact = "SeaportValidatorHelper";
  const seaportValidatorHelper = await deployContract(seaportValidatorHelperArtifact);
  const transactionSeaportValidatorHelper = await provider.getTransaction(seaportValidatorHelper.deployTransaction.hash);
  const creationCodeSeaportValidatorHelper = transactionSeaportValidatorHelper.data;
  const seaportValidatorHelper_address = await immutableCreate2.safeCreate2(bytesFormat , creationCodeSeaportValidatorHelper, {gasLimit: 1000000}); 

  const readOnlyOrderValidatorArtifact = "ReadOnlyOrderValidator";
  const readOnlyOrderValidatorHelper = await deployContract(readOnlyOrderValidatorArtifact);
  const transactionReadOnlyOrderValidatorHelper = await provider.getTransaction(readOnlyOrderValidatorHelper.deployTransaction.hash);
  const creationCodeReadOnlyOrderValidatorHelper = transactionReadOnlyOrderValidatorHelper.data;
  const creationCodeReadOnlyOrderValidatorHelper_address = await immutableCreate2.safeCreate2(bytesFormat , creationCodeReadOnlyOrderValidatorHelper, {gasLimit: 1000000}); 

  const seaportValidatorArtifact = "SeaportValidator";
  const seaportValidator = await deployContract(seaportValidatorArtifact, [readOnlyOrderValidatorHelper.address, seaportValidatorHelper.address, coduitController.address]);
  const transactionSeaportValidator = await provider.getTransaction(seaportValidator.deployTransaction.hash);
  const creationCodeSeaportValidator = transactionSeaportValidator.data;
  const seaportValidator_address = await immutableCreate2.safeCreate2(bytesFormat , creationCodeSeaportValidator , {gasLimit: 1000000}); 

  const requestValidatorArtifact = "RequestValidator";
  const requestValidator = await deployContract(requestValidatorArtifact);
  const transactionRequestValidator = await provider.getTransaction(requestValidator.deployTransaction.hash);
  const creationCodeRequestValidator = transactionRequestValidator.data;
  const requestValidator_address = await immutableCreate2.safeCreate2(bytesFormat , creationCodeRequestValidator, {gasLimit: 1000000}); 

  const criteriaHelperArtifact = "CriteriaHelper";
  const criteriaHelper = await deployContract(criteriaHelperArtifact);
  const transactioncriteriaHelper = await provider.getTransaction(criteriaHelper.deployTransaction.hash);
  const creationCodecriteriaHelper = transactioncriteriaHelper.data;
  const criteriaHelper_address = await immutableCreate2.safeCreate2(bytesFormat , creationCodecriteriaHelper, {gasLimit: 1000000}); 

  const validatorHelperArtifact = "ValidatorHelper";
  const validatorHelper = await deployContract(validatorHelperArtifact);
  const transactionvalidatorHelper = await provider.getTransaction(validatorHelper.deployTransaction.hash);
  const creationCodevalidatorHelper = transactionvalidatorHelper.data;
  const validatorHelper_address = await immutableCreate2.safeCreate2(bytesFormat , creationCodevalidatorHelper, {gasLimit: 1000000}); 

  const orderDetailsHelperArtifact = "OrderDetailsHelper";
  const orderDetailsHelper = await deployContract(orderDetailsHelperArtifact);
  const transactionorderDetailsHelper = await provider.getTransaction(orderDetailsHelper.deployTransaction.hash);
  const creationCodeorderDetailsHelper = transactionorderDetailsHelper.data;
  const orderDetailsHelper_address = await immutableCreate2.safeCreate2(bytesFormat , creationCodeorderDetailsHelper, {gasLimit: 1000000}); 

  const fulfillmentsHelperArtifact = "FulfillmentsHelper";
  const fulfillmentsHelper = await deployContract(fulfillmentsHelperArtifact);
  const transactionfulfillmentsHelper = await provider.getTransaction(fulfillmentsHelper.deployTransaction.hash);
  const creationCodefulfillmentsHelper = transactionfulfillmentsHelper.data;
  const fulfillmentsHelperr_address = await immutableCreate2.safeCreate2(bytesFormat , creationCodefulfillmentsHelper, {gasLimit: 1000000}); 

  const suggestedActionHelperArtifact = "SuggestedActionHelper";
  const suggestedActionHelper = await deployContract(suggestedActionHelperArtifact);
  const transactionsuggestedActionHelper = await provider.getTransaction(suggestedActionHelper.deployTransaction.hash);
  const creationCodesuggestedActionHelper = transactionsuggestedActionHelper.data;
  const suggestedActionHelper_address = await immutableCreate2.safeCreate2(bytesFormat , creationCodesuggestedActionHelper, {gasLimit: 1000000}); 

  const executionsHelperArtifact = "ExecutionsHelper";
  const executionsHelper = await deployContract(executionsHelperArtifact);
  const transactionexecutionsHelper = await provider.getTransaction(executionsHelper.deployTransaction.hash);
  const creationCodeExecutionsHelper = transactionexecutionsHelper.data;
  const executionsHelper_address = await immutableCreate2.safeCreate2(bytesFormat , creationCodeExecutionsHelper, {gasLimit: 1000000}); 

  const seaportNavigatorArtifact = "SeaportNavigator";
  const seaportNavigator = await deployContract(seaportNavigatorArtifact, 
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
    const seaportNavigator_address = await immutableCreate2.safeCreate2(bytesFormat , creationCodeseaportNavigator, {gasLimit: 1000000}); 
  
   
}
