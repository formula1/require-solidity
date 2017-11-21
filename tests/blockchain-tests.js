var Web3 = require("web3");

module.exports = function(contractsConfig){
  const HelloWorld = contractsConfig.contracts["HelloWorld.sol:HelloWorld"];
  var web3 = new Web3();

  const contract = new web3.eth.Contract(
    HelloWorld.abi,
    { data: "0x" + HelloWorld.bytecode }
  );

  contract.deploy({
    arguments: []
  });

};
