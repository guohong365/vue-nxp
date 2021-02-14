const Mapper = require("./mapper");

class UserMapper extends Mapper {
  constructor(debug) {
    super("t4_user", debug);
  }
  selectUserRoles(id, all, callback) {
    let columns = ["a.id", "a.name", "a.description", "a.valid"];
    let hasColumn = id
      ? this.dbConnection.raw("if(b.user is not null, true, false) as has")
      : this.dbConnection.raw("false as has");
    let query = this.dbConnection
      .select(columns, hasColumn)
      .where((builder) => {
        if (!all) {
          builder.where("a.valid", true);
        }
      })
      .from(this.dbConnection.ref("t4_role").as("a"));
    if (id) {
      query.leftJoin(this.dbConnection.ref("t4_user_role").as("b"), () => {
        this.on("a.id", "=", "b.role");
        if (id) {
          this.andOn("b.user", "=", id);
        }
      });
    }
    if (this.debug.sql) console.log(query.toString());

    if (typeof callback !== "function") return query;

    query
      .then((results) => {
        if (this.debug.data) console.log(results);

        callback(results);
      })
      .catch((error) => {
        if (this.debug) console.log(error);

        callback(undefined, error);
      });
  }
  columns() {
    return {
      ID: "a.ID",
      LOGIN_ID: "a.LOGIN_ID",
      PASSWORD: "a.PASSWORD",
      NAME: "a.NAME",
      TELE: "a.TELE",
      EMAIL: "a.EMAIL",
      ADMIN_FLAG: "a.ADMIN_FLAG",
      ORG: "a.ORG",
      CREATE_TIME: "a.CREATE_TIME",
      CREATOR: "a.CREATOR",
      CANCEL_TIME: "a.CANCEL_TIME",
      CANCELER: "a.CANCELER",
      DESCRIPTION: "a.DESCRIPTION",
      ORG_NAME: "b.NAME",
      CITY: "b.CITY",
      COUNTY: "b.AREA",
      CITY_NAME: "c.VALUE",
      COUNTY_NAME: "d.VALUE",
      CREATOR_NAME: "e.NAME",
      CANCELER_NAME: "f.NAME",
      VALID: this.db.raw("(a.CANCELER is null)"),
    };
  }
  tableAlias() {
    return { a: "t4_user" };
  }
  uuidAlias() {
    return "a.login_id";
  }
  idAlias() {
    return "a.id";
  }
  buildJoins(builder) {
    builder
      .leftJoin({ b: "t4_org" }, "a.org", "b.id")
      .leftJoin({ c: "t4_c_area" }, "b.city", "c.id")
      .leftJoin({ d: "t4_c_area" }, "b.area", "d.id")
      .leftJoin({ e: "t4_user" }, "e.id", "a.creator")
      .leftJoin({ f: "t4_user" }, "f.id", "a.canceler");
  }
  buildOptimizedWhere(builder, queryForm) {
    if (queryForm.loginId) builder.where("a.login_id", "like", `${queryForm.loginId}%`);
    if (queryForm.name) builder.where("a.name", "like", `${queryForm.name}%`);
    if (queryForm.org) builder.where("a.org", queryForm.org);
    if (!queryForm.queryAll) builder.whereNull("a.canceler");
  }
  buildOrderBy(builder, queryForm) {
    if (queryForm.queryOrderBy) {
      builder.orderBy(queryForm.queryOrderBy);
    }
  }
  selectUserMenuItems(id, callback) {
    let menuColumns = [
      { id: "a.id" },
      { uri: "b.uri" },
      { parent: "a.parent" },
      { name: "a.Name" },
      { sort: "a.sort" },
      { icon: "a.icon" },
    ];
    let query = this.db
      .select(menuColumns)
      .distinct()
      .whereNull("f.canceler")
      .andWhere((builder) => builder.where("b.valid", true).orWhereNull("b.valid"))
      .andWhere((builder) => builder.Where("d.valid", true).orWhereNull("d.valid"))
      .andWhere((builder) => builder.Where("f.id", id).orWhereNull("a.func"))
      .from({ a: "t4_menu" })
      .leftJoin({ b: "t4_function" }, "a.func", "b.id")
      .leftJoin({ c: "t4_role_func" }, "c.func", "a.func")
      .leftJoin({ d: "t4_role" }, "d.id", "c.role")
      .leftJoin({ e: "t4_user_role" }, "e.role", "d.id")
      .leftJoin({ f: "t4_user" }, "f.id", "e.user")
      .orderBy("a.sort");
    if (this.debug) console.log(query.toString());
    if (typeof callback !== "function") return query;
    query
      .then((results) => {
        if (this.debug) console.log(results);
        callback(results);
      })
      .catch((error) => {
        if (this.debug) console.log(error);
        callback(undefined, error);
      });
  }
  updateUserRoles(user, callback) {
    let query = this.db.transaction((tx) => {
      return tx("t4_user_role")
        .delete()
        .where("user", user.id)
        .then((deleted) => {
          console.log(`${deleted} records was deleted`);
          let roles = user.roles.map((item) => {
            return { user: user.id, role: item.id };
          });
          return tx("t4_user_role").insert(roles);
        });
    });
    if (this.debug) {
      console.log(query.toString());
    }
    query
      .then((newRoles) => {
        console.log(`${newRoles} roles assiged`);
      })
      .catch((error) => {
        callback(undefined, error);
      });
  }
  updataColumns() {
    return ["password", "name", "tele", "email", "adminFlag", "org", "cancelTime", "canceler", "description"];
  }
}
module.exports = UserMapper;
