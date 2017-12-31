"use strict";

const ItemBase = require("./item-base.js");
//eslint-disable-next-line no-unused-vars
const ImageManager = require("./image-manager.js");
const fse = require("fs-extra");
const path = require("path");
const sanitize = require("sanitize-filename");

class Comment extends ItemBase {
    constructor(obj) {
        super(obj);
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
        const commentPath = path.normalize(sanitize(`${rootCommentPath}/${this.created_at}`));
        const info = Object.freeze({
            "created_at": this.created_at,
            "id": this.id,
            "updated_at": this.updated_at
        });
        await Promise.all([
            fse.writeFile(path.normalize(`${commentPath}/index.html`), this.html),
            fse.writeFile(path.normalize(`${commentPath}/README.md`), this.markdown),
            fse.writeFile(path.normalize(`${commentPath}/info.json`), JSON.stringify(info))
        ]);
    }
}

module.exports = Comment;