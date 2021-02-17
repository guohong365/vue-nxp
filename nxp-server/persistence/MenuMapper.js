const Mapper = require("./mapper");

class MenuMapper extends Mapper {
  constructor(debug) {
    super("t4_menu", debug);
  }
  tableAlias() {
    return { a: "t4_menu" };
  }
  columns() {
    return ["a.ID", "a.UUID", "a.NAME", "a.FUNC", "b.NAME as FUNC_NAME", "a.PARENT", "a.SORT", "a.ICON"];
  }
  idAlias() {
    return "a.id";
  }
  updatableColumnsSet() {
    return new Set(["NAME", "FUNC", "PARENT", "SORT", "ICON"]);
  }
  uuidAlias() {
    return "a.uuid";
  }
  buildJoins(builder) {
    builder.leftJoin(builder.ref("t4_function").as("b"), "a.FUNC", "b.ID");
  }
  buildGroupBy(builder) {
    builder.groupBy("parent", "id");
  }
  buildOrderBy(builder) {
    builder.orderBy("parent", "id", "sort");
  }
  updateMenuStructs(menus, callback) {
    let query = this.db.transaction((tx) => {
      let querys = [];
      for (let i = 0; i < menus.length; i++) {
        let sub = tx(this.table).update(menus[i], ["parent", "sort"]).where("id", menus[i].id);
        querys.push(sub);
      }
      return Promise.all(querys);
    });
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    this.callQuery(query, callback);
  }
}

module.exports = MenuMapper;
