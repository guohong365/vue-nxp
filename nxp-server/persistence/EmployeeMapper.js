const Mapper = require("./mapper");

class EmployeeMapper extends Mapper {
  constructor(debug) {
    super("t4_employee", debug);
  }

  columns() {
    return [
      "a.ID AS ID",
      "a.NAME AS NAME",
      "a.SEX AS SEX",
      "a.ADDRESS AS ADDRESS",
      "a.EMAIL AS EMAIL",
      "a.TELE AS TELE",
      "a.DUTY AS DUTY",
      "a.JOIN_DATE AS JOIN_DATE",
      "a.LEAVE_DATE AS LEAVE_DATE",
      "a.RECV_MST_CURE AS RECV_MST_CURE",
      "a.MST_CURE_BEGIN_DATE AS MST_CURE_BEGIN_DATE",
      "a.MST_CURE_END_DATE AS MST_CURE_END_DATE",
      "a.INPUTER AS INPUTER",
      "a.INPUT_TIME AS INPUT_TIME",
      "a.MODIFIER AS MODIFIER",
      "a.MODIFY_TIME AS MODIFY_TIME",
      "c.VALUE AS CITY_NAME",
      "d.VALUE AS AREA_NAME",
      "e.VALUE AS DUTY_NAME",
      "f.NAME AS INPUTER_NAME",
      "g.NAME AS MODIFIER_NAME",
      "b.NAME AS SITE_NAME",
    ];
  }
  updatableColumnsSet() {
    return new Set([
      "SITE",
      "NAME",
      "SEX",
      "ADDRESS",
      "EMAIL",
      "TELE",
      "DUTY",
      "JOIN_DATE",
      "LEAVE_DATE",
      "RECV_MST_CURE",
      "MST_CURE_BEGIN_DATE",
      "MST_CURE_END_DATE",
      "MODIFIER",
      "MODIFY_TIME",
    ]);
  }
  insertColumns() {
    return [
      "UUID",
      "SITE",
      "NAME",
      "SEX",
      "ADDRESS",
      "EMAIL",
      "TELE",
      "DUTY",
      "JOIN_DATE",
      "LEAVE_DATE",
      "RECV_MST_CURE",
      "MST_CURE_BEGIN_DATE",
      "MST_CURE_END_DATE",
      "INPUTER",
    ];
  }
  tableAlias() {
    return { a: this.table };
  }

  buildJoins(builder, queryForm) {
    builder
      .leftJoin({ b: "t4_org" }, () => {
        this.on("b.ID", "=", "a.SITE");
        if (queryForm && queryForm.siteLimits && queryForm.siteLimits.length) {
          this.onIn("b.id", queryForm.siteLimits);
        }
      })
      .leftJoin({ c: "t4_c_area" }, "c.ID", "b.CITY")
      .leftJoin({ d: "t4_c_area" }, "d.ID", "b.AREA")
      .leftJoin({ e: "t4_c_duty" }, "e.CODE", "a.DUTY")
      .leftJoin({ f: "t4_user" }, "f.ID", "a.INPUTER")
      .leftJoin({ g: "t4_user" }, "g.ID", "a.MODIFIER");
  }
  buildOptimizedWhere(builder, queryForm) {
    if (queryForm) {
      builder.whereNotNull("b.id");
      if (queryForm.querySite) {
        builder.where("a.site", queryForm.querySite);
      } else {
        if (queryForm.queryCity) {
          builder.where("c.id", queryForm.queryCity);
        }
        if (queryForm.queryArea) {
          builder.where("d.id", queryForm.queryArea);
        }
      }
      if (queryForm.qeuryDuty) {
        builder.where("a.DUTY", queryForm.queryDuty);
      }
      if (queryForm.queryJoinDateFrom) {
        builder.where("a.JOIN_DATE", ">=", queryForm.queryJoinDateFrom);
      }
      if (queryForm.queryLeaveDateTo) {
        builder.where("a.LEAVE_DATE", "<=", queryForm.queryLeaveDateTo);
      }
      if (queryForm.queryJoinDateTo) {
        builder.where("a.JOIN_DATE", "<=", queryForm.queryJoinDateTo);
      }
      if (queryForm.queryLeaveDateFrom) {
        builder.where("a.LEAVE_DATE", ">=", queryForm.queryLeaveDateFrom);
      }
      if (!queryForm.queryAll) {
        builder.whereNull("a.LEAVE_DATE");
      }
      if (queryForm.queryName) {
        builder.where("a.NAME", "like", `%${queryForm.queryName}%`);
      }
    }
  }
}
module.exports = EmployeeMapper;
