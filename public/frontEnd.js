let app = new Vue({
  el: '#app',
  data: {
    //Temporary variables for creating a new poll
    optionsInCreation: [ //Each default poll has two answer choices
      "",
      ""
    ],
    username: "",
    questionInCreation: "",
    commentInCreation: "",
    //Array to hold polls that have already been created:
    polls: [
      /*Holds poll objects in the follwing form:
      poll: {
        username: "Anson",
        question: "What should I eat for Breakfast?",
        options: [{"Food": numVotes}, {"Cereal": numVotes}]
        comments: [{username: "Stephan", comment: "I like cereal", time: timeObject}]
    }*/
    ],
    loading: false,
  },
  created() {
    this.getPolls();
  },
  methods: {
    async getPolls() {
      this.polls = [];
      try {
        let response = await axios.get("/api/polls");
        // this.polls = response.data;
        response.data.forEach(poll => { //For each poll in the response, add it to the front of our front end polls array
          this.polls.unshift(poll);
        });
        console.log("We grabbed the polls!");
      } catch (error) {
        console.log(error);
      }
    },
    addOption() {
      this.optionsInCreation.push("");
    },
    getDate(date) {
      return moment(date).format("MMMM Do YYYY, h:mm:ss a");
    },
    async addPoll() {
      if (!(this.username === '' | this.questionInCreation === '' | this.optionsInCreation[0] === '' | this.optionsInCreation[1] === '')) {
        let poll = {
          username: this.username,
          questionText: this.questionInCreation,
          optionsText: [],
          // comments: [],
          // addComment: comment => {
          //   this.comments.push(comment)
          // },
          //We will take care of adding the date in the backend
        }
        this.optionsInCreation.forEach(option => {
          if (option !== "") {
            poll.optionsText.push(option);
            console.log(poll.optionsText);
          }
        });
        this.loading = true;
        try {
          let response = await axios.post("/api/polls", poll);
          console.log(response.data);
          this.polls.unshift(response.data); //Adds it to the front of our polls list
        } catch (error) {
          console.log(error);
        }
        this.loading = false;
        //Clear out variables
        this.username = "";
        this.questionInCreation = "";
        this.optionsInCreation = ["", ""];
        console.log("We just added a poll!");
      } else {
        console.log("Insufficient information to add a poll!")
      }
    },
    async deletePoll(poll) {
      try {
        await axios.delete("/api/polls/" + poll._id);
        this.loading = true;
        await this.getPolls(); //Can optimize this so that we just remove this particular poll from our local array.
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async addCount(poll, i) {
      console.log("Adding count to " + poll.optionsVotes[i]);
      Vue.set(poll.optionsVotes, i, poll.optionsVotes[i] + 1); //Remember, Vue has a weird thing with arrays
      try {
        await axios.put("/api/polls/" + poll._id, {
          // index: i, //This is a more efficient approach for another time.
          // newValue: poll.optionsVotes[i],
          optionsVotes: poll.optionsVotes,
        });
      } catch (error) {
        console.log(error);
      }
    },
    // addComment(item) {
    //   console.log(item);
    //   item[comments].push(this.commentInCreation);
    // },
  },
  computed: {
    //Consider creating a computed property that holds the total of all the votes for each poll... The only difficulty is that it may be more intensive to serach for which index we are looking for.
  },
})