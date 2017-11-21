const tap = require("tap");

tap.test("bin stdout", function(t){
  const { execSync } = require("child_process");

  var stdout = execSync(`node ${__dirname}/../dist/bin ${__dirname}/contracts/HelloWorld.sol`);
  t.pass("exec was successful");

  const contractsConfig = JSON.parse(stdout.toString("utf8"));

  t.pass("stdout is parsable json");

  const blockchainTests = require("./blockchain-tests");

  blockchainTests(contractsConfig);

  t.pass("pass blockchain tests");

  t.end();
});

tap.test("bin file", function(t){
  const { execSync } = require("child_process");
  const { existsSync, unlinkSync } = require("fs");

  const outputFile = `${__dirname}/hidden.json`;

  if(existsSync(outputFile)){
    unlinkSync(outputFile);
  }
  execSync(
    [
      "node",
      `${__dirname}/../dist/bin`,
      `${__dirname}/contracts/HelloWorld.sol`,
      outputFile
    ].join(" ")
  );

  t.pass("exec was successful");

  const contractsConfig = require(outputFile);

  t.pass("stdout is parsable from the output file json");

  const blockchainTests = require("./blockchain-tests");

  blockchainTests(contractsConfig);

  t.pass("pass blockchain tests");

  t.end();
});

tap.test("browserify transform", function(t){
  var browserify = require("browserify");
  var concatStream = require("concat-stream");
  var transform = require("../dist/node");
  var b = browserify({
    extensions: [".js", ".json"]
  });

  return Promise.resolve().then(()=>(
    b.add(__dirname + "/client/index.js"),
    b.transform(transform),
    b.bundle()
  )).then((s)=>(
    new Promise((res, rej)=>{
      s.pipe(concatStream(res)).on("error", rej);
    })
  )).then((buffer)=>{
    t.pass("able to transform the javascript");
    t.pass("able to use the base module as a transform");

    // console.log(buffer.toString());

    global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    global.self = global;

    eval(buffer.toString("utf8"));

    t.pass("pass blockchain tests");

    t.end();
  }).catch((e)=>{
    // console.error(e);
    throw e;
  });
});

tap.test("node requireSol Function", function(t){
  const requireSol = require("../dist/node");

  const contractsConfig = requireSol("./contracts/HelloWorld");

  t.pass("requireable from where its called");
  t.pass("able to use the base module as a require function");

  const blockchainTests = require("./blockchain-tests");

  blockchainTests(contractsConfig);

  t.pass("pass blockchain tests");

  t.end();
});

tap.test("node bind to require", function(t){
  require("../dist/node").bindToRequire();

  const contractsConfig = require("./contracts/HelloWorld.sol");

  t.pass("can access with normal require");

  const blockchainTests = require("./blockchain-tests");

  blockchainTests(contractsConfig);

  t.pass("pass blockchain tests");

  t.end();
});

tap.end();
