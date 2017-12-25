#!/usr/bin/env node

"use strict";

require("isomorphic-fetch");
const URLSearchParams = require("url").URLSearchParams;
const parseRFC5988LinkHeader = require("parse-link-header");
const fse = require("fs-extra");

const token = process.env.QIITA_ACCESS_TOKEN;//"9226168a5ef65f8e81153b460e7c78f8b8e53399";
const HTTPHeader = {
    "content-type"  : "application/json",
    "charset"       : "utf-8",
    "Authorization" : `Bearer ${token}`,
};

const getItemsFromQiita = async () => {
    const getParams = new URLSearchParams({"page":1, "per_page":100}).toString();
    const InitURL = `https://qiita.com/api/v2/authenticated_user/items?${getParams}`;
    let url = InitURL;
    let responseParsingPromise = [];
    let items = [];
    // eslint-disable-next-line no-constant-condition
    while(true){
        const response = await fetch(url, { headers: HTTPHeader});
        const requestRemain = response.headers.get("rate-remaining");
        if(requestRemain <= 0) {
            throw new Error("limit exceeded. Retry 1h later.");
        }
        console.log(`request limit remain: ${requestRemain}/${response.headers.get("rate-limit")}`);
        //append
        responseParsingPromise.push(response.json().then(j => Array.from(j)));
        const link = parseRFC5988LinkHeader(response.headers.get("link"));
        // when cannot find next page
        if(null == link["next"] || null == link["next"]["url"]) break;
        // set next url
        url = link["next"]["url"];
    }
    const responseParsed = await Promise.all(responseParsingPromise);
    for(const r of responseParsed) items = items.concat(r);
    return items;
};

const main = async () => {
    console.log("info: Request start");
    const items = await getItemsFromQiita();
    console.log("info: Request finish");
    console.log(`info: ${items.length} items found.`);
    await fse.writeJson("test.json", items);
};

main();

