const mongoose = require('mongoose');

const url = "mongodb+srv://ayushjoshi1403:Aj1403@cluster0.ovi5b.mongodb.net/electoralsystem?retryWrites=true&w=majority&appName=Cluster0"

// asynchroneous functions - returns promise
mongoose.connect(url)
    .then((result) => {
        console.log('database connected');
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = mongoose;