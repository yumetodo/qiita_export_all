#!/usr/bin/env node

"use strict";

const path = require("path");
const mkdirp = require("mkdirp");
const program = require("commander");
const QiitaApi = require("./qiita");
const Item = require("./item.js");
// eslint-disable-next-line no-unused-vars
const Comment = require("./comment.js");
const ImageManager = require("./image-manager.js");
const p = require('../package.json');

const token = process.env.QIITA_ACCESS_TOKEN;
const imagePathBase = "img";
const itemPathBase = "items";
const relativeCommentPath = "comments";
const relativePathFromItemFileToRootDirectory = "../../";
const relativePathFromCommentFileToRootDirectory = "../../../.../";

/**
 * @param {string|undefined} userId
 * @param {string|undefined} output
 * @param {boolean} debug
 */
const main = async (userId, output, debug = true) => {
  const imagePath = output == null ? imagePathBase : path.join(output, imagePathBase);
  const itemPath = output == null ? itemPathBase : path.join(output, itemPathBase);
  console.log("info: Requesting items...");
  const qiita = new QiitaApi(token, debug);
  const rawItems = await (userId == null ? qiita.GetAllAuthenticatedUserItems() : qiita.GetAllUserItems(userId));
  const items = rawItems.map(i => new Item(i));
  console.log(`\ninfo: ${items.length} items found.`);

  console.log("\ninfo: creating image save directory...");
  await mkdirp(imagePath);
  console.log("info: created.");
  const imageManager = new ImageManager(imagePath);
  console.log("\ninfo: Requesting comments/images...");
  for (const i of items) {
    // eslint-disable-next-line no-await-in-loop
    await i.FetchComments(qiita).catch(er => {
      throw er;
    });
    i.RegisterImagesToImageManager(imageManager);
  }
  await imageManager.WaitImageCachePromise().catch(er => {
    throw er;
  });
  console.log(
    `\ninfo: request limit remain: ${qiita.requestRemain}/${qiita.requestLimit}` + "\ninfo: Request finidhed."
  );

  console.log("\ninfo: Replacing Image path...");
  for (const i of items)
    i.ResolveImagePath(
      imageManager,
      relativePathFromItemFileToRootDirectory,
      relativePathFromCommentFileToRootDirectory
    );
  console.log("info: Replace finished.");

  console.log("\ninfo: Writing items/comments...");
  await Promise.all(items.map(i => i.WriteFiles(itemPath, relativeCommentPath)));
  console.log("write finished.");
};

if (token == null) {
  console.error("Fail to find QIITA_ACCESS_TOKEN env");
} else {
  program
    .version(p.version)
    .name("qiita_export_all")
    .option("-u, --user-id <id>", "Qiita user id you want to download(default: the user who get QIITA_ACCESS_TOKEN).")
    .option("-o, --output <path>", "Write output to <path> instead of current directory.")
    .option("--no-debug", "disable print api limit per request")
    .parse(process.argv);
  const opts = program.opts();
  main(opts.userId, opts.output, opts.debug).catch(er => {
    console.error(er.stack, er);
  });
}
