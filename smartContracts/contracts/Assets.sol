// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IBonvo.sol";
import "./Utils.sol";

abstract contract Assets is IBonvo {
    mapping(string => mapping(uint256 => Asset)) public assetsByCountry;
    mapping(string => uint256) public counterAssetsByCountry;
    mapping(uint256 => Asset) public assetsByTokenId;

    function saveInMapping(Asset memory _asset, uint256 tokenId) internal {
        _asset.tokenId = tokenId;
        uint256 size = counterAssetsByCountry[_asset.ISOCountry];
        assetsByCountry[_asset.ISOCountry][size] = _asset;
        counterAssetsByCountry[_asset.ISOCountry] = size + 1;
        assetsByTokenId[tokenId] = _asset;
    }

    function assetsNearMeNotCategory(
        int256 latitude,
        int256 longitude,
        string calldata ISOCountry
    ) public view returns (Asset[] memory) {
        return assetsNearMeCategory(latitude, longitude, ISOCountry, 0);
    }

    function assetsNearMeCategory(
        int256 latitude,
        int256 longitude,
        string calldata ISOCountry,
        uint256 idCategory
    ) public view returns (Asset[] memory) {
        Asset[] memory countryAssets = filterByCategory(ISOCountry, idCategory);
        uint256 size = countryAssets.length;
        for (uint256 i = 0; i < size; i++) {
            for (uint256 j = 0; j < size - i - 1; j++) {
                Asset memory a0 = countryAssets[j];
                uint256 d0 = Utils.diagDist(
                    latitude,
                    a0.latitude,
                    longitude,
                    a0.longitude
                );

                Asset memory a1 = countryAssets[j + 1];
                uint256 d1 = Utils.diagDist(
                    latitude,
                    a1.latitude,
                    longitude,
                    a1.longitude
                );

                if (d1 < d0) {
                    countryAssets[j] = a1;
                    countryAssets[j + 1] = a0;
                }
            }
        }
        return countryAssets;
    }

    function filterByCategory(string calldata ISOCountry, uint256 idCategory)
        internal
        view
        returns (Asset[] memory)
    {
        uint256 size = counterAssetsByCountry[ISOCountry];
        Asset[] memory tempAssets = new Asset[](size);
        uint256 c = 0;
        for (uint256 i = 0; i < size; i++) {
            if (idCategory == 0) {
                tempAssets[i] = assetsByCountry[ISOCountry][i];
            } else if (
                assetsByCountry[ISOCountry][i].idCategory == idCategory
            ) {
                tempAssets[c] = assetsByCountry[ISOCountry][i];
                c++;
            }
        }

        if (idCategory == 0) {
            return tempAssets;
        } else {
            Asset[] memory outAssets = new Asset[](c);
            for (uint256 i = 0; i < c; i++) {
                outAssets[i] = tempAssets[i];
            }
            return outAssets;
        }
    }
}
