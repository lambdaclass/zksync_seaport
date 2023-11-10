# ------------------------------------------------------------------------------
# Development environment setup:
# ------------------------------------------------------------------------------

setup: era-test-node setup-execution-helper setup-seaport

# Clones the `era-test-node` into `./era-test-node/`.
era-test-node: 
	git clone --depth 1 git@github.com:matter-labs/era-test-node.git

.PHONY: setup-execution-helper 
setup-execution-helper: 
	cd ExecutionHelper && yarn install 

.PHONY: setup-seaport
setup-seaport: 
	yarn install

# ------------------------------------------------------------------------------
# Development environment update:
# ------------------------------------------------------------------------------

.PHONY: update.era-test-node
update.era-test-node: ./era-test-node
	cd era-test-node && git pull

# ------------------------------------------------------------------------------
# Compile:
# ------------------------------------------------------------------------------

.PHONY: compile-and-deploy-execution-helper
compile-and-deploy-execution-helper:
	cd ExecutionHelper && yarn install && yarn hardhat compile && yarn hardhat deploy-zksync --script deploy.ts --network inMemoryNode

.PHONY: compile-seaport
compile-seaport: compile-and-deploy-execution-helper
	yarn hardhat compile 

# ------------------------------------------------------------------------------
# Developer tools:
# ------------------------------------------------------------------------------

.PHONY: run-era-test-node
run-era-test-node: era-test-node
	cd era-test-node && cargo +nightly run -- --show-calls=all --resolve-hashes run
