import { useState } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Button, 
  TextField, 
  Grid, 
  Container,
  Snackbar,
  Alert,
  Divider,
  Card,
  CardContent,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Phone, 
  Email, 
  LocationOn, 
  Send, 
  ContactSupport, 
  Facebook, 
  Twitter, 
  LinkedIn, 
  GitHub 
} from '@mui/icons-material';

const ContactPage = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Form validation state
  const [errors, setErrors] = useState({});
  
  // Handle closing snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message should be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Here you would typically send the form data to a server
    console.log('Submitting form data:', formData);
    
    // Show success notification
    setSnackbar({
      open: true,
      message: 'Your message has been sent. We will get back to you soon!',
      severity: 'success'
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          fontWeight="700" 
          sx={{ 
            mb: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Have questions about our electoral voting system? We're here to help!
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Contact Information Column */}
        <Grid item xs={12} md={5}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 4, 
              height: '100%', 
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
            }}
          >
            <Typography variant="h5" fontWeight="600" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <ContactSupport sx={{ mr: 1.5, color: 'primary.main' }} />
              Get in Touch
            </Typography>

            {/* Contact Details */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', mb: 3, alignItems: 'flex-start' }}>
                <LocationOn sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="600">Our Office</Typography>
                  <Typography variant="body2" color="text.secondary">
                    123 Democracy Street<br />
                    Electoral Heights, EV 54321<br />
                    United States
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                <Phone sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="600">Phone</Typography>
                  <Typography variant="body2" color="text.secondary">+1 (555) 123-4567</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                <Email sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="600">Email</Typography>
                  <Typography variant="body2" color="text.secondary">support@electoralvoting.com</Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Business Hours */}
            <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
              Business Hours
            </Typography>
            
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Monday - Friday:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="500">9:00 AM - 5:00 PM</Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Saturday:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="500">10:00 AM - 2:00 PM</Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Sunday:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="500">Closed</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Social Media Links */}
            <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
              Connect With Us
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                color="primary" 
                sx={{ minWidth: 0, p: 1, borderRadius: '50%' }}
              >
                <Facebook />
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                sx={{ minWidth: 0, p: 1, borderRadius: '50%' }}
              >
                <Twitter />
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                sx={{ minWidth: 0, p: 1, borderRadius: '50%' }}
              >
                <LinkedIn />
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                sx={{ minWidth: 0, p: 1, borderRadius: '50%' }}
              >
                <GitHub />
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Contact Form Column */}
        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h5" fontWeight="600" sx={{ mb: 3 }}>
              Send Us a Message
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Your Name"
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email Address"
                    fullWidth
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Subject"
                    fullWidth
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Your Message"
                    multiline
                    rows={6}
                    fullWidth
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    error={!!errors.message}
                    helperText={errors.message}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ px: 4, py: 1.5, fontWeight: 600 }}
                    startIcon={<Send />}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>

          {/* Map Card */}
          <Card sx={{ mt: 3, borderRadius: 2, overflow: 'hidden' }}>
            <Box 
              component="iframe" 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215706603107!2d-73.98793492422904!3d40.758900071391105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1693350929271!5m2!1sen!2sus"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location"
            />
            <CardContent sx={{ py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight="500">
                Our Office Location
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                href="https://maps.google.com/?q=Times+Square+New+York"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* FAQ Section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" fontWeight="600" textAlign="center" sx={{ mb: 4 }}>
          Frequently Asked Questions
        </Typography>
        
        <Grid container spacing={3}>
          {[
            {
              question: "How secure is your voting system?",
              answer: "Our electoral voting system uses blockchain technology to ensure that votes are immutable, transparent, and verifiable. All data is encrypted end-to-end and protected by state-of-the-art security measures."
            },
            {
              question: "Can I vote remotely using your system?",
              answer: "Yes! Our system is designed to enable secure remote voting. Voters need to be registered with proper verification to participate in elections."
            },
            {
              question: "What support do you offer during elections?",
              answer: "We provide 24/7 technical support during active elections. Our team can assist with setup, voter registration, and any technical issues that may arise."
            },
            {
              question: "How do I register as a voter?",
              answer: "Voter registration is typically managed by election administrators. Contact your local election authorities or the organization running the election to get registered."
            }
          ].map((faq, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 1.5 }}>
                    {faq.question}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

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
};

export default ContactPage;