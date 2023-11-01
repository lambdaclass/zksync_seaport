.PHONY: setup update run

setup:
	git submodule update --init

update:
	git submodule update

run: update
	cd submodules/era-test-node && cargo +nightly run -- --show-calls=all --resolve-hashes run
