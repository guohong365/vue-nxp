const dbConnection = require("../config/dbConnection");

//interface of sql Helper
class SqlHelper {
  constructor(options) {
    this.debug = options.debug;
    this.db = dbConnection;
    this._selectQuery = options.select;
    this._countQuery = options.count;
    this._selectByIdQuery = options.selectById;
    this._selectByUuidQuery = options.selectByUuid;
    this._selectIdByUuidQuery = options.selectIdByUuid;
    this._deleteQeury = options.delete;
    this._deleteByIdQuery = options.deleteById;
    this._updateQuery = options.update;
    this._updateByIdQuery = options.updateById;
  }
  setDebug(debug) {
    this.debug = debug;
  }
  getUpdateColumns(entity, updatableSet) {
    let keys = Object.keys(entity);
    return Array.from(
      new Set(
        keys.filter((value) => {
          updatableSet.has(value);
        })
      )
    );
  }
  destroy() {
    this.db.destroy();
  }
  buildSelectQuery(conditions, count, offset) {
    if (this._selectQuery) {
      let query = this._selectQuery(this.db, conditions);
      if (Number(count) > 0) query.limit(Number(count));
      if (Number(offset) >= 0) query.offset(Number(offset));
    }
    throw "no select query builder.";
  }
  buildCountQuery(conditions) {
    if (this._countQuery) return this._countQuery(this.db, conditions);
    throw "no select count query builder";
  }
  buildDeleteQeury(conditions) {
    if (this._deleteQeury) return this._deleteQeury(this.db, conditions);
    throw "no delete query builder";
  }
  buildSelectByIdQuery(id) {
    if (this._selectByIdQuery) return this._selectByIdQuery(this.db, id);
    throw "no select by id query builder";
  }
  buildSelectByUuidQuery(uuid) {
    if (this._selectByUuidQuery) return this._selectByUuidQuery(this.db, uuid);
    throw "no select by uuid query builder";
  }
  buildSelectIdByUuidQuery(uuid) {
    if (this._selectIdByUuidQuery) return this._selectIdByUuidQuery(this.db, uuid);
    throw "no select id by uuid query builder";
  }
  buildDeleteByIdQuery(id) {
    if (this._deleteByIdQuery) return this._deleteByIdQuery(this.db, id);
    throw "no delete by id query";
  }
  buildUpdateQuery(example, conditions) {
    if (this._updateQuery) return this._updateQuery(this.db, example, conditions);
    throw "no upate query builder";
  }
  buildUpdateByIdQuery(toUpdate) {
    if (this._updateByIdQuery) return this._updateByIdQuery(this.db, toUpdate);
    throw "no update by id query builder";
  }
  callQUery(query, callback) {
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

  select(conditions, count, offset, callback) {
    let query = this.builderSelectQuery(conditions, count, offset);
    if (count && Number(count) > 0) query.limit(Number(count));
    if (offset && Number(offset) > 0) query.offset(Number(offset));
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    this.callQUery(query, callback);
  }
  selectCount(conditions, callback) {
    let query = this.buildCountQuery(conditions);
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    this.callQUery(query, callback);
  }
  selectById(id, callback) {
    let query = this.buildSelectByIdQuery(id);
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    this.callQUery(query, callback);
  }
  selectByUuid(uuid, callback) {
    let query = this.buildSelectByUuidQuery();
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    this.callQUery(query, callback);
  }
  selectIdByUuid(uuid, callback) {
    let query = this.buildSelectIdByUuidQuery(uuid);
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    this.callQUery(query, callback);
  }
  deleteById(id, callback) {
    let query = this.buildDeleteByIdQuery(id);
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    this.callQUery(query, callback);
  }
  delete(conditions, callback) {
    let query = this.buldDeleteQuery(conditions);
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    this.callQUery(query, callback);
  }
  insert(table, entity, callback) {
    let query = this.db.inser36t(entity).into(table);
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    this.callQUery(query, callback);
  }
  updata(example, conditions, callback) {
    let query = this.buildUpdateQuery(conditions, example);

    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    this.callQUery(query, callback);
  }
  updateById(toUpdate, callback) {
    let query = this.buildUpdateByIdQuery(toUpdate);
    if (this.debug && this.debug.sql) console.log(query.toString());
    if (typeof callback !== "function") return query;
    this.callQUery(query, callback);
  }
}

module.exports = SqlHelper;
