// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import { ImmutableCreate2FactoryInterface } from "./interfaces/ImmutableCreate2FactoryInterface.sol";
import { DEPLOYER_SYSTEM_CONTRACT, IContractDeployer } from "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/libraries/SystemContractsCaller.sol";

/**
 * @title Immutable Create2 Contract Factory
 * @author 0age
 * @notice This contract provides a safeCreate2 function that takes a salt value
 * and a block of initialization code as arguments and passes them into inline
 * assembly. The contract prevents redeploys by maintaining a mapping of all
 * contracts that have already been deployed, and prevents frontrunning or other
 * collisions by requiring that the first 20 bytes of the salt are equal to the
 * address of the caller (this can be bypassed by setting the first 20 bytes to
 * the null address). There is also a view function that computes the address of
 * the contract that will be created when submitting a given salt or nonce along
 * with a given block of initialization code.
 * @dev This contract has not yet been fully tested or audited - proceed with
 * caution and please share any exploits or optimizations you discover.
 */
contract ImmutableCreate2Factory is ImmutableCreate2FactoryInterface {
  // mapping to track which addresses have already been deployed.
  mapping(address => bool) private _deployed;

  // /**
  //  * @dev Create a contract using CREATE2 by submitting a given salt or nonce
  //  * along with the initialization code for the contract. Note that the first 20
  //  * bytes of the salt must match those of the calling address, which prevents
  //  * contract creation events from being submitted by unintended parties.
  //  * @param salt bytes32 The nonce that will be passed into the CREATE2 call.
  //  * @param initializationCode bytes The initialization code that will be passed
  //  * into the CREATE2 call.
  //  * @return deploymentAddress Address of the contract that will be created, or the null address
  //  * if a contract already exists at that address.
  //  */
  function safeCreate2(
    bytes32 _salt,
    bytes32 _bytecodeHash,
    bytes calldata _input
  ) external payable containsCaller(_salt) returns (address deploymentAddress) {
    address targetDeploymentAddress = DEPLOYER_SYSTEM_CONTRACT.getNewAddressCreate2(address(this), _salt, _bytecodeHash, _input);
    
    // // move the initialization code from calldata to memory.
    // bytes memory initCode = initializationCode;

    // // determine the target address for contract deployment.
    // address targetDeploymentAddress = address(
    //   uint160(                    // downcast to match the address type.
    //     uint256(                  // convert to uint to truncate upper digits.
    //       keccak256(              // compute the CREATE2 hash using 4 inputs.
    //         abi.encodePacked(     // pack all inputs to the hash together.
    //           hex"ff",            // start with 0xff to distinguish from RLP.
    //           address(this),      // this contract will be the caller.
    //           salt,               // pass in the supplied salt value.
    //           keccak256(          // pass in the hash of initialization code.
    //             abi.encodePacked(
    //               initCode
    //             )
    //           )
    //         )
    //       )
    //     )
    //   )
    // );

    // ensure that a contract hasn't been previously deployed to target address.
    require(
      !_deployed[targetDeploymentAddress],
      "Invalid contract creation - contract has already been deployed."
    );

    (bool success, bytes memory returnData) = SystemContractsCaller
        .systemCallWithReturndata(
            uint32(gasleft()),
            address(DEPLOYER_SYSTEM_CONTRACT),
            uint128(0),
            abi.encodeCall(
                DEPLOYER_SYSTEM_CONTRACT.create2Account,
                (_salt, _bytecodeHash, _input, IContractDeployer.AccountAbstractionVersion.None)
            )
        );
    require(success, "Deployment failed");

    (deploymentAddress) = abi.decode(returnData, (address));

    // // using inline assembly: load data and length of data, then call CREATE2.
    // assembly {                                // solhint-disable-line
    //   let encoded_data := add(0x20, initCode) // load initialization code.
    //   let encoded_size := mload(initCode)     // load the init code's length.
    //   deploymentAddress := create2(           // call CREATE2 with 4 arguments.
    //     0xFF,                                 // start with 0xff to distinguish from RLP.
    //     encoded_data,                         // pass in initialization code.
    //     encoded_size,                         // pass in init code's length.
    //     salt                                  // pass in the salt value.
    //   )
    // }

    // check address against target to ensure that deployment was successful.
    require(
      deploymentAddress == targetDeploymentAddress,
      string.concat("Failed to deploy contract using provided salt and initialization code. ", toAsciiString(deploymentAddress), " ", toAsciiString(targetDeploymentAddress))
    );

    // record the deployment of the contract to prevent redeploys.
    _deployed[deploymentAddress] = true;
  }

  function toAsciiString(address x) internal pure returns (string memory) {
      bytes memory s = new bytes(40);
      for (uint i = 0; i < 20; i++) {
          bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
          bytes1 hi = bytes1(uint8(b) / 16);
          bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
          s[2*i] = char(hi);
          s[2*i+1] = char(lo);
      }
      return string(s);
  }

  function char(bytes1 b) internal pure returns (bytes1 c) {
      if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
      else return bytes1(uint8(b) + 0x57);
  }

  /**
   * @dev Compute the address of the contract that will be created when
   * submitting a given salt or nonce to the contract along with the contract's
   * initialization code. The CREATE2 address is computed in accordance with
   * EIP-1014, and adheres to the formula therein of
   * `keccak256( 0xff ++ address ++ salt ++ keccak256(init_code)))[12:]` when
   * performing the computation. The computed address is then checked for any
   * existing contract code - if so, the null address will be returned instead.
   * @param salt bytes32 The nonce passed into the CREATE2 address calculation.
   * @param initCode bytes The contract initialization code to be used.
   * that will be passed into the CREATE2 address calculation.
   * @return deploymentAddress Address of the contract that will be created, or the null address
   * if a contract has already been deployed to that address.
   */
  function findCreate2Address(
    bytes32 salt,
    bytes calldata initCode
  ) external view returns (address deploymentAddress) {
    // determine the address where the contract will be deployed.
    deploymentAddress = address(
      uint160(                      // downcast to match the address type.
        uint256(                    // convert to uint to truncate upper digits.
          keccak256(                // compute the CREATE2 hash using 4 inputs.
            abi.encodePacked(       // pack all inputs to the hash together.
              hex"ff",              // start with 0xff to distinguish from RLP.
              address(this),        // this contract will be the caller.
              salt,                 // pass in the supplied salt value.
              keccak256(            // pass in the hash of initialization code.
                abi.encodePacked(
                  initCode
                )
              )
            )
          )
        )
      )
    );

    // return null address to signify failure if contract has been deployed.
    if (_deployed[deploymentAddress]) {
      return address(0);
    }
  }

  /**
   * @dev Compute the address of the contract that will be created when
   * submitting a given salt or nonce to the contract along with the keccak256
   * hash of the contract's initialization code. The CREATE2 address is computed
   * in accordance with EIP-1014, and adheres to the formula therein of
   * `keccak256( 0xff ++ address ++ salt ++ keccak256(init_code)))[12:]` when
   * performing the computation. The computed address is then checked for any
   * existing contract code - if so, the null address will be returned instead.
   * @param salt bytes32 The nonce passed into the CREATE2 address calculation.
   * @param initCodeHash bytes32 The keccak256 hash of the initialization code
   * that will be passed into the CREATE2 address calculation.
   * @return deploymentAddress Address of the contract that will be created, or the null address
   * if a contract has already been deployed to that address.
   */
  function findCreate2AddressViaHash(
    bytes32 salt,
    bytes32 initCodeHash
  ) external view returns (address deploymentAddress) {
    // determine the address where the contract will be deployed.
    deploymentAddress = address(
      uint160(                      // downcast to match the address type.
        uint256(                    // convert to uint to truncate upper digits.
          keccak256(                // compute the CREATE2 hash using 4 inputs.
            abi.encodePacked(       // pack all inputs to the hash together.
              hex"ff",              // start with 0xff to distinguish from RLP.
              address(this),        // this contract will be the caller.
              salt,                 // pass in the supplied salt value.
              initCodeHash          // pass in the hash of initialization code.
            )
          )
        )
      )
    );

    // return null address to signify failure if contract has been deployed.
    if (_deployed[deploymentAddress]) {
      return address(0);
    }
  }

  /**
   * @dev Determine if a contract has already been deployed by the factory to a
   * given address.
   * @param deploymentAddress address The contract address to check.
   * @return True if the contract has been deployed, false otherwise.
   */
  function hasBeenDeployed(
    address deploymentAddress
  ) external view returns (bool) {
    // determine if a contract has been deployed to the provided address.
    return _deployed[deploymentAddress];
  }

  /**
   * @dev Modifier to ensure that the first 20 bytes of a submitted salt match
   * those of the calling account. This provides protection against the salt
   * being stolen by frontrunners or other attackers. The protection can also be
   * bypassed if desired by setting each of the first 20 bytes to zero.
   * @param salt bytes32 The salt value to check against the calling address.
   */
  modifier containsCaller(bytes32 salt) {
    // prevent contract submissions from being stolen from tx.pool by requiring
    // that the first 20 bytes of the submitted salt match msg.sender.
    require(
      (address(bytes20(salt)) == msg.sender) ||
      (bytes20(salt) == bytes20(0)),
      "Invalid salt - first 20 bytes of the salt must match calling address."
    );
    _;
  }
}
