const fs = require("fs");
const solc = require("solc");
const resolve = require("resolve");
const path = require("path");
const debug = require("./debug");

const cache = new Map();

const isWarning = /Warning\: /;

function findImport(oFile, solToRequire){
  debug.log("Look for relative file: " + oFile + ", from " + solToRequire);
  oFile = path.resolve(path.dirname(solToRequire), oFile);
  if(!fs.existsSync(oFile)){
    debug.error(`File ${oFile} not found`);
    return { error: `File ${oFile} not found` };
  }
  return { contents: fs.readFileSync(oFile, "utf8") };
}

module.exports = function(filename, relativeTo){
  var solToRequire = resolve.sync(filename, {
    basedir: path.resolve(relativeTo, ".."),
    extensions: [".sol"],
    packageFilter: function(pkg){
      pkg.main = pkg.contract || "./index.sol";
      return pkg;
    }
  });
  if(!fs.existsSync(solToRequire)){
    throw new Error("could not find solidity from " + filename);
  }
  if(cache.has(solToRequire)){
    return cache.get(solToRequire);
  }
  const source = fs.readFileSync(solToRequire, "utf8");
  debug.log("before compile: " + solToRequire);
  let compiledContractString = solc.compile(
    JSON.stringify(
      {
        language: "Solidity",
        sources: {
          [path.basename(solToRequire)]: {
            content: source
          }
        },
        settings: {
          outputSelection: {
            "*": { "*": ["*"] }
          }
        }
      }
    ),
    function(otherFile){
      return findImport(otherFile, solToRequire);
    }
  );

  const compiledContract = JSON.parse(compiledContractString);

  compiledContract.errors && compiledContract.errors.forEach((e)=>{
    if(!isWarning.test(e)){
      throw e;
    } else{
      debug.warn(e);
    }
  });

  cache.set(solToRequire, compiledContract);
  return compiledContract;
};
