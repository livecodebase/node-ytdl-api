const express = require("express");
const app = express();

const helloRoute = require("./hello.js");

app.use("/hello", helloRoute);

module.exports = app;
