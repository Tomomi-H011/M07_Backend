//models/song.js
const db = require("../db"); // Import the db.js file

// Create a model for the songs
const Song = db.model("Song", {
    // There is a hidden parameter here called _id that is automatically created
    title: {type: String, required: true},
    artist: String,
    popularity: {type:Number, min:1, max:10},
    releaseDate: {type: Date, default: Date.now}, // Default is the current date
    genre: [String] // This is an array of strings
});

module.exports = Song; // Export the Song model to be used in other files