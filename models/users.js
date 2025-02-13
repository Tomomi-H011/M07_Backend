//models/users.js
const db = require("../db"); // Import the db.js file

// Create a model for the songs
const User = db.model("User", {
    username: {type: String, required: true},
    password: {type:String, required: true},
    status: String
});

module.exports = User; // Export the Song model to be used in other files