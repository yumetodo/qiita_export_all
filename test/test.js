// eslint-disable-next-line node/no-unsupported-features
import test from "ava";
const nock = require("nock");
const path = require("path");
const QiitaApi = require("../bin/qiita");
const Item = require("../bin/item.js");
const ImageManager = require("../bin/image-manager.js");

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
  t.is(items.length, ids.length);
});
test("image register", async t => {
  const mock = nock("https://qiita.com");
  registerItemMockImpl(mock);
  const qiita = new QiitaApi("xxx");
  const rawItems = await qiita.GetAllUserItems("yumetodo");
  const item = rawItems.map(i => new Item(i)).filter(i => i.id === "bd41f31f39dd590e8c80")[0];
  const imageManager = new ImageManager("img");
  item.RegisterImagesToImageManager(imageManager, true);
  // imageManager.imageListMap
  t.true("bd41f31f39dd590e8c80" in imageManager.imageListMap);
  t.true("item" in imageManager.imageListMap.bd41f31f39dd590e8c80);
  /** @type {Set<string>} */
  const imageList = imageManager.imageListMap.bd41f31f39dd590e8c80.item;
  const expectedList = new Set([
    /* eslint-disable max-len */
    "https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.amazonaws.com%2F0%2F94177%2F7cc6d1de-3a09-b7d5-5ed4-8209007eb39f.png",
    "https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.amazonaws.com%2F0%2F94177%2F523b8224-a8f8-280b-f5b6-8cb6ae0ec473.png",
    /* eslint-enable max-len */
  ]);
  for (const actualRaw of imageList) {
    const actual = new URL(actualRaw);
    actual.search = "";
    t.true(expectedList.has(actual.href), `actual: ${actual.href}`);
  }
});
