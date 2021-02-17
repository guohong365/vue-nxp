const Mapper = require("./mapper");

class RoleMapper extends Mapper {
  constructor(debug) {
    super("t4_role", debug);
  }

  columns() {
    return ["ID", "UUID", "NAME", "DESCRIPTION", "VALID", "PREDEFINED"];
  }
  updatableColumnsSet() {
    new Set(["ID", "UUID", "NAME", "DESCRIPTION", "VALID", "PREDEFINED"]);
  }

  buildOptimizedWhere(builder, queryForm) {
    if (queryForm.name) builder.where("name", "like", `%${queryForm.name}%`);
    if (!queryForm.queryAll) builder.where("valid", true);
  }

  selectFunctions(id, callback) {
    let query = id
      ? this.db
          .select(
            "a.ID",
            "a.NAME",
            "a.URI",
            "a.DESCRIPTION",
            "a.VALID",
            "a.URI_PATTERN",
            this.db.raw("if(b.FUNC is null, false, true) as AVAILABLE")
          )
          .from({ a: "t4_role" })
          .leftJoin(() => {
            this.on({ b: "t4_role_func" }, "a.ID", "b.FUNC").andOn("b.ROLE", "=", id);
          })
      : this.db
          .select("ID", "NAME", "URI", "DESCRIPTION", "VALID", "URI_PATTERN", this.db.raw("false as AVAILABLE"))
          .from("t4_function")
          .where("VALID", true);
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    this.callQuery(query, callback);
  }

  updateRoleFunctions(role, callback) {
    let query = this.db.transaction((tx) => {
      return tx
        .delete()
        .from("t4_role_func")
        .where("role", role.id)
        .then(() => {
          let roleFunc = role.functions.map((item) => {
            return { role: role.id, func: item.id };
          });
          return tx("t4_role_func").batchInsert(roleFunc);
        });
    });
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    this.callQuery(query, callback);
  }
}

module.exports = RoleMapper;
