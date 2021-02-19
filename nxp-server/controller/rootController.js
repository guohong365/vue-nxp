const redis = require("redis");
const jwt = require("jsonwebtoken");
const UserMapper = require("../persistence/UserMapper");
const redisConfig = require("../config/redis.config");
const secret = "secret";
const userMapper = new UserMapper();
const redisClient = redis.createClient(redisConfig);

exports.login = async function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  try {
    let users = await userMapper.selectByExample({ loginId: username, password: password });
    if (users && users.lenght == 1 && users[0].loginId === username) {
      let user = users[0];
      let adminFlag = user.adminFlag;
      let token = jwt.sign({ username: username, admin: adminFlag }, secret, { algorithm: "RS256", expiresIn: "30s" });
      let menuItems = await userMapper.selectUserMenuItems(user.id);
      redisClient.lpush(user.loginId, user);
      res.send({
        user: user,
        menuItems: menuItems,
        status: "ok",
        token: token,
        msg: "",
      });
      return;
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: "error",
      msg: "system error:" + error,
    });
    return;
  }
  res.send({
    status: "faild",
    msg: "用户名或密码错误",
  });
};

exports.logout = function (req, res) {
  redisClient.mget("users");
};
