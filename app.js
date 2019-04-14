//=======================================================
//firebase
const config = {
  apiKey: "AIzaSyCJ4aKTy_Ue0nGKbhpGwXdcC8EiFN1HRQc",
  authDomain: "timecard-group.firebaseapp.com",
  databaseURL: "https://timecard-group.firebaseio.com",
  projectId: "timecard-group",
  storageBucket: "timecard-group.appspot.com",
  messagingSenderId: "300610980754"
};
//firebase initilization
firebase.initializeApp(config);

var database = firebase.database();
//=======================================================

$("#submit").click(function(event) {
  event.preventDefault();
  let employee = $("#emp-name").val();
  let role = $("#emp-role").val();
  let rate = $("#emp-rate").val();
  let month = $("#emp-stmonth").val();
  let day = $("#emp-stday").val();
  let year = $("#emp-styear").val();
  let start = month.toString() + "/" + day.toString() + "/" + year.toString();

  database.ref().push({
    employee: employee,
    role: role,
    startDate: start,
    monthlyRate: rate
  });
});

database.ref().on(
  "child_added",
  function(snapshot) {
    console.log(snapshot.val());
    var months = moment(snapshot.val().startDate, "MM/DD/YYYY");
    let today = moment();
    let difference = today.diff(months, "months");
    var totalBilled = difference * snapshot.val().monthlyRate;

    console.log(difference);

    $("tbody").append(`
        <tr>
            <td id="employee-name">${snapshot.val().employee}</td>
            <td id="role">${snapshot.val().role}</td>
            <td id="start-date">${snapshot.val().startDate}</td>
            <td id="months-worked">${difference}</td>
            <td id="monthly-rate">${snapshot.val().monthlyRate}</td>
            <td id="total-billed">${totalBilled}</td>
            <hr>
        </tr>
      `);
  },
  function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  }
);
