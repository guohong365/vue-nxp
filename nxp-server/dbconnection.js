var mysql = require("mysql");
var config = require("./config/mysql.config");
var connection = mysql.createConnection(config);

connection.connect(function (err) {
  if (err) {
    console.error("mysql connection was exit error...");
    return false;
  }
  console.info("mysql connection is already....");
});

module.exports = connection;
