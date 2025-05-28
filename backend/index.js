// importing express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// initializing express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://ayushjoshi1403:Aj1403@cluster0.ovi5b.mongodb.net/electoralsystem?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Routes
app.use('/api/elections', require('./routers/electionRouter'));
app.use('/api/candidates', require('./routers/candidateRouter'));
app.use('/api/voters', require('./routers/voterRouter'));
app.use('/api/votes', require('./routers/voteRouter'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// accept and process request
// route
app.get('/', (req, res) => {
    res.send('response from express');
});

//add
app.get('/add', (req, res) => {
    res.send('response from add');
})

// getall
app.get('/getall', (req, res) => {
    res.send('response from getall');
})

// delete
app.get('/delete', (req, res) => {
    res.send('response from delete');
})

// update
app.get('/update', (req, res) => {
    res.send('response from update');
})

// start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;