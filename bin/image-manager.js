"use strict";

const request = require("gaxios").request;
const fs = require("fs");
const util = require("util");
const stream = require("stream");
const pipeline = util.promisify(stream.pipeline);
const path = require("path");
const mime = require("mime/lite");
const isURI = require("validate.io-uri");

const identifierForItem = "item";

class ImageManager {
  /**
   *
   * @param {string} imageDirectoryPathFromRootDirectry image directory path from root directory
   */
  constructor(imageDirectoryPathFromRootDirectry) {
    this.imagePathMap_ = {};
    /** @type {Promise<void>[]} */
    this.imageCachePromise_ = [];
    this.registerdImageURLs_ = new Set();
    this.imageListMap = {};
    this.imageDirectoryPath = imageDirectoryPathFromRootDirectry;
    this.imageNumber = 0;
  }

  /**
   * wait all registered image download
   */
  async WaitImageCachePromise() {
    await Promise.all(this.imageCachePromise_);
  }

  /**
   * convert image url to saved relative image path from current directory
   * @param {string} imageUrl image url to download and cache
   * @param {string} ext file extension
   */
  ConvertImgUrlToImgPath_(imageUrl, ext) {
    const re = this.imageNumber;
    this.imageNumber += 1;
    return path.normalize(`${this.imageDirectoryPath}/${re}_${imageUrl.charAt(imageUrl.length - 1)}.${ext}`);
  }

  /**
   * notify to cache image
   * @param {string} imageUrl image url to download and cache
   * @param {string} from used for error handling display info
   */
  NotifyCacheImage_(imageUrl, from) {
    if (this.registerdImageURLs_.has(imageUrl)) return;
    this.registerdImageURLs_.add(imageUrl);
    /**
     * @param {string} url
     * @returns {Promise<void>}
     */
    const impl = async url => {
      /** @type {ReadableStream<Uint8Array> | NodeJS.ReadableStream} */
      let input;
      /** @type {string} */
      let contentType;
      try {
        const re = await request({
          url: url,
          retryConfig: {
            retry: 4,
            retryDelay: 1000,
          },
          retry: true,
          responseType: "stream",
        });
        contentType = re.headers["Content-Type"];
        input = re.data;
      } catch (er) {
        console.error(`When fetch ${imageUrl} (${from}), ${er}`);
        this.imagePathMap_[imageUrl] = imageUrl;
        return;
      }
      const imagePath = this.ConvertImgUrlToImgPath_(imageUrl, mime.getExtension(contentType) || "tmp");
      await pipeline(input, fs.createWriteStream(imagePath));
      this.imagePathMap_[imageUrl] = imagePath;
    };
    this.imageCachePromise_.push(impl(imageUrl));
  }

  /**
   * Extract Images from HTML string and register to cache
   * @param {string} itemId item id
   * @param {string} identifier identifier
   * @param {string} htmlStr HTML string
   */
  RegisterImagesFromHtml_(itemId, identifier, htmlStr) {
    const imageUrlMaatches = htmlStr.match(/img[^>]* src="[^"]+"/g);
    if (imageUrlMaatches == null) return;
    const imageUrls = imageUrlMaatches.map(m => m.match(/img[^>]* src="([^"]+)"/)[1]);
    if (imageUrls.length === 0) return;
    // create empty object to avoid to read undefined propaty
    if (this.imageListMap[itemId] == null) this.imageListMap[itemId] = {};
    /** @type {Set<string>} */
    const imageList = this.imageListMap[itemId][identifier] || new Set();
    for (const imageUrl of imageUrls) {
      if (imageUrl == null || !isURI(imageUrl)) continue;
      this.NotifyCacheImage_(imageUrl, `${itemId}/${identifier}`);
      imageList.add(imageUrl);
    }
    if (imageList.size !== 0) this.imageListMap[itemId][identifier] = imageList;
  }

  /**
   * Extract Images from HTML string and register to cache
   * @param {string} itemId item id
   * @param {string} htmlStr HTML string
   */
  RegisterImagesFromItemHtml(itemId, htmlStr) {
    this.RegisterImagesFromHtml_(itemId, identifierForItem, htmlStr);
  }

  /**
   * Extract Images from HTML string and register to cache
   * @param {string} itemId item id
   * @param {string} commentId comment id
   * @param {string} htmlStr HTML string
   */
  RegisterImagesFromCommentHtml(itemId, commentId, htmlStr) {
    this.RegisterImagesFromHtml_(itemId, commentId, htmlStr);
  }

  /**
   * Replace URL to image path
   * @param {string} relativeFilePath target file relaive path from workroot directory
   * @param {string} itemId item id
   * @param {string} identifier identifier
   * @param {string} str target string
   */
  ResolveImagePath_(relativeFilePath, itemId, identifier, str) {
    if (this.imageListMap[itemId] == null) return str;
    /** @type {Set<string>} */
    const imageList = this.imageListMap[itemId][identifier];
    if (imageList == null || imageList.size === 0) return str;
    const tmpArr = [];
    // TODO: rewrite to make simple
    for (const v of imageList.values()) tmpArr.push(v);
    const rx = new RegExp(`(${tmpArr.join("|")})`, "g");
    return str.replace(rx, (_, url) => {
      if (url === this.imagePathMap_[url]) return url;
      try {
        return path.normalize(relativeFilePath + this.imagePathMap_[url]);
      } catch (_) {
        return "";
      }
    });
  }

  /**
   * Replace URL to image path
   * @param {string} relativeFilePath target file relaive path from workroot directory
   * @param {string} itemId item id
   * @param {string} str target string
   */
  ResolveItemImagePath(relativeFilePath, itemId, str) {
    return this.ResolveImagePath_(relativeFilePath, itemId, identifierForItem, str);
  }

  /**
   * Replace URL to image path
   * @param {string} relativeFilePath target file relaive path from workroot directory
   * @param {string} itemId item id
   * @param {string} commentId comment id
   * @param {string} str target string
   */
  ResolveCommentImagePath(relativeFilePath, itemId, commentId, str) {
    return this.ResolveImagePath_(relativeFilePath, itemId, commentId, str);
  }
}

module.exports = ImageManager;
