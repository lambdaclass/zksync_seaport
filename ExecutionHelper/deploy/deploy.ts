import { deployContract } from "./utils";
import * as fs from 'fs';

function storeContractAddress(address: string) {
  fs.writeFileSync(".executionHelper.address", address);
}

export default async function() {
  const contractArtifactName = "ExecutionHelper";
  const contract = await deployContract(contractArtifactName);

  storeContractAddress(contract.address);
}
