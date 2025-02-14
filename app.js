// Set up = This is similar to default tags in html
const express = require('express'); // This is a framework for Node.js
// We have to use cors to host a front end and back end on the same device. Declare global variable for cors to use it in different files
var cors = require('cors'); // This is a package that allows the server to accept requests from other servers (cross-origin resource sharing) = from the front end

// Set up the app
const bodyParser = require('body-parser'); // This is a package that allows the server to read the body of the request
const jwt = require('jwt-simple'); // This is a package that allows the server to create and verify JSON web tokens


const Song = require("./models/song"); // Import the Song model from the songs.js file
const User = require("./models/users"); // Import the User model from the users.js file

const app = express(); // The variable app is the instance of express server

app.use(cors()); //middleware that allows the server to accept requests from other servers
app.use(bodyParser.json()); // This is middleware that allows the server to read the body of the request
const router = express.Router(); // The variable router is the instance of express router which is used to create routes (sends back only the data requested)

const secret = "supersecret"; // This is the secret key that will be used to create and verify JSON web tokens

// Create a new user in the database
router.post("/user", async(req, res) => {
    if(!req.body.username || !req.body.password){ // If the username or password is missing
        return res.sendStatus(400).json({error: "Missing username of password"}); // Send a status of 400
    }

    const newUser = await new User({
        username: req.body.username,  //Grb values from the form
        password: req.body.password,
        status: req.body.status
    })

    try{
        await newUser.save(); // Save the new user to the database
        res.sendStatus(201); // Send a status of 201
        console.log(newUser);
        }
    catch(err){
        console.log(err);
        res.sendStatus(400); // Send a status of 400});
    }
});

// Authenticate a user/login
// Post request to create a new session
router.post("/auth", async(req, res) => {
    if(!req.body.username || !req.body.password){ // If the username or password is missing
        res.sendStatus(400).json({error: "Missing username of password"}); // Send a status of 400
        return 
    }
    // Fid the user in the database, then see if it matches with a username and password
    let user = await User.findOne({username: req.body.username}) // function(err, user){
            //const user = await User.findOne({username: req.body.username});
        
        //connection or server error
        //if(err){
            // res.sendStatus(400).json({error: "Server error"});
        // }
    //If the user is not found
    if(!user){
        res.sendStatus(401).json({error: "Bad Username"});
    }
    //Check to see if the user's password matches the request password
    else{
        if(user.password != req.body.password){
            res.sendStatus(401).json({error: "Bad Password"});
        }
        // Successful login
        else{
            //create a token that encoded with the jwt library, and send back the username
            //Also, send back the status(authorized) in side the token
            //Use boolean:Not authorized auth=0(false), Authorized auth =1(true)
            username2 = user.username;
            const token = jwt.encode({username: user.username}, secret);
            const auth = 1

            //respond with the token
            res.json({
                username2,
                token: token,  //Bind the token to the user
                auth: auth
            })
        }
    }
});

// Check status of user with a valid token, see if it matches the frontend token
router.get("/status", async(req, res) => {
    if(!req.headers["x-auth"]){
        return res.status(401).json({error: "Missing X-Auth"}); // missing token in the header
    }

    // if x-auth contains the token (it should)
    const token = req.headers["x-auth"];
    try{
        const decoded = jwt.decode(token, secret); // decode the token with the secret

        //send back all the username and status fields to the client
        let users = User.find({}, "username status");
        res.json(users); // send the users back to the client
    }
    catch(err){
        res.status(401).json({error: "Invalid jwt token"}); // send a status of 401 and an error message
    }
});

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
router.delete("/songs/:id", async(req, res) => {  //Get id from the url
    try{
        const song = await Song.findById(req.params.id); // This will grab the song by its id
        console.log(song);
        await Song.deleteOne({_id: song._id}); // Filter by the id and delete the song // Function in mongoose/mongo
        // await Song.deleteOne({_id: req.params.id}); // Filter by the id and delete the song // Function in mongoose/mongo
        res.sendStatus(204); // This will send a status of 204 back to the client
    }
    catch(err){
        res.status(400).send(err);
    }
});

// Add a new route to grab all users in the database
router.get("/user", async(req, res) => {
    try{
        const users = await User.find({}); // This will grab all the users
        res.send(users); // This will send the users back to the client
        console.log(users);
    }
    catch(err){
        console.log(err);
    }
});

// Add redirect for Glitch
app.get("/", (req, res) => {
    res.redirect("/api/songs"); // Redirect the root URL to "/api/songs"
});

// All reqquests that usually use an api start with /api... so the url would be http://localhost:3000/api/songs
app.use("/api", router); // This is the route that the router will use

var port = process.env.PORT || 3000; // This is the port that the server will listen to
app.listen(port); // This is the port that the server will listen to
