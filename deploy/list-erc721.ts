import { Seaport } from "./seaport";
import { ItemType } from "./constants";
import { ethers } from "ethers";
import { getProvider, getWallet } from "./utils";

const NFT_ADDRESS = "0x76F668B5faED818d6F1b848aDf910d58f71539A4";

// Listing an ERC-721 for 10 ETH and fulfilling it
export default async function () {
    const provider = getProvider();
    const wallet = getWallet(); 
    const seaportContractAddress = "0xEC1f5bAC8c4976c82274a390A68d85872B35e835";
    const seaport = new Seaport(provider, { overrides: { contractAddress: seaportContractAddress } });

    const offerer = wallet.address;
    // const fulfiller = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";
    const { executeAllActions } = await seaport.createOrder(
        {
            offer: [
                {
                    itemType: ItemType.ERC721,
                    token: NFT_ADDRESS,
                    identifier: "1",
                },
            ],
            consideration: [
                {
                    amount: ethers.utils.parseEther("10").toString(),
                    recipient: offerer,
                },
            ],
        },
        offerer,
    );

    const order = await executeAllActions();

    console.log(order);

    // const { executeAllActions: executeAllFulfillActions } =
    // await seaport.fulfillOrder({
    //     order,
    // });

    // const transaction = await executeAllFulfillActions();

    // console.log(transaction);
}
