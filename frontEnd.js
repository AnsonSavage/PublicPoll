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
      if (!(this.username === '' | this.questionInCreation === '' | this.optionsInCreation[0] === '' | this.optionsInCreation[1] === '')) {
        let poll = {
          username: this.username,
          question: this.questionInCreation,
          options: [],
          // comments: [],
          // addComment: comment => {
          //   this.comments.push(comment)
          // },
          total: 0,
          date: moment().format('MMMM Do YYYY, h:mm:ss a'),
        }
        this.optionsInCreation.forEach(option => {
          if (option !== "") {
            let newOption = {}; //Create a new, empty object
            newOption[option] = 0;
            console.log(newOption[option], option);
            poll.options.push(newOption);
            console.log(poll.options);
          }
        });
        this.polls.unshift(poll);
        //Clear out variables
        this.username = "";
        this.questionInCreation = "";
        this.optionsInCreation = ["", ""];
        console.log("We just added a poll!");
      } else {
        console.log("Insufficient information to add a poll!")
      }
    },
    addCount(poll, option) {
      poll.total++;
      //Increment the count associated with that particular value
      option[Object.keys(option)[0]]++; //There's got to be a better way to do this, but oh well.
    },
    // addComment(item) {
    //   console.log(item);
    //   item[comments].push(this.commentInCreation);
    // },
  },
  computed: {

  },
})