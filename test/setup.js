const fs = require("fs");
const XSDOMParse = require("../index.js");

module.exports = (new XSDOMParse()).parseFromString(
    fs.readFileSync('./test/test.html').toString(), 'text/html');