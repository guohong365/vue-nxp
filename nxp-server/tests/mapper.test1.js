const Mapper = require("../persistence/mapper");
/*
function callback(results) {
  for (const key in results) {
    console.log(`in callback: ${key}=[${results[key]}]`);
  }
}
*/
let mapper = new Mapper("t4_user", { sql: true, data: true });

afterAll(() => {
  return new Promise((done) => {
    mapper.destroy();
    done();
  });
});

test("select by example", async () => {
  const data = await mapper.selectByExample({ LOGIN_ID: "abcd" });
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
  data[0].description = "系统管理员";
  const updated = await mapper.update(data[0]);
  console.log(updated);
  expect(updated).toBe(1);
  data = await mapper.selectById(1);
  console.log(data[0]);
  expect(data[0].description).toBe("系统管理员");
});

describe("test for insert", () => {
  beforeEach(() => {
    mapper.deleteById({ loginId: "abcd" }, (data, error) => {
      if (data) console.log("abcd user was deleted.");
      else if (error) console.log(`deleting was error:${error}`);
    });
  });

  test("insert user", async () => {
    let user = {
      LOGIN_ID: "abcd",
      PASSWORD: "1111",
      NAME: "test user",
      TELE: "12345678",
      EMAIL: "abc@system.com",
      adminFlag: false,
      ORG: 1,
      CreateTime: new Date(),
      CREATOR: 2,
      DESCRIPTION: "备注",
    };
    let data = await mapper.insert(user);
    console.log(data);
    expect(data[0]).toBeGreaterThan(0);
    data = await mapper.selectById(data[0]);
    console.log(data[0]);
    data = await mapper.deleteById(data[0].id);
    console.log(data);
  });
});
