//=======================================================
//firebase
var config = {
  apiKey: "AIzaSyDSYusUjcxvdFzfy_dSzMh5quCVD-anvLM",
  authDomain: "trainscheduler-c70a7.firebaseapp.com",
  databaseURL: "https://trainscheduler-c70a7.firebaseio.com",
  projectId: "trainscheduler-c70a7",
  storageBucket: "trainscheduler-c70a7.appspot.com",
  messagingSenderId: "992976683191"
};
//firebase initilization
firebase.initializeApp(config);

var database = firebase.database();
//=======================================================

//receive train start time and frequency to calculate what time the next arrival
//will be and how many minutes away it is

$("#submit").click(function(event) {
  event.preventDefault();

  var name = $("#name").val();
  var destination = $("#destination").val();
  var firstTrain = $("#firstTrain").val();
  var frequency = $("#frequency").val();

  database.ref().push({
    name: name,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  });
});

database.ref().on(
  "child_added",
  function(snapshot) {
    console.log(snapshot.val());
    var minutesRaw = snapshot.val().frequency;
    var min = moment(minutesRaw, "mm").format("m");
    var nextRaw = snapshot.val().firstTrain;
    var today = moment().format("hh:mm");
    var frequency = snapshot.val().frequency;
    var start = moment.utc(nextRaw, "hh:mm");
    var end = moment.utc(today, "hh:mm");
    var timeDifference = moment.duration(end.diff(start)) / 1000 / 60;
    var minutesAway =
      Math.ceil(timeDifference / frequency) * frequency - timeDifference;
    var trainTime = moment(start)
      .add(Math.ceil(timeDifference / frequency) * frequency, "minutes")
      .format("hh:mm");

    $("tbody").append(`
        <tr>
            <td>${snapshot.val().name}</td>
            <td>${snapshot.val().destination}</td>
            <td>${min}</td>
            <td id="start-date">${trainTime}</td>
            <td id="new-time">${minutesAway}</td>
            <hr>
        </tr>
      `);
  },
  function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  }
);
