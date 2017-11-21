# Require solidity
This module can be used

- a browserify transform when requiring
- to enable node to require sol files
- to compile files ahead of time

## For browserify

In your client js simply require solidity files such as
```javascript
//  in client_side.js
var contractinfo = require("./contract.sol");
```

Then add the module as a transform as normal

```javascript
var b = browserify();
b.add("/client_side.js");
b.transform(require("require-solidity"));
b.bundle();
```

## For node

```javascript
require("require-solidity").bindToRequire();

var contractinfo = require("./contract.sol");
```

or you can use it directly

```javascript
const requireSol = require("require-solidity");

var contractinfo = requireSol("./contract.sol");
```


## For compiling

```bash
$ compile-sol ./path/to/inputfile.sol
```
Will echo out to the stdout

or you can send it to an output file
```bash
$ compile-sol ./path/to/inputfile.sol ./path/to/output.json
```
