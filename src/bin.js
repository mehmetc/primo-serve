/*
# primo-serve
#
# Catch command line arguments and run the proxy
#
# KULeuven/LIBIS
# Mehmet Celik (c) 2018
*/
import Primo from './primo'

"use strict";
var argv = require('minimist')(process.argv.slice(2));
if (Object.keys(argv).includes('proxy') &&
    Object.keys(argv).includes('vid')
  ) {
    let baseDir = Object.keys(argv).includes('dir') ? argv.dir : process.cwd();
    let primoVE = Object.keys(argv).includes('ve') ? true : false;
    if (/:/.test(argv.vid)) {
      primoVE = true;
    }
    console.log("Serving Primo...");
    console.log(` vid = "${argv.vid}"\n proxy = "${argv.proxy}"\n dir = "${baseDir}" \n isVE = "${primoVE}"`);
    const primo = new Primo(argv.vid, argv.proxy, baseDir, primoVE);
    primo.serve();
} else {
  console.log(`primo-server version ${require('../package.json').version}`);
  console.log(`Usage: primoServe --vid=NUI --proxy=https://your.primo.url --dir=/directory/to/vids --ve`);
}
