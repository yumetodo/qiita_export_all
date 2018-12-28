#!/usr/bin/env node

"use strict";

const mkdirp = require("mkdirp-promise");

const QiitaApi = require("./qiita");
const Item = require("./item.js");
//eslint-disable-next-line no-unused-vars
const Comment = require("./comment.js");
const ImageManager = require("./image-manager.js");

const token = process.env.QIITA_ACCESS_TOKEN;
const imageDirectoryPath = "img";
const rootItemPath = "items";
const relativeCommentPath = "comments";
const relativePathFromItemFileToRootDirectory = "../../";
const relativePathFromCommentFileToRootDirectory = "../../../.../";

const main = async () => {
    console.log("info: Requesting items...");
    const qiita = new QiitaApi(token, true);
    const items = await qiita.GetAllAuthenticatedUserItems()
        .then(rawItems => rawItems.map(i => new Item(i)))
        .catch(er => {throw er});
    console.log(`info: ${items.length} items found.`);

    console.log("info: creating image save directory...");
    await mkdirp(imageDirectoryPath).catch(er => {throw er});
    console.log("info: created.");
    const imageManager = new ImageManager(imageDirectoryPath);
    console.log("info: Requesting comments/images...");
    for(const i of items) {
        await i.FetchComments(qiita).catch(er => {throw er});
        i.RegisterImagesToImageManager(imageManager);
    }
    await imageManager.WaitImageCachePromise().catch(er => {throw er});
    console.log("info: Request finidhed.");

    console.log("info: Replacing Image path...");
    for(const i of items) i.ResolveImagePath(
        imageManager,
        relativePathFromItemFileToRootDirectory,
        relativePathFromCommentFileToRootDirectory
    );
    console.log("info: Replace finished.");

    console.log("info: Writing items/comments...");
    for(const i of items) await i.WriteFiles(rootItemPath, relativeCommentPath).catch(er => {throw er});
    console.log("write finished.");
};

if(null == token){
    console.error("Fail to find QIITA_ACCESS_TOKEN env");
} else {
    main().catch(er => {
        console.error(er.stack, er);
    });
}
