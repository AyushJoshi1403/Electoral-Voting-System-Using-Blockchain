import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Avatar, 
  CircularProgress, 
  Snackbar, 
  Alert,
  Chip
} from '@mui/material';
import { useBlockchain } from '../context/BlockchainContext';
import { useNavigate } from 'react-router-dom';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';

export default function VotingArea() {
  const navigate = useNavigate();
  const { 
    account, 
    voter, 
    candidates, 
    electionInfo, 
    castVote,
    connectWallet
  } = useBlockchain();

  // UI states
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Handle closing snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle voting
  const handleVote = async () => {
    if (selectedCandidate === null) {
      setSnackbar({
        open: true,
        message: 'Please select a candidate first',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);
    try {
      const success = await castVote(selectedCandidate);

      if (success) {
        setSnackbar({
          open: true,
          message: 'Vote cast successfully!',
          severity: 'success'
        });
        
        // Redirect to results after a small delay
        setTimeout(() => {
          navigate('/results');
        }, 2000);
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Error casting vote: ${err.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to format remaining time
  const formatRemainingTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${remainingSeconds}s`;
  };

  // If no wallet connected
  if (!account) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h5" gutterBottom>
          Connect Your Wallet
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          You need to connect your wallet to access the voting area
        </Typography>
        <Button 
          variant="contained" 
          onClick={connectWallet} 
          startIcon={<LockIcon />}
        >
          Connect Wallet
        </Button>
      </Box>
    );
  }

  // If voting is not open
  if (!electionInfo?.isOpen) {
    return (
      <Box>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Voting is currently closed
          </Typography>
          <Typography variant="body1">
            Please check back later when the voting period opens or view the current results.
          </Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 3 }} 
            onClick={() => navigate('/results')}
          >
            View Results
          </Button>
        </Paper>
      </Box>
    );
  }

  // If user has already voted
  if (voter.hasVoted) {
    return (
      <Box>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="primary" gutterBottom>
            You have already cast your vote
          </Typography>
          <Typography variant="body1">
            Thank you for participating in the election.
          </Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 3 }} 
            onClick={() => navigate('/results')}
          >
            View Results
          </Button>
        </Paper>
      </Box>
    );
  }

  // If user is not registered
  if (!voter.isRegistered) {
    return (
      <Box>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Not Registered to Vote
          </Typography>
          <Typography variant="body1">
            You are not registered to participate in this election. 
            Please contact the election administrator to get registered.
          </Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 3 }} 
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Cast Your Vote
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{electionInfo.name}</Typography>
          <Chip 
            color="primary" 
            icon={<HowToVoteIcon />} 
            label={`Time remaining: ${formatRemainingTime(electionInfo.remainingTime)}`} 
          />
        </Box>
      </Paper>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Select a Candidate:
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {candidates.map((candidate) => (
          <Grid item xs={12} sm={6} md={4} key={candidate.id}>
            <Card 
              elevation={selectedCandidate === candidate.id ? 8 : 2}
              sx={{ 
                cursor: 'pointer', 
                height: '100%',
                transition: 'all 0.2s ease',
                transform: selectedCandidate === candidate.id ? 'scale(1.03)' : 'scale(1)',
                border: selectedCandidate === candidate.id ? '2px solid #1976d2' : 'none'
              }}
              onClick={() => setSelectedCandidate(candidate.id)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: selectedCandidate === candidate.id ? 'primary.main' : 'grey.400', mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <Typography variant="h6">{candidate.name}</Typography>
                </Box>
                
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {candidate.party}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  {candidate.manifesto}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color={selectedCandidate === candidate.id ? "primary" : "inherit"}
                  variant={selectedCandidate === candidate.id ? "contained" : "text"}
                  onClick={() => setSelectedCandidate(candidate.id)}
                  fullWidth
                >
                  {selectedCandidate === candidate.id ? "Selected" : "Select"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', pb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<HowToVoteIcon />}
          disabled={selectedCandidate === null || loading}
          onClick={handleVote}
          sx={{ px: 4, py: 1 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Cast Vote'}
        </Button>
      </Box>

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
