"use strict";

class ItemBase {
    constructor(obj) {
        /**@type {string} */
        this.created_at = obj.created_at;
        /**@type {string} */
        this.id = obj.id;
        /**@type {string} */
        this.updated_at = obj.updated_at;
        /**@type {string} */
        this.markdown = obj.body;
        /**@type {string} */
        this.html = obj.rendered_body;
    }
}

module.exports = ItemBase;