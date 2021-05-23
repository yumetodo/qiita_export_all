"use strict";

const ItemBase = require("./item-base.js");
const Comment = require("./comment.js");
// eslint-disable-next-line no-unused-vars
const QiitaApi = require("./qiita");
// eslint-disable-next-line no-unused-vars
const ImageManager = require("./image-manager.js");
const fs = require("fs").promises;
const path = require("path");
const sanitize = require("sanitize-filename");
const mkdirp = require("mkdirp");

class Item extends ItemBase {
  constructor(obj) {
    super(obj);
    /** @type {string} */
    this.title = obj.title;
    /** @type {string[]} */
    this.tags = obj.tags.map(t => t.name);
    /** @type {Comment[]} */
    this.comments = [];
    /** @type {number} */
    this.comments_count_ = obj.comments_count;
  }

  /**
   * fetch comment data
   * @param {QiitaApi} qiitaApi api wrapper class
   */
  async FetchComments(qiitaApi) {
    if (this.comments_count_ > 0) {
      const comments = await qiitaApi.GetAllComments(this.id);
      this.comments = comments.map(c => new Comment(c));
    }
  }

  /**
   * Extract and register image to image manager
   * @param {ImageManager} imageManager image manager
   * @param {boolean} [isDryRun=false] When this flag is true, image get request will not be occured.
   */
  RegisterImagesToImageManager(imageManager, isDryRun = false) {
    imageManager.RegisterImagesFromItemHtml(this.id, this.html, isDryRun);
    for (const comment of this.comments) comment.RegisterImagesToImageManager(imageManager, this.id, isDryRun);
  }

  /**
   * Resolve image path
   * @param {ImageManager} imageManager image manager
   * @param {string} relativeItemFilePath relaive path from  item file to workroot directory
   * @param {string} relativeCommentFilePath relative path from comment file to workroot directory
   */
  ResolveImagePath(imageManager, relativeItemFilePath, relativeCommentFilePath) {
    this.html = imageManager.ResolveItemImagePath(relativeItemFilePath, this.id, this.html);
    this.markdown = imageManager.ResolveItemImagePath(relativeItemFilePath, this.id, this.markdown);
    for (const comment of this.comments) comment.ResolvePath(imageManager, relativeCommentFilePath, this.id);
  }

  /**
   * write item/comment data to markdown/html file
   * @param {string} rootItemPath root path of item
   * @param {string} relativeCommentPath relative path from item path(not root path of item) to comment root path
   */
  async WriteFiles(rootItemPath, relativeCommentPath) {
    const itemPath = path.join(rootItemPath, sanitize(this.title));
    await mkdirp(itemPath);
    const info = Object.freeze({
      created_at: this.created_at,
      id: this.id,
      updated_at: this.updated_at,
      title: this.title,
      tags: this.tags,
    });
    const promise = [
      fs.writeFile(path.join(itemPath, "index.html"), this.html),
      fs.writeFile(path.join(itemPath, "README.md"), this.markdown),
      fs.writeFile(path.join(itemPath, "info.json"), JSON.stringify(info)),
    ];
    for (const comment of this.comments) promise.push(comment.WriteFiles(path.join(itemPath, relativeCommentPath)));
    await Promise.all(promise);
  }
}

module.exports = Item;
