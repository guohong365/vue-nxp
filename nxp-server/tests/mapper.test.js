const Mapper = require("../persistence/Mapper");

let mapper = new Mapper("t4_user", { sql: true, data: true });

afterAll(() => {
  return new Promise((done) => {
    mapper.destroy();
    done();
  });
});

test("select by example", async () => {
  const data = await mapper.selectByExample({ loginId: "admin" });
  console.log(data);
  expect.anything();
  expect(data.length).toBeGreaterThanOrEqual(0);
});

test("select by id", async () => {
  const data = await mapper.selectById(1);
  console.log(data);
  expect(data[0].id).toBe(1);
});

test("update by id", async () => {
  let data = await mapper.selectById(1);
  console.log(data[0]);
  data[0].description = "系统管理员 1";
  const updated = await mapper.update(data[0]);
  console.log(updated);
  expect(updated).toBe(1);
  data = await mapper.selectById(1);
  console.log(data[0]);
  expect(data[0].description).toBe("系统管理员 1");
});

test("select count optimized", async () => {
  try {
    let data = await mapper.selectCountOptimized({});
    console.log(data);
    expect(data[0].count).toBeGreaterThan(1);
  } catch (error) {
    console.log(error);
  }
});

test("select by example use nick name", async () => {
  let data = await mapper.selectByExample({ loginId: "admin" });
  expect(data.length).toBe(1);
  expect(data[0].loginId).toBe("admin");
});

test("select by id with callback", () => {
  return mapper.selectById(1, (results, error) => {
    console.log(results);
    expect(results.length).toBe(1);
    expect(results[0].loginId).toBe("admin");
    if (results) {
      console.log("CALLBACK: %o", results[0]);
    } else if (error) {
      console.log("CALLBAK:%o", error);
    }
  });
});

test("select count with callback", () => {
  return mapper.selectCountOptimized({}, (results, error) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].count).toBeGreaterThan(1);
    if (results) {
      console.log("CALLBACK: %o", results[0]);
    } else if (error) {
      console.log("CALLBAK:%o", error);
    }
  });
});

describe("test for insert", () => {
  beforeEach(() => {
    mapper.deleteByExample({ loginId: "abcd" }, (data, error) => {
      if (data) console.log("abcd user was deleted.");
      else if (error) console.log(`deleting was error:${error}`);
    });
  });

  test("insert user", async () => {
    let user = {
      loginId: "abcd",
      PASSWORD: "1111",
      name: "test user",
      TELE: "12345678",
      ORG: 1,
      CREATOR: 1,
      EMAIL: "abc@system.com",
      CreateTime: new Date(),
      DESCRIPTION: "备注",
    };
    try {
      let data = await mapper.insert(user);
      console.log(data);
      expect(data[0]).toBeGreaterThan(0);
      data = await mapper.selectById(data[0]);
      console.log(data[0]);
      data = await mapper.deleteById(data[0].id);
      console.log(data);
    } catch (error) {
      console.log("ERROR:%o", error);
    }
  });
});
