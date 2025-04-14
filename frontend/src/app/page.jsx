"use client";
// pages/index.tsx
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';

// Import ethers only on client side
let ethers;
if (typeof window !== 'undefined') {
  // Dynamic import for ethers
  import('ethers').then(eth => {
    ethers = eth;
  });
}

// Import your contract ABI directly - manually define if needed
// This is a temporary solution until you compile your contract properly
const ElectionSystemABI = [
  // ABI for admin function 
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  // ABI for electionCount function
  {
    "inputs": [],
    "name": "electionCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  // ABI for getElectionDetails function
  {
    "inputs": [{ "internalType": "uint256", "name": "_electionId", "type": "uint256" }],
    "name": "getElectionDetails",
    "outputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "uint256", "name": "startTime", "type": "uint256" },
      { "internalType": "uint256", "name": "endTime", "type": "uint256" },
      { "internalType": "bool", "name": "isActive", "type": "bool" },
      { "internalType": "uint256", "name": "candidateCount", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // ABI for createElection function
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "uint256", "name": "_startTime", "type": "uint256" },
      { "internalType": "uint256", "name": "_endTime", "type": "uint256" }
    ],
    "name": "createElection",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // ABI for addCandidate function
  {
    "inputs": [
      { "internalType": "uint256", "name": "_electionId", "type": "uint256" },
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_party", "type": "string" }
    ],
    "name": "addCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // ABI for toggleElection function
  {
    "inputs": [
      { "internalType": "uint256", "name": "_electionId", "type": "uint256" },
      { "internalType": "bool", "name": "_isActive", "type": "bool" }
    ],
    "name": "toggleElection",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // ABI for getCandidateCount function
  {
    "inputs": [{ "internalType": "uint256", "name": "_electionId", "type": "uint256" }],
    "name": "getCandidateCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  // ABI for getCandidateDetails function
  {
    "inputs": [
      { "internalType": "uint256", "name": "_electionId", "type": "uint256" },
      { "internalType": "uint256", "name": "_candidateId", "type": "uint256" }
    ],
    "name": "getCandidateDetails",
    "outputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "party", "type": "string" },
      { "internalType": "uint256", "name": "voteCount", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // ABI for hasVoted function
  {
    "inputs": [
      { "internalType": "uint256", "name": "_electionId", "type": "uint256" },
      { "internalType": "address", "name": "_voter", "type": "address" }
    ],
    "name": "hasVoted",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  // ABI for castVote function
  {
    "inputs": [
      { "internalType": "uint256", "name": "_electionId", "type": "uint256" },
      { "internalType": "uint256", "name": "_candidateId", "type": "uint256" }
    ],
    "name": "castVote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Set the contract address to your deployed contract address
// This example uses a typical Hardhat local deployment address
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function Home() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newElection, setNewElection] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: ''
  });
  const [newCandidate, setNewCandidate] = useState({
    electionId: 0,
    name: '',
    party: ''
  });
  const [selectedElection, setSelectedElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isClient) {
      toast.error("Application is initializing. Please try again in a moment.");
      return;
    }

    if (!ethers) {
      toast.error("Ethereum library is still loading. Please try again in a moment.");
      return;
    }

    try {
      if (window.ethereum) {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Create provider and signer
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const account = await signer.getAddress();
        
        // Create contract instance
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ElectionSystemABI, signer);
        
        setProvider(provider);
        setSigner(signer);
        setContract(contract);
        setAccount(account);
        
        // Check if user is admin
        try {
          const admin = await contract.admin();
          setIsAdmin(admin.toLowerCase() === account.toLowerCase());
        } catch (adminError) {
          console.error("Error checking admin status:", adminError);
          toast.error("Connected but couldn't verify admin status");
        }
        
        // Load elections
        loadElections(contract);
      } else {
        toast.error("Please install MetaMask to use this application");
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      
      // Provide specific error messages based on common issues
      if (error.code === 4001) {
        toast.error("Connection rejected by user");
      } else if (error.message && error.message.includes("contract address")) {
        toast.error("Invalid contract address. Make sure your contract is deployed.");
      } else if (error.message && error.message.includes("wrong network")) {
        toast.error("Please connect to the correct network where your contract is deployed.");
      } else {
        toast.error("Failed to connect wallet: " + (error.message || error));
      }
    }
  };

  // Rest of your component code remains the same...
}

// Use dynamic export with no SSR to avoid window-is-not-defined errors
export default dynamic(() => Promise.resolve(Home), { ssr: false });