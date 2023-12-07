use ethers::abi::Abi;
use std::str::FromStr;
use std::fs::File;
use std::io::Read;
use rustc_serialize::json::Json;
use zksync_web3_rs::providers::{Middleware, Provider};
use zksync_web3_rs::signers::{LocalWallet, Signer};
use zksync_web3_rs::zks_provider::ZKSProvider;
use zksync_web3_rs::zks_wallet::{CallRequest, DeployRequest};
use zksync_web3_rs::ZKSWallet;
use serde_json::Value;

// This is the default url for a local `era-test-node` instance.
static ERA_PROVIDER_URL: &str = "http://127.0.0.1:8011";

// This is the private key for one of the rich wallets that come bundled with the era-test-node.
static PRIVATE_KEY: &str = "28a574ab2de8a00364d5dd4b07c4f2f574ef7fcc2a86a197f65abaec836d1959";
static CONDUIT_JSON: &str = include_str!("./../artifacts-zk/contracts/conduit/Conduit.sol/LocalConduit.dbg.json");


#[tokio::main(flavor = "current_thread")]
async fn main() {
    // Note that for this code example we only need to interface with zkSync Era. We don't care
    // about the Ethereum layer-1 network.
    let zk_wallet = {
        let era_provider = Provider::try_from(ERA_PROVIDER_URL).unwrap();

        let chain_id = era_provider.get_chainid().await.unwrap();
        let l2_wallet = LocalWallet::from_str(PRIVATE_KEY)
            .unwrap()
            .with_chain_id(chain_id.as_u64());
        ZKSWallet::new(l2_wallet, None, Some(era_provider.clone()), None).unwrap()
    };

    // Deploy contract:
    let contract_address = {
        let mut file = File::open("../artifacts-zk/contracts/conduit/Conduit.sol/LocalConduit.dbg.json").unwrap();
        let mut data = String::new();
        file.read_to_string(&mut data).unwrap();

        let json = Json::from_str(&data).unwrap();
        let bitecode = json.find_path(&["bytecode"]).unwrap().as_string().unwrap();
        let contract_bin = hex::decode(bitecode).unwrap().to_vec();

        let abi_json = json.find_path(&["abi"]).unwrap().as_string().unwrap();
        let abi = Abi::load(CONDUIT_JSON.as_bytes()).unwrap();
        let request = DeployRequest::with(abi, contract_bin, vec!["Hey".to_owned()])
            .from(zk_wallet.l2_address());
        let address = zk_wallet.deploy(&request).await.unwrap();

        println!("Contract address: {:#?}", address);

        address
    };

}
