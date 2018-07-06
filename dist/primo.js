'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var Primo = function () {
	_createClass(Primo, null, [{
		key: 'parseUrl',
		value: function parseUrl(rawUrl) {
			var parsedUrl = _url2.default.parse(rawUrl);
			if (parsedUrl.port == null) {
				switch (parsedUrl.protocol) {
					case "https:":
						parsedUrl.port = 443;
						break;
					case "http:":
						parsedUrl.port = 80;
						break;
					default:
						throw parsedUrl.protocol + ' not supported';
				}
			}

			return parsedUrl;
		}
	}]);

	function Primo(vid, baseUrl, baseDir) {
		_classCallCheck(this, Primo);

		this.vid = vid;
		this.baseUrl = baseUrl;
		this.baseDir = baseDir;
	}

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
						_this._proxyMiddelware(_this.baseDir, _this.baseUrl, req, res, next);
					}, (0, _proxyMiddleware2.default)(parsedBaseUrl)]
				}
			});
		}
	}, {
		key: '_proxyMiddelware',
		value: function _proxyMiddelware(baseDir, baseUrl, req, res, next) {
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