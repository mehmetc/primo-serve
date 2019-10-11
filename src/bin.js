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
    let baseDir = Object.keys(argv).includes('dir') ? argv.dir : process.cwd()
    console.log("Serving Primo...");
    console.log(` vid = "${argv.vid}"\n proxy = "${argv.proxy}"\n dir = "${baseDir}"`);
    const primo = new Primo(argv.vid, argv.proxy, baseDir);
    primo.serve();
} else {
  console.log(`Usage: primoServe --vid=NUI --proxy=https://your.primo.url --dir=/directory/to/vids`);
}
