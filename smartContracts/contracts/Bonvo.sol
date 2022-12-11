// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Strings.sol";
import "./IBonvo.sol";
import "./TokenBonvo.sol";
import "./Rewards.sol";
import "./NftAsset.sol";
import "./Assets.sol";
import "./Rates.sol";
import "./Rents.sol";

contract Bonvo is IBonvo, Assets, Rates, Rents {
    using Strings for uint256;
    address public owner;
    mapping(address => User) public users;
    NftAsset public nft = new NftAsset();
    TokenBonvo public BNV;
    Rewards public r = new Rewards();

    constructor() {
        owner = msg.sender;
        BNV = new TokenBonvo(owner);
    }

    function createUser(address idUser, User memory _user) external {
        require(idUser != address(0), "Valid wallet address required");
        users[idUser] = _user;
    }

    function addRent(uint256 _tokenId) public {
        require(assetsByTokenId[_tokenId].latitude != 0, "Inexistent asset");
        uint256 id = rents.length;
        saveRent(id, _tokenId);
        BNV.dTransfer(owner, msg.sender, r.RENT_REWARD());
    }

    function addRate(
        uint8 _rate,
        string calldata _argue,
        uint256 _tokenId
    ) public {
        require(_rate != 0, "Not valid rate");
        require(assetsByTokenId[_tokenId].latitude != 0, "Inexistent asset");

        uint256 id = ratesArray.length;
        Rate memory rate = Rate({
            idRate: id,
            rate: _rate,
            argue: _argue,
            rater: msg.sender,
            assetId: _tokenId
        });
        ratesArray.push(rate);

        saveAssetRate(rate, _tokenId);
        saveUserRate(rate, msg.sender);
        BNV.dTransfer(owner, msg.sender, r.RATE_REWARD());
    }

    event Allowance(string, uint256);

    function createAsset(Asset memory _asset) external {
        uint256 tokenId = nft.mint(msg.sender, _asset.images[0]);
        saveInMapping(_asset, tokenId);
        BNV.dTransfer(owner, msg.sender, r.CREATE_ASSET_REWARD());
    }
}

/**
ASSET
[0, 1010, 0xd6dd6c7e69d5fa4178923dac6a239f336e3c40e3, 110, ["https://storage.googleapis.com/bonvo-bucket/adeeaa00-a262-4ef6-b39c-bc3745deef82_post.jpeg"], 45, 12, 1, "Bolivia", ["Casa", "casa", "562 Angel Pisarello", 2, 50]]

*/
