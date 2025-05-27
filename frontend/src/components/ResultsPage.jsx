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
  Divider
} from '@mui/material';
import { useBlockchain } from '../context/BlockchainContext';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

export default function ResultsPage() {
  const { 
    account, 
    voter, 
    candidates, 
    electionInfo, 
    getWinner,
    refreshData
  } = useBlockchain();

  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);

  // Fetch winner when voting is closed
  useEffect(() => {
    const fetchWinner = async () => {
      if (!electionInfo?.isOpen) {
        try {
          setLoading(true);
          const winnerData = await getWinner();
          setWinner(winnerData);
        } catch (err) {
          console.error('Error fetching winner:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWinner();
  }, [electionInfo?.isOpen, getWinner]);

  // Calculate total votes
  useEffect(() => {
    if (candidates.length > 0) {
      const total = candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);
      setTotalVotes(total);
    }
  }, [candidates]);

  // Refresh the data when component mounts
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Helper function to calculate vote percentage
  const calculatePercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return (votes / totalVotes) * 100;
  };

  // Find the candidate the user voted for
  const userVote = voter?.hasVoted ? candidates.find(c => c.id === voter.candidateId) : null;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Election Results
      </Typography>
      <Typography variant="h6" color="primary" gutterBottom>
        {electionInfo?.name || 'Election'}
      </Typography>

      {/* Election Status */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Status</Typography>
          {electionInfo?.isOpen ? (
            <Chip 
              color="warning" 
              label="VOTING IN PROGRESS" 
            />
          ) : (
            <Chip 
              color="success" 
              label="VOTING CONCLUDED" 
            />
          )}
        </Box>

        {electionInfo?.isOpen ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Final results will be available once the voting period ends.
          </Typography>
        ) : loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
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
              {winner.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              With {winner.votes} votes ({calculatePercentage(winner.votes).toFixed(1)}%)
            </Typography>
          </Box>
        ) : null}
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
        
        {electionInfo?.isOpen && !winner ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Detailed results are hidden during voting to prevent influence.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {candidates.map((candidate) => (
              <Grid item xs={12} key={candidate.id}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body1">
                      {candidate.name} ({candidate.party})
                    </Typography>
                    <Typography variant="body2">
                      {candidate.voteCount} votes ({calculatePercentage(candidate.voteCount).toFixed(1)}%)
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={calculatePercentage(candidate.voteCount)} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 1,
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: winner && candidate.id === winner.id ? '#ff9800' : undefined,
                      }
                    }}
                  />
                </Box>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Votes: {totalVotes}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Candidates Table */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Candidate Details
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Candidate</TableCell>
                <TableCell>Party</TableCell>
                <TableCell>Manifesto</TableCell>
                {!electionInfo?.isOpen && (
                  <TableCell align="right">Votes</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow 
                  key={candidate.id}
                  sx={{ 
                    backgroundColor: winner && candidate.id === winner.id ? 'rgba(255, 193, 7, 0.1)' : undefined,
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {winner && candidate.id === winner.id && (
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
                  <TableCell>{candidate.manifesto}</TableCell>
                  {!electionInfo?.isOpen && (
                    <TableCell align="right">{candidate.voteCount}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
