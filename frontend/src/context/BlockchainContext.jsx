import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ApiService from '../services/api';

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

  // Add backend data states
  const [backendConnected, setBackendConnected] = useState(false);
  const [backendElections, setBackendElections] = useState([]);
  const [backendCandidates, setBackendCandidates] = useState([]);
  const [backendVoters, setBackendVoters] = useState([]);
  const [currentElectionId, setCurrentElectionId] = useState(null);

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
  // Function to check backend connection
  const checkBackendConnection = async () => {
    try {
      await fetch('http://localhost:5000/api/health');
      setBackendConnected(true);
      return true;
    } catch (error) {
      console.log('Backend not connected, using blockchain data only');
      setBackendConnected(false);
      return false;
    }
  };

  // Function to load backend data
  const loadBackendData = async () => {
    try {
      if (!backendConnected) return;

      const [elections, voters] = await Promise.all([
        ApiService.getElections(),
        ApiService.getRegisteredVoters()
      ]);
      
      setBackendElections(elections);
      setBackendVoters(voters);
      
      // If there's a current election, load its candidates
      if (elections.length > 0) {
        const currentElection = elections[0]; // Get most recent election
        setCurrentElectionId(currentElection._id);
        const candidatesData = await ApiService.getCandidates(currentElection._id);
        setBackendCandidates(candidatesData);
      }
    } catch (error) {
      console.error('Error loading backend data:', error);
      setBackendConnected(false);
    }
  };

  // Add this function after loadBackendData
  const createElectionInBackend = async (electionData) => {
    try {
      if (!backendConnected) return null;
      
      const election = await ApiService.createElection({
        blockchainId: 0, // For demo purposes
        name: electionData.name || "Demo Election 2025",
        description: electionData.description || "Demonstration of blockchain voting system",
        startTime: new Date(),
        endTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        contractAddress: contractAddress || "0x0000000000000000000000000000000000000000",
        createdBy: account,
        isActive: false
      });
      
      setCurrentElectionId(election._id);
      await loadBackendData();
      return election;
    } catch (error) {
      console.error('Error creating election in backend:', error);
      return null;
    }
  };

  // Enhanced connectToContract function
  const connectToContract = async (provider, signer, address) => {
    try {
      // Check backend connection first
      await checkBackendConnection();
      
      // If backend is connected but no election exists, create one
      if (backendConnected && backendElections.length === 0) {
        await createElectionInBackend({
          name: "Demo Election 2025",
          description: "Demonstration of blockchain voting system"
        });
      }
      
      if (!address) return;
      
      // Create mock contract with relevant methods for development purposes
      const mockContract = {
        admin: async () => account,
        electionName: async () => {
          // Try to get from backend first, fallback to mock
          if (backendConnected && backendElections.length > 0) {
            return backendElections[0].name;
          }
          return "Demo Election 2025";
        },
        getVotingStatus: async () => {
          // Try to get from backend first
          if (backendConnected && backendElections.length > 0) {
            const election = backendElections[0];
            return [election.isActive, 0, 0, 0];
          }
          return [false, 0, 0, 0];
        },
        getVoterStatus: async (voterAddress) => {
          // Check backend for voter status
          if (backendConnected) {
            const voter = backendVoters.find(v => 
              v.walletAddress?.toLowerCase() === voterAddress?.toLowerCase()
            );
            return [!!voter, voter?.hasVoted || false, voter?.votedCandidateId || 0];
          }
          return [true, false, 0];
        },
        getCandidatesCount: async () => {
          if (backendConnected && backendCandidates.length > 0) {
            return backendCandidates.length;
          }
          return 3;
        },
        getCandidate: async (id) => {
          if (backendConnected && backendCandidates.length > 0) {
            const candidate = backendCandidates[id];
            if (candidate) {
              return [
                id,
                candidate.name,
                candidate.party,
                candidate.manifesto || candidate.description,
                candidate.voteCount || 0
              ];
            }
          }
          // Fallback to mock data
          const mockCandidates = [
            [0, "John Doe", "Party A", "Building a better future", 0],
            [1, "Jane Smith", "Party B", "Prosperity for all", 0],
            [2, "Robert Johnson", "Party C", "Security and growth", 0]
          ];
          return mockCandidates[id % 3];
        },
        addCandidate: async (name, party, manifesto) => {
          console.log(`Adding candidate ${name} from ${party}`);
          
          // Try to save to backend first
          if (backendConnected && currentElectionId) {
            try {
              await ApiService.createCandidate({
                name,
                party,
                manifesto: manifesto || '',
                description: manifesto || '',
                electionId: currentElectionId,
                blockchainId: backendCandidates.length, // Use current count as blockchain ID
                electionBlockchainId: 0, // Assuming single election
                voteCount: 0
              });
              // Reload backend data
              await loadBackendData();
              return { wait: async () => true };
            } catch (error) {
              console.error('Error saving to backend:', error);
              throw error;
            }
          }
          
          return { wait: async () => true };
        },
        registerVoter: async (voterAddress) => {
          console.log(`Registering voter ${voterAddress}`);
          
          // Try to save to backend
          if (backendConnected && currentElectionId) {
            try {
              await ApiService.registerVoter({
                walletAddress: voterAddress,
                electionId: currentElectionId
              });
              // Reload backend data
              await loadBackendData();
            } catch (error) {
              console.error('Error saving voter to backend:', error);
            }
          }
          
          return { wait: async () => true };
        },
        startVoting: async (duration) => {
          console.log(`Starting voting for ${duration} minutes`);
          
          // Update backend if connected
          if (backendConnected && currentElectionId) {
            try {
              await ApiService.updateElection(currentElectionId, {
                isActive: true,
                startTime: new Date(),
                duration: duration
              });
              await loadBackendData();
            } catch (error) {
              console.error('Error updating election in backend:', error);
            }
          }
          
          return { wait: async () => true };
        },
        endVoting: async () => {
          console.log(`Ending voting`);
          
          // Update backend if connected
          if (backendConnected && currentElectionId) {
            try {
              await ApiService.updateElection(currentElectionId, {
                isActive: false,
                endTime: new Date()
              });
              await loadBackendData();
            } catch (error) {
              console.error('Error updating election in backend:', error);
            }
          }
          
          return { wait: async () => true };
        },
        vote: async (candidateId) => {
          console.log(`Voting for candidate ${candidateId}`);
          
          // Record vote in backend
          if (backendConnected && currentElectionId) {
            try {
              await ApiService.recordVote({
                candidateId,
                voterAddress: account,
                electionId: currentElectionId
              });
              await loadBackendData();
            } catch (error) {
              console.error('Error recording vote in backend:', error);
            }
          }
          
          return { wait: async () => true };
        },
        getWinner: async () => {
          // Calculate winner from backend data
          if (backendConnected && backendCandidates.length > 0) {
            const winner = backendCandidates.reduce((prev, current) => 
              (prev.voteCount > current.voteCount) ? prev : current
            );
            return [winner._id, winner.name, winner.voteCount || 0];
          }
          return [0, "John Doe", 5];
        }
      };
      
      setContract(mockContract);
      setIsAdmin(true);

      // Load backend data
      await loadBackendData();

      // Set election info
      const name = await mockContract.electionName();
      const [isOpen, startTime, endTime, remainingTime] = await mockContract.getVotingStatus();
      
      setElectionInfo({
        name,
        isOpen,
        startTime: Number(startTime),
        endTime: Number(endTime),
        remainingTime: Number(remainingTime),
      });

      // Set voter information
      if (account) {
        const [isRegistered, hasVoted, candidateId] = await mockContract.getVoterStatus(account);
        setVoter({
          isRegistered,
          hasVoted,
          candidateId: Number(candidateId),
        });
      }

      // Get candidates
      await fetchCandidates(mockContract);
      
      setError('');
    } catch (err) {
      console.error('Error connecting to contract:', err);
      setError(`Error connecting to contract: ${err.message}`);
    }
  };

  // Enhanced fetchCandidates function
  const fetchCandidates = async (votingContract) => {
    try {
      const contractToUse = votingContract || contract;
      if (!contractToUse) return;

      // If backend is connected, use backend data
      if (backendConnected && backendCandidates.length > 0) {
        const formattedCandidates = backendCandidates.map((candidate, index) => ({
          id: index,
          blockchainId: candidate._id,
          name: candidate.name,
          party: candidate.party,
          manifesto: candidate.manifesto || candidate.description,
          voteCount: candidate.voteCount || 0,
        }));
        setCandidates(formattedCandidates);
        return;
      }

      // Fallback to contract/mock data
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
    }
  };

  // Enhanced refreshData function
  const refreshData = async () => {
    // Refresh backend connection and data
    await checkBackendConnection();
    await loadBackendData();

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
          if (contractAddress) {
            connectToContract(provider, signer, contractAddress);
          }
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      // Cleanup function
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [provider, signer, contractAddress]);

  // On component mount, connect wallet and load data
  useEffect(() => {
    const init = async () => {
      await connectWallet();
    };

    init();
  }, []);

  // Reconnect if network or account changes
  useEffect(() => {
    const handleNetworkChange = async (chainId) => {
      setLoading(true);
      setError('');

      // For development, we might be on a different chain
      const targetChainId = '0x5'; // Goerli testnet
      if (chainId !== targetChainId) {
        setError('Please switch to the Goerli testnet in MetaMask');
        setLoading(false);
        return;
      }

      // Reconnect to contract if address is set
      if (contractAddress) {
        await connectToContract(provider, signer, contractAddress);
      }

      setLoading(false);
    };

    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleNetworkChange);

      // Cleanup function
      return () => {
        window.ethereum.removeListener('chainChanged', handleNetworkChange);
      };
    }
  }, [provider, signer, contractAddress]);

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
    // Backend-related states
    backendConnected,
    backendElections,
    backendCandidates,
    backendVoters,
    currentElectionId,
    // Functions
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
    // Backend functions
    checkBackendConnection,
    loadBackendData,
    createElectionInBackend, // Add this
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
}
