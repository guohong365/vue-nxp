class User {
  constructor(loginId, password) {
    this.id = 0;
    this.loginId = loginId; //用户登录名，唯一
    this.password = password; //密码，MD5
    this.name = ""; //用户中文姓名
    this.tele = null; //电话
    this.email = null; //电子邮件
    this.adminFlag = false; //管理员标识，拥有该标识的用户将默认拥有admin角色
    this.org = 0; //所属机构
    this.createTime = new Date(); //创建时间
    this.creator = 0; //创建人
    this.cancelTime = null; //注销时间
    this.canceler = null; //注销人
    this.description = null; //备注
  }
}
module.exports = User;
