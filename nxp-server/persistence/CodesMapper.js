const dbConnection = require("../config/dbConnection");

class CodesMapper {
  constructor() {
    this.db = dbConnection;
  }
  codeColumns() {
    return ["code", "value", "valid"];
  }
  async selectCode(codeTable, queryAll) {
    let query = this.db.select(this.codeColumns()).from(codeTable);
    if (!queryAll) query.where("valid", true);
    query.orderBy("code");
    return await query;
  }

  selectAreasForReport() {
    this.db
      .select(this.db.ref("a.ID").as("CODE"), this.db.ref("a.PARENT").as("PARENT"), this.db.ref("a.NAME").as("VALUE"))
      .from({ a: "t4_c_area" })
      .where("a.valid", true)
      .whereNotExists("select 1 from t4_c_area where PARENT = a.ID")
      .whereNotNull("a.PARENT");
  }
  selectOrgTreeCodes() {
    this.db
      .select(
        this.db.ref("ID").as("CODE"),
        this.db.ref("PARENT").as("PARENT"),
        this.db.ref("NAME").as("VALUE"),
        "VALID",
        "TYPE",
        "CITY",
        "AREA",
        "PREFIX"
      )
      .from("t4_org")
      .orderBy("PARENT", "CODE");
  }
  selectAreaTreeCodes() {
    this.db
      .select(this.db.ref("id").as("code"), "PARENT", "VALUE", "VALID", "TYPE", "LEVEL")
      .from("t4_c_area")
      .orderBy("PARENT", "CODE");
  }
  selectCities(isAll, withProvince) {
    this.db
      .select(this.db.ref("id").as("code"), "VALUE", "VALID")
      .from("t4_c_area")
      .where((builder) => {
        if (!isAll) builder.where("valid", true);
        builder.where(() => {
          this.where("type", "city");
          if (withProvince) {
            this.orWhere("type", "PROVINCE");
          }
        });
      })
      .orderBy("PARENT", "CODE");
  }

  selectAreaCodesByIds(ids, isAll) {
    this.db
      .select(this.db.ref("id").as("code"), "VALUE", "VALID")
      .from("t4_c_area")
      .where((builder) => {
        if (ids.length > 0) {
          builder.whereIn(ids);
          if (!isAll) {
            builder.where("valid", true);
          }
        }
      });
  }

  selectEmployee(siteId, isAll) {
    this.db
      .select(
        this.db.ref("id").as("code"),
        this.db.ref("name").as("VALUE"),
        this.db.raw("(LEAVE_DATE is NULL) as VALID")
      )
      .from("t4_employee")
      .where((builder) => {
        builder.where("site", siteId);
        if (!isAll) builder.whereNull("LEAVE_DATE");
      })
      .orderBy("NAME");
  }
  selectReportYears(tableName) {
    this.db
      .select(this.db.ref("year").as("code"), this.db.ref("year").as("value"), this.db.raw("true as valid"))
      .distinct()
      .from(tableName)
      .orderBy("year");
  }
  selectReportMonths(tableName, year) {
    this.db
      .select(this.db.ref("MONTH").as("CODE"), this.db.ref("MONTH").as("VALUE"), this.db.raw("true as VALID"))
      .distinct()
      .from(tableName)
      .where((builder) => {
        if (year) {
          builder.where("year", year);
        }
      })
      .orderBy("MONTH");
  }
  selectReportQuarters(tableName, year) {
    this.db
      .select(this.db.ref("QUARTER").as("CODE"), this.db.ref("QUARTER").as("Value"), this.db.raw("true as VALID"))
      .from(tableName)
      .where((builder) => {
        if (year) {
          builder.where("year", year);
        }
      })
      .orderBy("QUARTER");
  }
  selectClassifyCode(codeName, classify, isAll) {
    this.db
      .select("CODE", "CLASSIFY", "VALUE", "VALID")
      .from(codeName)
      .where((builder) => {
        if (!isAll) {
          builder.where("valid", true);
        }
        if (classify) {
          builder.where("classify", classify);
        }
      })
      .orderBy("CODE");
  }

  selectCombinedCategory(isAll) {
    this.db
      .select(
        this.db.ref("a.ID").as("CODE"),
        this.db.raw("concat_ws(' ', a.NAME, b.VALUE, c.VALUE) as VALUE"),
        this.raw("true as VALID")
      )
      .from({ a: "t4_category" })
      .leftJoin({ b: "t4_c_model" }, "b.CODE", "a.MODEL")
      .leftJoin({ c: "t4_c_specification" }, "c.CODE", "a.SPECIFICATION")
      .where((builder) => {
        builder.where("a.NAME", "注射器");
        if (!isAll) builder.andWhere("a.valid", true);
      });
  }
  selectManufacturer(isAll) {
    this.db
      .select("a.CODE", "a.VALUE", "a.VALID")
      .from({ a: "t4_c_manufacturer" })
      .where((builder) => {
        if (!isAll) builder.where("a.valid", true);
      })
      .orderBy("a.sort");
  }
}

module.exports = CodesMapper;
