var express = require("express");
var router = express.Router();
var user_contoller = require("../controller/userController");
/* GET users listing. */
router.get("/", user_contoller.list);

module.exports = router;
