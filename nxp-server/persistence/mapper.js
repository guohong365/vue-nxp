const dbConnection = require("../config/dbConnection");

class AbstractMapper {
  constructor(table, debug = false) {
    this.table = table;
    this.debug = debug;
    this.db = dbConnection;
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
  id() {
    return "id";
  }
  updatableSet() {
    return undefined;
  }
  // eslint-disable-next-line no-unused-vars
  buildOptimizedWhere(_builder, _queryForm) {}
  // eslint-disable-next-line no-unused-vars
  buildJoins(_builder, _queryForm) {}

  buildOrderBy(builder, queryForm) {
    if (queryForm.queryOrderBy) builder.orderBy(queryForm.queryOrderBy);
  }
  buildGroupBy(builder, queryForm) {
    if (queryForm.queryGroupBy) builder.groupBy(queryForm.queryGroupBy);
  }
  // eslint-disable-next-line no-unused-vars
  buildDistinct(_builder, _queryForm) {}
  // eslint-disable-next-line no-unused-vars
  buildHaving(_builder, _queryForm) {}
  insertColumns() {
    return undefined;
  }
  updatableColumnsSet() {
    return undefined;
  }
}
class Mapper extends AbstractMapper {
  constructor(table, debug = false) {
    super(table, debug);
  }
  callQuery(query, callback) {
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

  destroy() {
    this.db.destroy();
  }

  selectOptimizedQuery(queryForm) {
    let query = this.select(this.columns()).from(this.tableAlias());
    this.buildJoins(query, queryForm);
    this.buildOptimizedWhere(query, queryForm);
    this.buildGroupBy(query, queryForm);
    this.buildHaving(query, queryForm);
    this.buildOrderBy(query, queryForm);
    return query;
  }

  selectOptimized(queryForm, count, offset, callback) {
    let query = this.selectOptimizedQuery(queryForm);

    if (count && Number(count) > 0) query.limit(Number(count));
    if (offset && Number(offset) > 0) query.offset(Number(offset));
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;

    this.callQUery(query, callback);
  }
  selectCountOptimized(queryForm, callback) {
    let query = this.count("*").from(this.selectOptimizedQuery(queryForm).as("all"));
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    this.callQuery(query, callback);
  }
  selectById(id, callback) {
    let query = this.select(this.columns()).from(this.tableAlias());
    this.buildJoins(query);
    query.where(this.idAlias(), id);

    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;

    this.callQuery(query, callback);
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
    this.callQuery(query, callback);
  }
  selectByUuid(uuid, callback) {
    let query = this.select(this.columns()).form(this.tableAlias);
    this.buildJoins(query);
    query.where(this.uuidAlias(), uuid);

    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    this.callQuery(query, callback);
  }
  selectIdByUuid(uuid, callback) {
    let query = this.db.select(this.idAlias()).from(this.tableAlias()).where(this.uuidAlias(), uuid);
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    this.callQuery(query, callback);
  }
  deleteById(id, callback) {
    let query = this.db.delete().from(this.tableAlias()).where(this.idAlias(), id);
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;

    this.callQuery(query, callback);
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
    this.callQuery(query, callback);
  }
  insert(entity, callback) {
    let query = this.db.insert(entity, this.insertColumns()).into(this.table).returning("id");
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;

    this.callQuery(query, callback);
  }
  updatableColumns(data) {
    let updatable = this.updatableColumnsSet();
    if (updatable && updatable.size) {
      return Array.from(new Set(Object.keys(data).filter((value) => updatable.has(value))));
    }
    return undefined;
  }
  updataByExample(example, updateData, callback) {
    let columns = this.updatableColumns();
    let query = this.db
      .update(updateData, columns)
      .table(this.table)
      .where((builder) => {
        for (let key in example) {
          builder.where(key, example[key]);
        }
      });
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    this.callQuery(query, callback);
  }
  update(entity, callback) {
    let columns = this.updatableColumns();
    let query = this.db(this.table).where(this.id(), entity.id);
    if (columns) query.update(entity, columns);
    else query.update(entity);
    if (this.debug) console.log(query.toString());

    if (typeof callback !== "function") return query;

    this.callQuery(query, callback);
  }
  updateSelective(entity, callback) {
    let columns = this.updatableColumns();
    let toUpdate = {};
    if (columns) {
      for (let key in columns) {
        if (entity[key]) toUpdate[key] = entity[key];
      }
    } else throw "undefined update columns";
    let query = this.db(this.table).where(this.id(), entity.id).update(toUpdate, columns);
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    this.callQuery(query, callback);
  }
}

module.exports = Mapper;
