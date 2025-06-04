import { AppBar, Toolbar, Typography, Button, Container, Box, CircularProgress, Alert, CssBaseline, ThemeProvider, createTheme, Paper, Avatar, Menu, MenuItem, IconButton, Chip } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AccountBalanceWallet, Person, AdminPanelSettings, HowToVote, Assessment, Logout, Home as HomeIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useBlockchain } from './context/BlockchainContext';
import './App.css';

// Import components
import HomePage from './components/Home';
import AdminPanel from './components/AdminPanel';
import VotingPage from './components/VotingArea';
import ResultsPage from './components/ResultsPage';
import DeployContract from './components/DeployContract';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './components/AdminLogin';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';

// Define consistent colors that will be used throughout the app
const colors = {
  primary: {
    main: '#2563eb',
    light: '#60a5fa',
    dark: '#1d4ed8',
    ultraLight: '#e0eaff'
  },
  secondary: {
    main: '#7c3aed',  // Changed to purple to match gradient
    light: '#a78bfa',
    dark: '#6d28d9'
  },
  accent: {
    main: '#dc2626',  // Moved red to accent
    light: '#f87171',
    dark: '#b91c1c'
  },
  background: {
    default: '#f8fafc',
    paper: '#ffffff',
    gradient: 'linear-gradient(135deg, #f5f7fa 0%, #e0eaff 100%)'  // Made consistent with primary color
  },
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    light: '#ffffff'
  }
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
    },
    error: {
      main: colors.accent.main,
      light: colors.accent.light,
      dark: colors.accent.dark,
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 500,
          padding: '8px 16px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          backgroundImage: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

function App() {
  const {
    account,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    isAdmin,
    contractAddress
  } = useBlockchain();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    localStorage.removeItem('walletConnected');
    handleMenuClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static" elevation={0}>
          <Toolbar sx={{ py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <AccountBalanceWallet sx={{ mr: 2, fontSize: 28 }} />
              <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                Electoral Voting System
              </Typography>
            </Box>

            {account ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Navigation Buttons */}
                <Button
                  color="inherit"
                  component={Link}
                  to="/"
                  startIcon={<HomeIcon />}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                  }}
                >
                  Home
                </Button>

                {isAdmin && (
                  <Button
                    color="inherit"
                    component={Link}
                    to="/admin"
                    startIcon={<AdminPanelSettings />}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                    }}
                  >
                    Admin
                  </Button>
                )}

                <Button
                  color="inherit"
                  component={Link}
                  to="/vote"
                  startIcon={<HowToVote />}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                  }}
                >
                  Vote
                </Button>

                <Button
                  color="inherit"
                  component={Link}
                  to="/results"
                  startIcon={<Assessment />}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                  }}
                >
                  Results
                </Button>

                {/* User Menu */}
                <Box sx={{ ml: 2 }}>
                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{ p: 0 }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: colors.background.paper,
                        color: colors.primary.main,
                        width: 40,
                        height: 40,
                        fontSize: '14px',
                        fontWeight: 600
                      }}
                    >
                      {account.slice(2, 4).toUpperCase()}
                    </Avatar>
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 250,
                        borderRadius: 2,
                      }
                    }}
                  >
                    <Box sx={{ px: 2, py: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Connected Wallet
                      </Typography>
                      <Chip
                        label={`${account.slice(0, 6)}...${account.slice(-4)}`}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                      {isAdmin && (
                        <Chip
                          label="Admin"
                          color="secondary"
                          size="small"
                          sx={{ mt: 1, ml: 1 }}
                        />
                      )}
                    </Box>
                    <MenuItem onClick={handleDisconnectWallet}>
                      <Logout sx={{ mr: 1, color: colors.accent.main }} />
                      <Typography color={colors.accent.main}>Disconnect Wallet</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
            ) : (
              <Button
                variant="contained"
                onClick={connectWallet}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AccountBalanceWallet />}
                sx={{
                  backgroundColor: colors.background.paper,
                  color: colors.primary.main,
                  '&:hover': { backgroundColor: colors.primary.ultraLight },
                  px: 3,
                  py: 1
                }}
              >
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <Box sx={{
          minHeight: '100vh',
          background: colors.background.gradient,
          pt: 4
        }}>
          <Container maxWidth="lg">
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: 2
                }}
              >
                {error}
              </Alert>
            )}

            {loading ? (
              <Paper
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '400px',
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
                  color: colors.text.light
                }}
              >
                <CircularProgress size={60} sx={{ color: colors.text.light, mb: 2 }} />
                <Typography variant="h6">Loading...</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Please wait while we connect to the blockchain
                </Typography>
              </Paper>
            ) : !contractAddress ? (
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: colors.primary.ultraLight,
                }}
              >
                <DeployContract />
              </Paper>
            ) : (
              <Paper
                sx={{
                  minHeight: '500px',
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <AdminPanel />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/vote" element={<VotingPage />} />
                  <Route path="/results" element={<ResultsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/about" element={<AboutPage />} />
                </Routes>
              </Paper>
            )}
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
