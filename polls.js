const mongoose = require("mongoose");
const express = require("express");
const router = express.Router(); //We need a router to rout all our api request!


const pollSchema = new mongoose.Schema({ //Maps to a MongDB collection
  username: String, //Notice that, as of right now, we are storing the username in the Poll itself. What I plan to do is to have each user object have an array of ids which point to the polls they have made.
  questionText: String,
  date: Date,
  options: [{
    optionText: String,
    votes: Number
  }],
  //comments: [{commentUser: String, commentText: String}] //Go ahead and implement this once we get comments working.
});

const Poll = mongoose.model('Poll', pollSchema); //We have to convert the schema into a model in order to begin working with it. Instances of this model become documents

router.get("/", async (request, response) => { //Again, we don't have to use "/api/polls," because we already specified that server.js will only refer to polls.js if they receive a request srating with /api.polls
  try {
    let polls = await Poll.find(); //Note! We will modify this to only grab polls that are in your list of friends!
    return response.send(polls);
  } catch (error) {
    console.log(error); //Oh no! We couldn't get all the polls from the database!
  }
});

router.post("/", async (request, response) => {
  const poll = new Poll({
    username: request.body.username, //I'm pretty sure that this stuff already went through the bodyParser.
    questionText: request.body.questionText,
    date: request.body.date,
    options: request.body.options
  });
  try {
    await poll.save(); //Try to save this in the database as a new document
    return response.send(poll); //Send back the poll!
  } catch (error) {
    console.log(error);
    return response.sendStatus(500); //Something really bad happened! We can't save to our server!
  }
});

module.exports = router; //When we say require("/polls.js") in server.js, we are pulling in this router object!