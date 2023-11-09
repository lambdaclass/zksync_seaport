.PHONY: setup update run

setup-execution-helper: 
	cd ExecutionHelper && yarn install 

compile-and-deploy-execution-helper:
	cd ExecutionHelper && yarn hardhat compile && yarn hardhat deploy-zksync --script deploy.ts

setup-seaport: 
	yarn install

compile-seaport:
	yarn hardhat compile 

clone-node: 
	git clone --depth 1 git@github.com:matter-labs/era-test-node.git

setup: clone-node setup-execution-helper compile-and-deploy-execution-helper setup-seaport compile-seaport

update:
	cd era-test-node && git pull

run:
	cd era-test-node && cargo +nightly run -- --show-calls=all --resolve-hashes run
