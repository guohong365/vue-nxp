const dbConnection = require("../config/dbConnection");

class Mapper {
  constructor(table, debug = false) {
    this.table = table;
    this.debug = debug;
    this.db = dbConnection;
  }
  destroy() {
    this.db.destroy();
  }
  tableAlias() {
    return this.table;
  }
  uuidAlias() {
    return "uuid";
  }
  columns() {
    return "*";
  }
  idAlias() {
    return "id";
  }
  // eslint-disable-next-line no-unused-vars
  buildOptimizedWhere(_builder, _queryForm) {}
  // eslint-disable-next-line no-unused-vars
  buildJoins(_builder, _queryForm) {}
  // eslint-disable-next-line no-unused-vars
  buildOrderBy(_builder, _queryForm) {}

  selection(queryForm) {
    let query = this.db.select(this.columns()).from(this.tableAlias());
    this.buildJoins(query, queryForm);
    return query;
  }

  selectOptimized(queryForm, count, offset, callback) {
    let query = this.selection();
    this.buildOptimizedWhere(query, queryForm);
    this.buildOrderBy(query, queryForm);
    if (count && Number(count) > 0) query.limit(Number(count));
    if (offset && Number(offset) > 0) query.offset(Number(offset));
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;

    query
      .then((results) => {
        callback(results);
        if (this.debug && this.debug.data) console.log(results);
      })
      .catch((error) => {
        if (this.debug) console.log(error);
        callback(undefined, error);
      });
  }
  selectCountOptimized(queryForm, callback) {
    let query = this.db(this.tableAlias()).count("*");
    this.buildOptimizedWhere(queryForm);
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;

    query
      .then((results) => {
        callback(results);
        if (this.debug && this.debug.data) console.log(results);
      })
      .catch((error) => {
        if (this.debug) console.log(error);
        callback(undefined, error);
      });
  }
  selectById(id, callback) {
    let query = this.selection().where(this.idAlias(), id);
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;

    query
      .then((results) => {
        callback(results);
        if (this.debug && this.debug.data) console.log(results[0]);
      })
      .catch((error) => {
        if (this.debug) console.log(error);
        callback(undefined, error);
      });
  }
  selectByExample(example, callback) {
    let query = this.db
      .select()
      .from(this.table)
      .where((builder) => {
        for (let key in example) {
          builder.where(key, example[key]);
        }
      });
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    query
      .then((results) => {
        callback(results);
        if (this.debug && this.debug.data) console.log(results);
      })
      .catch((error) => {
        if (this.debug) console.log(error);
        callback(undefined, error);
      });
  }
  selectByUuid(uuid, callback) {
    let query = this.selection().where(this.uuidAlias(), uuid);
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    query
      .then((results) => {
        callback(results);
        if (this.debug && this.debug.data) console.log(results);
      })
      .catch((error) => {
        if (this.debug) console.log(error);
        callback(undefined, error);
      });
  }
  selectIdByUuid(uuid, callback) {
    let query = this.db.select("id").from(this.table).where(this.uuidAlias(), uuid);
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    query
      .then((results) => {
        callback(results);
        if (this.debug && this.debug.data) console.log(results);
      })
      .catch((error) => {
        if (this.debug) console.log(error);
        callback(undefined, error);
      });
  }
  deleteById(id, callback) {
    let query = this.db.delete().from(this.table).where("id", id);
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;

    query
      .then((results) => {
        callback(results);
        if (this.debug && this.debug.data) console.log(results);
      })
      .catch((error) => {
        if (this.debug) console.log(error);
        callback(undefined, error);
      });
  }
  insertColumns() {
    return [];
  }
  deleteByExample(example, callback) {
    let query = this.db
      .delete()
      .from(this.table)
      .where((builder) => {
        for (let key in example) {
          builder.where(key, example[key]);
        }
      });
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    query
      .then((results) => {
        if (this.debug && this.debug.data) console.log(results);
        callback(results);
      })
      .catch((error) => {
        if (this.debug) console.log(error);
        callback(undefined, error);
      });
  }
  insert(entity, callback) {
    let query = this.db.insert(entity, this.insertColumns()).into(this.table).returning("id");
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;

    query
      .then((results) => {
        callback(results);
        if (this.debug && this.debug.data) console.log(results);
      })
      .catch((error) => {
        if (this.debug) console.log(error);
        callback(undefined, error);
      });
  }
  updataColumns() {
    return undefined;
  }
  updateSelectiveColumns() {
    return this.updataColumns();
  }
  updataByExample(example, updateData, callback) {
    let query = this.db
      .update(updateData, Object.keys(updateData))
      .table(this.table)
      .where((builder) => {
        for (let key in example) {
          builder.where(key, example[key]);
        }
      });
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    query
      .then((results) => {
        callback(results);
        if (this.debug && this.debug.data) console.log(results);
      })
      .catch((error) => {
        if (this.debug) console.log(error);
        callback(undefined, error);
      });
  }
  update(entity, callback) {
    let columns = this.updataColumns();
    let query = this.db(this.table).where("id", entity.id);
    if (columns) query.update(entity, columns);
    else query.update(entity);
    if (this.debug) console.log(query.toString());

    if (typeof callback !== "function") return query;

    query
      .then((results) => {
        callback(results);
        if (this.debug && this.debug.data) console.log(results);
      })
      .catch((error) => {
        if (this.debug) console.log(error);
        callback(undefined, error);
      });
  }
  updateSelective(entity, callback) {
    let columns = this.updateSelectiveColumns();
    if (!columns) {
      columns = this.updataColumns();
    }

    let toUpdate = {};
    if (columns) {
      for (let key in columns) {
        if (entity[key]) toUpdate[key] = entity[key];
      }
    } else throw "undefined update columns";
    let query = this.db(this.table).where("ID", entity.id).update(toUpdate, columns);
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    query
      .then((results) => {
        callback(results);
        if (this.debug && this.debug.data) console.log(results);
      })
      .catch((error) => {
        if (this.debug) console.log(error);
        callback(undefined, error);
      });
  }
}

module.exports = Mapper;
