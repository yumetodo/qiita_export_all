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

const token = process.env.QIITA_ACCESS_TOKEN;
const imagePathBase = "img";
const itemPathBase = "items";
const relativeCommentPath = "comments";
const relativePathFromItemFileToRootDirectory = "../../";
const relativePathFromCommentFileToRootDirectory = "../../../.../";

/**
 * @param {string|undefined} userId
 * @param {string|undefined} output
 */
const main = async (userId, output) => {
  const imagePath = output == null ? imagePathBase : path.join(output, imagePathBase);
  const itemPath = output == null ? itemPathBase : path.join(output, itemPathBase);
  console.log("info: Requesting items...");
  const qiita = new QiitaApi(token, true);
  const rawItems = await (userId == null ? qiita.GetAllAuthenticatedUserItems() : qiita.GetAllUserItems(userId));
  const items = rawItems.map(i => new Item(i));
  console.log(`info: ${items.length} items found.`);

  console.log("info: creating image save directory...");
  await mkdirp(imagePath);
  console.log("info: created.");
  const imageManager = new ImageManager(imagePath);
  console.log("info: Requesting comments/images...");
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
  console.log("info: Request finidhed.");

  console.log("info: Replacing Image path...");
  for (const i of items)
    i.ResolveImagePath(
      imageManager,
      relativePathFromItemFileToRootDirectory,
      relativePathFromCommentFileToRootDirectory
    );
  console.log("info: Replace finished.");

  console.log("info: Writing items/comments...");
  await Promise.all(items.map(i => i.WriteFiles(itemPath, relativeCommentPath)));
  console.log("write finished.");
};

if (token == null) {
  console.error("Fail to find QIITA_ACCESS_TOKEN env");
} else {
  program
    .version("1.3.1")
    .option("-u, --user-id <id>", "user id")
    .option("-o, --output <file>", "Write output to <file> instead of current directory.")
    .parse(process.argv);
  main(program.userId, program.output).catch(er => {
    console.error(er.stack, er);
  });
}
