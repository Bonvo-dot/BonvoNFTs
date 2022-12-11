// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import '@openzeppelin/contracts/access/AccessControl.sol';

contract Rewards is AccessControl {
    uint public CREATE_ASSET_REWARD = 2_000_000_000_000_000_000;
    uint public RATE_REWARD = 2_000_000_000_000_000_000;
    uint public RENT_REWARD = 2_000_000_000_000_000_000;

    constructor(){
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setCreateAssetReward(uint reward) public onlyRole(DEFAULT_ADMIN_ROLE) {
        CREATE_ASSET_REWARD = reward;
    }

    function setRateReward(uint reward) public onlyRole(DEFAULT_ADMIN_ROLE) {
        RATE_REWARD = reward;
    }

    function setRentReward(uint reward) public onlyRole(DEFAULT_ADMIN_ROLE) {
        RENT_REWARD = reward;
    }
}