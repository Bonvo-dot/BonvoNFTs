// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import './IBonvo.sol';

abstract contract Rates is IBonvo{
    mapping(uint => mapping(uint =>Rate)) public assetRates;
    mapping(uint => uint) countAssetRates;
    mapping(address => mapping(uint =>Rate)) public userRates;
    mapping(address => uint) countUserRates;
    Rate[] public ratesArray;

    function saveAssetRate(Rate memory rate, uint _assetId) internal {
        uint size = countAssetRates[_assetId];
        assetRates[_assetId][size] = rate;
        countAssetRates[_assetId] = size+1;
    }
    
    function saveUserRate(Rate memory rate, address user) internal {
        uint size = countUserRates[user];
        userRates[user][size] = rate;
        countUserRates[user] = size+1; 
    }

    function getAssetRates(uint assetId) public view returns(Rate[] memory){
        uint size = countAssetRates[assetId];
        Rate[] memory rates = new Rate[](size);
        for (uint256 i = 0; i < size; i++) {
            rates[i] = assetRates[assetId][i];
        }
        return rates;
    }
    
    function getUserRates(address user) public view returns(Rate[] memory){
        uint size = countUserRates[user];
        Rate[] memory rates = new Rate[](size);
        for (uint256 i = 0; i < size; i++) {
            rates[i] = userRates[user][i];
        }
        return rates;
    }
}