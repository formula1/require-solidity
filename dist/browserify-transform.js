var through = require("through2");
var fs = require("fs");
var path = require("path");
const findAndCompile = require("../src");
const debug = require("debug")("require-solidity-browserify");

const cwd = process.cwd();

var defaults = {
  rootDir: cwd,
  onFlush: function(options, done){
    done();
  },
  output: ""
};

function bool(b){
  return !(/^(false|0)$/i).test(b) && !!b;
}

try{
  var pkg = JSON.parse(fs.readFileSync(cwd + "/package.json") || "{}");
  var options = pkg["require-solidity"] || defaults;
  if(typeof options === "string"){
    var base = path.relative(__dirname, cwd);
    options = require(path.join(base, options)) || defaults;
  }
} catch (err){
  options = defaults;
}
options = Object.assign({}, defaults, options);

module.exports = function(filename, opts){
  if(!/\.sol$/i.test(filename)){
    return through();
  }

  options = Object.assign({}, options, opts);

  // Convert string to boolean when passing transform options from command line
  // https://github.com/cheton/browserify-css/issues/51
  options.autoInject = bool(options.autoInject);
  if(typeof options.autoInjectOptions === "object"){
    options.autoInjectOptions.verbose = bool(options.autoInjectOptions.verbose);
  }
  options.minify = bool(options.minify);

  if(typeof options.output === "string" && options.output.length > 0){
    try{
      fs.writeFileSync(options.output, "", "utf8");
    } catch (err){
      options.output = "";
      debug(err);
    }
  }

  return through(
    function transform(chunk, enc, next){
      next();
    },
    function flush(done){
      var json = findAndCompile(filename, options.rootDir);
      this.push(`
        module.exports = ${JSON.stringify(json)};
      `);
      this.push(null);
      done();
    }
  );
};
