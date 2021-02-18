const Mapper = require("./Mapper");

class CodesMapper extends Mapper {
  constructor(debug) {
    super("", debug);
  }
  codeColumns() {
    return ["id", "value", "valid", "comment"];
  }
  selectCode(codeTable, queryAll, callback) {
    let query = this.db.select(this.codeColumns()).from(codeTable);
    if (!queryAll) query.where("valid", true);
    query.orderBy("id");
    if (this.debug && this.debug.sql) {
      console.log(query.toString());
    }
    if (typeof callback !== "function") {
      return query;
    }
    this.callQuery(query, callback);
  }
}
module.exports = CodesMapper;
