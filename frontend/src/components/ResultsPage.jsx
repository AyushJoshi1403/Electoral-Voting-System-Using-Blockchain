import { useState, useEffect, useCallback, useRef } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { 
  Box, Typography, Paper, CircularProgress, Grid, Card, CardContent, 
  Alert, useTheme, Chip
} from '@mui/material';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { EmojiEvents, HowToVote, Assessment } from '@mui/icons-material';

// Keep these outside the component
const CHART_COLORS = [
  '#2563eb', '#7c3aed', '#dc2626', '#0ea5e9', '#8b5cf6', 
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#10b981'
];

const calculatePercentage = (votes, total) => {
  if (!total || total === 0) return '0.0';
  const percentage = (votes / total) * 100;
  if (percentage < 0.1 && percentage > 0) return '< 0.1';
  if (percentage > 99.9 && percentage < 100) return '> 99.9';
  return percentage.toFixed(1);
};

const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 1.5, boxShadow: 3, borderRadius: 1 }}>
        <Typography variant="subtitle2">{payload[0].payload.name}</Typography>
        <Typography variant="body2" color="text.secondary">{payload[0].payload.party}</Typography>
        <Typography variant="body2" fontWeight="bold">
          {payload[0].value} votes ({payload[0].payload.percentage}%)
        </Typography>
      </Paper>
    );
  }
  return null;
};

