const getCallerFile = require("get-caller-file");
const findAndCompile = require("../src");

const browserTransform = require("./browserify-transform");

module.exports = function(filename, opts){
  var callerFile = getCallerFile();
  if(/[\\\/]node_modules[\\\/]module-deps[\\\/]index\.js$/.test(callerFile)){
    return browserTransform(filename, opts);
  }
  return findAndCompile(filename, callerFile);
};

module.exports.browserifyTransform = browserTransform;

module.exports.requireSol = function(filename){
  var callerFile = getCallerFile();
  return findAndCompile(filename, callerFile);
};

module.exports.bindToRequire = function(){
  if(!require.extensions){
    throw new Error("cannot bind to require");
  }
  require.extensions[".sol"] = (module, filename)=>(
    module._compile(
      `module.exports = ${JSON.stringify(findAndCompile(filename, module.filename))};`,
      filename
    )
  );
};
