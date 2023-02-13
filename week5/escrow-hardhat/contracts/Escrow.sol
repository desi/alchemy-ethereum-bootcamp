// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Escrow {
	address public arbiter;
	address public beneficiary;
	address public depositor;

	bool public isApproved;
    event Approved(uint balanceSent);
    
    constructor(address _arbiter, address _beneficiary) payable {
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = msg.sender;
        isApproved = false;
    }

    function approve() external onlyArbiter {
        uint contractBalance = address(this).balance;
        (bool success, ) = beneficiary.call { value: contractBalance }("");
        require(success, "Failed to send");
        isApproved = true;
        emit Approved(contractBalance);
    }

    modifier onlyArbiter() {
        require(msg.sender == arbiter, "Only the Arbiter can do this action.");
        _;
    }
}