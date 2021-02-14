const dbConfig = require("../config/mysql.config");
const mysql = require("mysql");

let pool = mysql.createPool(dbConfig);

const query = function (sql, params, callback) {
  pool.getConnection(function (error, connection) {
    if (error) {
      callback(error, null, null);
    } else {
      connection.query(sql, params, function (qError, results, fields) {
        connection.release();
        callback(qError, results, fields);
      });
    }
  });
};

module.exports = query;