const ResultsPage = () => {
  const theme = useTheme();
  const { contract, candidates, electionInfo, loading, error, getWinner, refreshData } = useBlockchain();
  
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [winner, setWinner] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [chartType, setChartType] = useState('pie');
  
  const isMounted = useRef(true);
  
  // Fix: Add proper dependencies to fetchData to prevent stale closures
  const fetchData = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      console.log("Starting data fetch for results page");
      setPageLoading(true);
      
      // First refresh all data
      await refreshData();
      
      if (!isMounted.current) return;
      
      console.log("Data refreshed, calculating total votes");
      // Calculate total votes
      const votes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
      setTotalVotes(votes);
      console.log("Total votes:", votes);
      
      // Get winner only if voting has ended
      if (!electionInfo.isOpen) {
        console.log("Voting is closed, fetching winner");
        try {
          const winnerData = await getWinner();
          if (isMounted.current) {
            console.log("Winner found:", winnerData);
            setWinner(winnerData);
          }
        } catch (err) {
          console.log("No winner determined yet:", err);
        }
      }
    } catch (err) {
      console.error("Error loading results:", err);
      if (isMounted.current) {
        setPageError("Failed to load election results. Please try again later.");
      }
    } finally {
      if (isMounted.current) {
        console.log("Fetch complete, setting loading to false");
        setPageLoading(false);
      }
    }
  }, [refreshData, candidates, electionInfo, getWinner]); // Fix: Include all dependencies
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      console.log("Results page unmounting");
      isMounted.current = false;
    };
  }, []);

  // Initial data fetch
  useEffect(() => {
    console.log("Results page mounted, fetching data");
    fetchData();
  }, [fetchData]);
  
  // Fix: Add effect to recalculate when candidates change
  useEffect(() => {
    console.log("Candidates or voting state changed, updating results");
    const votes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
    setTotalVotes(votes);
  }, [candidates]);

  // Chart data calculation with memoization
  const chartData = candidates
    .filter(candidate => candidate.voteCount > 0)
    .sort((a, b) => b.voteCount - a.voteCount)
    .map(candidate => ({
      name: candidate.name,
      value: candidate.voteCount,
      party: candidate.party,
      percentage: calculatePercentage(candidate.voteCount, totalVotes)
    }));

  // Fix: Simplified loading condition to fix the infinite loading issue
  if (pageLoading && candidates.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px'
      }}>
        <CircularProgress size={50} sx={{ mb: 3 }} />
        <Typography variant="h6" color="text.secondary">Loading results...</Typography>
      </Box>
    );
  }

  // Error state
  if (pageError || error) {
    return (
      <Alert severity="error" sx={{ my: 3, py: 2, borderRadius: 2 }}>
        {pageError || error}
      </Alert>
    );
  }

  // No candidates state
  if (candidates.length === 0) {
    return (
      <Box p={3}>
        <Alert 
          severity="info" 
          sx={{ py: 2, borderRadius: 2 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', py: 3 }}>
            <Assessment sx={{ fontSize: 60, mb: 2, opacity: 0.7 }} />
            <Typography variant="h6" gutterBottom textAlign="center">
              No candidates have been added to this election yet
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Check back later when candidates have been registered
            </Typography>
          </Box>
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={{ xs: 2, sm: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Assessment sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" fontWeight="600">
          Election Results
        </Typography>
      </Box>
      
      <Paper 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0eaff 100%)'
        }}
        elevation={2}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight="600" gutterBottom>
              {electionInfo.name || "Election"}
            </Typography>
            
            <Chip 
              label={electionInfo.isOpen ? 'Voting in Progress' : 'Voting Ended'} 
              color={electionInfo.isOpen ? 'success' : 'primary'} 
              variant="outlined"
              sx={{ fontWeight: 500, mb: 1 }}
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <HowToVote sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1" color="text.secondary">
                <strong>{totalVotes}</strong> {totalVotes === 1 ? 'vote' : 'votes'} cast
              </Typography>
            </Box>
          </Box>
          
          {winner && !electionInfo.isOpen && (
            <Card sx={{ 
              backgroundColor: 'primary.ultraLight', 
              border: '1px solid',
              borderColor: 'primary.light',
              borderRadius: 2,
              minWidth: 200
            }} elevation={0}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <EmojiEvents sx={{ color: 'primary.main', mr: 1.5, fontSize: 28 }} />
                <Box>
                  <Typography variant="overline" color="text.secondary">Winner</Typography>
                  <Typography variant="subtitle1" fontWeight="600">{winner.name}</Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </Paper>

      {/* Winner Section - Simplified without animations */}
      {!electionInfo.isOpen && winner && (
        <Paper sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: '1px solid',
          borderColor: 'primary.light',
          position: 'relative',
          overflow: 'hidden'
        }} elevation={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EmojiEvents sx={{ color: 'primary.main', mr: 1.5, fontSize: 28 }} />
            <Typography variant="h5" fontWeight="600">
              Election Winner
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            mt: 3
          }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '1.5rem',
                mr: { xs: 0, sm: 3 },
                mb: { xs: 2, sm: 0 }
              }}
            >
              {winner.name?.charAt(0) || "W"}
            </Box>
            
            <Box>
              <Typography variant="h5" fontWeight="600">{winner.name}</Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {winner.party}
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mt: 1,
                p: 1, 
                borderRadius: 1,
                bgcolor: 'rgba(255,255,255,0.6)'
              }}>
                <Box sx={{ 
                  px: 2, 
                  py: 0.5, 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  borderRadius: 1,
                  fontWeight: 600,
                  mr: 2
                }}>
                  {calculatePercentage(winner.voteCount, totalVotes)}%
                </Box>
                <Typography variant="body1">
                  {winner.voteCount} of {totalVotes} votes
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Chart & Results - Only show if there are votes */}
      {totalVotes > 0 && (
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: { xs: 2, sm: 3 }, height: { xs: 350, sm: 400 }, borderRadius: 3 }} elevation={2}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 2 
              }}>
                <Typography variant="h6" fontWeight="600">Vote Distribution</Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Box 
                    onClick={() => setChartType('pie')} 
                    sx={{ 
                      px: 1.5, 
                      py: 0.5, 
                      cursor: 'pointer',
                      bgcolor: chartType === 'pie' ? 'primary.main' : 'transparent',
                      color: chartType === 'pie' ? 'white' : 'text.primary'
                    }}
                  >
                    Pie
                  </Box>
                  <Box 
                    onClick={() => setChartType('bar')} 
                    sx={{ 
                      px: 1.5, 
                      py: 0.5, 
                      cursor: 'pointer',
                      bgcolor: chartType === 'bar' ? 'primary.main' : 'transparent',
                      color: chartType === 'bar' ? 'white' : 'text.primary'
                    }}
                  >
                    Bar
                  </Box>
                </Box>
              </Box>
              
              <ResponsiveContainer width="100%" height="90%">
                {chartType === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      innerRadius={50}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, value}) => `${name}: ${calculatePercentage(value, totalVotes)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CHART_COLORS[index % CHART_COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} votes`, 'Votes']} />
                    <Legend />
                  </PieChart>
                ) : (
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="value" 
                      name="Votes" 
                      radius={[4, 4, 0, 0]}
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CHART_COLORS[index % CHART_COLORS.length]} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </Paper>
          </Grid>
          
          {/* Results List - Simplified without complex animations */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }} elevation={2}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Candidate Results
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                {candidates
                  .sort((a, b) => b.voteCount - a.voteCount)
                  .map((candidate, index) => (
                    <Box key={candidate.id} sx={{ mb: 2 }}>
                      <Card 
                        sx={{ 
                          borderRadius: 2,
                          backgroundColor: index === 0 && !electionInfo.isOpen ? 'primary.ultraLight' : 'background.paper',
                          border: '1px solid',
                          borderColor: index === 0 && !electionInfo.isOpen ? 'primary.main' : 'divider',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        elevation={0}
                      >
                        <CardContent>
                          <Grid container alignItems="center">
                            <Grid item xs={7} sm={8}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ 
                                  width: { xs: 32, sm: 40 }, 
                                  height: { xs: 32, sm: 40 }, 
                                  borderRadius: '50%', 
                                  bgcolor: CHART_COLORS[index % CHART_COLORS.length],
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  mr: 1.5
                                }}>
                                  {candidate.name.charAt(0)}
                                </Box>
                                <Box>
                                  <Typography variant="subtitle1" fontWeight={500}>
                                    {candidate.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {candidate.party}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={5} sm={4} sx={{ textAlign: 'right' }}>
                              <Typography variant="h6" fontWeight={600}>
                                {candidate.voteCount}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontWeight: 500,
                                  color: CHART_COLORS[index % CHART_COLORS.length],
                                }}
                              >
                                {calculatePercentage(candidate.voteCount, totalVotes)}%
                              </Typography>
                            </Grid>
                          </Grid>
                          
                          {/* Simplified progress bar */}
                          <Box 
                            sx={{ 
                              mt: 1.5, 
                              width: '100%', 
                              height: 8, 
                              bgcolor: 'grey.100', 
                              borderRadius: 5,
                              overflow: 'hidden'
                            }}
                          >
                            <Box 
                              sx={{ 
                                width: `${totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0}%`, 
                                height: '100%', 
                                bgcolor: CHART_COLORS[index % CHART_COLORS.length],
                                borderRadius: 5
                              }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* No votes message */}
      {totalVotes === 0 && (
        <Alert 
          severity="info" 
          sx={{ mt: 2, borderRadius: 3, py: 2 }}
          icon={<HowToVote fontSize="inherit" />}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', py: 2 }}>
            <Typography variant="h6" gutterBottom>
              No votes have been cast yet
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Results will appear here once voting begins
            </Typography>
          </Box>
        </Alert>
      )}
    </Box>
  );
};

export default ResultsPage;
