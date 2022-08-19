const express = require("express");
const app = express();

const helloRoute = require("./yt.js");

app.use("/yt", helloRoute);

module.exports = app;
