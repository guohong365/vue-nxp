module.exports = {
  id: { type: Number, required: false, default: 0 },
  login_id: { type: String, required: true }, //用户登录名，唯一
  password: { type: String, required: true, default: "" }, //密码，MD5
  name: { type: String, required: false, default: "" }, //用户中文姓名
  tele: { type: String, required: false }, //电话
  email: { type: String, required: false }, //电子邮件
  admin_flag: { type: Boolean, required: true, default: false }, //管理员标识，拥有该标识的用户将默认拥有admin角色
  org: { type: Number, required: true, default: 0 }, //所属机构
  create_time: { type: Date, required: false, default: null }, //创建时间
  creator: { type: Number, required: false, default: 0 }, //创建人
  cancel_time: { type: Date, required: false, default: null }, //注销时间
  canceler: { type: Number, required: false, default: null }, //注销人
  description: { type: Number, required: false, default: null }, //备注
};
