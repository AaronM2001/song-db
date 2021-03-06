const mysql= require("mysql");
const inquirer = require("inquirer");

//CONNETING THE DB///

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: '15586Am2001$',
    database: 'top 1000 songs'
});

connection.connect(function(err){
    if(err) throw err;
    runSearch();
});
function runSearch(){
    inquirer
    .prompt({
        name: "action",
        type:"list",
        message: "what would you like to do ",
        choices:["Find song by artist",
        "Find all artists who appear more then once",
        "Find data within spesific range",
        "search for a spesific song",
    "exit"] 
    })
.then(function(answer){
    switch (answer.action){
        case "Find song by artist":
        artistSearch();
        break;
        case "Find all artists who appear more then once":
            multiSearch();
            break ;
            case "Find data within spesific range":
                rangeSearch();
                break;
                case "search for a spesific song":
                    songSearch();
                    break;
                    case"exit":
                    connection.end();
                    break;
    }});
}
function artistSearch() {
    inquirer
      .prompt({
        name: "artist",
        type: "input",
        message: "What artist would you like to search for?"
      })
      .then(function(answer) {
        var query = "SELECT position, song, year FROM top_1000_song WHERE ?";
        connection.query(query, { artist: answer.artist }, function(err, res) {
          if (err) throw err;
          for (var i = 0; i < res.length; i++) {
            console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
          }
          runSearch();
        });
      });
  }
  function multiSearch() {
    var query = "SELECT artist FROM top_1000_song GROUP BY artist HAVING count(*) > 1";
    connection.query(query, function(err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].artist);
      }
      runSearch();
    });
  }
  function rangeSearch() {
    inquirer
      .prompt([
        {
          name: "start",
          type: "input",
          message: "Enter starting position: ",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
          name: "end",
          type: "input",
          message: "Enter ending position: ",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function(answer) {
        var query = "SELECT position,song,artist,year FROM top_1000_song WHERE position BETWEEN ? AND ?";
        connection.query(query, [answer.start, answer.end], function(err, res) {
          if (err) throw err;
          for (var i = 0; i < res.length; i++) {
            console.log(
              "Position: " +
                res[i].position +
                " || Song: " +
                res[i].song +
                " || Artist: " +
                res[i].artist +
                " || Year: " +
                res[i].year
            );
          }
          runSearch();
        });
      });
  }
  function songSearch() {
    inquirer
      .prompt({
        name: "song",
        type: "input",
        message: "What song would you like to look for?"
      })
      .then(function(answer) {
        console.log(answer.song);
        connection.query("SELECT * FROM top_1000_song WHERE ?", { song: answer.song }, 
        function(err, res) {
          if (err) throw err;
          console.log(
            "Position: " +
              res[0].position +
              " || Song: " +
              res[0].song +
              " || Artist: " +
              res[0].artist +
              " || Year: " +
              res[0].year
          );
          runSearch();
        });
      });
  }