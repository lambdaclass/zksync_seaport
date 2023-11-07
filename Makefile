.PHONY: setup-seaport setup update compile-contracts deploy-libraries run clone-repos

setup-seaport: clone-repos
	yarn install && \
	yarn build

setup-era-test-node:
	git clone --depth 1 git@github.com:matter-labs/era-test-node.git

clone-repos:
	$(shell ./scripts/pull_repos.sh)

setup: clone-repos setup-era-test-node setup-seaport

update:
	cd era-test-node && git pull

compile-contracts:
	yarn hardhat compile --network inMemoryNode

deploy-libraries:
	yarn hardhat deploy-zksync:libraries --private-key WALLET_PRIVATE_KEY

run:
	cd era-test-node && cargo +nightly run -- --show-calls=all --resolve-hashes run
