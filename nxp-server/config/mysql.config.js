module.exports = {
  typeCast: function (field, next) {
    if (field.type === "BIT") {
      if (field.length === 1) {
        return field.string() === "\x01";
      }
    } else if (field.type === "TINY") {
      if (field.length === 1) {
        return field.string() === "1";
      }
    }
    return next();
  },
  host: "localhost",
  user: "root",
  password: "1111",
  database: "nxp",
  port: "3306",
};
