#!/usr/bin/env node

// Delete the 0 and 1 argument (node and script.js)
// var args = process.argv.splice(process.execArgv.length + 2);
//
// // Retrieve the first argument
// var url = args[0];
// var path = args[1];


var lib = require('../lib/index.js');

lib.backup();