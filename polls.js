const mongoose = require("mongoose");
const express = require("express");
const router = express.Router(); //We need a router to rout all our api request!


const pollSchema = new mongoose.Schema({ //Maps to a MongDB collection
  username: String, //Notice that, as of right now, we are storing the username in the Poll itself. What I plan to do is to have each user object have an array of ids which point to the polls they have made.
  questionText: String,
  date: Date, //We could store this as a Date object, but we're already sending the date over as a string... IDK what's better practice, we can change this later.
  optionsText: [String], //This is how the stuff will be stored in the database, but when it's converted to JSON, it'll get slammed back into one object.
  optionsVotes: [Number]
  //comments: [{commentUser: String, commentText: String}] //Go ahead and implement this once we get comments working.
});

// pollSchema.methods.toJSON = async () => { //I'm making this so we can turn the object ids into actual objects.
//   date
// };


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
  console.log(request.body.options); //These are the options sent across
  const poll = new Poll({
    username: request.body.username, //I'm pretty sure that this stuff already went through the bodyParser.
    questionText: request.body.questionText,
    date: new Date(),
    optionsText: request.body.optionsText, //I hope you see the importance of keeping these two arrays in sync!
    optionsVotes: request.body.optionsText.map(option => 0) //For each option in the optionsText, initialize the vote to zero.
  });
  try {
    await poll.save(); //Try to save this in the database as a new document
    console.log("We added a poll to the server!");
    return response.send(poll); //Send back the poll!
  } catch (error) {
    console.log(error);
    return response.sendStatus(500); //Something really bad happened! We can't save to our server!
  }
});

router.put("/:id", async (request, response) => {
  try {
    await Poll.updateOne({
      _id: request.params.id,
    }, {
      optionsVotes: request.body.optionsVotes,
    });
    // const pollToUpdate = await Poll.findOne({
    //   _id: request.params.id
    // });
    // console.log(pollToUpdate.username);
    // pollToUpdate.optionsVotes.(request.body.index) = request.body.newValue;
    // console.log("We did it!");
    // await pollToUpdate.save();
    response.sendStatus(200);
  } catch (error) {
    console.log("Couldn't update the vote count on the object!");
    console.log(error);
    response.sendStatus(500);
  }
});

router.delete("/:id", async (request, response) => {
  try {
    console.log("We will now try deleting the object.");
    await Poll.deleteOne({
      _id: request.params.id
    }, error => {
      if (!error) {
        console.log(error);
      }
    });
    console.log("We deleted it!");
    response.sendStatus(200); //Hooray, we deleted it!
  } catch (error) {
    console.log("Couldn't delete the object!");
    console.log(error);
    response.sendStatus(500);
  }
});

module.exports = router; //When we say require("/polls.js") in server.js, we are pulling in this router object!