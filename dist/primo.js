'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * @file Primo proxy
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * @author Mehmet Celik <mehmet.celik at kuleuven.be>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * KULeuven/LIBIS
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * Mehmet Celik (c) 2018
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */


var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _browserSync = require('browser-sync');

var _browserSync2 = _interopRequireDefault(_browserSync);

var _proxyMiddleware = require('proxy-middleware');

var _proxyMiddleware2 = _interopRequireDefault(_proxyMiddleware);

var _mimeTypes = require('mime-types');

var _mimeTypes2 = _interopRequireDefault(_mimeTypes);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Primo proxy class */
var Primo = function () {
	/**
 * Create a proxy
 * @param {String} vid - The ViewID that you wish to open
 * @param {String} baseUrl - Base URL to your Primo environment that needs proxing
 * @param {String} baseDir - The directory your data is stored in. The proxy will look in this directory for every path that starts with /primo-explore/custom/.
 */
	function Primo(vid, baseUrl, baseDir) {
		_classCallCheck(this, Primo);

		this.vid = vid;
		this.baseUrl = baseUrl;
		this.baseDir = baseDir;
	}

	/**
 * Start proxy and serve files from disk
 */


	_createClass(Primo, [{
		key: 'serve',
		value: function serve() {
			var _this = this;

			var parsedBaseUrl = _url2.default.parse(this.baseUrl);
			var bs = _browserSync2.default.create(parsedBaseUrl.hostname);

			bs.init({
				ui: false,
				files: [this.baseDir + '/**/*'],
				port: 8003,
				startPath: "/primo-explore/search?vid=" + this.vid,
				proxy: {
					target: 'http://' + parsedBaseUrl.hostname,
					middleware: [function (req, res, next) {
						_this._fileProxy(_this.baseDir, req, res, next);
					}, (0, _proxyMiddleware2.default)(parsedBaseUrl)]
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

	}, {
		key: '_fileProxy',
		value: function _fileProxy(baseDir, req, res, next) {
			var parsedUrl = _url2.default.parse(req.url);
			console.log(req.url);

			try {
				var filePath = baseDir + '/' + parsedUrl.pathname.replace('/primo-explore/custom', '');
				var contentType = _mimeTypes2.default.lookup(filePath);
				var data = _fs2.default.readFileSync(filePath);
				console.log(_chalk2.default.bold.yellow('hijacking') + ' ' + _chalk2.default.underline(parsedUrl.pathname) + ' from ' + _chalk2.default.underline(filePath) + ' size ' + _chalk2.default.bold(data.length));

				try {
					res.writeHead(200, { 'Content-Type': contentType });
				} catch (e) {
					console.log(e);
				}
				res.write(data);
				res.end();
			} catch (err) {
				next();
			}
		}
	}]);

	return Primo;
}();

exports.default = Primo;