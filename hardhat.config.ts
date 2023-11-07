import { TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS } from "hardhat/builtin-tasks/task-names";
import { subtask, task } from "hardhat/config";

import { compareLastTwoReports } from "./scripts/compare_reports";
import { printLastReport } from "./scripts/print_report";
import { getReportPathForCommit } from "./scripts/utils";
import { writeReports } from "./scripts/write_reports";

import type { HardhatUserConfig } from "hardhat/config";

import "@matterlabs/hardhat-zksync-node";
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";

import "dotenv/config";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

// Filter Reference Contracts
subtask(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS).setAction(
  async (_, __, runSuper) => {
    const paths = await runSuper();

    return paths.filter((p: any) => !p.includes("contracts/reference/"));
  }
);

task("write-reports", "Write pending gas reports").setAction(
  async (taskArgs, hre) => {
    writeReports(hre);
  }
);

task("compare-reports", "Compare last two gas reports").setAction(
  async (taskArgs, hre) => {
    compareLastTwoReports(hre);
  }
);

task("print-report", "Print the last gas report").setAction(
  async (taskArgs, hre) => {
    printLastReport(hre);
  }
);

const optimizerSettingsNoSpecializer = {
  enabled: true,
  runs: 9_000_000_000,
  details: {
    peephole: true,
    inliner: true,
    jumpdestRemover: true,
    orderLiterals: true,
    deduplicate: true,
    cse: true,
    constantOptimizer: true,
    yulDetails: {
      stackAllocation: true,
      optimizerSteps:
        "dhfoDgvulfnTUtnIf[xa[r]EscLMcCTUtTOntnfDIulLculVcul [j]Tpeulxa[rul]xa[r]cLgvifCTUca[r]LSsTOtfDnca[r]Iulc]jmul[jul] VcTOcul jmul",
    },
  },
};

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          viaIR: true,
          optimizer: {
            ...(process.env.NO_SPECIALIZER
              ? optimizerSettingsNoSpecializer
              : { enabled: true, runs: 4_294_967_295 }),
          },
          metadata: {
            bytecodeHash: "none",
          },
          outputSelection: {
            "*": {
              "*": ["evm.assembly", "irOptimized", "devdoc"],
            },
          },
        },
      },
    ],
    overrides: {
      "contracts/conduit/Conduit.sol": {
        version: "0.8.14",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
      "contracts/conduit/ConduitController.sol": {
        version: "0.8.14",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
      "contracts/helpers/TransferHelper.sol": {
        version: "0.8.14",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
      "contracts/helpers/order-validator": {
        version: "0.8.17",
        settings: {
          viaIR: false,
          optimizer: {
            enabled: true,
            runs: 1,
          },
        },
      },
    },
  },
  zksolc: {
    version: "latest",
    settings: {
      libraries: {
        "lib/seaport-core/src/lib/Consideration.sol": {
          Consideration: "0xdf5445d8518Ab352f721dAf6D945E20795e6A8A8",
        },
        "lib/seaport-core/src/lib/ReentrancyGuard.sol": {
          ReentrancyGuard: "0x0c1ee95331D377315117FC810E728Aa811589040",
        },
        "lib/seaport-core/contracts/GettersAndDerivers.sol": {
          GettersAndDerivers: "0xB3b570E884254131ef47eF26A01975918672Dc86",
        },
        "lib/seaport-core/contracts/Verifiers.sol": {
          Verifiers: "0x491708aC0aC935E75b3bE8281639D5165e03A8A5",
        },
        "lib/seaport-core/contracts/SignatureVerification.sol": {
          SignatureVerification: "0xaE7F6b4f2fF21fC5Fc52932A25faea11Bf5F509e",
        },
        "lib/seaport-sol/contracts/lib/fulfillment/AmountDeriverHelper.sol": {
          AmountDeriverHelper: "0x4BF4F1aeB40b71bAf59d519EEA133f0b4EEE07bA",
        },
        "lib/seaport-sol/contracts/lib/types/MatchComponentType.sol": {
          MatchComponentType: "0x7ebEd91306D639FB2B3edD08738730bae3125045",
        },
      },
    },
  },
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
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    outputFile: getReportPathForCommit(),
    noColors: true,
  },
  etherscan: {
    apiKey: process.env.EXPLORER_API_KEY,
  },
  // specify separate cache for hardhat, since it could possibly conflict with foundry's
  paths: { 
    cache: "hh-cache",
  },
};

export default config;
