
let owner;
let addr1;
let addr2
const { ethers } = require("hardhat");
async () =>{
    [owner,addr1,addr2] = await ethers.getSigners();
}
console.log(owner,addr1,addr2)