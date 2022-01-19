const path = require("path");

const cacheDir = path.join(path.dirname(__dirname), "cache", "app");

exports.cacheDir = cacheDir;

module.exports = {
  cacheDir,
};
