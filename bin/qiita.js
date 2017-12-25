"use strict";

require("isomorphic-fetch");
const URLSearchParams = require("url").URLSearchParams;
const parseRFC5988LinkHeader = require("parse-link-header");

/**
 * Qiita api wrapper
 */
class QiitaApi {
    /**
     * @param {string} token Qiita API access token
     * @param {boolean} debugFlag Enable debug log
     */
    constructor(token, debugFlag = false) {
        this.token_ = token;
        this.debugFlag_ = debugFlag;
        Object.freeze(this.token_);
        Object.freeze(this.debugFlag_);
    }
    /**
     * Create HTTP Header include token
     */
    CreateHttpHeader_() {
        return {
            "content-type"  : "application/json",
            "charset"       : "utf-8",
            "Authorization" : `Bearer ${this.token_}`
        };
    }
    /**
     * @param {string} url GET Request URL includes GET params
     * @returns {Promise<any[]>}
     */
    async GetAllData_(url) {
        let responseParsingPromise = [];
        let items = [];
        // eslint-disable-next-line no-constant-condition
        while(true){
            const response = await fetch(url, { headers: this.CreateHttpHeader_() });
            const requestRemain = response.headers.get("rate-remaining");
            if(requestRemain <= 0) {
                throw new Error("API request limit exceeded. Retry 1h later.");
            }
            if(this.debugFlag_) console.log(`request limit remain: ${requestRemain}/${response.headers.get("rate-limit")}`);
            //append
            responseParsingPromise.push(response.json().then(j => Array.from(j)));
            const link = parseRFC5988LinkHeader(response.headers.get("link"));
            // when cannot find next page
            if(null == link["next"] || null == link["next"]["url"]) break;
            // set next url
            url = link["next"]["url"];
        }
        for(const r of await Promise.all(responseParsingPromise)) items = items.concat(r);
        return items;
    }
    /**
     * Get all authenticated user items
     * @returns {Promise<any[]>}
     */
    async GetAllAuthenticatedUserItems() {
        const getParams = new URLSearchParams({"page":1, "per_page":100}).toString();
        return this.GetAllData_(`https://qiita.com/api/v2/authenticated_user/items?${getParams}`);
    }
    /**
     * Get all comment
     * @param {string} itemId target item id
     * @returns {Promise<any[]>}
     */
    async GetAllComments(itemId) {
        const getParams = new URLSearchParams({"page":1, "per_page":100}).toString();
        return this.GetAllData_(`https://qiita.com/api/v2/items/${itemId}/comments?${getParams}`);
    }
}

module.exports = QiitaApi;