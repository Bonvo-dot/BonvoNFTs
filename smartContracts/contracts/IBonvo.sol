// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IBonvo {
    struct StaticDataAsset {
        string title;
        string description;
        string location;
        uint256 rooms;
        uint256 size;
    }
    struct Asset {
        uint256 tokenId;
        uint256 timestamp;
        address owner;
        uint256 price;
        string[] images;
        int256 latitude;
        int256 longitude;
        uint8 idCategory;
        string ISOCountry;
        StaticDataAsset staticData;
    }

    struct AssetCategory {
        uint256 idCategory;
        string name;
        string description;
    }

    struct User {
        address idUser;
        string firstName;
        string lastName;
        string isoCountry;
        int256 reputation;
        string image;
    }

    struct Rent {
        uint256 idRent;
        uint256 assetId;
        address renter;
    }

    struct Rate {
        uint256 idRate;
        uint8 rate;
        string argue;
        address rater;
        uint256 assetId;
    }
}
