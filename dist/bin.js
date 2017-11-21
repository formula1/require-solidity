const fs = require("fs");
const path = require("path");
const findAndCompile = require("../src");

const basedir = process.cwd();
const inputfile = process.argv[2];
const outputfile = process.argv[3];

var contract = findAndCompile(
  inputfile, basedir
);
if(outputfile){
  fs.writeFileSync(
    path.resolve(basedir, outputfile),
    JSON.stringify(contract)
  );
}else{
  process.stdout.write(JSON.stringify(contract));
}
process.exit();
