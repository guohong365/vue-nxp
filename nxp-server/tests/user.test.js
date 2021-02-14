const UserMapper = require("../persistence/UserMapper");

let mapper = new UserMapper({ sql: true });

afterAll(() => {
  mapper.destroy();
});

test("user mapper select by id", async () => {
  let data = await mapper.selectById(1);
  console.log(data);
  expect(data[0].id).toBe(1);
});

/*
test("select Optimized", async () => {
  for (let i = 0; i < 3; i++) {
    let data = await mapper.selectOptimized(
      { org: 1, queryOrderBy: ["org", { column: "name", order: "desc" }] },
      3,
      i * 3
    );
    expect(data.length).toBe(3);
    console.log(data);
  }
});
*/

test("select by uuid", async () => {
  let data = await mapper.selectByUuid("admin");
  expect(data[0].id).toBe(1);
});
