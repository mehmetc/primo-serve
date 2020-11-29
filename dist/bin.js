/*
# primo-serve
#
# Catch command line arguments and run the proxy
#
# KULeuven/LIBIS
# Mehmet Celik (c) 2018-2020
*/
const Primo = require('./primo');

const Package = require('../package.json');

"use strict";

var argv = require('minimist')(process.argv.slice(2));

if (Object.keys(argv).includes('proxy') && Object.keys(argv).includes('vid')) {
  let baseDir = Object.keys(argv).includes('dir') ? argv.dir : process.cwd();
  let primoVE = Object.keys(argv).includes('ve') ? true : false;
  let port = Object.keys(argv).includes('port') ? argv.port : 8003;

  if (/:/.test(argv.vid)) {
    primoVE = true;
  }

  console.log("Serving Primo...");
  console.log(` vid = "${argv.vid}"\n proxy = "${argv.proxy}"\n dir = "${baseDir}" \n isVE = "${primoVE}" port = "${port}"`);
  const primo = new Primo(argv.vid, argv.proxy, baseDir, primoVE, port);
  primo.serve();
} else {
  console.log(`primoServe version ${Package.version}`);
  console.log(`Usage: primoServe --port=8003 --vid=NUI --proxy=https://your.primo.url --dir=/directory/to/vids --ve`);
}