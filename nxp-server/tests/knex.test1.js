const knexConfig = require("../config/knex.config");
console.log(knexConfig);
const knex = require("knex")(knexConfig);

afterAll(() => {
  knex.destroy();
});

test("select code t4_c_duty", () => {
  return knex("t4_c_duty")
    .select()
    .then((data) => {
      console.log(data);
      expect.assertions(data.length > 0);
    });
});
/*
//const pool = mysql.createPool(dbConfig);
var connection = mysql.createConnection(dbConfig);

connection.connect();

connection.query("SELECT * from t4_c_duty limit 10", function (err, results, fields) {
  if (err) {
    console.error(err);
    throw err;
  }
  console.log(results);
  console.log(fields);
});
connection.end();
*/
/*
let tables = ["t4_c_duty", "t4_c_article_level"];
tables.forEach(function (table) {
  connection.query(
    {
      sql: "select * from ?? where valid= ? order by code",
      nestedTables: true,
    },

    [table, true],
    function (err, results) {
      if (err) {
        console.error(err);
        throw err;
      }
      console.log(results);
    }
  );
});
connection.end();

query("select * from t4_article order by create_time desc", [], function (error, results, fields) {
  if (error) {
    console.error(error);
    throw error;
  }
  console.log(results);
  console.log(fields);
});
*/
