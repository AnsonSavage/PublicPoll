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
      try {
        let response = await axios.get("/api/polls");
        // this.polls = response.data;
        response.data.forEach(poll => {
          this.polls.push(poll);
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
          //date: moment().format('MMMM Do YYYY, h:mm:ss a'), //We will take care of adding the date in the backend
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
    async addCount(poll, i) {
      console.log("Adding count to " + poll.optionsVotes[i]);
      //poll.total++;
      //Increment the count associated with that particular value
      //option[Object.keys(option)[0]]++; //There's got to be a better way to do this, but oh well.
      // poll.optionsVotes[i]++;
      Vue.set(poll.optionsVotes, i, poll.optionsVotes[i] + 1); //Remember, Vue has a weird thing with arrays
      try {
        await axios.put("/api/polls/" + poll._id, {
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

  },
})