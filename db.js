//db.js
// This file is used to connect to the database
const mongoose = require('mongoose');
const db = mongoose.connection;

// Set up the database

mongoose.connect("mongodb+srv://tomh11:RcYDi1j67CdIOVBK@cluster0.qea7x.mongodb.net/SongDB?retryWrites=true&w=majority", {
    // useNewUrlParser: true, // This is to deal with deprecation warnings
    // useUnifiedTopology: true
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to the database');
});

module.exports = mongoose; // Export the mongoose module to be used in other files



//m06user, password: UypwHOHm85czVkL3