const Knex = require("knex");
const knexConfig = require("./knex.config");

module.exports = Knex(knexConfig);
