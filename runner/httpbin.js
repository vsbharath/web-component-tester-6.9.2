/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var bodyParser = require("body-parser");
var cleankill = require("cleankill");
var express = require("express");
var http = require("http");
var multer = require("multer");
var serverDestroy = require("server-destroy");
var port_scanner_1 = require("./port-scanner");
var express_1 = require("express");
exports.Router = express_1.Router;
exports.httpbin = express.Router();
function capWords(s) {
    return s.split('-')
        .map(function (word) { return word[0].toUpperCase() + word.slice(1); })
        .join('-');
}
function formatRequest(req) {
    var headers = {};
    for (var key in req.headers) {
        headers[capWords(key)] = req.headers[key];
    }
    var formatted = {
        headers: headers,
        url: req.originalUrl,
        data: req.body,
        files: req.files,
        form: {},
        json: {}
    };
    var contentType = (headers['Content-Type'] || '').toLowerCase().split(';')[0];
    var field = {
        'application/json': 'json',
        'application/x-www-form-urlencoded': 'form',
        'multipart/form-data': 'form'
    }[contentType];
    if (field) {
        formatted[field] = req.body;
    }
    return formatted;
}
exports.httpbin.use(bodyParser.urlencoded({ extended: false }));
exports.httpbin.use(bodyParser.json());
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
exports.httpbin.use(upload.any());
exports.httpbin.use(bodyParser.text());
exports.httpbin.use(bodyParser.text({ type: 'html' }));
exports.httpbin.use(bodyParser.text({ type: 'xml' }));
exports.httpbin.get('/delay/:seconds', function (req, res) {
    setTimeout(function () {
        res.json(formatRequest(req));
    }, (req.params.seconds || 0) * 1000);
});
exports.httpbin.post('/post', function (req, res) {
    res.json(formatRequest(req));
});
// Running this script directly with `node httpbin.js` will start up a server
// that just serves out /httpbin/...
// Useful for debugging only the httpbin functionality without the rest of
// wct.
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var app, server, port;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = express();
                    server = http.createServer(app);
                    app.use('/httpbin', exports.httpbin);
                    return [4 /*yield*/, port_scanner_1.findPort([7777, 7000, 8000, 8080, 8888])];
                case 1:
                    port = _a.sent();
                    server.listen(port);
                    server.port = port;
                    serverDestroy(server);
                    cleankill.onInterrupt(function () {
                        return new Promise(function (resolve) {
                            server.destroy();
                            server.on('close', resolve);
                        });
                    });
                    console.log('Server running at http://localhost:' + port + '/httpbin/');
                    return [2 /*return*/];
            }
        });
    });
}
if (require.main === module) {
    main()["catch"](function (err) {
        console.error(err);
        process.exit(1);
    });
}
