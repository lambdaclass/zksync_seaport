import { Seaport } from "@opensea/seaport-js";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import { ethers } from "ethers";
import { getProvider, getWallet } from "./utils";

// Listing an ERC-721 for 10 ETH and fulfilling it
export default async function () {
    const provider = getProvider();
    const wallet = getWallet(); 
    const seaporContractAddress = "0x4AabcFA6A4085dEeb5DfB72E458E3E97f53906CF";
    const seaport = new Seaport(provider, { overrides: { contractAddress: seaporContractAddress } });

    const offerer = wallet.address;
    // const fulfiller = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";
    const { executeAllActions } = await seaport.createOrder(
        {
            offer: [
                {
                    itemType: ItemType.ERC721,
                    token: "0x76F668B5faED818d6F1b848aDf910d58f71539A4",
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
