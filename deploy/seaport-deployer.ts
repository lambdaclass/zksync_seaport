import { deployContract, getProvider } from "./utils";
import { ethers } from 'ethers';

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY) throw "⛔️ Private key not detected! Add it to the .env file!";

export default async function () {

  // Deploy CREATE2-related contracts
  const immutableCreate2FactoryInterfaceArtifact = "ImmutableCreate2FactoryInterface";
  const create2Interface = await deployContract(immutableCreate2FactoryInterfaceArtifact);

  // Deploy conduit-related contracts
  const coduitControllerArtifact = "ConduitController";
  const coduitController = await deployContract(coduitControllerArtifact);
  const conduitArtifact = "Conduit";
  await deployContract(conduitArtifact);

  // Deploy Seaport contract
  const seaportArtifact = "Seaport";
  const seaport = await deployContract(seaportArtifact, [coduitController.address]);

  // CREATE2 salt (20-byte caller or zero address + 12-byte salt).
 const salt = '0x0000000000000000000000000000000000000000d4b6fcc21169b803f25d2210'; 

  const combinedSalt = seaport.address + salt;

  const saltBytes32 = ethers.utils.arrayify(combinedSalt);
  
  const provider = await getProvider();
  const transaction = await provider.getTransaction(seaport.deployTransaction.hash);
  const creationCode = transaction.data;

  const seaport_address = await create2Interface.safeCreate2(saltBytes32, creationCode); 
  console.log('Result:', creationCode);

  if (seaport_address != seaport.address) {
    throw new Error("address is not the spected");
  }
}
