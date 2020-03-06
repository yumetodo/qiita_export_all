// eslint-disable-next-line node/no-unsupported-features
import test from "ava";
const nock = require("nock");
const path = require("path");
const QiitaApi = require("../bin/qiita");
const Item = require("../bin/item.js");

/**
 * @param {nock.Scope} scope
 */
const registerItemMockImpl = scope => {
  for (let i = 1; i <= 6; ++i) {
    scope
      .get("/api/v2/users/yumetodo/items")
      .query(q => "page" in q && q.page === `${i}`)
      .replyWithFile(200, path.join(__dirname, `items${i}.json`), {
        "content-type": "application/json; charset=utf-8",
        link:
          '<https://qiita.com/api/v2/users/yumetodo/items?page=1>; rel="first", ' +
          (i === 1 ? "" : `<https://qiita.com/api/v2/users/yumetodo/items?page=${i - 1}>; rel="prev", `) +
          (i === 6 ? "" : `<https://qiita.com/api/v2/users/yumetodo/items?page=${i + 1}>; rel="next", `) +
          '<https://qiita.com/api/v2/users/yumetodo/items?page=6>; rel="last"',
        "rate-limit": 1000,
        "rate-remaining": 1000,
      });
  }
  return scope;
};
test("item", async t => {
  const mock = nock("https://qiita.com");
  registerItemMockImpl(mock);
  const qiita = new QiitaApi("xxx");
  const rawItems = await qiita.GetAllUserItems("yumetodo");
  const ids = ["48d77f5d554df84f66f7", "bd41f31f39dd590e8c80"];
  const items = rawItems.map(i => new Item(i)).filter(i => ids.includes(i.id));
  t.true(items.length === ids.length);
});
