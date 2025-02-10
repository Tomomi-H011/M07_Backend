// Set up = This is similar to default tags in html
const express = require('express'); // This is a framework for Node.js
// We have to use cors to host a front end and back end on the same device. Declare global variable for cors to use it in different files
var cors = require('cors'); // This is a package that allows the server to accept requests from other servers (cross-origin resource sharing) = from the front end

// Set up the app
const bodyParser = require('body-parser'); // This is a package that allows the server to read the body of the request
// Import the Song model
const Song = require("./models/song"); // Import the Song model from the songs.js file
const app = express(); // The variable app is the instance of express server

app.use(cors()); //middleware that allows the server to accept requests from other servers
app.use(bodyParser.json()); // This is middleware that allows the server to read the body of the request
const router = express.Router(); // The variable router is the instance of express router which is used to create routes (sends back only the data requested)



// // Grab all the songs in the database
router.get("/songs", async(req, res) => {
    try{
        const songs = await Song.find({}); // This will grab all the songs
        res.send(songs); // This will send the songs back to the client
        console.log(songs);
    }
    catch(err){
        console.log(err);
    }
});

// Grab a single song by its id from the database
router.get("/songs/:id", async(req, res) => {  //Don't need to add underscore before id
    try {
        const song = await Song.findById(req.params.id); // This will grab the song by its id
        res.json(song); // This will send the song back to the client
    }
    catch(err){
        res.status(400).send(err); // set status to 400 and send the error message
    }
});

// Add a song to the database
router.post("/songs", async(req, res) => {
    try{
        const song = await new Song(req.body); // This will create a new instance of song model
        await song.save(); // This will save the song to the database
        res.status(201).json(song); // This will send the song back to the client
        console.log(song);
    }
    catch(err){
        console.status(400).send(err);  // set status to 400 and send the error message (this is a part of express framework)
    }
});

// Update a song in the database using a PUT request
router.put("/songs/:id", async(req, res) => {
    // First we need to find the song by the id of the song from request
    try{
        const song = req.body; // This will grab the song from the request
        await Song.updateOne({_id: req.params.id}, song); // Filter by the id and update the song with the song from the request
        console.log(song);
        res.sendStatus(204); // This will send a status of 204 back to the client
    }
    catch(err){
            res.status(400).send(err);
        }
});

// Delete a song from the database using a DELETE request
router.delete("/songs/:id", async(req, res) => {
    try{
        await Song.deleteOne({_id: req.params.id}); // Filter by the id and delete the song
        res.sendStatus(204); // This will send a status of 204 back to the client
    }
    catch(err){
        res.status(400).send(err);
    }
});

// Add redirect for Glitch
app.get("/", (req, res) => {
    res.redirect("/api/songs"); // Redirect the root URL to "/api/songs"
});

// All reqquests that usually use an api start with /api... so the url would be http://localhost:3000/api/songs
app.use("/api", router); // This is the route that the router will use
app.listen(3000); // This is the port that the server will listen to
