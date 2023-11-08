.PHONY: setup update run

setup-execution-helper: 
	cd ExecutionHelper && yarn install && yarn hardhat compile && yarn hardhat deploy-zksync --script deploy.ts

setup-seaport: 
	yarn install
	yarn hardhat compile 
clone-node: 
	git clone --depth 1 git@github.com:matter-labs/era-test-node.git

setup: clone-node setup-execution-helper setup-seaport

update:
	cd era-test-node && git pull

run:
	cd era-test-node && cargo +nightly run -- --show-calls=all --resolve-hashes run
