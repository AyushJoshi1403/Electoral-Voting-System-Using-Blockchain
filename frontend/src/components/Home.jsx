import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Divider,
  Stepper, 
  Step, 
  StepLabel, 
  StepContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  useTheme,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useBlockchain } from '../context/BlockchainContext';

// Importing icons from Tabler
import { 
  IconLock, // Instead of IconLockAccess
  IconSettings, // Instead of IconSettingsAutomation
  IconFingerprint,
  IconShieldLock,
  IconUserCheck,
  IconReportAnalytics,
  IconArrowRight,
  IconChevronDown,
  IconCheck,
  IconDeviceDesktop,
  IconWallet,
  IconShieldCheck,
  IconClipboardCheck,
  IconReportMoney,
  IconBrandStorj,
  IconNote
} from '@tabler/icons-react';

const HomePage = () => {
  const theme = useTheme();
  const { account, isAdmin } = useBlockchain();

  // Voting steps
  const votingSteps = [
    {
      label: 'Connect Your Wallet',
      description: 'Connect your Ethereum wallet such as MetaMask to authenticate yourself securely.',
      icon: <IconWallet size={24} stroke={2} />
    },
    {
      label: 'Verify Your Identity',
      description: 'The system verifies your identity against the voter registry maintained by the election administrator.',
      icon: <IconShieldCheck size={24} stroke={2} />
    },
    {
      label: 'Cast Your Vote',
      description: 'Review the candidates and submit your vote. Your choice is encrypted and securely recorded on the blockchain.',
      icon: <IconNote size={24} stroke={2} />
    },
    {
      label: 'Confirmation',
      description: 'Receive confirmation of your vote being recorded. The transaction hash serves as your receipt.',
      icon: <IconClipboardCheck size={24} stroke={2} />
    },
    {
      label: 'View Results',
      description: 'Once the election closes, results are tallied automatically and can be viewed by all participants.',
      icon: <IconReportMoney size={24} stroke={2} />
    }
  ];

  // Key benefits of blockchain voting
  const benefits = [
    {
      title: 'Transparency',
      description: 'All transactions are visible on a public ledger, allowing for unprecedented transparency in the electoral process.',
      icon: <IconBrandStorj stroke={2} />
    },
    {
      title: 'Security',
      description: 'Military-grade encryption and decentralized architecture protect votes from tampering and fraud.',
      icon: <IconShieldLock stroke={2} />
    },
    {
      title: 'Immutability',
      description: 'Once recorded, votes cannot be altered or deleted, ensuring the integrity of the electoral process.',
      icon: <IconLock stroke={2} />
    },
    {
      title: 'Accessibility',
      description: 'Vote securely from anywhere with an internet connection, increasing participation rates.',
      icon: <IconDeviceDesktop stroke={2} />
    },
    {
      title: 'Auditability',
      description: 'The blockchain provides a permanent audit trail that can be verified by independent observers.',
      icon: <IconReportAnalytics stroke={2} />
    },
    {
      title: 'Automation',
      description: 'Smart contracts automatically enforce voting rules and tally results, eliminating human error.',
      icon: <IconSettings stroke={2} />
    }
  ];

  // FAQ items
  const faqItems = [
    {
      question: "How does blockchain ensure vote security?",
      answer: "Blockchain secures votes through cryptographic techniques. Each vote is encrypted and added to a chain of blocks that are mathematically linked. This creates an immutable record that cannot be changed without consensus from the network, making tampering virtually impossible."
    },
    {
      question: "Is my vote anonymous?",
      answer: "Yes, your vote is anonymous. While your wallet address is used for verification to ensure you're eligible to vote, the specific candidate you voted for is not linked to your identity in a way that others can trace. The system uses cryptographic techniques to ensure voter privacy."
    },
    {
      question: "What if I don't have a cryptocurrency wallet?",
      answer: "You'll need to set up a wallet like MetaMask to participate. It's free and takes only a few minutes to create. We've provided a guide in our 'Help' section that walks you through the process step by step."
    },
    {
      question: "Can votes be changed or deleted once cast?",
      answer: "No, once your vote is recorded on the blockchain, it cannot be altered or deleted. This immutability is one of the key security features of blockchain technology, ensuring the integrity of the electoral process."
    },
    {
      question: "How are results calculated and verified?",
      answer: "Results are calculated automatically through smart contracts that count each vote. The calculations are transparent and can be independently verified by anyone with access to the blockchain. This eliminates the need for manual counting and reduces the risk of error or manipulation."
    }
  ];

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          py: 8,
          borderRadius: { xs: '0 0 24px 24px', md: '0 0 50px 50px' },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            width: '100%', 
            height: '100%', 
            opacity: 0.1,
            backgroundImage: 'url("https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography 
                variant="h2" 
                fontWeight="800" 
                sx={{ 
                  mb: 2,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' } 
                }}
              >
                Secure Electoral Voting on the Blockchain
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, fontWeight: 400, opacity: 0.9 }}>
                A transparent, immutable, and secure voting system powered by blockchain technology.
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 1, sm: 2 }, 
                justifyContent: { xs: 'center', md: 'flex-start' },
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                mt: { xs: 3, sm: 4 }
              }}>
                {account ? (
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to="/vote"
                    size="large"
                    sx={{ 
                      px: 4, 
                      py: 1.5, 
                      bgcolor: 'white', 
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'white' }
                    }}
                    startIcon={<IconArrowRight size={20} />}
                  >
                    Start Voting
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    size="large"
                    sx={{ 
                      px: 4, 
                      py: 1.5, 
                      bgcolor: 'white', 
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'white' }
                    }}
                    onClick={() => document.getElementById('wallet-connect-button').click()}
                  >
                    Connect Wallet to Start
                  </Button>
                )}
                
                <Button 
                  variant="outlined" 
                  component={Link} 
                  to="/about"
                  size="large"
                  sx={{ 
                    px: 4, 
                    py: 1.5, 
                    color: 'white',
                    borderColor: 'white',
                    fontWeight: 600,
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ position: 'relative', height: '100%', minHeight: 350 }}>
                <Box
                  component="img"
                  src="/vote-illustration.svg"
                  alt="Blockchain Voting"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: 450,
                    position: 'absolute',
                    right: { md: -30 },
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* What is Blockchain Voting Section */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/blockchain-concept.svg" 
              alt="Blockchain Architecture"
              sx={{
                width: '100%',
                maxWidth: { xs: '100%', sm: 450, md: 500 },
                height: 'auto',
                borderRadius: 2,
                boxShadow: 3,
                mx: { xs: 'auto', md: 0 },
                display: 'block'
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h3" fontWeight="700" gutterBottom>
              What is Blockchain Voting?
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              Blockchain voting transforms the electoral process by leveraging distributed ledger technology 
              to create a secure, transparent, and tamper-proof voting system. Unlike traditional paper ballots 
              or electronic voting machines, blockchain voting provides an immutable record of every vote.
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              Each vote is encrypted and stored as a transaction on the blockchain, which is distributed across 
              multiple nodes. This decentralized architecture eliminates single points of failure and makes the 
              system resistant to hacking or manipulation.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Smart contracts automatically enforce voting rules, verify voter eligibility, prevent double voting, 
              and tally results with mathematical precision. The entire process is transparent and can be audited 
              by anyone, while still maintaining the privacy of individual voters.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Typography variant="h3" fontWeight="700" textAlign="center" gutterBottom>
          How It Works
        </Typography>
        <Typography variant="body1" textAlign="center" paragraph sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
          Our blockchain voting system combines cutting-edge cryptography with the transparency and 
          security of distributed ledger technology. Here's how the process works from start to finish:
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                borderRadius: 2, 
                height: '100%', 
                position: { xs: 'static', md: 'sticky' }, 
                top: 20 
              }}
            >
              <Typography variant="h5" fontWeight="600" gutterBottom>
                Technical Architecture
              </Typography>
              
              <Typography variant="body2" paragraph sx={{ mb: 3 }}>
                Our system uses Ethereum blockchain technology and smart contracts to create a secure and transparent voting platform:
              </Typography>
              
              <List disablePadding>
                <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <IconCheck size={20} color={theme.palette.primary.main} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Smart Contract Deployment"
                    secondary="The election administrator deploys a smart contract that defines the voting rules, candidate list, and eligibility requirements."
                  />
                </ListItem>
                
                <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <IconCheck size={20} color={theme.palette.primary.main} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Voter Registration"
                    secondary="Eligible voters are registered by the administrator using their Ethereum wallet addresses, creating a secure voter registry on the blockchain."
                  />
                </ListItem>
                
                <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <IconCheck size={20} color={theme.palette.primary.main} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Cryptographic Protection"
                    secondary="Each vote is encrypted using the voter's private key, ensuring that only they can cast a vote using their identity."
                  />
                </ListItem>
                
                <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <IconCheck size={20} color={theme.palette.primary.main} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Vote Transaction"
                    secondary="When a vote is cast, it creates a transaction on the Ethereum blockchain that is verified by network consensus."
                  />
                </ListItem>
                
                <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <IconCheck size={20} color={theme.palette.primary.main} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Immutable Recording"
                    secondary="Once confirmed, the vote becomes part of the permanent blockchain record and cannot be altered or deleted."
                  />
                </ListItem>
                
                <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <IconCheck size={20} color={theme.palette.primary.main} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Automated Tallying"
                    secondary="When voting ends, the smart contract automatically tallies the votes and declares results, eliminating manual counting errors."
                  />
                </ListItem>
                
                <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <IconCheck size={20} color={theme.palette.primary.main} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Public Verification"
                    secondary="Anyone can verify the vote count by querying the blockchain, ensuring complete transparency of results."
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Typography variant="h5" fontWeight="600" gutterBottom>
              Voting Process for Participants
            </Typography>
            
            <Stepper orientation="vertical" sx={{ mt: 3 }}>
              {votingSteps.map((step, index) => (
                <Step active={true} key={index}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: theme.palette.primary.main,
                          color: 'white'
                        }}
                      >
                        {step.icon}
                      </Box>
                    )}
                  >
                    <Typography variant="h6" fontWeight="600">
                      {step.label}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {step.description}
                    </Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            
            <Box sx={{ mt: 6, mb: 4 }}>
              <Typography variant="h5" fontWeight="600" gutterBottom>
                System Security Measures
              </Typography>
              
              <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                          sx={{
                            mr: 1.5,
                            display: 'flex',
                            p: 1,
                            borderRadius: '50%',
                            bgcolor: alpha(theme.palette.primary.main, 0.1)
                          }}
                        >
                          <IconShieldLock size={24} color={theme.palette.primary.main} />
                        </Box>
                        <Typography variant="h6" fontWeight="600">
                          Cryptographic Security
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        All votes are secured using 256-bit encryption, making them virtually impossible to decode without the proper keys.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                          sx={{
                            mr: 1.5,
                            display: 'flex',
                            p: 1,
                            borderRadius: '50%',
                            bgcolor: alpha(theme.palette.primary.main, 0.1)
                          }}
                        >
                          <IconUserCheck size={24} color={theme.palette.primary.main} />
                        </Box>
                        <Typography variant="h6" fontWeight="600">
                          Fraud Prevention
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        Smart contracts prevent double voting and ensure that only registered voters can participate in elections.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                          sx={{
                            mr: 1.5,
                            display: 'flex',
                            p: 1,
                            borderRadius: '50%',
                            bgcolor: alpha(theme.palette.primary.main, 0.1)
                          }}
                        >
                          <IconFingerprint size={24} color={theme.palette.primary.main} />
                        </Box>
                        <Typography variant="h6" fontWeight="600">
                          Identity Verification
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        Wallet signatures provide cryptographic proof of voter identity while maintaining privacy of voting choices.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                          sx={{
                            mr: 1.5,
                            display: 'flex',
                            p: 1,
                            borderRadius: '50%',
                            bgcolor: alpha(theme.palette.primary.main, 0.1)
                          }}
                        >
                          <IconReportAnalytics size={24} color={theme.palette.primary.main} />
                        </Box>
                        <Typography variant="h6" fontWeight="600">
                          Audit Trail
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        Every action is logged on the blockchain, creating a permanent record that can be audited for verification.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ 
        mt: 10, 
        py: 8,
        bgcolor: alpha(theme.palette.primary.main, 0.05),
      }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="700" textAlign="center" gutterBottom>
            Key Benefits of Blockchain Voting
          </Typography>
          
          <Typography variant="body1" textAlign="center" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
            Our blockchain-based electoral system offers numerous advantages over traditional voting methods:
          </Typography>
          
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '100%',
                    borderRadius: 2,
                    transition: '0.3s',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 5 }
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        mb: 2,
                        p: 1.5,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        width: 60,
                        height: 60,
                        mx: 'auto'
                      }}
                    >
                      <Box sx={{ color: theme.palette.primary.main, fontSize: 30 }}>
                        {benefit.icon}
                      </Box>
                    </Box>
                    
                    <Typography variant="h5" align="center" fontWeight="600" gutterBottom>
                      {benefit.title}
                    </Typography>
                    
                    <Typography variant="body2" align="center" color="text.secondary">
                      {benefit.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Container maxWidth="lg" sx={{ mt: 10, mb: 8 }}>
        <Typography variant="h3" fontWeight="700" textAlign="center" gutterBottom>
          Frequently Asked Questions
        </Typography>
        
        <Typography variant="body1" textAlign="center" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
          Learn more about how our blockchain voting system works and addresses common concerns.
        </Typography>
        
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          {faqItems.map((item, index) => (
            <Accordion 
              key={index} 
              disableGutters 
              elevation={0} 
              sx={{ 
                mb: { xs: 1, sm: 2 }, 
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '8px !important',
                overflow: 'hidden',
                '&:before': {
                  display: 'none',
                }
              }}
            >
              <AccordionSummary
                expandIcon={<IconChevronDown size={24} />}
                sx={{ 
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                  '&.Mui-expanded': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05) 
                  }
                }}
              >
                <Typography 
                  variant="h6" 
                  fontWeight="600"
                  sx={{ 
                    fontSize: { xs: '1rem', sm: '1.25rem' } 
                  }}
                >
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
                <Typography variant="body1">
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>

      {/* Call to Action */}
      <Box sx={{ 
        mt: 8, 
        py: 8,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        borderRadius: { xs: '24px 24px 0 0', md: '50px 50px 0 0' },
        color: 'white',
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight="700" gutterBottom>
            Ready to Experience Secure Voting?
          </Typography>
          
          <Typography variant="h6" fontWeight="normal" sx={{ mb: 4, opacity: 0.9 }}>
            Join the future of democratic participation with our blockchain-based electoral system.
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: { xs: 1, sm: 2 }, 
            flexWrap: 'wrap' 
          }}>
            {account ? (
              <>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/vote"
                  size="large"
                  sx={{ 
                    px: { xs: 3, sm: 4 }, 
                    py: { xs: 1, sm: 1.5 },
                    bgcolor: 'white', 
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    '&:hover': { bgcolor: alpha(theme.palette.primary.light, 0.9) }
                  }}
                >
                  Start Voting Now
                </Button>
                
                {isAdmin && (
                  <Button 
                    variant="outlined" 
                    component={Link} 
                    to="/admin"
                    size="large"
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      color: 'white',
                      borderColor: 'white',
                      fontWeight: 600,
                      '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                  >
                    Manage Election
                  </Button>
                )}
              </>
            ) : (
              <Button 
                variant="contained" 
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  bgcolor: 'white', 
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  '&:hover': { bgcolor: alpha(theme.palette.primary.light, 0.9) }
                }}
                onClick={() => document.getElementById('wallet-connect-button').click()}
              >
                Connect Wallet to Participate
              </Button>
            )}
            
            <Button 
              variant="outlined" 
              component={Link} 
              to="/contact"
              size="large"
              sx={{ 
                px: 4, 
                py: 1.5,
                color: 'white',
                borderColor: 'white',
                fontWeight: 600,
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Contact Us
            </Button>
          </Box>
          
          <Box sx={{ 
            mt: { xs: 3, sm: 5 }, 
            display: 'flex', 
            gap: { xs: 0.5, sm: 1 }, 
            justifyContent: 'center', 
            flexWrap: 'wrap' 
          }}>
            <Chip 
              label="Secure" 
              size="small" 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 500 }}
            />
            <Chip 
              label="Transparent" 
              size="small" 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 500 }}
            />
            <Chip 
              label="Immutable" 
              size="small" 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 500 }}
            />
            <Chip 
              label="Verifiable" 
              size="small" 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 500 }}
            />
            <Chip 
              label="Decentralized" 
              size="small" 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 500 }}
            />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
