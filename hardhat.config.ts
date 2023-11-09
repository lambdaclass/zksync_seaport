import { HardhatUserConfig } from "hardhat/config";
import * as fs from 'fs';

import "@matterlabs/hardhat-zksync-node";
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";

function readContractAddressFromFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf8').trim();
  } catch (err) {
    const msg = (err.code === 'ENOENT') ? `ERROR: address file not found ${filePath}` : `Error reading the file ${filePath}`;
    console.log(msg);
    return msg;
  }
}

const config: HardhatUserConfig = {
  defaultNetwork: "inMemoryNode",
  networks: {
    zkSyncTestnet: {
      url: "https://testnet.era.zksync.dev",
      ethNetwork: "goerli",
      zksync: true,
      verifyURL: "https://zksync2-testnet-explorer.zksync.dev/contract_verification",
    },
    zkSyncMainnet: {
      url: "https://mainnet.era.zksync.io",
      ethNetwork: "mainnet",
      zksync: true,
      verifyURL: "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
    },
    dockerizedNode: {
      url: "http://localhost:3050",
      ethNetwork: "http://localhost:8545",
      zksync: true,
    },
    inMemoryNode: {
      url: "http://localhost:8011",
      ethNetwork: "", // in-memory node doesn't support eth node; removing this line will cause an error
      zksync: true,
    },
    hardhat: {
      zksync: true,
    },
  },
  zksolc: {
    version: "latest",
    settings: {
      libraries: {
        "ExecutionHelper/contracts/ExecutionHelper.sol": {
          ExecutionHelper: readContractAddressFromFile("./ExecutionHelper/.executionHelper.address"),
        },
      },
      // find all available options in the official documentation
      // https://era.zksync.io/docs/tools/hardhat/hardhat-zksync-solc.html#configuration
    },
  },
  solidity: {
    version: "0.8.17",
  },
};

export default config;
