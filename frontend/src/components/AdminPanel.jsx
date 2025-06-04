import { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Button, 
  TextField, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Container,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useBlockchain } from '../context/BlockchainContext';
import { useNavigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';

export default function AdminPanel() {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const { 
    isAdmin, 
    account,
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

  // Check admin authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

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

  // Check if admin is logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (token && user) {
      setIsAuthenticated(true);
      setAdminUser(JSON.parse(user));
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Redirect if not admin or not logged in
  useEffect(() => {
    if (account && !isAdmin) {
      navigate('/');
    }
  }, [account, isAdmin, navigate]);

  // Fetch registered voters on component mount
  useEffect(() => {
    if (isAdmin && isAuthenticated) {
      fetchRegisteredVoters();
    }
  }, [isAdmin, isAuthenticated, fetchRegisteredVoters]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setAdminUser(null);
    setSnackbar({
      open: true,
      message: 'Logged out successfully',
      severity: 'success'
    });
  };

  // Handle closing snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle adding a candidate
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
      const success = await addCandidate(
        newCandidate.name,
        newCandidate.party,
        newCandidate.manifesto || ''
      );

      if (success) {
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
        await refreshData();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Error adding candidate: ${err.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle registering a voter
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
      const success = await registerVoter(voterAddress);

      if (success) {
        setSnackbar({
          open: true,
          message: 'Voter registered successfully',
          severity: 'success'
        });
        setVoterAddress('');
        await fetchRegisteredVoters(); // Refresh registered voters list
      }
    } catch (err) {
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

      if (success) {
        setSnackbar({
          open: true,
          message: 'Voting started successfully',
          severity: 'success'
        });
      }
    } catch (err) {
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

      if (success) {
        setSnackbar({
          open: true,
          message: 'Voting ended successfully',
          severity: 'success'
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Error ending voting: ${err.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // If not admin, show access denied
  if (!account || !isAdmin) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert 
          severity="error"
          variant="filled"
          sx={{ 
            py: 2,
            borderRadius: 2,
            boxShadow: 3
          }}
        >
          <Typography variant="h6" gutterBottom>Access Denied</Typography>
          <Typography>
            You do not have admin privileges. This wallet address is not registered as an admin.
          </Typography>
          <Button 
            variant="contained" 
            color="inherit" 
            sx={{ mt: 2 }}
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        mt: 2,
        pb: 2,
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DashboardIcon sx={{ fontSize: 36, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h4" fontWeight="600">
              Admin Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {electionInfo?.name || 'Election Management System'}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Chip 
            label={`Admin: ${adminUser?.username}`} 
            color="primary" 
            variant="outlined" 
            sx={{ mr: 2, fontWeight: 500 }} 
          />
          <Tooltip title="Refresh data">
            <IconButton 
              color="primary" 
              onClick={refreshData}
              sx={{ mr: 1 }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={4}>
          {/* Election Status */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 2,
              background: electionInfo?.isOpen 
                ? 'linear-gradient(135deg, #ebfaf5 0%, #d0f8e6 100%)' 
                : 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
              border: 1,
              borderColor: electionInfo?.isOpen ? 'success.light' : 'divider'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="600">
                Election Status
              </Typography>
              <Chip 
                color={electionInfo?.isOpen ? "success" : "default"} 
                label={electionInfo?.isOpen ? "VOTING OPEN" : "VOTING CLOSED"} 
                variant="filled"
                sx={{ fontWeight: 600 }}
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {electionInfo?.isOpen && (
              <Box sx={{ mb: 2, p: 1.5, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 1 }}>
                <Typography variant="subtitle2" fontWeight="600">
                  Time Remaining
                </Typography>
                <Typography variant="h5" color="success.main" fontWeight="600">
                  {Math.floor(electionInfo.remainingTime / 60)}:{String(electionInfo.remainingTime % 60).padStart(2, '0')}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center' }}>
              {!electionInfo?.isOpen ? (
                <>
                  <TextField
                    label="Duration (minutes)"
                    type="number"
                    value={votingDuration}
                    onChange={(e) => setVotingDuration(parseInt(e.target.value) || 1)}
                    size="small"
                    sx={{ width: 150, mr: 1 }}
                  />
                  <Button 
                    variant="contained" 
                    color="success" 
                    onClick={handleStartVoting}
                    disabled={loading || candidates.length === 0}
                    startIcon={<PlayArrowIcon />}
                    sx={{ flexGrow: 1 }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Start Voting'}
                  </Button>
                </>
              ) : (
                <Button 
                  variant="contained" 
                  color="error" 
                  onClick={handleEndVoting}
                  disabled={loading}
                  startIcon={<StopIcon />}
                  fullWidth
                >
                  {loading ? <CircularProgress size={24} /> : 'End Voting'}
                </Button>
              )}
            </Box>
          </Paper>

          {/* Election Stats - Improved with charts */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Election Statistics
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card sx={{ 
                  p: 2, 
                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                  border: 1, 
                  borderColor: alpha(theme.palette.primary.main, 0.3), 
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <CardContent sx={{ p: 0 }}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={7}>
                        <Typography variant="overline" fontWeight="600" color="text.secondary">
                          Candidates
                        </Typography>
                        <Typography variant="h4" sx={{ mt: 0.5 }} fontWeight="600" color="primary.main">
                          {candidates.length}
                        </Typography>
                        {candidates.length > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            {candidates.filter(c => c.voteCount > 0).length} with votes
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={5} sx={{ textAlign: 'right' }}>
                        <PeopleIcon sx={{ fontSize: 48, color: alpha(theme.palette.primary.main, 0.3) }} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6}>
                <Card sx={{ 
                  p: 2, 
                  bgcolor: alpha(theme.palette.secondary.main, 0.1), 
                  border: 1, 
                  borderColor: alpha(theme.palette.secondary.main, 0.3), 
                  borderRadius: 2 
                }}>
                  <CardContent sx={{ p: 0 }}>
                    <Typography variant="overline" fontWeight="600" color="text.secondary">
                      Registered Voters
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 0.5 }} fontWeight="600" color="secondary.main">
                      {registeredVoters?.length || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6}>
                <Card sx={{ 
                  p: 2, 
                  bgcolor: alpha(theme.palette.success.main, 0.1), 
                  border: 1, 
                  borderColor: alpha(theme.palette.success.main, 0.3), 
                  borderRadius: 2 
                }}>
                  <CardContent sx={{ p: 0 }}>
                    <Typography variant="overline" fontWeight="600" color="text.secondary">
                      Votes Cast
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h4" sx={{ mt: 0.5 }} fontWeight="600" color="success.dark">
                        {electionInfo?.isOpen 
                          ? '—' 
                          : registeredVoters?.filter(voter => voter.hasVoted).length || 0}
                      </Typography>
                      {!electionInfo?.isOpen && registeredVoters?.length > 0 && (
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          ({Math.round((registeredVoters.filter(v => v.hasVoted).length / registeredVoters.length) * 100)}%)
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Add voter participation visualization */}
              {!electionInfo?.isOpen && registeredVoters?.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ 
                    mt: 1, 
                    height: 10, 
                    bgcolor: 'grey.200', 
                    borderRadius: 5,
                    overflow: 'hidden'
                  }}>
                    <Box 
                      sx={{ 
                        width: `${(registeredVoters.filter(v => v.hasVoted).length / registeredVoters.length) * 100}%`, 
                        height: '100%', 
                        bgcolor: 'success.main',
                        borderRadius: 5
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">Participation rate</Typography>
                    <Typography variant="caption" fontWeight="bold">
                      {Math.round((registeredVoters.filter(v => v.hasVoted).length / registeredVoters.length) * 100)}%
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Voter Registration */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonAddIcon sx={{ color: 'secondary.main', mr: 1.5 }} />
              <Typography variant="h6" fontWeight="600">
                Voter Management
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              {/* Single voter registration */}
              <Grid item xs={12}>
                <TextField
                  label="Voter Wallet Address"
                  fullWidth
                  placeholder="0x..."
                  value={voterAddress}
                  onChange={(e) => setVoterAddress(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        disabled={loading || !voterAddress}
                        onClick={handleRegisterVoter}
                        sx={{ minWidth: '120px' }}
                      >
                        {loading ? <CircularProgress size={20} /> : 'Register'}
                      </Button>
                    ),
                    sx: { pr: 0.5 }
                  }}
                />
              </Grid>
              
              {/* Quick stats and actions */}
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  bgcolor: alpha(theme.palette.secondary.main, 0.05),
                  borderRadius: 1,
                  p: 1.5
                }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">REGISTERED VOTERS</Typography>
                    <Typography variant="h6" color="secondary.main" fontWeight="600">
                      {registeredVoters?.length || 0}
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">VOTED</Typography>
                    <Typography variant="h6" color="text.primary" fontWeight="600">
                      {registeredVoters?.filter(voter => voter.hasVoted)?.length || 0} / {registeredVoters?.length || 0}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 'auto' }}>
                    <Tooltip title="Refresh voters list">
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={fetchRegisteredVoters}
                      >
                        <RefreshIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Grid>
              
              {/* Recent registrations */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
                  Recent Registrations
                </Typography>
                <Box sx={{ 
                  maxHeight: 150, 
                  overflowY: 'auto', 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 1
                }}>
                  {registeredVoters && registeredVoters.length > 0 ? (
                    registeredVoters.slice(Math.max(0, registeredVoters.length - 3)).map((voter, index) => (
                      <Box 
                        key={index}
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          py: 0.75,
                          borderBottom: index < Math.min(registeredVoters.length, 3) - 1 ? '1px solid' : 'none',
                          borderColor: 'divider'
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'monospace',
                            maxWidth: '70%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {voter.address}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={voter.hasVoted ? "Voted" : "Not Voted"}
                          color={voter.hasVoted ? "success" : "default"}
                          variant="outlined"
                        />
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                      No voters registered yet
                    </Typography>
                  )}
                </Box>
              </Grid>
              
              {/* Batch actions */}
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    size="small"
                    fullWidth
                    startIcon={<FileUploadIcon />}
                    onClick={() => alert('Import feature would be implemented here')}
                  >
                    Import CSV
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    size="small"
                    fullWidth
                    startIcon={<FileDownloadIcon />}
                    onClick={() => alert('Export feature would be implemented here')}
                    disabled={registeredVoters?.length === 0}
                  >
                    Export List
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Right Column */}
        <Grid item xs={12} md={8}>
          {/* Add Candidate */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              mb: 3,
              borderRadius: 2,
              bgcolor: electionInfo?.isOpen ? 'rgba(0,0,0,0.02)' : 'white'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AddCircleIcon sx={{ color: 'primary.main', mr: 1.5 }} />
              <Typography variant="h6" fontWeight="600">
                Add Candidate
              </Typography>
            </Box>
            
            {electionInfo?.isOpen && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Cannot add candidates while voting is in progress
              </Alert>
            )}
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Candidate Name"
                  fullWidth
                  margin="normal"
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})}
                  disabled={electionInfo?.isOpen || loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Political Party"
                  fullWidth
                  margin="normal"
                  value={newCandidate.party}
                  onChange={(e) => setNewCandidate({...newCandidate, party: e.target.value})}
                  disabled={electionInfo?.isOpen || loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Manifesto/Description"
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                  value={newCandidate.manifesto}
                  onChange={(e) => setNewCandidate({...newCandidate, manifesto: e.target.value})}
                  disabled={electionInfo?.isOpen || loading}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon />}
                onClick={handleAddCandidate}
                disabled={loading || electionInfo?.isOpen || !newCandidate.name || !newCandidate.party}
                size="large"
              >
                {loading ? <CircularProgress size={24} /> : 'Add Candidate'}
              </Button>
            </Box>
          </Paper>

          {/* Candidates List - Better space utilization */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="600">
                Candidates ({candidates.length})
              </Typography>
              <Box>
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  startIcon={<VisibilityIcon />}
                  onClick={() => navigate('/results')}
                  sx={{ mr: 1 }}
                >
                  View Results
                </Button>
                <Tooltip title="Refresh candidates">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => refreshData()}
                    disabled={loading}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            {candidates.length === 0 ? (
              <Alert 
                severity="info" 
                sx={{ borderRadius: 1 }}
              >
                No candidates have been added yet. Add candidates before starting the election.
              </Alert>
            ) : (
              <Box>
                <Grid container spacing={2}>
                  {candidates.map((candidate) => (
                    <Grid item xs={12} sm={6} md={4} key={candidate.id}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          height: '100%', 
                          transition: 'all 0.2s',
                          '&:hover': {
                            boxShadow: 2,
                            borderColor: 'primary.main'
                          }
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', mb: 1.5, justifyContent: 'space-between' }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: 18
                              }}
                            >
                              {candidate.id}
                            </Box>
                            <Chip 
                              label={candidate.party} 
                              variant="outlined" 
                              size="small"
                              color="primary"
                            />
                          </Box>
                          
                          <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 500 }}>
                            {candidate.name}
                          </Typography>
                          
                          {candidate.manifesto && (
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                mb: 1.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: '2',
                                WebkitBoxOrient: 'vertical'
                              }}
                            >
                              {candidate.manifesto}
                            </Typography>
                          )}
                          
                          <Divider sx={{ my: 1 }} />
                          
                          <Box sx={{ mt: 1.5 }}>
                            <Typography variant="caption" color="text.secondary">VOTES</Typography>
                            <Typography variant="body1" fontWeight="bold">
                              {electionInfo?.isOpen ? (
                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                  Hidden during voting
                                </Typography>
                              ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {candidate.voteCount}
                                  {candidate.voteCount > 0 && (
                                    <Chip 
                                      size="small" 
                                      label={`${((candidate.voteCount / candidates.reduce((sum, c) => sum + c.voteCount, 0)) * 100).toFixed(1)}%`} 
                                      color="primary" 
                                      variant="outlined"
                                      sx={{ ml: 1, fontWeight: 500 }}
                                    />
                                  )}
                                </Box>
                              )}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Paper>

          {/* Registered Voters List - Add search and filtering */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="600">
                Registered Voters ({registeredVoters?.length || 0})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  placeholder="Search address..."
                  size="small"
                  InputProps={{
                    startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  onChange={(e) => {
                    // Add search functionality
                    // This would filter the displayed voters list
                  }}
                />
                <Tooltip title="Refresh voters">
                  <IconButton 
                    size="small" 
                    color="secondary"
                    onClick={() => fetchRegisteredVoters()}
                    disabled={loading}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip
                label="All Voters"
                clickable
                onClick={() => {/* Filter by all */}}
                color="primary"
                variant="filled"
                size="small"
              />
              <Chip
                label="Voted"
                clickable
                onClick={() => {/* Filter by voted */}}
                variant="outlined"
                size="small"
              />
              <Chip
                label="Not Voted"
                clickable
                onClick={() => {/* Filter by not voted */}}
                variant="outlined"
                size="small"
              />
            </Box>
            
            {registeredVoters?.length === 0 ? (
              <Alert 
                severity="info" 
                sx={{ borderRadius: 1 }}
              >
                No voters have been registered yet. Register voters to allow them to participate.
              </Alert>
            ) : (
              <TableContainer sx={{ maxHeight: 350, borderRadius: 1, border: 1, borderColor: 'divider' }}>
                <Table stickyHeader size="small">
                  <TableHead sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.05) }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {registeredVoters.map((voter, index) => (
                      <TableRow 
                        key={index}
                        sx={{ 
                          bgcolor: voter.address === account ? alpha(theme.palette.primary.main, 0.05) : 'inherit',
                          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.03)' },
                        }}
                      >
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center'
                          }}>
                            <Box 
                              sx={{ 
                                width: 24, 
                                height: 24, 
                                borderRadius: '50%',
                                bgcolor: stringToColor(voter.address),
                                mr: 1,
                                flexShrink: 0
                              }} 
                            />
                            <Typography 
                              variant="body2" 
                              component="span" 
                              sx={{ 
                                display: 'block',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                maxWidth: { xs: '120px', sm: '200px', md: '250px' }
                              }}
                            >
                              {voter.address}
                            </Typography>
                            {voter.address === account && (
                              <Chip 
                                label="You" 
                                color="primary" 
                                variant="outlined" 
                                size="small" 
                                sx={{ ml: 1, height: 20, minWidth: 40 }} 
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            color={voter.hasVoted ? "success" : "default"} 
                            label={voter.hasVoted ? "Voted" : "Not Voted"} 
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Copy address">
                            <IconButton 
                              size="small" 
                              onClick={() => {
                                navigator.clipboard.writeText(voter.address);
                                setSnackbar({
                                  open: true,
                                  message: 'Address copied to clipboard',
                                  severity: 'success'
                                });
                              }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled" 
          sx={{ width: '100%', boxShadow: 3 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};
