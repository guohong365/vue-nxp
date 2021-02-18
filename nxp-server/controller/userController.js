const pageConfig = require("../config/page.config");
const UserMapper = require("../persistence/UserMapper");

const mapper = new UserMapper();

exports.list = async (req, res) => {
  let params = req.params;
  try {
    let total = await mapper.selectCountOptimized(params ? params : {});
    total = total ? total[0].count : 0;

    let pages = Math.ceil(total / pageConfig.pageSize);
    let offset = !params ? 0 : isNaN(Number(params.queryOffset)) ? 0 : Number(params.queryOffset);
    let users = await mapper.selectOptimized(params ? params : {}, pageConfig.pageSize, offset);
    let result = {
      queryTotal: total,
      queryPages: pages,
      queryOffset: offset,
      queryPageSize: pageConfig.pageSize,
      data: users,
      state: "ok",
    };
    console.log(result);
    res.send(result);
  } catch (error) {
    res.send({ state: "error" });
  }
};
