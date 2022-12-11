// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NftAsset is ERC721, ERC721URIStorage {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    constructor() ERC721("BnvAsset", "BAs") {}

    function generateJson(uint256 tokenId, string calldata uri) public pure returns (string memory){
        bytes memory metadata = abi.encodePacked(
            '{',
                '"name": "Bnb Asset for:', tokenId.toString(),'",',
                '"description": "This is an Bonvo asset ",',
                '"image":"', uri,'"'
            '}'
        );

        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(metadata)
        ));
    }

    function mint(address to, string calldata uri) public returns (uint256){
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, generateJson(tokenId, uri));
        return tokenId;
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function getLastTokenId() public view returns(uint){
        return _tokenIdCounter.current();
    }
}