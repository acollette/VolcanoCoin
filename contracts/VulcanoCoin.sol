//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VulcanoCoin is ERC20, Ownable {

    mapping (address => Payment[]) public userPayments;

    struct Payment {
        uint256 amount;
        address from;
        address to;
    }

    constructor() ERC20("VulcanoCoin", "VCN") {
        _mint(msg.sender, 10000);
    }

    function increaseTotalSupply () public onlyOwner {
        _mint(msg.sender, 1000);
    }


    function getPayments(address _user) public view returns (Payment[] memory){
        Payment[] memory payments = userPayments[_user];
        return payments;
    }

    function _recordPayment (uint256 amount, address from, address to) internal{
        Payment memory payment = Payment(amount, from, to);
        userPayments[from].push(payment);

    }

    function _afterTokenTransfer (address from, address to, uint256 amount) internal override {
        _recordPayment(amount, from, to);

    }
    

}
