const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'electoral-voting-system-secret';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// In-memory admin store (replace with database in production)
const adminUsers = [
  {
    id: 1,
    username: 'admin',
    // Default password: admin123 (hashed)
    password: '$2b$10$DUO6bq8IsslZQjDYrVVYkuvcm.r9ARnxkylCL6j1WP1WqjFzY7ju2',
    role: 'admin'
  }
];

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Route to handle admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find admin by username
    const admin = adminUsers.find(user => user.username === username);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // Validate password
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // Create and assign a token
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: admin.id,
        username: admin.username,
        role: admin.role
      }
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Protected route example
app.get('/api/admin/dashboard', authenticateToken, (req, res) => {
  // Only accessible with valid token
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  
  res.json({ message: 'Admin dashboard data', user: req.user });
});

// Register new admin (protected route)
app.post('/api/admin/register', authenticateToken, async (req, res) => {
  try {
    // Check if requester is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    
    const { username, password } = req.body;
    
    // Check if username already exists
    if (adminUsers.some(user => user.username === username)) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new admin
    const newAdmin = {
      id: adminUsers.length + 1,
      username,
      password: hashedPassword,
      role: 'admin'
    };
    
    // Add to admin users (in production, save to database)
    adminUsers.push(newAdmin);
    
    res.status(201).json({ 
      message: 'Admin registered successfully',
      user: {
        id: newAdmin.id,
        username: newAdmin.username,
        role: newAdmin.role
      }
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change admin password
app.post('/api/admin/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.user;
    
    // Find admin by id
    const adminIndex = adminUsers.findIndex(user => user.id === id);
    if (adminIndex === -1) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    // Validate current password
    const validPassword = await bcrypt.compare(currentPassword, adminUsers[adminIndex].password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    adminUsers[adminIndex].password = hashedPassword;
    
    res.status(200).json({ message: 'Password updated successfully' });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Electoral Voting System backend server running on port ${PORT}`);
});

// Helper function to generate a hashed password (for setup)
// Uncomment to use for generating new admin passwords

// const generateHashedPassword = async () => {
//   const password = 'admin123';
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);
//   console.log('Hashed password:', hashedPassword);
// };
// generateHashedPassword();
