import { deployContract, getProvider } from "./utils";

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY) throw "⛔️ Private key not detected! Add it to the .env file!";

export default async function () {

  // Deploy CREATE2-related contracts
  const immutableCreate2FactoryInterfaceArtifact = "ImmutableCreate2Factory";
  const create2Interface = await deployContract(immutableCreate2FactoryInterfaceArtifact);

  // Deploy conduit-related contracts
  const coduitControllerArtifact = "ConduitController";
  const coduitController = await deployContract(coduitControllerArtifact);
  const conduitArtifact = "Conduit";
  await deployContract(conduitArtifact);

  // Deploy Seaport contract
  const seaportArtifact = "Seaport";
  const seaport = await deployContract(seaportArtifact, [coduitController.address]);

}
