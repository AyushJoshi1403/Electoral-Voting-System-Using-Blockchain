import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  LinearProgress, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  CircularProgress,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useBlockchain } from '../context/BlockchainContext';
import ApiService from '../services/api';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

export default function ResultsPage() {
  const { 
    account, 
    voter, 
    candidates, 
    electionInfo, 
    getWinner,
    refreshData,
    // Access backend data from context if available
    backendConnected,
    backendCandidates: contextBackendCandidates,
    backendElections: contextBackendElections,
    backendVoters: contextBackendVoters,
    loadBackendData: contextLoadBackendData
  } = useBlockchain();

  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);
  const [error, setError] = useState('');
  
  // Local backend data states (fallback if context doesn't have them)
  const [backendCandidates, setBackendCandidates] = useState([]);
  const [backendElections, setBackendElections] = useState([]);
  const [backendVoters, setBackendVoters] = useState([]);
  const [currentElectionId, setCurrentElectionId] = useState(null);
  const [backendConnectionStatus, setBackendConnectionStatus] = useState(false);

  // Use context data if available, otherwise use local state
  const displayBackendCandidates = contextBackendCandidates?.length > 0 ? contextBackendCandidates : backendCandidates;
  const displayBackendElections = contextBackendElections?.length > 0 ? contextBackendElections : backendElections;
  const displayBackendVoters = contextBackendVoters?.length > 0 ? contextBackendVoters : backendVoters;

  // Check backend connection
  const checkBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      if (response.ok) {
        setBackendConnectionStatus(true);
        return true;
      }
    } catch (error) {
      console.log('Backend not available');
    }
    setBackendConnectionStatus(false);
    return false;
  };

  // Load backend data with error handling
  const loadBackendData = async () => {
    try {
      setDataLoading(true);
      setError('');

      // Check if backend is available
      const isBackendAvailable = await checkBackendConnection();
      if (!isBackendAvailable) {
        setError('Backend server is not available. Using blockchain data only.');
        return;
      }

      // Fetch data from backend
      const [elections, voters] = await Promise.all([
        ApiService.getElections(),
        ApiService.getRegisteredVoters()
      ]);
      
      setBackendElections(elections);
      setBackendVoters(voters);
      
      // If there's a current election, load its candidates
      if (elections.length > 0) {
        const currentElection = elections.find(e => e.isActive) || elections[0]; // Prefer active election
        setCurrentElectionId(currentElection._id);
        
        const candidatesData = await ApiService.getCandidates(currentElection._id);
        setBackendCandidates(candidatesData);
        
        console.log('Backend data loaded:', {
          elections: elections.length,
          candidates: candidatesData.length,
          voters: voters.length
        });
      } else {
        console.log('No elections found in backend');
      }
    } catch (error) {
      console.error('Error loading backend data:', error);
      setError(`Failed to load backend data: ${error.message}`);
      setBackendConnectionStatus(false);
    } finally {
      setDataLoading(false);
    }
  };

  // Load backend data on component mount
  useEffect(() => {
    loadBackendData();
  }, []);

  // Fetch winner when voting is closed
  useEffect(() => {
    const fetchWinner = async () => {
      const isElectionOpen = electionInfo?.isOpen || displayBackendElections[0]?.isActive;
      
      if (!isElectionOpen && !loading) {
        try {
          setLoading(true);
          
          // Try to get winner from backend first
          if (backendConnectionStatus && displayBackendCandidates.length > 0) {
            const winnerCandidate = displayBackendCandidates.reduce((prev, current) => 
              (prev.voteCount > current.voteCount) ? prev : current
            );
            
            if (winnerCandidate && winnerCandidate.voteCount > 0) {
              setWinner({
                id: winnerCandidate._id || winnerCandidate.id,
                name: winnerCandidate.name,
                party: winnerCandidate.party,
                votes: winnerCandidate.voteCount
              });
            }
          } else if (getWinner) {
            // Fallback to blockchain winner
            const winnerData = await getWinner();
            setWinner(winnerData);
          }
        } catch (err) {
          console.error('Error fetching winner:', err);
          setError('Failed to determine winner');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWinner();
  }, [electionInfo?.isOpen, displayBackendElections, displayBackendCandidates, backendConnectionStatus, getWinner, loading]);

  // Use backend data when available, fallback to blockchain data
  const displayCandidates = displayBackendCandidates.length > 0 ? displayBackendCandidates.map(candidate => ({
    id: candidate._id || candidate.id,
    blockchainId: candidate.blockchainId || candidate.id,
    name: candidate.name,
    party: candidate.party,
    manifesto: candidate.manifesto || candidate.description,
    voteCount: candidate.voteCount || 0,
    _id: candidate._id
  })) : candidates;

  const displayVoters = displayBackendVoters.length > 0 ? displayBackendVoters : [];
  const currentElection = displayBackendElections[0] || null;

  // Calculate total votes using display candidates
  useEffect(() => {
    if (displayCandidates.length > 0) {
      const total = displayCandidates.reduce((sum, candidate) => sum + (candidate.voteCount || 0), 0);
      setTotalVotes(total);
    }
  }, [displayCandidates]);

  // Refresh all data
  const handleRefreshData = async () => {
    setDataLoading(true);
    await Promise.all([
      refreshData?.(),
      loadBackendData(),
      contextLoadBackendData?.()
    ]);
  };

  // Helper function to calculate vote percentage
  const calculatePercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return (votes / totalVotes) * 100;
  };

  // Find the candidate the user voted for
  const userVote = voter?.hasVoted ? displayCandidates.find(c => 
    (c.id === voter.candidateId) || (c.blockchainId === voter.candidateId)
  ) : null;

  // Check if voting is in progress
  const isVotingInProgress = electionInfo?.isOpen || currentElection?.isActive;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Election Results
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            {electionInfo?.name || currentElection?.name || 'Election'}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefreshData}
          disabled={dataLoading}
        >
          {dataLoading ? <CircularProgress size={20} /> : 'Refresh'}
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Backend Status Indicator */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: backendConnectionStatus ? 'success.light' : 'warning.light' }}>
        <Typography variant="body2" color="white">
          Data Source: {backendConnectionStatus && displayBackendCandidates.length > 0 ? '✅ Backend Connected' : '⚠️ Using blockchain data only'}
          {backendConnectionStatus && (
            <Typography variant="caption" display="block">
              Elections: {displayBackendElections.length} | Candidates: {displayBackendCandidates.length} | Voters: {displayVoters.length}
            </Typography>
          )}
        </Typography>
      </Paper>

      {/* Loading State */}
      {dataLoading && (
        <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Loading election data...
          </Typography>
        </Paper>
      )}

      {/* Election Status */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Election Status</Typography>
          {isVotingInProgress ? (
            <Chip color="warning" label="VOTING IN PROGRESS" />
          ) : (
            <Chip color="success" label="VOTING CONCLUDED" />
          )}
        </Box>

        {/* Election Details */}
        {currentElection && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Description:</strong> {currentElection.description}
            </Typography>
            {currentElection.startTime && (
              <Typography variant="body2" color="text.secondary">
                <strong>Started:</strong> {new Date(currentElection.startTime).toLocaleString()}
              </Typography>
            )}
            {currentElection.endTime && !isVotingInProgress && (
              <Typography variant="body2" color="text.secondary">
                <strong>Ended:</strong> {new Date(currentElection.endTime).toLocaleString()}
              </Typography>
            )}
          </Box>
        )}

        {/* Winner Display */}
        {!isVotingInProgress && (
          <>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ ml: 2, alignSelf: 'center' }}>
                  Calculating winner...
                </Typography>
              </Box>
            ) : winner ? (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Chip 
                  icon={<EmojiEventsIcon />}
                  label="WINNER"
                  color="primary"
                  sx={{ mb: 1 }}
                />
                <Typography variant="h5" gutterBottom>
                  {winner.name} ({winner.party})
                </Typography>
                <Typography variant="body1" gutterBottom>
                  With {winner.votes} votes ({calculatePercentage(winner.votes).toFixed(1)}%)
                </Typography>
              </Box>
            ) : totalVotes > 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                Election completed. Results calculated from {totalVotes} total votes.
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                No votes were cast in this election.
              </Typography>
            )}
          </>
        )}

        {isVotingInProgress && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Final results will be available once the voting period ends.
          </Typography>
        )}
      </Paper>

      {/* User's vote */}
      {voter?.hasVoted && userVote && (
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Your Vote
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mr: 2 }}>
              You voted for:
            </Typography>
            <Chip 
              label={`${userVote.name} (${userVote.party})`}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Paper>
      )}

      {/* Results Chart */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Vote Distribution
        </Typography>
        
        {isVotingInProgress && !winner ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Detailed results are hidden during voting to prevent influence.
          </Typography>
        ) : displayCandidates.length > 0 ? (
          <Grid container spacing={2}>
            {displayCandidates.map((candidate) => (
              <Grid item xs={12} key={candidate.id || candidate._id}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body1">
                      {candidate.name} ({candidate.party})
                    </Typography>
                    <Typography variant="body2">
                      {candidate.voteCount || 0} votes ({calculatePercentage(candidate.voteCount || 0).toFixed(1)}%)
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={calculatePercentage(candidate.voteCount || 0)} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 1,
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: winner && (candidate.id === winner.id || candidate._id === winner.id) ? '#ff9800' : undefined,
                      }
                    }}
                  />
                </Box>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Total Votes: {totalVotes}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Registered Voters: {displayVoters.length}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No candidates found for this election.
          </Typography>
        )}
      </Paper>

      {/* Candidates Table */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Candidate Details {displayBackendCandidates.length > 0 && '(Backend Data)'}
          </Typography>
          <Button 
            size="small" 
            variant="outlined"
            onClick={loadBackendData}
            disabled={dataLoading}
            startIcon={<RefreshIcon />}
          >
            Refresh Backend Data
          </Button>
        </Box>
        
        {displayCandidates.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Candidate</TableCell>
                  <TableCell>Party</TableCell>
                  <TableCell>Manifesto</TableCell>
                  {!isVotingInProgress && (
                    <TableCell align="right">Votes</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {displayCandidates.map((candidate) => (
                  <TableRow 
                    key={candidate.id || candidate._id}
                    sx={{ 
                      backgroundColor: winner && (candidate.id === winner.id || candidate._id === winner.id) ? 'rgba(255, 193, 7, 0.1)' : undefined,
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {winner && (candidate.id === winner.id || candidate._id === winner.id) && (
                          <EmojiEventsIcon 
                            color="warning" 
                            fontSize="small" 
                            sx={{ mr: 1 }} 
                          />
                        )}
                        {candidate.name}
                      </Box>
                    </TableCell>
                    <TableCell>{candidate.party}</TableCell>
                    <TableCell>{candidate.manifesto || 'No manifesto provided'}</TableCell>
                    {!isVotingInProgress && (
                      <TableCell align="right">
                        <Chip 
                          label={candidate.voteCount || 0}
                          color={winner && (candidate.id === winner.id || candidate._id === winner.id) ? 'primary' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No candidates available for this election.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
