#!/bin/bash

# Define a list of repository URLs
repo_urls=(
  "https://github.com/dmfxyz/murky"
  "https://github.com/openzeppelin/openzeppelin-contracts"
  "https://github.com/transmissions11/solmate"
  "https://github.com/foundry-rs/forge-std"
  "https://github.com/vectorized/solady"
  "https://github.com/emo-eth/solarray"
  "https://github.com/dapphub/ds-test"
  "https://github.com/projectopensea/seaport-types"
  "https://github.com/projectopensea/seaport-core"
  "https://github.com/projectopensea/seaport-sol"
)

# Specify the directory where you want to clone the repositories
clone_dir="./lib"

# Loop through the list of URLs and clone each repository
for url in "${repo_urls[@]}"; do
  # Extract the repository name from the URL (assumes the last part is the repo name)
  repo_name=$(basename "$url" | sed 's/\.git$//')
  
  # Clone the repository
  git clone "$url" "$clone_dir/$repo_name"
done
