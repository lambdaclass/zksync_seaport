# ------------------------------------------------------------------------------
# CI targets:
# ------------------------------------------------------------------------------

start-node-from-release-binary:
	curl -LO https://github.com/matter-labs/era-test-node/releases/download/v0.1.0-alpha.10/era_test_node-v0.1.0-alpha.10-x86_64-unknown-linux-gnu.tar.gz
	tar -zxvf era_test_node-v0.1.0-alpha.10-x86_64-unknown-linux-gnu.tar.gz && chmod +x ./era_test_node && ./era_test_node run &

wait-for-node-to-start:
				 sleep 10 && curl --request POST \
										--url http://localhost:8011/ \
										--header 'content-type: application/json' \
										--data '{ "jsonrpc": "2.0", "id": "1", "method": "eth_chainId", "params": []}'

npm-ci-deps:
	npm install -g node-gyp

setup-ci: start-node-from-release-binary npm-ci-deps setup-execution-helper setup-seaport

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
	cd ExecutionHelper && yarn install && yarn hardhat compile && yarn hardhat deploy-zksync --script deploy.ts

.PHONY: compile-seaport
compile-seaport: compile-and-deploy-execution-helper
	yarn hardhat compile 

# ------------------------------------------------------------------------------
# Developer tools:
# ------------------------------------------------------------------------------

.PHONY: run-era-test-node
run-era-test-node: era-test-node
	cd era-test-node && cargo +nightly run -- --show-calls=all --resolve-hashes run
