// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenBonvo is ERC20, AccessControl{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    constructor(address adminRole) ERC20("Bonvo", "Bnv"){
        _setupRole(DEFAULT_ADMIN_ROLE, adminRole);
        _mint(adminRole, 100_000_000_000_000_000_000_000_000);
    }
    function dTransfer(address owner, address to, uint256 amount) public {
        _transfer(owner, to, amount);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE){
        _mint(to, amount);
    }

    function burn(address to, uint256 amount) public onlyRole(BURNER_ROLE){
        _burn(to, amount);    
    }
} 