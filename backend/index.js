// importing express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// initializing express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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

// Routes
app.use('/api/elections', require('./routers/electionRouter'));
app.use('/api/candidates', require('./routers/candidateRouter'));
app.use('/api/voters', require('./routers/voterRouter'));

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
  console.log(`Server running on port ${PORT}`);
});