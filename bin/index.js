#!/usr/bin/env node

"use strict";

const QiitaApi = require("./qiita");

// require("isomorphic-fetch");

// const token = process.env.QIITA_ACCESS_TOKEN;
const token = "9226168a5ef65f8e81153b460e7c78f8b8e53399";

const main = async () => {
    console.log("info: Request start");
    const qiita = new QiitaApi(token, true);
    const items = await qiita.GetAllAuthenticatedUserItems();
    console.log("info: Request finish");
    console.log(`info: ${items.length} items found.`);
    console.log("info: Request start");
    const comments = await qiita.GetAllComments("91e5169bff5ea4a813de");
    console.log("info: Request finish");
    console.log(`info: ${comments.length} items found.`);
};

main();

