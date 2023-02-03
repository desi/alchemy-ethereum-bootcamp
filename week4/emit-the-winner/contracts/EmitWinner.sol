//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IContract {
  function attempt() external;
}

contract EmitWinner {
  function emitWinner(address contractToCall) external  {
    IContract(contractToCall).attempt();
  }
}
