import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Hardcoded ABI for when artifacts aren't available
const VotingSystemArtifact = {
  abi: [
    // Basic functions from VotingSystem contract
    {
      "inputs": [{"internalType": "string", "name": "_electionName", "type": "string"}],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "admin",
      "outputs": [{"internalType": "address", "name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "electionName",
      "outputs": [{"internalType": "string", "name": "", "type": "string"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "string", "name": "_name", "type": "string"},
        {"internalType": "string", "name": "_party", "type": "string"},
        {"internalType": "string", "name": "_manifesto", "type": "string"}
      ],
      "name": "addCandidate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "address", "name": "_voter", "type": "address"}],
      "name": "registerVoter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "_durationInMinutes", "type": "uint256"}],
      "name": "startVoting",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "endVoting",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCandidatesCount",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "_candidateId", "type": "uint256"}],
      "name": "getCandidate",
      "outputs": [
        {"internalType": "uint256", "name": "id", "type": "uint256"},
        {"internalType": "string", "name": "name", "type": "string"},
        {"internalType": "string", "name": "party", "type": "string"},
        {"internalType": "string", "name": "manifesto", "type": "string"},
        {"internalType": "uint256", "name": "voteCount", "type": "uint256"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "address", "name": "_voter", "type": "address"}],
      "name": "getVoterStatus",
      "outputs": [
        {"internalType": "bool", "name": "isRegistered", "type": "bool"},
        {"internalType": "bool", "name": "hasVoted", "type": "bool"},
        {"internalType": "uint256", "name": "votedCandidateId", "type": "uint256"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getVotingStatus",
      "outputs": [
        {"internalType": "bool", "name": "isOpen", "type": "bool"},
        {"internalType": "uint256", "name": "startTime", "type": "uint256"},
        {"internalType": "uint256", "name": "endTime", "type": "uint256"},
        {"internalType": "uint256", "name": "remainingTime", "type": "uint256"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "_candidateId", "type": "uint256"}],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getWinner",
      "outputs": [
        {"internalType": "uint256", "name": "winnerId", "type": "uint256"},
        {"internalType": "string", "name": "winnerName", "type": "string"},
        {"internalType": "uint256", "name": "winnerVotes", "type": "uint256"}
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
};

const BlockchainContext = createContext();

export function useBlockchain() {
  return useContext(BlockchainContext);
}

export default function BlockchainProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [networkName, setNetworkName] = useState('');
  const [electionInfo, setElectionInfo] = useState({
    name: '',
    isOpen: false,
    startTime: 0,
    endTime: 0,
    remainingTime: 0,
  });
  const [voter, setVoter] = useState({
    isRegistered: false,
    hasVoted: false,
    candidateId: 0,
  });
  const [candidates, setCandidates] = useState([]);
  // Add state for registered voters
  const [registeredVoters, setRegisteredVoters] = useState([]);

  // Contract address will be set after deployment
  // For development, we'll need to update this with the deployed address
  const [contractAddress, setContractAddress] = useState('');

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError('');

      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to use this application.');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      setAccount(account);

      // Set up provider and signer
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      const ethersSigner = await ethersProvider.getSigner();
      
      setProvider(ethersProvider);
      setSigner(ethersSigner);
      
      // Get network info
      const network = await ethersProvider.getNetwork();
      setNetworkName(network.name);

      // If we have a contract address, connect to the contract
      if (contractAddress) {
        await connectToContract(ethersProvider, ethersSigner, contractAddress);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error connecting to wallet:', err);
      setError(err.message || 'Error connecting to wallet');
      setLoading(false);
    }
  };
  const connectToContract = async (provider, signer, address) => {
    try {
      if (!address) return;
      
      // Create mock contract with relevant methods for development purposes
      const mockContract = {
        admin: async () => account,
        electionName: async () => "Mock Election 2025",
        getVotingStatus: async () => [false, 0, 0, 0],
        getVoterStatus: async () => [true, false, 0],
        getCandidatesCount: async () => 3,
        getCandidate: async (id) => {
          const mockCandidates = [
            [0, "John Doe", "Party A", "Building a better future", 0],
            [1, "Jane Smith", "Party B", "Prosperity for all", 0],
            [2, "Robert Johnson", "Party C", "Security and growth", 0]
          ];
          return mockCandidates[id % 3];
        },
        addCandidate: async (name, party, manifesto) => {
          console.log(`Mock: Added candidate ${name} from ${party}`);
          // No actual blockchain interaction, just log and return a mock transaction
          return { wait: async () => true };
        },
        registerVoter: async (voter) => {
          console.log(`Mock: Registered voter ${voter}`);
          return { wait: async () => true };
        },
        startVoting: async (duration) => {
          console.log(`Mock: Started voting for ${duration} minutes`);
          return { wait: async () => true };
        },
        endVoting: async () => {
          console.log(`Mock: Ended voting`);
          return { wait: async () => true };
        },
        vote: async (candidateId) => {
          console.log(`Mock: Voted for candidate ${candidateId}`);
          return { wait: async () => true };
        },
        getWinner: async () => [0, "John Doe", 5]
      };
      
      setContract(mockContract);
      
      // Set admin status - in mock mode, the connected account is always admin
      setIsAdmin(true);

      // Set mock election name
      const name = await mockContract.electionName();
      
      // Set mock voting status
      const [isOpen, startTime, endTime, remainingTime] = await mockContract.getVotingStatus();
      
      setElectionInfo({
        name,
        isOpen,
        startTime: Number(startTime),
        endTime: Number(endTime),
        remainingTime: Number(remainingTime),
      });

      // Set mock voter information
      if (account) {
        const [isRegistered, hasVoted, candidateId] = await mockContract.getVoterStatus(account);
        setVoter({
          isRegistered,
          hasVoted,
          candidateId: Number(candidateId),
        });
      }

      // Get mock candidates
      await fetchCandidates(mockContract);
      
      // Fetch registered voters if admin
      if (isAdmin) {
        await fetchRegisteredVoters();
      }
      
      setError('');
    } catch (err) {
      console.error('Error connecting to contract:', err);
      setError(`Error connecting to contract: ${err.message}`);
    }
  };
  const fetchCandidates = async (votingContract) => {
    try {
      const contractToUse = votingContract || contract;
      if (!contractToUse) return;

      // If we're working with a mock contract or real contract, we'll handle both cases
      const count = await contractToUse.getCandidatesCount();
      const fetchedCandidates = [];

      for (let i = 0; i < Number(count); i++) {
        try {
          const [id, name, party, manifesto, voteCount] = await contractToUse.getCandidate(i);
          fetchedCandidates.push({
            id: Number(id),
            name,
            party,
            manifesto,
            voteCount: Number(voteCount),
          });
        } catch (error) {
          console.error(`Error fetching candidate ${i}:`, error);
        }
      }

      setCandidates(fetchedCandidates);
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError(`Error fetching candidates: ${err.message}`);
      
      // Set some mock candidates as fallback
      setCandidates([
        { id: 0, name: "John Doe", party: "Party A", manifesto: "Building a better future", voteCount: 0 },
        { id: 1, name: "Jane Smith", party: "Party B", manifesto: "Prosperity for all", voteCount: 0 },
        { id: 2, name: "Robert Johnson", party: "Party C", manifesto: "Security and growth", voteCount: 0 }
      ]);
    }
  };

  const refreshData = async () => {
    if (contract && account) {
      try {
        // Refresh voting status
        const [isOpen, startTime, endTime, remainingTime] = await contract.getVotingStatus();
        
        setElectionInfo({
          ...electionInfo,
          isOpen,
          startTime: Number(startTime),
          endTime: Number(endTime),
          remainingTime: Number(remainingTime),
        });

        // Refresh voter information
        const [isRegistered, hasVoted, candidateId] = await contract.getVoterStatus(account);
        setVoter({
          isRegistered,
          hasVoted,
          candidateId: Number(candidateId),
        });

        // Refresh candidates
        await fetchCandidates();
        
        // Refresh registered voters if admin
        if (isAdmin) {
          await fetchRegisteredVoters();
        }
      } catch (err) {
        console.error('Error refreshing data:', err);
        setError(`Error refreshing data: ${err.message}`);
      }
    }
  };

  // Function to add a candidate
  const addCandidate = async (name, party, manifesto) => {
    if (!contract || !isAdmin) return;
    
    try {
      const tx = await contract.addCandidate(name, party, manifesto);
      await tx.wait();
      await fetchCandidates();
      return true;
    } catch (err) {
      console.error('Error adding candidate:', err);
      setError(`Error adding candidate: ${err.message}`);
      return false;
    }
  };

  // Function to register a voter
  const registerVoter = async (voterAddress) => {
    if (!contract || !isAdmin) return;
    
    try {
      const tx = await contract.registerVoter(voterAddress);
      await tx.wait();
      
      // If the registered voter is the current user, update voter state
      if (voterAddress.toLowerCase() === account.toLowerCase()) {
        setVoter({
          ...voter,
          isRegistered: true,
        });
      }
      
      // Update registered voters list
      await fetchRegisteredVoters();
      
      return true;
    } catch (err) {
      console.error('Error registering voter:', err);
      setError(`Error registering voter: ${err.message}`);
      return false;
    }
  };

  // Function to start voting
  const startVoting = async (durationInMinutes) => {
    if (!contract || !isAdmin) return;
    
    try {
      const tx = await contract.startVoting(durationInMinutes);
      await tx.wait();
      await refreshData();
      return true;
    } catch (err) {
      console.error('Error starting voting:', err);
      setError(`Error starting voting: ${err.message}`);
      return false;
    }
  };

  // Function to end voting
  const endVoting = async () => {
    if (!contract || !isAdmin) return;
    
    try {
      const tx = await contract.endVoting();
      await tx.wait();
      await refreshData();
      return true;
    } catch (err) {
      console.error('Error ending voting:', err);
      setError(`Error ending voting: ${err.message}`);
      return false;
    }
  };

  // Function to cast a vote
  const castVote = async (candidateId) => {
    if (!contract || !voter.isRegistered || voter.hasVoted) return;
    
    try {
      const tx = await contract.vote(candidateId);
      await tx.wait();
      await refreshData();
      return true;
    } catch (err) {
      console.error('Error casting vote:', err);
      setError(`Error casting vote: ${err.message}`);
      return false;
    }
  };

  // Function to get winner
  const getWinner = async () => {
    if (!contract) return null;
    
    try {
      const [winnerId, winnerName, winnerVotes] = await contract.getWinner();
      return {
        id: Number(winnerId),
        name: winnerName,
        votes: Number(winnerVotes),
      };
    } catch (err) {
      console.error('Error getting winner:', err);
      setError(`Error getting winner: ${err.message}`);
      return null;
    }
  };

  // Function to fetch registered voters
  const fetchRegisteredVoters = async () => {
    if (!contract || !isAdmin) return [];
    
    try {
      // Since Solidity doesn't provide a direct way to get all registered voters,
      // in a real app we'd use events or a separate function in the contract.
      // For this demo, we'll use mock data
      
      // Mock data for demo purposes
      const mockRegisteredVoters = [
        { address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", hasVoted: true },
        { address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", hasVoted: false },
        { address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", hasVoted: true },
        { address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", hasVoted: false },
        { address: account, hasVoted: voter.hasVoted }
      ];
      
      setRegisteredVoters(mockRegisteredVoters);
      return mockRegisteredVoters;
    } catch (err) {
      console.error('Error fetching registered voters:', err);
      setError(`Error fetching registered voters: ${err.message}`);
      return [];
    }
  };

  const setDeployedContractAddress = async (address) => {
    setContractAddress(address);
    if (provider && signer) {
      await connectToContract(provider, signer, address);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          setAccount('');
          setIsAdmin(false);
        } else {
          setAccount(accounts[0]);
          if (contract) {
            // Check if the new account is admin
            contract.admin().then((adminAddress) => {
              setIsAdmin(adminAddress.toLowerCase() === accounts[0].toLowerCase());
            });
            // Update voter information for the new account
            contract.getVoterStatus(accounts[0]).then(([isRegistered, hasVoted, candidateId]) => {
              setVoter({
                isRegistered,
                hasVoted,
                candidateId: Number(candidateId),
              });
            });
          }
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [contract]);
  // Automatically try to connect when the component mounts
  useEffect(() => {
    connectWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set up a refresh interval to update time-based information
  useEffect(() => {
    if (electionInfo.isOpen) {
      const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [electionInfo.isOpen, contract, account]);

  const value = {
    provider,
    signer,
    contract,
    account,
    loading,
    error,
    isAdmin,
    networkName,
    electionInfo,
    voter,
    candidates,
    registeredVoters,
    contractAddress,
    connectWallet,
    connectToContract,
    fetchCandidates,
    refreshData,
    addCandidate,
    registerVoter,
    startVoting,
    endVoting,
    castVote,
    getWinner,
    fetchRegisteredVoters,
    setDeployedContractAddress,
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
}
