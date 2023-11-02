.PHONY: setup update run

setup:
	git clone --depth 1 git@github.com:matter-labs/era-test-node.git

update:
	cd era-test-node && git pull

run:
	cd era-test-node && cargo +nightly run -- --show-calls=all --resolve-hashes run
