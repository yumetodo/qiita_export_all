"use strict";

const ItemBase = require("./item-base.js");
//eslint-disable-next-line no-unused-vars
const ImageManager = require("./image-manager.js");
const fse = require("fs-extra");
const path = require("path");
const sanitize = require("sanitize-filename");
const mkdirp = require("mkdirp-promise");

class Comment extends ItemBase {
    constructor(obj) {
        super(obj);
        /**@type {string} user id*/
        this.user = obj.user.id;
    }
    /**
     * Extract and register image to image manager
     * @param {ImageManager} imageManager image manager
     * @param {string} itemId item id
     */
    RegisterImagesToImageManager(imageManager, itemId) {
        imageManager.RegisterImagesFromCommentHtml(itemId, this.id, this.html);
    }
    /**
     * Resolve image path
     * @param {ImageManager} imageManager image manager
     * @param {string} relativeFilePath relaive path from comment file to workroot directory
     * @param {string} itemId item id
     */
    ResolvePath(imageManager, relativeFilePath, itemId) {
        this.html = imageManager.ResolveCommentImagePath(relativeFilePath, itemId, this.id, this.html);
        this.markdown = imageManager.ResolveCommentImagePath(relativeFilePath, itemId, this.id, this.markdown);
    }
    /**
     * write comment data to markdown/html file
     * @param {string} rootCommentPath root path of comment
     */
    async WriteFiles(rootCommentPath){
        const commentPath = path.join(rootCommentPath, sanitize(this.created_at));
        await mkdirp(commentPath);
        const info = Object.freeze({
            "created_at": this.created_at,
            "id": this.id,
            "updated_at": this.updated_at,
            "user": this.user
        });
        await Promise.all([
            fse.writeFile(path.join(commentPath, "index.html"), this.html),
            fse.writeFile(path.join(commentPath, "README.md"), this.markdown),
            fse.writeFile(path.join(commentPath, "info.json"), JSON.stringify(info))
        ]);
    }
}

module.exports = Comment;