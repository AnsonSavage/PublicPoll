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
  },
  methods: {
    addOption() {
      this.optionsInCreation.push("");
    },
    addPoll() {
      let poll = {
        username: this.username,
        question: this.questionInCreation,
        options: [],
        comments: [],
        addComment: comment => {
          this.comments.push(comment)
        },
      }
      this.optionsInCreation.forEach(option => {
        let newOption = {}; //Create a new, empty object
        newOption[option] = 0;
        console.log(newOption[option], option);
        poll.options.push(newOption);
        console.log(poll.options);
      });
      this.polls.push(poll);
      //Clear out variables
      this.username = "";
      this.questionInCreation = "";
      this.optionsInCreation = ["", ""];
      console.log("We just added a poll!");
    },
    // addComment(item) {
    //   console.log(item);
    //   item[comments].push(this.commentInCreation);
    // },
  },
  computed: {

  },
})