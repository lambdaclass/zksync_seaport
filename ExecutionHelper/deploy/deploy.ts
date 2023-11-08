import { deployContract } from "./utils";
import * as fs from 'fs';

function storeContractAddress(address: string) {
  fs.writeFileSync(".executionHelper.address", address);
}


// An example of a basic deploy script
// It will deploy a Greeter contract to selected network
// as well as verify it on Block Explorer if possible for the network
export default async function() {
  const contractArtifactName = "ExecutionHelper";
  const contract = await deployContract(contractArtifactName);

  storeContractAddress(contract.address);
}
