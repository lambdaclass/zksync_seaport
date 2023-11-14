import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { getWallet } from "./utils";

export default async function (hre: HardhatRuntimeEnvironment) {
  // Private key of the account used to deploy
  const wallet = getWallet();
  const deployer = new Deployer(hre, wallet);
  const factoryArtifact = await deployer.loadArtifact("ImmutableCreate2FactoryInterface");

  // Getting the bytecodeHash of the account
  // HERE IS WHERE THE BYTECODE FAILS
  const bytecodeHash = utils.hashBytecode(factoryArtifact.bytecode);

  const factory = await deployer.deploy(
    factoryArtifact,
    [bytecodeHash],
    
  );

  console.log(`AA factory address: ${factory.address}`);
}
