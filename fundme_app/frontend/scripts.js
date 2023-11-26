const {ethers} = require("hardhat")
const provider=new ethers.providers.Web3Provider(window.ethereum)
const abi=["event Accountcreated(address[] owners, uint256 indexed id, uint256 timestamp)",
"event Deposit(address indexed user, uint256 indexed accountid, uint256 value, uint256 timestamp)",
"event Withdraw(uint256 indexed withdrawid, uint256 timestamp)",
"event Withdrawrequested(address indexed user, uint256 indexed accountid, uint256 indexed withdrawid, uint256 amount, uint256 timestamp)",
"function approvewithdrawal(uint256 accountid, uint256 withdrawid)",
"function createAccount(address[] otherOwners)",
"function deposit(uint256 accountid) payable",
"function getApprovals(uint256 accountid, uint256 withdrawid) view returns (uint256)",
"function getBalance(uint256 accountid) view returns (uint256)",
"function getaccounts() view returns (uint256[])",
"function getowners(uint256 accountid) view returns (address[])",
"function requestwithdrawl(uint256 accountid, uint256 amount)",
"function withdraw(uint256 accountid, uint256 withdrawid)"]

const address="0xa51c1fc2f0d1a1b8494ed1fe312d7c3a78ed91c0"
let contract=null


async function createAccount() {
    await getaccess()
    const owners=document.getElementById("owners").innerText.split(",").filter(n => n)
    await contract.createAccount(owners).then(()=> alert("success"))


}


async function viewaccounts() {
    await getaccess()
    const result=await contract.getAccounts()
    document.getElementById("accounts").innerHTML=result
}

async function getaccess() {
    if (contract) return;
    await provider.send("eth_requestAccounts",[])
    const signer=provider.getSigner()
    contract=new ethers.Contract(address,abi,signer)
    const eventlog=document.getElementById("events")
    contract.on("AccountCreated",(owners,id,event) => {
        eventlog.append(`Account created: ID= ${id},owners = ${owners}`)
    })
}