// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library Utils {

    function diagDist(int x1, int x2, int y1, int y2) internal pure returns (uint){
        int abscissa = (x1 - x2);
        int ordinates = (y1 - y2);
        uint quadratic = uint(abscissa**2) + uint(ordinates**2);
        return quadratic ;
    }
}