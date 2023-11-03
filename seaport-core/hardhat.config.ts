import { HardhatUserConfig } from "hardhat/config";

import "@matterlabs/hardhat-zksync-node";
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      zksync: false,
    },
    zkSyncTestnet: {
      url: "https://testnet.era.zksync.dev",
      ethNetwork: "goerli", // or a Goerli RPC endpoint from Infura/Alchemy/Chainstack etc.
      zksync: true,
    },
    inMemoryNode: {
      url: "http://localhost:8011",
      ethNetwork: "", // in-memory node doesn't support eth node; removing this line will cause an error.
      zksync: true,
    },
  },
  defaultNetwork: "inMemoryNode",
  zksolc: {
    version: "latest",
    settings: {
      // find all available options in the official documentation
      // https://era.zksync.io/docs/tools/hardhat/hardhat-zksync-solc.html#configuration
    },
  },
  solidity: {
    version: "0.8.17",
  },
};

export default config;
