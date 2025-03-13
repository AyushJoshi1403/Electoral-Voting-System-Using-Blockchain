// importing express
const express = require('express');
const UserRouter = require('./routers/userRouter');
const cors = require('cors');

// initializing express
const app = express();
const port = 5000;

// middleware
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use('/user', UserRouter);

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
app.listen(port, () => {
    console.log('server started');
});