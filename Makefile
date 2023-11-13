# ------------------------------------------------------------------------------
# Development environment setup:
# ------------------------------------------------------------------------------

setup: setup-era-test-node setup-seaport

setup-era-test-node:
	[ -d "./era-test-node" ] || git clone --depth 1 git@github.com:matter-labs/era-test-node.git && \
	cd era-test-node && cargo install --path .

.PHONY: setup-execution-helper
setup-execution-helper: 
	cd ExecutionHelper && yarn install 

.PHONY: setup-seaport
setup-seaport: setup-execution-helper
	yarn install

# ------------------------------------------------------------------------------
# Development environment update:
# ------------------------------------------------------------------------------

.PHONY: update.era-test-node
update.era-test-node: ./era-test-node
	cd era-test-node && \
	git pull && \
	cargo install --path .

# ------------------------------------------------------------------------------
# Compile:
# ------------------------------------------------------------------------------

.PHONY: compile-and-deploy-execution-helper
compile-and-deploy-execution-helper:
	cd ExecutionHelper && yarn hardhat compile && yarn hardhat deploy-zksync --script deploy.ts

.PHONY: compile-seaport
compile-seaport: compile-and-deploy-execution-helper
	yarn hardhat compile

# ------------------------------------------------------------------------------
# Developer tools:
# ------------------------------------------------------------------------------

.PHONY: run-era-test-node
run-era-test-node: era-test-node
	cd era-test-node && cargo +nightly run -- --show-calls=all --resolve-hashes run
