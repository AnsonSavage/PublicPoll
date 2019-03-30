const express = require("express");
const bodyParser = require("body-parser"); //Makes it so that we can actually accesss request.body

const app = express(); //Create an express instance called app
app.use(bodyParser.json()); //We tell it that we want to parse up the body of the requests that come in into JSON. bodyParser.json() returns a function, and we tell it to be universal middleware
app.use(bodyParser.urlencoded({ //Only parses urlencoded bodies,
  extended: false //We tell it that the value in the string-value pairs can only be a string or an array (if we set this to true, it could be any type)
}));

app.use(express.static("./public")); //Tells express to serve static files from the public directory
const mongoose = require("mongoose"); //Import mongoose!

mongoose.connect("mongodb://localhost:27017/polls", {
  useNewUrlParser: true //This basically just tells Mongoose that we want to use the new url parser, which requires that we specify a port. The old one is apparently depreciated.
}) //We now connect to the Mongo polls database.

const polls = require("./polls.js"); //We want to use the poll.js file in our current directory.
app.use("/api/polls", polls); //Thus, if we get any path starting with /api/polls, we know we should use the poll.js code

app.listen(3001, () => console.log("The server is listening on port 3001, yahoo"));