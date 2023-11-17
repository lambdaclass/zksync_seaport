import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { deployContract, getWallet } from "./utils";
import * as fs from 'fs';
import * as hre from 'hardhat';

function storeContractAddress(address: string) {
  fs.writeFileSync(".executionHelper.address", address);
}

export default async function() {
  const wallet = getWallet();
  const deployer = new Deployer(hre, wallet);
  const contractArtifactName = "GameItem";
  const nft = await deployContract(deployer, wallet, contractArtifactName);
  const tx = await nft.awardItem(wallet.address, "https://imgur.com/gallery/AwyDb9Z");
  const tx_receipt = await tx.wait();
}
