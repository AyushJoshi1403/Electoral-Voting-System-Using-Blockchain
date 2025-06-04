import { 
  Typography, 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardMedia, 
  Divider, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Avatar,
  useTheme,
  alpha,
} from '@mui/material';

import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';

// Replace Material UI icons with Tabler icons
import { 
  IconShieldLock,
  IconUserCheck, 
  IconSpeedboat,
  IconWorld, 
  IconUsers, 
  IconChartBar,
  IconFingerprint,
  IconUserShield,
  IconEye,
  IconBrandStrava,
  IconPhone,
  IconMail,
  IconMapPin,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandGithub
} from '@tabler/icons-react';

const AboutPage = () => {
  const theme = useTheme();

  // Team data
  const team = [
    {
      name: 'Alex Johnson',
      role: 'Chief Executive Officer',
      bio: 'Alex has 15+ years experience in election technology and blockchain security.',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Sarah Chen',
      role: 'Chief Technology Officer',
      bio: 'Sarah leads our technical team with expertise in distributed systems and cryptography.',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Security',
      bio: 'Michael ensures our voting platform meets the highest security standards.',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
    },
    {
      name: 'Priya Patel',
      role: 'UX Design Lead',
      bio: 'Priya focuses on creating intuitive, accessible voting experiences for all users.',
      avatar: 'https://randomuser.me/api/portraits/women/58.jpg'
    }
  ];

  // Timeline events
  const timeline = [
    {
      year: '2018',
      title: 'Company Founded',
      description: 'Our journey began with a mission to modernize electoral systems.'
    },
    {
      year: '2019',
      title: 'First Blockchain Implementation',
      description: 'Launched our first blockchain-based voting prototype for small elections.'
    },
    {
      year: '2021',
      title: 'Major Security Enhancements',
      description: 'Implemented advanced encryption and voter verification protocols.'
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description: 'Expanded services to support elections in over 25 countries worldwide.'
    },
    {
      year: '2025',
      title: 'Next-Gen Platform',
      description: 'Released our latest platform with enhanced accessibility and security features.'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 8, 
        position: 'relative',
        px: 2
      }}>
        <Typography 
          variant="overline" 
          color="primary" 
          fontWeight="bold" 
          sx={{ letterSpacing: 2, mb: 2, display: 'block' }}
        >
          ABOUT OUR PLATFORM
        </Typography>
        <Typography 
          variant="h2" 
          component="h1" 
          fontWeight="800" 
          sx={{ 
            mb: 3,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Revolutionizing Democratic Processes
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', mb: 5 }}>
          We're building the future of secure, transparent, and accessible voting technology.
          Our blockchain-based electoral system ensures that every vote counts and is counted correctly.
        </Typography>

        <Box 
          component="img" 
          src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
          alt="Voting Technology"
          sx={{ 
            width: '100%',
            borderRadius: 4,
            boxShadow: 3,
            maxHeight: 400,
            objectFit: 'cover'
          }}
        />
      </Box>

      {/* Mission & Vision Section */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 4, 
              height: '100%', 
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  mr: 2
                }}
              >
                <IconEye size={28} color="white" />
              </Box>
              <Typography variant="h5" fontWeight="700">Our Vision</Typography>
            </Box>
            <Typography variant="body1" sx={{ mt: 2 }}>
              To create a world where every election is fair, transparent, and accessible to all eligible voters,
              regardless of location or circumstance.
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, flexGrow: 1 }}>
              We envision a future where trust in democratic processes is strengthened through technology,
              and where participation in governance is made simpler and more secure than ever before.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 4, 
              height: '100%', 
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  bgcolor: 'secondary.main',
                  mr: 2
                }}
              >
                <IconFingerprint size={28} color="white" />
              </Box>
              <Typography variant="h5" fontWeight="700">Our Mission</Typography>
            </Box>
            <Typography variant="body1" sx={{ mt: 2 }}>
              To provide cutting-edge electoral technology that ensures votes are counted accurately, kept secure,
              and verified transparently—all while maintaining voter privacy and preventing fraud.
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, flexGrow: 1 }}>
              We are committed to developing solutions that make voting more accessible, auditable, and efficient,
              empowering citizens and institutions to conduct elections with confidence and integrity.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Core Features Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" fontWeight="700" textAlign="center" sx={{ mb: 5 }}>
          Core Features of Our Platform
        </Typography>
        
        <Grid container spacing={3}>
          {[
            {
              icon: <IconShieldLock size={40} color={theme.palette.primary.main} />,
              title: 'Secure Blockchain',
              description: 'Votes are stored on a tamper-proof blockchain, ensuring data integrity and preventing unauthorized modifications.'
            },
            {
              icon: <IconUserCheck size={40} color={theme.palette.primary.main} />,
              title: 'Voter Verification',
              description: 'Multi-factor authentication and identity verification to prevent fraud while maintaining privacy.'
            },
            {
              icon: <IconSpeedboat size={40} color={theme.palette.primary.main} />,
              title: 'Real-time Results',
              description: 'Immediate vote counting with transparent and auditable results available as soon as voting ends.'
            },
            {
              icon: <IconWorld size={40} color={theme.palette.primary.main} />,
              title: 'Global Accessibility',
              description: 'Remote voting capabilities that work across devices and locations while maintaining security.'
            },
            {
              icon: <IconUsers size={40} color={theme.palette.primary.main} />,
              title: 'User-Friendly Interface',
              description: 'Intuitive design that makes voting simple for users of all technical backgrounds and abilities.'
            },
            {
              icon: <IconChartBar size={40} color={theme.palette.primary.main} />,
              title: 'Advanced Analytics',
              description: 'Comprehensive election data analysis tools for administrators, with privacy-preserving statistics.'
            }
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%', 
                  borderRadius: 2,
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 5
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 1.5 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Our Journey Timeline */}
      <Paper elevation={1} sx={{ p: 4, mb: 8, borderRadius: 2 }}>
        <Typography variant="h4" component="h2" fontWeight="700" textAlign="center" sx={{ mb: 4 }}>
          Our Journey
        </Typography>
        
        <Timeline position="alternate">
          {timeline.map((event, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent color="text.secondary">
                <Typography variant="h6" fontWeight="600" color="primary">
                  {event.year}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="primary" />
                {index < timeline.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" fontWeight="600">
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.description}
                  </Typography>
                </Box>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Paper>

      {/* Meet Our Team */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" fontWeight="700" textAlign="center" sx={{ mb: 2 }}>
          Meet Our Team
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 5, maxWidth: 800, mx: 'auto' }}>
          Our diverse team brings together expertise in blockchain technology, cybersecurity, 
          user experience design, and electoral systems.
        </Typography>
        
        <Grid container spacing={3}>
          {team.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                elevation={1} 
                sx={{ 
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <Avatar 
                    src={member.avatar} 
                    alt={member.name}
                    sx={{ 
                      width: '100%', 
                      height: 'auto', 
                      borderRadius: 0,
                      aspectRatio: '1/1',
                      boxShadow: 1
                    }} 
                  />
                </Box>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="600">{member.name}</Typography>
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Why Choose Us */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 8, 
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <Typography variant="h4" component="h2" fontWeight="700" textAlign="center" sx={{ mb: 4 }}>
          Why Choose Our Platform
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <List>
              {[
                { 
                  icon: <IconUserShield size={24} color={theme.palette.primary.main} />,
                  primary: 'Industry-Leading Security',
                  secondary: 'End-to-end encryption, multi-factor authentication, and continuous security audits.'
                },
                { 
                  icon: <IconChartBar size={24} color={theme.palette.primary.main} />,
                  primary: 'Transparent Results Processing',
                  secondary: 'All vote calculations are fully traceable and can be independently verified.'
                },
                { 
                  icon: <IconWorld size={24} color={theme.palette.primary.main} />,
                  primary: 'International Compliance',
                  secondary: 'Our system meets legal requirements in numerous jurisdictions worldwide.'
                }
              ].map((item, index) => (
                <ListItem key={index} sx={{ pb: 2 }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="h6" fontWeight="600">{item.primary}</Typography>}
                    secondary={<Typography variant="body2" color="text.secondary">{item.secondary}</Typography>}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <List>
              {[
                { 
                  icon: <IconFingerprint size={24} color={theme.palette.primary.main} />,
                  primary: 'Privacy Protection',
                  secondary: 'Votes are kept private while maintaining complete verifiability of results.'
                },
                { 
                  icon: <IconSpeedboat size={24} color={theme.palette.primary.main} />,
                  primary: 'Rapid Deployment',
                  secondary: 'Our platform can be set up and customized for an election in as little as one week.'
                },
                { 
                  icon: <IconUsers size={24} color={theme.palette.primary.main} />,
                  primary: 'Dedicated Support',
                  secondary: '24/7 technical assistance before, during, and after each election.'
                }
              ].map((item, index) => (
                <ListItem key={index} sx={{ pb: 2 }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="h6" fontWeight="600">{item.primary}</Typography>}
                    secondary={<Typography variant="body2" color="text.secondary">{item.secondary}</Typography>}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Paper>

      {/* Call to Action */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 5, 
          textAlign: 'center',
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white'
        }}
      >
        <Typography variant="h4" fontWeight="700" sx={{ mb: 2 }}>
          Ready to Modernize Your Electoral Process?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: 800, mx: 'auto', opacity: 0.9 }}>
          Join organizations worldwide that are using our platform to conduct secure, transparent, and efficient elections.
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Box 
              component="a"
              href="/contact"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
                display: 'inline-block',
                boxShadow: 2,
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }}
            >
              Contact Us
            </Box>
          </Grid>
          <Grid item>
            <Box 
              component="a"
              href="/demo"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
                display: 'inline-block',
                border: '1px solid white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)'
                }
              }}
            >
              Request Demo
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AboutPage;