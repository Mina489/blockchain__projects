console.log('hii')
console.log(window)
import { ethers } from "./ethers-5.6.esm.min.js"
import {abi} from "./constants.js"
const connectButton=document.getElementById("connectButton")
const fundbutton=document.getElementById("fund")
connectButton.onclick=connect
fundbutton.onclick=fund
async function connect() {
    if(typeof window.ethereum!=undefined){
        console.log('í see ametamask')
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log(accounts[0])
            console.log('connected')
            document.getElementById("connectButton").innerHTML='connected'    
    }else{
        console.log('no metamask')
    }}

async function fund(eth_amount=33) {
    console.log(`funding with ${eth_amount}`)
    if (typeof window.ethereum!="undefined"){
        const provider=  new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
    }
}    