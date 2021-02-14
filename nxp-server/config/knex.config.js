const camelcaseKeys = require("camelcase-keys");
const { snakeCase } = require("snake-case");
const mysqlConfig = require("./mysql.config");

module.exports = {
  client: "mysql",
  connection: mysqlConfig,
  postProcessResponse: (results) => {
    if (Array.isArray(results)) {
      return results.map((row) => camelcaseKeys(row));
    } else {
      return camelcaseKeys(results);
    }
  },
  wrapIdentifier: (value, origImpl) => origImpl(snakeCase(value).toUpperCase()),
  //pool: { min: 1, max: 10 },
};
