const Mapper = require("./mapper");

class FunctionMapper extends Mapper {
  constructor(debug) {
    super("t4_function", debug);
  }

  columns() {
    return ["ID", "UUID", "NAME", "URI", "DESCRIPTION", "VALID", "URI_PATTERN"];
  }
  insertColumns() {
    return ["UUID", "NAME", "URI", "DESCRIPTION", "VALID", "URI_PATTERN"];
  }
  updatableColumnsSet() {
    return new Set(["NAME", "URI", "DESCRIPTION", "VALID", "URI_PATTERN"]);
  }
}

module.exports = FunctionMapper;
