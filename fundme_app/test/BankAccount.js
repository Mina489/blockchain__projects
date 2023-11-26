const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("BankAccount", function () {
  async function deployBankAccount() {
    const [addr0, addr1,addr2,addr3,addr4] = await ethers.getSigners();

    const BankAccount = await ethers.getContractFactory("BankAccount");
    const bankAccount = await BankAccount.deploy();

    return { bankAccount, addr0,addr1,addr2,addr3,addr4 };
  }


  async function deployBankAccountWithAccounts(owners=1,deposit=0,withDrawAmounts=[]){
    const {bankAccount,addr0,addr1,addr2,addr3,addr4}=await loadFixture(deployBankAccount)
    const addresses=[]
    if(owners==2){
      addresses=[addr1.address]
    }else if(owners==3){
      addresses=[addr1.address,addr2.address]
    }else if(owners==4){
      addresses=[addr1.address,addr2.address,addr3.address]
    }
    await bankAccount.connect(addr0).createAccount(addresses)
    if (deposit>0){
      await bankAccount.connect(addr0).deposit(0,{value:deposit.toString()})
    }
    for (const withDrawAmount of withDrawAmounts){
      await bankAccount.connect(addr0).requestwithdrawl(0,withDrawAmount)
    }
    return {bankAccount,addr0,addr1,addr2,addr3,addr4}
  }


  describe("Deployment", function () {
    it("should deploy without error",async() =>{
      await loadFixture(deployBankAccount)
    })
  })
  describe("creating an account", function () {
    it("should allow creating a single user account",async() =>{
      const {bankAccount,addr0}=await loadFixture(deployBankAccount);
      await bankAccount.connect(addr0).createAccount([])
      const accounts=bankAccount.connect(addr0).getaccounts() 
      console.log('account is',accounts)
    })
    it("should allow creating a double user account",async() =>{
      const {bankAccount,addr0,addr1,addr2,addr3}=await loadFixture(deployBankAccount);
      await bankAccount.connect(addr0).createAccount([addr1.address,addr2.address,addr3.address])

      const accounts1=bankAccount.connect(addr1).getaccounts() 
      console.log('account is',accounts1)
      expect(accounts1.length).to.equal(1)

      const accounts2=bankAccount.connect(addr2).getaccounts() 
      console.log('account is',accounts2)
      expect(accounts2.length).to.equal(1)

      const accounts3=bankAccount.connect(addr3).getaccounts() 
      console.log('account is',accounts3)
      expect(accounts3.length).to.equal(1)
    })
    it("shouldn't allow creating an account with 5 owners",async() =>{
      const {bankAccount,addr0,addr1,addr2,addr3}=await loadFixture(deployBankAccount);
      for (let idx=0;idx<3;idx++){
        await bankAccount.connect(addr0).createAccount([])
      }
      await expect(bankAccount.connect(addr0).createAccount([])).to.be.reverted
    })    
  })

  describe("Depositing",() =>{
    it("should allow deposit from account owner",async() =>{
      const {bankAccount,addr0} = await deployBankAccountWithAccounts(1)
      await excpect(bankAccount.connect(addr0).deposit(0,{value:"100"})).to.changeEtherBalances([BankAccount,addr0],["100","-100"])
  })
  it("should not allow deposit from account owner",async() =>{
    const {bankAccount,addr1} = await deployBankAccountWithAccounts(1)
    await excpect(bankAccount.connect(addr0).deposit(0,{value:"100"})).to
    .be.reverted
  })
  })

  describe("withdraw",() =>{
    describe("request a withdraw",() =>{
      it("should not allow deposit from account owner",async() =>{
        const {bankAccount,addr0} = await deployBankAccountWithAccounts(1,100)
        await bankAccount.connect(addr0).requestwithdrawl(0,100)
      })
    })
    describe("approve a withdraw",() =>{})
})

})
