
const debug = {
  error: require("debug")("require-sol:error"),
  warn: require("debug")("require-sol:warn"),
  log: require("debug")("require-sol:log")
};
debug.warn.log = console.warn.bind(console); // eslint-disable-line no-console
debug.log.log = console.log.bind(console); // eslint-disable-line no-console

module.exports = debug;
