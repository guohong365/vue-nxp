var sql = {
  usre: {
    add: "insert into t4_user set ?",
    selectById: "select * from t4_user where id =?",
    select: "select * from t4_user where ?",
    updateById: "update t4_user set ? where id = ?",
  },
};

module.exports = sql;
