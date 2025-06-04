import { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
      
      if (accounts.length > 0) {
        const connectedAccount = accounts[0];
        setAccount(connectedAccount);
        // Store connected wallet information
        localStorage.setItem('walletConnected', 'true');
        
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
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      setError(error.message || 'Error connecting to wallet');
    } finally {
      setLoading(false);
    }
  };  const connectToContract = async (provider, signer, address) => {
    try {
      if (!address) return;
        // Create mock contract with relevant methods for development purposes
      // Add state management for voting
      let votingState = {
        isOpen: false,
        startTime: 0,
        endTime: 0,
        remainingTime: 0
      };
      
      // Try to load stored voting state
      try {
        const storedVotingState = localStorage.getItem('mockVotingState');
        if (storedVotingState) {
          votingState = JSON.parse(storedVotingState);
          console.log('Loaded stored voting state:', votingState);
        }
      } catch (err) {
        console.error('Error loading stored voting state:', err);
      }
      
      // Track voter states
      let voterStates = {};

      // Track candidates - load from localStorage if available
      let mockCandidates = [];
      
      // Try to load stored candidates if we're using the mock contract
      try {
        const storedCandidates = localStorage.getItem('mockCandidates');
        if (storedCandidates) {
          mockCandidates = JSON.parse(storedCandidates);
          console.log('Loaded stored candidates:', mockCandidates);
        }
      } catch (err) {
        console.error('Error loading stored candidates:', err);
      }
      
      const mockContract = {
        admin: async () => account,
        electionName: async () => "Mock Election 2025",
        getVotingStatus: async () => {
          // Update remaining time if voting is open
          if (votingState.isOpen) {
            const now = Math.floor(Date.now() / 1000);
            const remaining = Math.max(0, votingState.endTime - now);
            votingState.remainingTime = remaining;
            
            // Auto-close voting if time is up
            if (remaining <= 0) {
              votingState.isOpen = false;
              votingState.remainingTime = 0;
            }
          }
          
          return [
            votingState.isOpen, 
            votingState.startTime, 
            votingState.endTime, 
            votingState.remainingTime
          ];
        },
        getVoterStatus: async (address) => {
          const voterAddress = address || account;
          const voterState = voterStates[voterAddress] || { isRegistered: true, hasVoted: false, candidateId: 0 };
          return [voterState.isRegistered, voterState.hasVoted, voterState.candidateId];
        },
        getCandidatesCount: async () => mockCandidates.length,
        getCandidate: async (id) => {
          if (id >= 0 && id < mockCandidates.length) {
            const candidate = mockCandidates[id];
            return [candidate.id, candidate.name, candidate.party, candidate.manifesto, candidate.voteCount];
          }
          throw new Error("Candidate not found");
        },
        addCandidate: async (name, party, manifesto) => {
          const newCandidate = {
            id: mockCandidates.length,
            name,
            party,
            manifesto: manifesto || '',
            voteCount: 0
          };
          mockCandidates.push(newCandidate);
          console.log(`Mock: Added candidate ${name} from ${party} with manifesto: ${manifesto}`);
          
          // Save updated candidates to localStorage
          localStorage.setItem('mockCandidates', JSON.stringify(mockCandidates));
          
          return { wait: async () => true };
        },
        registerVoter: async (voterAddress) => {
          console.log(`Mock: Registered voter ${voterAddress}`);
          // Initialize voter state
          voterStates[voterAddress] = {
            isRegistered: true,
            hasVoted: false,
            candidateId: 0
          };
          return { wait: async () => true };
        },
        startVoting: async (duration) => {
          console.log(`Mock: Started voting for ${duration} minutes`);
          // Update voting state
          const now = Math.floor(Date.now() / 1000);
          const endTime = now + (duration * 60); // Convert minutes to seconds
          votingState = {
            isOpen: true,
            startTime: now,
            endTime: endTime,
            remainingTime: duration * 60
          };
          
          // Store voting state
          localStorage.setItem('mockVotingState', JSON.stringify(votingState));
          
          return { wait: async () => true };
        },
        
        endVoting: async () => {
          console.log(`Mock: Ended voting`);
          // Update voting state
          votingState = {
            ...votingState,
            isOpen: false,
            remainingTime: 0
          };
          
          // Store updated voting state
          localStorage.setItem('mockVotingState', JSON.stringify(votingState));
          
          return { wait: async () => true };
        },        vote: async (candidateId) => {
          console.log(`Mock: Voted for candidate ${candidateId}`);
          // Update voter state
          voterStates[account] = {
            isRegistered: true,
            hasVoted: true,
            candidateId: candidateId
          };
          
          // Update candidate vote count
          if (candidateId < mockCandidates.length) {
            mockCandidates[candidateId].voteCount += 1;
            // Save updated candidates with vote counts
            localStorage.setItem('mockCandidates', JSON.stringify(mockCandidates));
          }
          
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
        setElectionInfo(prev => ({
        ...prev,
        name,
        isOpen,
        startTime: Number(startTime),
        endTime: Number(endTime),
        remainingTime: Number(remainingTime),
      }));

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
      
      // Don't set mock candidates as fallback
      setCandidates([]);
    }
  };

  const refreshData = async () => {
    if (contract && account) {
      try {        // Refresh voting status
        const [isOpen, startTime, endTime, remainingTime] = await contract.getVotingStatus();
          setElectionInfo(prev => ({
          ...prev,
          isOpen,
          startTime: Number(startTime),
          endTime: Number(endTime),
          remainingTime: Number(remainingTime),
        }));

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
    try {
      if (!contract) {
        throw new Error('Contract not connected');
      }
      
      if (!isAdmin) {
        throw new Error('Only admin can add candidates');
      }

      // Call the contract's addCandidate function
      const tx = await contract.addCandidate(name, party, manifesto || '');
      await tx.wait();
      
      // After successful transaction, refresh the candidates list
      await fetchCandidates();
      
      console.log('Candidate added:', name);
      return true;
    } catch (error) {
      console.error('Error adding candidate:', error);
      setError(`Error adding candidate: ${error.message}`);
      throw error;
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
  };  // Function to fetch registered voters
  const fetchRegisteredVoters = useCallback(async () => {
    if (!contract || !isAdmin) return [];
    
    try {
      // Since Solidity doesn't provide a direct way to get all registered voters,
      // in a real app we'd use events or a separate function in the contract.
      // For this demo, we'll use mock data
      
      // Get current voter status to avoid dependency issues
      const [, currentVoterHasVoted] = await contract.getVoterStatus(account);
      
      // Mock data for demo purposes
      const mockRegisteredVoters = [
        { address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", hasVoted: true },
        { address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", hasVoted: false },
        { address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", hasVoted: true },
        { address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", hasVoted: false },
        { address: account, hasVoted: currentVoterHasVoted }
      ];
      
      setRegisteredVoters(mockRegisteredVoters);
      return mockRegisteredVoters;
    } catch (err) {
      console.error('Error fetching registered voters:', err);
      setError(`Error fetching registered voters: ${err.message}`);
      return [];
    }
  }, [contract, isAdmin, account]);

  const setDeployedContractAddress = (address) => {
    setContractAddress(address);
    // Store contract address in localStorage for persistence
    localStorage.setItem('contractAddress', address);
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

  // Check if there's a stored contract address on component mount
  useEffect(() => {
    const storedContractAddress = localStorage.getItem('contractAddress');
    
    if (storedContractAddress) {
      console.log('Found stored contract address:', storedContractAddress);
      setContractAddress(storedContractAddress);
      
      // If we have a wallet connected, try to reconnect to the contract
      if (account) {
        connectToContract(provider, signer, storedContractAddress);
      }
    }
  }, [account, provider, signer]); // Re-run when these dependencies change

  // Set up a refresh interval to update time-based information
  useEffect(() => {
    if (electionInfo.isOpen) {
      const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [electionInfo.isOpen, contract, account]);

  // Add logout function (make sure it's properly defined)
  const disconnectWallet = () => {
    // Reset all state
    setAccount('');
    setIsAdmin(false);
    setContract(null);
    setProvider(null);
    setSigner(null);
    setVoter({
      isRegistered: false,
      hasVoted: false,
      candidateId: null
    });
    setCandidates([]);
    setElectionInfo({
      name: '',
      isOpen: false,
      startTime: 0,
      endTime: 0,
      remainingTime: 0
    });
    setRegisteredVoters([]);
    setContractAddress('');
    setError('');
    
    // Clear localStorage items
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('contractAddress');
    
    // When using the real blockchain, we wouldn't clear this
    // But for development/testing purposes, provide an option to reset
    const resetMockData = true; // Set to false if you want to keep candidates between sessions
    if (resetMockData) {
      localStorage.removeItem('mockCandidates');
      localStorage.removeItem('mockVoters');
      localStorage.removeItem('mockVotingState');
    }
    
    console.log('Wallet disconnected successfully');
  };

  // In your main useEffect for initialization
  useEffect(() => {
    const checkConnection = async () => {
      // Check if user was previously connected
      if (localStorage.getItem('walletConnected') === 'true') {
        try {
          // Try to reconnect wallet automatically
          await connectWallet();
        } catch (error) {
          console.error("Failed to auto-connect wallet:", error);
          localStorage.removeItem('walletConnected');
        }
      }
    };
    
    checkConnection();
  }, []); // Empty dependency array means this runs once on mount

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
    disconnectWallet, // Change from logout to disconnectWallet
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
}
