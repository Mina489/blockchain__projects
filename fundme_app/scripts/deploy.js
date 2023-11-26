const hre = require("hardhat");
const fs=require("fs/promises")
async function main() {
  const BankAccount = await hre.ethers.getContractFactory("BankAccount");
  const bankAccount = await BankAccount.deploy();
  await bankAccount.deployed();
  await writeDeplymentinfo(bankAccount)

}


async function writeDeplymentinfo(contract) {
  const data ={
    contracts : {
      addresss:contract.address,
      signerAddress:contract.signer.address,
      abi:contract.interface.format(),
    },
  }
  console.log(contract.address)
  const content = JSON.stringify(data,null,2)
  await fs.writeFile("deployment.json",content,{encoding:"utf-8"})
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
