import { Box, Typography, Paper, Button, Grid } from '@mui/material';
import { useBlockchain } from '../context/BlockchainContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const { 
    account,
    electionInfo,
    voter,
    connectWallet
  } = useBlockchain();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to the Electoral Voting System
      </Typography>
      <Typography variant="h5" gutterBottom color="primary">
        {electionInfo.name || 'Election'}
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Secure Blockchain Voting
        </Typography>
        <Typography paragraph>
          This platform allows you to cast your vote securely using blockchain technology.
          Your vote is encrypted and recorded on the blockchain, ensuring it cannot be tampered with.
        </Typography>
        
        <Typography paragraph>
          To participate, you need to:
        </Typography>
        
        <Typography component="ol" sx={{ pl: 2 }}>
          <li>Connect your digital wallet (MetaMask recommended)</li>
          <li>Register as a voter (if you haven't already)</li>
          <li>Cast your vote during the open voting period</li>
        </Typography>
        
        {!account ? (
          <Button 
            variant="contained" 
            onClick={connectWallet}
            sx={{ mt: 2 }}
          >
            Connect Wallet to Start
          </Button>
        ) : !voter.isRegistered ? (
          <Box>
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Your wallet is connected, but you are not registered to vote.
            </Typography>
            <Typography color="text.secondary">
              Please contact the election administrator to register.
            </Typography>
          </Box>
        ) : voter.hasVoted ? (
          <Typography color="success.main" sx={{ mt: 2 }}>
            You have already cast your vote in this election.
          </Typography>
        ) : electionInfo.isOpen ? (
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/vote" 
            sx={{ mt: 2 }}
          >
            Proceed to Voting
          </Button>
        ) : (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Voting is not currently open. Please check back later.
          </Typography>
        )}
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Voting Status
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                Status: {electionInfo.isOpen ? (
                  <Typography component="span" color="success.main" fontWeight="bold">
                    Open
                  </Typography>
                ) : (
                  <Typography component="span" color="text.secondary" fontWeight="bold">
                    Closed
                  </Typography>
                )}
              </Typography>
            </Box>
            <Button 
              variant="outlined" 
              component={Link} 
              to="/results" 
              fullWidth
            >
              View Current Results
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Your Voting Status
            </Typography>
            
            {!account ? (
              <Typography color="text.secondary">
                Connect your wallet to see your voting status
              </Typography>
            ) : (
              <>
                <Typography>
                  Registered: {voter.isRegistered ? 'Yes' : 'No'}
                </Typography>
                <Typography>
                  Voted: {voter.hasVoted ? 'Yes' : 'No'}
                </Typography>
                {voter.hasVoted && (
                  <Button 
                    variant="outlined" 
                    component={Link} 
                    to="/results"
                    sx={{ mt: 2 }}
                  >
                    See Your Vote
                  </Button>
                )}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
