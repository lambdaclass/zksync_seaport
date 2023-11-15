.PHONY: clean env deploy-execution-helper deploy-seaport deploy

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
compile-execution-helper:
	cd ExecutionHelper && \
	yarn hardhat compile

.PHONY: compile-seaport
compile-seaport: compile-execution-helper deploy-execution-helper
	yarn hardhat compile 

# ------------------------------------------------------------------------------
# Developer tools:
# ------------------------------------------------------------------------------

.PHONY: run-era-test-node
run-era-test-node: era-test-node
	cd era-test-node && cargo +nightly run -- --show-calls=all --resolve-hashes run

env:
	source .env

# ------------------------------------------------------------------------------
# Clean:
# ------------------------------------------------------------------------------

.PHONY: clean-execution-helper
clean-execution-helper: 
	cd ExecutionHelper && \
	yarn hardhat clean && \
	yarn cache clean

clean-seaport:
	yarn hardhat clean && \
	yarn cache clean

clean: clean-execution-helper clean-seaport
	yarn hardhat clean

# ------------------------------------------------------------------------------
# Deploy:
# ------------------------------------------------------------------------------

# The name of this target is good for now. If in the future we'd add more libs
# this should be a general target for deploying all of them befor deploying the
# concret project.
deploy-execution-helper:
	cd ExecutionHelper && \
	yarn hardhat deploy-zksync --script deploy.ts

deploy-seaport:
	yarn hardhat deploy-zksync --script seaport-deployer.ts

deploy: deploy-execution-helper deploy-seaport
