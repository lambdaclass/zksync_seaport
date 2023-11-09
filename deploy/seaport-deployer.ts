import { deployContract } from "./utils";
import { ethers } from 'ethers';
import { HardhatRuntimeEnvironment } from "hardhat/types";

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY) throw "⛔️ Private key not detected! Add it to the .env file!";

export default async function (hre: HardhatRuntimeEnvironment) {

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
  const callerAddress = '0x0000000000000000000000000000000000000000'; // Replace with the actual caller address
  const salt = '0x0000000000000000000000000000000000000000d4b6fcc21169b803f25d2210'; // 12-byte salt

  const combinedSalt = ethers.utils.hexZeroPad(callerAddress, 32) + salt.slice(2);

  const saltBytes32 = ethers.utils.arrayify(combinedSalt);

  // const ImmutableCreate2FactoryArtifact = await hre.artifacts.readArtifact("ImmutableCreate2FactoryInterface");

  // const aaFactory = new ethers.Contract(
  //   AA_FACTORY_ADDRESS,
  //   factoryArtifact.abi,
  //   wallet,
  // );
  // // Packed and ABI-encoded contract bytecode and constructor arguments.
  // bytes memory initCode = abi.encodePacked(
  //   type(Seaport).creationCode,
  //   abi.encode(CONDUIT_CONTROLLER)
  // );

  await create2Interface.safeCreate2(saltBytes32, )
}
