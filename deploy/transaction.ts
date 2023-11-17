import { Seaport } from "@opensea/seaport-js";
import { parseEther } from "ethers/lib/utils";
import { getProvider, getWallet, deployContract } from "./utils";
import {ItemType} from "./constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import * as hre from "hardhat";
import { ethers } from 'ethers';
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

export default async function () { 
  const provider = getProvider();
  const wallet = getWallet();
  const deployer = new Deployer(hre, wallet);

  const seaportNavigatorTypesArtifact = "SeaportNavigatorTypes";
  const seaportNavigatorTypes = await deployContract(deployer, wallet, seaportNavigatorTypesArtifact);
 
  const seaportNavigatorAddress = 'YOUR_CONTRACT_ADDRESS';
  const seaportNavigatorArtifact = await hre.artifacts.readArtifact("SeaportNavigator");
  const seaportNavigatorFactory = new ethers.Contract(
    seaportNavigatorAddress,
    seaportNavigatorArtifact.abi,
    wallet,
  );

  const seaportAddress = 'YOUR_CONTRACT_ADDRESS';
  const seaportArtifact = await hre.artifacts.readArtifact("Seaport");
  const seaportFactory = new ethers.Contract(
    seaportAddress,
    seaportArtifact.abi,
    wallet,
  );

  const seaportValidatorAddress = 'YOUR_CONTRACT_ADDRESS';
  const seaportValidatorArtifact = await hre.artifacts.readArtifact("SeaportValidator");
  const seaportValidatorFactory = new ethers.Contract(
    seaportAddress,
    seaportArtifact.abi,
    wallet,
  );

  const tx = seaportNavigatorTypes.NavigatorRequest({
    seaport: seaportFactory,
    validator: seaportValidatorFactory,
    orders: orders,
    caller: offerer1.addr,
    nativeTokensSupplied: 0,
    fulfillerConduitKey: bytes32(0),
    recipient: address(this),
    maximumFulfilled: type(uint256).max,
    seed: 0,
    fulfillmentStrategy: fulfillmentStrategy,
    criteriaResolvers: new CriteriaResolver[](0),
    preferMatch: false
  }
    
  );

  const seaport = new Seaport(provider);
  const { executeAllActions } = await seaport.createOrder(
    {
      offer: [
        {
          amount: parseEther("10").toString(),
          // WETH
          token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      ],
      consideration: [
        {
          itemType: ItemType.ERC721,
          token: "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
          identifier: "1",
          recipient: offerer,
        },
      ],
    },
    offerer,
  );

  const order = await executeAllActions();

  const { executeAllActions: executeAllFulfillActions } =
    await seaport.fulfillOrder({
      order,
      accountAddress: fulfiller.address,
    });

  const transaction = executeAllFulfillActions();
}
