#!/usr/bin/env node

"use strict";

const QiitaApi = require("./qiita");
const Item = require("./item.js");
//eslint-disable-next-line no-unused-vars
const Comment = require("./comment.js");
const ImageManager = require("./image-manager.js");

// const token = process.env.QIITA_ACCESS_TOKEN;
const token = "9226168a5ef65f8e81153b460e7c78f8b8e53399";
const imageDirectoryPath = "img";
const rootItemPath = "items";
const relativeCommentPath = "comments";
const relativePathFromItemFileToRootDirectory = "../../";
const relativePathFromCommentFileToRootDirectory = "../../../.../";

const main = async () => {
    console.log("info: Requesting items...");
    const qiita = new QiitaApi(token, true);
    const items = await qiita.GetAllAuthenticatedUserItems().then(rawItems => rawItems.map(i => new Item(i)));
    console.log(`info: ${items.length} items found.`);

    console.log("info: Requesting comments...");
    for(const i of items) await i.FetchComments(qiita);
    console.log("info: Request finidhed.");

    const imageManager = new ImageManager(imageDirectoryPath);
    console.log("info: Requesting images...");
    for(const i of items) i.RegisterImagesToImageManager(imageManager);
    await imageManager.WaitImageCachePromise();
    console.log("info: Request finidhed.");

    console.log("info: Replacing Image path...");
    for(const i of items) i.ResolveImagePath(
        imageManager,
        relativePathFromItemFileToRootDirectory,
        relativePathFromCommentFileToRootDirectory
    );
    console.log("info: Replace finished.");

    console.log("info: Writing items/comments...");
    for(const i of items) await i.WriteFiles(rootItemPath, relativeCommentPath);
    console.log("write finished.");
};

main();
