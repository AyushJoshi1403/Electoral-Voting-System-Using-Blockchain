import { AppBar, Toolbar, Typography, Button, Container, Box, CircularProgress, Alert, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useBlockchain } from './context/BlockchainContext';
import './App.css';

// Import components
import Home from './components/Home';
import AdminPanel from './components/AdminPanel';
import VotingArea from './components/VotingArea';
import ResultsPage from './components/ResultsPage';
import DeployContract from './components/DeployContract';
// import LoginPage from './components/LoginPage';
// import SignupPage from './components/SignupPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const { 
    account, 
    loading, 
    error, 
    connectWallet, 
    isAdmin, 
    contractAddress
  } = useBlockchain();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Electoral Voting System
            </Typography>
            
            {account ? (
              <>
                <Typography variant="body2" sx={{ mr: 2 }}>
                  {account.slice(0, 6)}...{account.slice(-4)}
                </Typography>
                
                {isAdmin && (
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/admin"
                  >
                    Admin Panel
                  </Button>
                )}
                
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/vote"
                >
                  Vote
                </Button>
                
                <Button 
                  color="inherit"
                  component={Link}
                  to="/results"
                >
                  Results
                </Button>
              </>
            ) : (
              <Button 
                color="inherit" 
                onClick={connectWallet}
                disabled={loading}
              >
                Connect Wallet
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : !contractAddress ? (
            <DeployContract />
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/vote" element={<VotingArea />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          )}
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
