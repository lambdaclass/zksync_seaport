# ------------------------------------------------------------------------------
# Main:
# ------------------------------------------------------------------------------

setup: install-era-test-node setup-seaport

compile: compile-seaport

deploy: deploy-execution-helper deploy-seaport

# ------------------------------------------------------------------------------
# Development environment 
# ------------------------------------------------------------------------------

.PHONY: install-era-test-node
install-era-test-node:
	[ -d "./era-test-node" ] || git clone --depth 1 git@github.com:matter-labs/era-test-node.git && \
	cd era-test-node && cargo install --path .

.PHONY: setup-execution-helper
setup-execution-helper: 
	cd ExecutionHelper && yarn install 

.PHONY: setup-seaport
setup-seaport: setup-execution-helper
	yarn install

.PHONY: setup
setup: era-test-node setup-execution-helper setup-seaport

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
run-era-test-node:
	era_test_node --show-calls=all --resolve-hashes --show-gas-details=all run

# ------------------------------------------------------------------------------
# Clean:
# ------------------------------------------------------------------------------

.PHONY: clean-execution-helper
clean-execution-helper: 
	cd ExecutionHelper && \
	yarn hardhat clean && \
	rm -rf node_modules

.PHONY: clean-seaport
clean-seaport:
	yarn hardhat clean && \
	rm -rf node_modules

.PHONY: clean
clean: clean-execution-helper clean-seaport

# ------------------------------------------------------------------------------
# Deploy:
# ------------------------------------------------------------------------------

# The name of this target is good for now. If in the future we'd add more libs
# this should be a general target for deploying all of them befor deploying the
# concret project.
.PHONY: deploy-execution-helper
deploy-execution-helper:
	cd ExecutionHelper && \
	yarn hardhat deploy-zksync --script deploy.ts

.PHONY: deploy-seaport
deploy-seaport:
	yarn hardhat deploy-zksync --script seaport-deployer.ts
