// src/ethereum.js
import { BrowserProvider, Contract } from 'ethers';

// Create an ethers provider using the injected window.ethereum object from MetaMask
const provider = new BrowserProvider(window.ethereum);

// The address of the CrypToadz contract
const contractAddress = '0x1CB1A5e65610AEFF2551A50f76a87a7d3fB649C6';

// The ABI (Application Binary Interface) of the contract, focusing on tokenURI function
const contractABI = [
  "function tokenURI(uint256 tokenId) public view returns (string memory)"
];

// Create a contract instance
const contract = new Contract(contractAddress, contractABI, provider);

async function requestAccount() {
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
        console.error('Error requesting account access:', error);
        throw error; // Rethrow the error to be caught by calling function
    }
}

async function getSigner() {
    return await provider.getSigner();
}

export { provider, contract, requestAccount, getSigner };
