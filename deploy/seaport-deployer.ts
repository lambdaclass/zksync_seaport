import { deployContract, getProvider } from "./utils";
import { ethers } from 'ethers';

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY) throw "⛔️ Private key not detected! Add it to the .env file!";

export default async function () {

  // Deploy CREATE2-related contracts
  const immutableCreate2FactoryInterfaceArtifact = "ImmutableCreate2Factory";
  const immutableCreate2 = await deployContract(immutableCreate2FactoryInterfaceArtifact);

  // Deploy conduit-related contracts
  const coduitControllerArtifact = "ConduitController";
  const coduitController = await deployContract(coduitControllerArtifact);
  const conduitArtifact = "Conduit";
  await deployContract(conduitArtifact);

  // Deploy Seaport contract
  const seaportArtifact = "Seaport";
  const seaport = await deployContract(seaportArtifact, [coduitController.address]);

  // Deploy Helpers contract
  const transferHelperArtifact = "TransferHelper";
  const transferHelper = await deployContract(transferHelperArtifact, [coduitController.address]);

  const salt = "0x00000000000000000000000000000000000000000000fcc21169b803f25d2210";
  const bytesFormat = ethers.utils.arrayify(salt);

  
  console.log('provider');
  const provider = await getProvider();
  console.log('transaction');
  const transaction = await provider.getTransaction(transferHelper.deployTransaction.hash);
  console.log('code');
  const creationCode = transaction.data;
  console.log('safecreate');

  const transferHelper_address = await immutableCreate2.safeCreate2(bytesFormat , creationCode); 
  console.log('Result:', transferHelper_address);

 
}
