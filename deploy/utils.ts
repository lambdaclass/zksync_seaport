import * as hre from "hardhat";
import chalk from 'chalk';
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import dotenv from "dotenv";
import { formatEther } from "ethers/lib/utils";
import { BigNumberish, ethers } from "ethers";
import { DeploymentType } from 'zksync-web3/build/src/types';
import { Contract, ContractFactory, Provider, Wallet, utils } from 'zksync-web3';

import "@matterlabs/hardhat-zksync-node/dist/type-extensions";
import "@matterlabs/hardhat-zksync-verify/dist/src/type-extensions";

// Load env file
dotenv.config();

const entry = chalk.bold.yellow;
const announce = chalk.yellow;
const success = chalk.green;
const timestamp = chalk.grey;

export const getProvider = () => {
  const rpcUrl = hre.network.config.url;
  if (!rpcUrl) throw `⛔️ RPC URL wasn't found in "${hre.network.name}"! Please add a "url" field to the network config in hardhat.config.ts`;
  
  // Initialize zkSync Provider
  const provider = new Provider(rpcUrl);

  return provider;
}

export const getWallet = (privateKey?: string) => {
  if (!privateKey) {
    // Get wallet private key from .env file
    if (!process.env.WALLET_PRIVATE_KEY) throw "⛔️ Wallet private key wasn't found in .env file!";
  }

  const provider = getProvider();
  
  // Initialize zkSync Wallet
  const wallet = new Wallet(privateKey ?? process.env.WALLET_PRIVATE_KEY!, provider);

  return wallet;
}

export const verifyEnoughBalance = async (wallet: Wallet, amount: BigNumberish) => {
  // Check if the wallet has enough balance
  const balance = await wallet.getBalance();
  if (balance.lt(amount)) throw `⛔️ Wallet balance is too low! Required ${formatEther(amount)} ETH, but current ${wallet.address} balance is ${formatEther(balance)} ETH`;
}

/**
 * @param {string} data.contract The contract's path and name. E.g., "contracts/Greeter.sol:Greeter"
 */
export const verifyContract = async (data: {
  address: string,
  contract: string,
  constructorArguments: string,
  bytecode: string
}) => {
  const verificationRequestId: number = await hre.run("verify:verify", {
    ...data,
    noCompile: true,
  });
  return verificationRequestId;
}

type DeployContractOptions = {
  /**
   * If true, the deployment process will not print any logs
   */
  silent?: boolean
  /**
   * If true, the contract will not be verified on Block Explorer
   */
  noVerify?: boolean
  /**
   * If specified, the contract will be deployed using this wallet
   */ 
  wallet?: Wallet
}
export const deployContract = async (deployer: Deployer, wallet: Wallet, contractArtifactName: string, constructorArguments?: any[], options?: DeployContractOptions) => {
  const log = (message: string) => {
    if (!options?.silent) console.log(message);
  }

  log(`\nStarting deployment process of "${contractArtifactName}"...`);
  
  const artifact = await deployer.loadArtifact(contractArtifactName).catch((error) => {
    if (error?.message?.includes(`Artifact for contract "${contractArtifactName}" not found.`)) {
      console.error(error.message);
      throw `⛔️ Please make sure you have compiled your contracts or specified the correct contract name!`;
    } else {
      throw error;
    }
  });

  // Estimate contract deployment fee
  const deploymentFee = await deployer.estimateDeployFee(artifact, constructorArguments || []);
  log(`Estimated deployment cost: ${formatEther(deploymentFee)} ETH`);

  // Check if the wallet has enough balance
  await verifyEnoughBalance(wallet, deploymentFee);

  // Deploy the contract to zkSync
  const contract = await deployer.deploy(artifact, constructorArguments);

  const constructorArgs = contract.interface.encodeDeploy(constructorArguments);
  const fullContractSource = `${artifact.sourceName}:${artifact.contractName}`;

  // Display contract deployment info
  log(`\n"${artifact.contractName}" was successfully deployed:`);
  log(` - Contract address: ${contract.address}`);
  log(` - Contract source: ${fullContractSource}`);
  log(` - Encoded constructor arguments: ${constructorArgs}\n`);

  if (!options?.noVerify && hre.network.config.verifyURL) {
    log(`Requesting contract verification...`);
    await verifyContract({
      address: contract.address,
      contract: fullContractSource,
      constructorArguments: constructorArgs,
      bytecode: artifact.bytecode,
    });
  }

  return contract;
}

export async function deployCreate2Contract(wallet: Wallet, contractName: string, args: any[] = [], overrides: Object = {}): Promise<Contract> {
  const artifact = await hre.artifacts.readArtifact(contractName);
  console.log("before contract factory");
  const factory = new ContractFactory(artifact.abi, artifact.bytecode, wallet, "create2");
  console.log("before deploy");
  const contract = (await factory.deploy(...args, {
      customData: { salt: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("LambdaClass"))},
      gasLimit: 300000000,
  })) as Contract;
  console.log(`${success('✔')} Deployed ${contractName} at address: ${contract.address}`);

  return contract;
}

export const deploySafeCreate2Contract = async (provider: Provider, contract: Contract, salt: string, immutableCreate2: Contract) => {
  
  if (!immutableCreate2.hasBeenDeployed(contract.address)) {
    const transaction = await provider.getTransaction(contract.deployTransaction.hash);
    const creationCode = transaction.data;
    const contract_address = await immutableCreate2.safeCreate2(salt , creationCode, {gasLimit: 100000000}); 
    return contract_address;
  }
  
}
