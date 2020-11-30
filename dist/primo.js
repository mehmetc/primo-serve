/**
* @file Primo proxy
* @author Mehmet Celik <mehmet.celik at kuleuven.be>
*
* KULeuven/LIBIS
* Mehmet Celik (c) 2018-2020
*/
var url = require('url');

var browserSync = require('browser-sync');

var mime = require('mime-types');

var fs = require('fs');

var chalk = require('chalk');

var proxy = require('proxy-middleware');
/** Primo proxy class */


class Primo {
  //export default class Primo {

  /**
  * Create a proxy
  * @param {String} vid - The ViewID that you wish to open
  * @param {String} baseUrl - Base URL to your Primo environment that needs proxing
  * @param {String} baseDir - The directory your data is stored in. The proxy will look in this directory for every path that starts with /primo-explore/custom/.
  */
  constructor(vid, baseUrl, baseDir, isVE = false, port = 8003) {
    this.vid = vid;
    this.baseUrl = baseUrl;
    this.baseDir = baseDir;
    this.isVE = isVE;
    this.port = port;
    this.URLPrefix = this.isVE ? "/discovery" : "/primo-explore";
  }
  /**
  * Start proxy and serve files from disk
  */


  serve() {
    const parsedBaseUrl = url.parse(this.baseUrl);
    let bs = browserSync.create(parsedBaseUrl.hostname);
    let startPath = `${this.URLPrefix}/search?vid=${this.vid}`;
    bs.init({
      ui: false,
      files: [`${this.baseDir}/**/*`],
      port: this.port,
      startPath: startPath,
      proxy: {
        target: `http://${parsedBaseUrl.hostname}`,
        middleware: [(req, res, next) => {
          this._fileProxy(this.baseDir, req, res, next);
        }, proxy(parsedBaseUrl)]
      }
    });
  }
  /**
  * Proxies files from your baseDir
  * @access private
  * @param baseDir - The directory your data is stored in. The proxy will look in this directory for every path that starts with /primo-explore/custom/.
  * @param req - The original http(s) request
  * @param res - The original http(s) response
  * @param next - Call next middleware
  */


  _fileProxy(baseDir, req, res, next) {
    const parsedUrl = url.parse(req.url);
    console.log(req.url);

    try {
      const filePath = `${baseDir}${parsedUrl.pathname.replace(`${this.URLPrefix}/custom`, '')}`;
      console.log(chalk.red(filePath));
      const contentType = mime.lookup(filePath);
      const data = fs.readFileSync(filePath);
      console.log(`${chalk.bold.yellow('hijacking')} ${chalk.underline(parsedUrl.pathname)} from ${chalk.underline(filePath)} size ${chalk.bold(data.length)}`);

      try {
        res.writeHead(200, {
          'Content-Type': contentType
        });
      } catch (e) {
        console.log(e);
      }

      res.write(data);
      res.end();
    } catch (err) {
      next();
    }
  }

}

module.exports = Primo;