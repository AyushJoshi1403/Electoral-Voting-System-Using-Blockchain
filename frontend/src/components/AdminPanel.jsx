import { useState, useEffect } from 'react';
import { Typography, Box, Paper, Button, TextField, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Snackbar, Alert, CircularProgress, Chip, Divider} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useBlockchain } from '../context/BlockchainContext';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { 
    isAdmin, 
    account,
    contract,
    electionInfo,
    candidates,
    registeredVoters,
    registerVoter,
    addCandidate,
    startVoting,
    endVoting,
    refreshData,
    fetchRegisteredVoters
  } = useBlockchain();

  // Backend data states
  const [backendElections, setBackendElections] = useState([]);
  const [backendCandidates, setBackendCandidates] = useState([]);
  const [backendVoters, setBackendVoters] = useState([]);
  const [currentElectionId, setCurrentElectionId] = useState(null);

  // State for new candidate
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    party: '',
    manifesto: ''
  });

  // State for voter registration
  const [voterAddress, setVoterAddress] = useState('');
  
  // State for voting duration
  const [votingDuration, setVotingDuration] = useState(30);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Redirect if not admin
  useEffect(() => {
    if (account && !isAdmin) {
      navigate('/');
    }
  }, [account, isAdmin, navigate]);

  // Load backend data on component mount
  useEffect(() => {
    if (isAdmin) {
      loadBackendData();
    }
  }, [isAdmin]);

  // Load all backend data
  const loadBackendData = async () => {
    try {
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
        const candidates = await ApiService.getCandidates(currentElection._id);
        setBackendCandidates(candidates);
      }
    } catch (error) {
      console.error('Error loading backend data:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load data from backend',
        severity: 'error'
      });
    }
  };

  // Handle closing snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle adding a candidate (sync with blockchain and backend)
  const handleAddCandidate = async () => {
    if (!newCandidate.name || !newCandidate.party) {
      setSnackbar({
        open: true,
        message: 'Name and party are required',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      // First add to blockchain
      const blockchainSuccess = await addCandidate(
        newCandidate.name,
        newCandidate.party,
        newCandidate.manifesto || ''
      );

      if (blockchainSuccess && currentElectionId) {
        // Then sync with backend
        await ApiService.createCandidate({
          blockchainId: candidates.length, // Use current blockchain candidate count
          electionId: currentElectionId,
          electionBlockchainId: 0, // Assuming single election for now
          name: newCandidate.name,
          party: newCandidate.party,
          description: newCandidate.manifesto || '',
          voteCount: 0
        });

        setSnackbar({
          open: true,
          message: 'Candidate added successfully',
          severity: 'success'
        });
        
        setNewCandidate({
          name: '',
          party: '',
          manifesto: ''
        });
        
        // Refresh both blockchain and backend data
        await Promise.all([
          refreshData(),
          loadBackendData()
        ]);
      }
    } catch (err) {
      console.error('Error adding candidate:', err);
      setSnackbar({
        open: true,
        message: `Error adding candidate: ${err.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle registering a voter (sync with blockchain and backend)
  const handleRegisterVoter = async () => {
    if (!voterAddress) {
      setSnackbar({
        open: true,
        message: 'Voter address is required',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      // First register on blockchain
      const blockchainSuccess = await registerVoter(voterAddress);

      if (blockchainSuccess) {
        // Then sync with backend
        await ApiService.registerVoter({
          walletAddress: voterAddress.toLowerCase(),
          registeredBy: account,
          hasVoted: false
        });

        setSnackbar({
          open: true,
          message: 'Voter registered successfully',
          severity: 'success'
        });
        
        setVoterAddress('');
        
        // Refresh both blockchain and backend data
        await Promise.all([
          fetchRegisteredVoters(),
          loadBackendData()
        ]);
      }
    } catch (err) {
      console.error('Error registering voter:', err);
      setSnackbar({
        open: true,
        message: `Error registering voter: ${err.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle starting the voting process
  const handleStartVoting = async () => {
    setLoading(true);
    try {
      const success = await startVoting(votingDuration);

      if (success && currentElectionId) {
        // Update election status in backend
        await ApiService.updateElection(currentElectionId, {
          isActive: true,
          startTime: new Date()
        });

        setSnackbar({
          open: true,
          message: 'Voting started successfully',
          severity: 'success'
        });
        
        await loadBackendData();
      }
    } catch (err) {
      console.error('Error starting voting:', err);
      setSnackbar({
        open: true,
        message: `Error starting voting: ${err.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle ending the voting process
  const handleEndVoting = async () => {
    setLoading(true);
    try {
      const success = await endVoting();

      if (success && currentElectionId) {
        // Update election status in backend
        await ApiService.updateElection(currentElectionId, {
          isActive: false,
          endTime: new Date()
        });

        setSnackbar({
          open: true,
          message: 'Voting ended successfully',
          severity: 'success'
        });
        
        await loadBackendData();
      }
    } catch (err) {
      console.error('Error ending voting:', err);
      setSnackbar({
        open: true,
        message: `Error ending voting: ${err.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!account || !isAdmin) {
    return (
      <Box>
        <Typography>You do not have access to the admin panel.</Typography>
      </Box>
    );
  }

  // Use backend data when available, fallback to blockchain data
  const displayCandidates = backendCandidates.length > 0 ? backendCandidates : candidates;
  const displayVoters = backendVoters.length > 0 ? backendVoters : registeredVoters;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <Typography variant="h6" color="primary" gutterBottom>
        {electionInfo?.name || 'Election Administration'}
      </Typography>

      {/* Backend Status Indicator */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'info.light' }}>
        <Typography variant="body2" color="white">
          Backend Status: {backendElections.length > 0 ? '✅ Connected' : '⚠️ Using blockchain data only'}
        </Typography>
      </Paper>

      {/* Current Status */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Election Status
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography>
              Status: {' '}
              {electionInfo?.isOpen ? (
                <Chip color="success" label="OPEN" />
              ) : (
                <Chip color="default" label="CLOSED" />
              )}
            </Typography>
          </Grid>
          
          {electionInfo?.isOpen && (
            <Grid item xs={12} sm={6}>
              <Typography>
                Time Remaining: {Math.floor(electionInfo.remainingTime / 60)} min {electionInfo.remainingTime % 60} sec
              </Typography>
            </Grid>
          )}
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              {!electionInfo?.isOpen ? (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleStartVoting}
                  disabled={loading || displayCandidates.length === 0}
                >
                  {loading ? <CircularProgress size={24} /> : 'Start Voting'}
                </Button>
              ) : (
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={handleEndVoting}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'End Voting'}
                </Button>
              )}
              
              {!electionInfo?.isOpen && (
                <TextField
                  label="Duration (minutes)"
                  type="number"
                  value={votingDuration}
                  onChange={(e) => setVotingDuration(parseInt(e.target.value))}
                  size="small"
                  sx={{ width: 150 }}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Election Statistics - Updated to use backend data */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Election Summary
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={1} sx={{ p: 2, bgcolor: 'primary.light', color: 'white', textAlign: 'center', height: '100%' }}>
              <Typography variant="body2">Total Candidates</Typography>
              <Typography variant="h4" sx={{ my: 1 }}>{displayCandidates.length}</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Paper elevation={1} sx={{ p: 2, bgcolor: 'secondary.light', color: 'white', textAlign: 'center', height: '100%' }}>
              <Typography variant="body2">Registered Voters</Typography>
              <Typography variant="h4" sx={{ my: 1 }}>{displayVoters?.length || 0}</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Paper elevation={1} sx={{ p: 2, bgcolor: 'success.light', color: 'white', textAlign: 'center', height: '100%' }}>
              <Typography variant="body2">Votes Cast</Typography>
              <Typography variant="h4" sx={{ my: 1 }}>
                {electionInfo?.isOpen ? '...' : displayVoters?.filter(voter => voter.hasVoted).length || 0}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Candidate Management */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Add Candidate
              </Typography>
              <Button 
                size="small" 
                variant="outlined"
                onClick={loadBackendData}
                startIcon={<RefreshIcon />}
                disabled={loading}
              >
                Sync
              </Button>
            </Box>
            
            <TextField
              label="Candidate Name"
              fullWidth
              margin="normal"
              value={newCandidate.name}
              onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})}
              disabled={electionInfo?.isOpen}
            />
            
            <TextField
              label="Political Party"
              fullWidth
              margin="normal"
              value={newCandidate.party}
              onChange={(e) => setNewCandidate({...newCandidate, party: e.target.value})}
              disabled={electionInfo?.isOpen}
            />
            
            <TextField
              label="Manifesto/Description"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              value={newCandidate.manifesto}
              onChange={(e) => setNewCandidate({...newCandidate, manifesto: e.target.value})}
              disabled={electionInfo?.isOpen}
            />
            
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleAddCandidate}
              disabled={loading || electionInfo?.isOpen}
            >
              {loading ? <CircularProgress size={24} /> : 'Add Candidate'}
            </Button>
          </Paper>
        </Grid>

        {/* Voter Registration */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Register Voter
              </Typography>
              <Button 
                size="small" 
                variant="outlined"
                onClick={loadBackendData}
                startIcon={<RefreshIcon />}
                disabled={loading}
              >
                Sync
              </Button>
            </Box>
            
            <TextField
              label="Voter Wallet Address"
              fullWidth
              margin="normal"
              placeholder="0x..."
              value={voterAddress}
              onChange={(e) => setVoterAddress(e.target.value)}
            />
            
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleRegisterVoter}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Register Voter'}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Candidates List - Updated to show backend data */}
      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Current Candidates {backendCandidates.length > 0 && '(Backend Data)'}
          </Typography>
          <Button 
            size="small" 
            variant="outlined"
            onClick={loadBackendData}
            startIcon={<RefreshIcon />}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
        
        {displayCandidates.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No candidates have been added yet
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Party</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Vote Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayCandidates.map((candidate, index) => (
                    <TableRow 
                      key={candidate._id || candidate.id || index}
                      sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                    >
                      <TableCell>{candidate.blockchainId ?? candidate.id ?? index}</TableCell>
                      <TableCell>{candidate.name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={candidate.party} 
                          variant="outlined" 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {electionInfo?.isOpen ? (
                          <Typography variant="body2" color="textSecondary">
                            Hidden during voting
                          </Typography>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ mr: 1 }}>{candidate.voteCount}</Typography>
                            {candidate.voteCount > 0 && (
                              <Chip 
                                size="small" 
                                label={`${((candidate.voteCount / displayCandidates.reduce((sum, c) => sum + c.voteCount, 0)) * 100).toFixed(1)}%`} 
                                color="primary" 
                                variant="outlined"
                              />
                            )}
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Total Candidates: {displayCandidates.length}
            </Typography>
          </>
        )}
      </Paper>

      {/* Registered Voters List - Updated to show backend data */}
      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Registered Voters {backendVoters.length > 0 && '(Backend Data)'}
          </Typography>
          <Button 
            size="small" 
            variant="outlined"
            onClick={loadBackendData}
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
        </Box>
        
        {displayVoters?.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No voters have been registered yet
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Registered</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayVoters.map((voter, index) => (
                    <TableRow 
                      key={voter._id || index}
                      sx={{ 
                        backgroundColor: (voter.walletAddress || voter.address) === account ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                      }}
                    >
                      <TableCell>
                        {(voter.walletAddress || voter.address) === account ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {voter.walletAddress || voter.address}
                            <Chip 
                              label="You" 
                              color="primary" 
                              variant="outlined" 
                              size="small" 
                              sx={{ ml: 1, height: 20 }} 
                            />
                          </Box>
                        ) : (
                          voter.walletAddress || voter.address
                        )}
                      </TableCell>
                      <TableCell>
                        {voter.hasVoted ? (
                          <Chip color="primary" label="Voted" size="small" />
                        ) : (
                          <Chip color="default" label="Not Voted" size="small" />
                        )}
                      </TableCell>
                      <TableCell>
                        {voter.createdAt ? new Date(voter.createdAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Total Registered Voters: {displayVoters.length}
            </Typography>
          </>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled" 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
