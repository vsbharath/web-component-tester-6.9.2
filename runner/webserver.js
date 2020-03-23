"use strict";
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var bowerConfig = require("bower-config");
var cleankill = require("cleankill");
var fs = require("fs");
var _ = require("lodash");
var path = require("path");
var polyserve_1 = require("polyserve");
var resolve = require("resolve");
var semver = require("semver");
var send = require("send");
var serverDestroy = require("server-destroy");
var config_1 = require("./config");
// Template for generated indexes.
var INDEX_TEMPLATE = _.template(fs.readFileSync(path.resolve(__dirname, '../data/index.html'), { encoding: 'utf-8' }));
var DEFAULT_HEADERS = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
};
function relativeFrom(fromPath, toPath) {
    return path.relative(fromPath, toPath).replace(/\\/g, '/');
}
function resolveFrom(fromPath, moduleId) {
    try {
        return resolve.sync(moduleId, { basedir: fromPath, preserveSymlinks: true });
    }
    catch (e) {
        return '';
    }
}
/**
 * The webserver module is a quasi-plugin. This ensures that it is hooked in a
 * sane way (for other plugins), and just follows the same flow.
 *
 * It provides a static HTTP server for serving the desired tests and WCT's
 * `browser.js`/`environment.js`.
 */
function webserver(wct) {
    var options = wct.options;
    wct.hook('configure', function () {
        return __awaiter(this, void 0, void 0, function () {
            var browserScript, scripts, extraScripts, modules, extraModules, fromPath_1, npmPackageRootPath_1, wctPackageScriptName, packageName, isPackageScoped, rootNodeModules_1, legacyNpmSupportPackageScripts, resolvedLegacyNpmSupportPackageScripts, resolvedMochaScript;
            var _a;
            return __generator(this, function (_b) {
                // For now, you should treat all these options as an implementation detail
                // of WCT. They may be opened up for public configuration, but we need to
                // spend some time rationalizing interactions with external webservers.
                options.webserver = _.merge(options.webserver, {});
                if (options.verbose) {
                    options.clientOptions.verbose = true;
                }
                // Hacky workaround for Firefox + Windows issue where FF screws up pathing.
                // Bug: https://github.com/Polymer/web-component-tester/issues/194
                options.suites = options.suites.map(function (cv) { return cv.replace(/\\/g, '/'); });
                browserScript = 'web-component-tester/browser.js';
                scripts = [], extraScripts = [];
                modules = [], extraModules = [];
                if (options.npm) {
                    options.clientOptions = options.clientOptions || {};
                    options.clientOptions.environmentScripts =
                        options.clientOptions.environmentScripts || [];
                    browserScript = '';
                    fromPath_1 = path.resolve(options.root || process.cwd());
                    options.wctPackageName = options.wctPackageName ||
                        ['wct-mocha', 'wct-browser-legacy', 'web-component-tester'].find(function (p) { return !!resolveFrom(fromPath_1, p); });
                    npmPackageRootPath_1 = path.dirname(resolveFrom(fromPath_1, options.wctPackageName + '/package.json'));
                    if (npmPackageRootPath_1) {
                        wctPackageScriptName = ['web-component-tester', 'wct-browser-legacy'].includes(options.wctPackageName) ?
                            'browser.js' :
                            options.wctPackageName + ".js";
                        browserScript = (npmPackageRootPath_1 + "/" + wctPackageScriptName).slice(npmPackageRootPath_1.length - options.wctPackageName.length);
                    }
                    packageName = config_1.getPackageName(options);
                    isPackageScoped = packageName && packageName[0] === '@';
                    rootNodeModules_1 = path.resolve(path.join(options.root, 'node_modules'));
                    // WCT used to try to bundle a lot of packages for end-users, but
                    // because of `node_modules` layout, these need to actually be resolved
                    // from the package as installed, to ensure the desired version is
                    // loaded.  Here we list the legacy packages and attempt to resolve them
                    // from the WCT package.
                    if (['web-component-tester', 'wct-browser-legacy'].includes(options.wctPackageName)) {
                        legacyNpmSupportPackageScripts = [
                            'stacky/browser.js',
                            'async/lib/async.js',
                            'lodash/index.js',
                            'mocha/mocha.js',
                            'chai/chai.js',
                            '@polymer/sinonjs/sinon.js',
                            'sinon-chai/lib/sinon-chai.js',
                            'accessibility-developer-tools/dist/js/axs_testing.js',
                            '@polymer/test-fixture/test-fixture.js',
                        ];
                        resolvedLegacyNpmSupportPackageScripts = legacyNpmSupportPackageScripts
                            .map(function (script) { return resolveFrom(npmPackageRootPath_1, script); })
                            .filter(function (script) { return script !== ''; });
                        (_a = options.clientOptions.environmentScripts).push.apply(_a, resolvedLegacyNpmSupportPackageScripts.map(function (script) { return relativeFrom(rootNodeModules_1, script); }));
                    }
                    else {
                        resolvedMochaScript = resolveFrom(npmPackageRootPath_1, 'mocha/mocha.js');
                        if (resolvedMochaScript) {
                            options.clientOptions.environmentScripts.push(relativeFrom(rootNodeModules_1, resolvedMochaScript));
                        }
                    }
                    if (browserScript && isPackageScoped) {
                        browserScript = "../" + browserScript;
                    }
                }
                if (browserScript) {
                    scripts.push("../" + browserScript);
                }
                if (!options.npm) {
                    scripts.push('web-component-tester/data/a11ysuite.js');
                }
                options.webserver._generatedIndexContent =
                    INDEX_TEMPLATE(__assign({ scripts: scripts, extraScripts: [], modules: modules }, options));
                return [2 /*return*/];
            });
        });
    });
    wct.hook('prepare', function () {
        return __awaiter(this, void 0, void 0, function () {
            // TODO(rictic): re-enable this stuff. need to either move this code
            // into polyserve or let the polyserve API expose this stuff.
            // app.use('/httpbin', httpbin.httpbin);
            // app.get('/favicon.ico', function(request, response) {
            //   response.end();
            // });
            // app.use(function(request, response, next) {
            //   wct.emit('log:warn', '404', chalk.magenta(request.method),
            //   request.url);
            //   next();
            // });
            function interruptHandler() {
                return __awaiter(this, void 0, void 0, function () {
                    var _i, _a, io;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                // close the socket IO server directly if it is spun up
                                for (_i = 0, _a = (wct._socketIOServers || []); _i < _a.length; _i++) {
                                    io = _a[_i];
                                    // we will close the underlying server ourselves
                                    io.httpServer = null;
                                    io.close();
                                }
                                return [4 /*yield*/, Promise.all(onDestroyHandlers.map(function (f) { return f(); }))];
                            case 1:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }
            var wsOptions, additionalRoutes, packageName, componentDir, pathToLocalWct_1, version, mdFilenames, _i, mdFilenames_1, mdFilename, pathToMetadata, allowedRange, hasWarnedBrowserJs_1, pathToGeneratedIndex, appMapper, polyserveResult, servers, onDestroyHandlers, registerServerTeardown, address, address, _a, _b, server, never, _c, servers_1, server;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        wsOptions = options.webserver;
                        additionalRoutes = new Map();
                        packageName = config_1.getPackageName(options);
                        // Check for client-side compatibility.
                        // Non-npm case.
                        if (!options.npm) {
                            componentDir = bowerConfig.read(options.root).directory;
                            pathToLocalWct_1 = path.join(options.root, componentDir, 'web-component-tester');
                            version = undefined;
                            mdFilenames = ['package.json', 'bower.json', '.bower.json'];
                            for (_i = 0, mdFilenames_1 = mdFilenames; _i < mdFilenames_1.length; _i++) {
                                mdFilename = mdFilenames_1[_i];
                                pathToMetadata = path.join(pathToLocalWct_1, mdFilename);
                                try {
                                    if (!version) {
                                        version = require(pathToMetadata).version;
                                    }
                                }
                                catch (e) {
                                    // Handled below, where we check if we found a version.
                                }
                            }
                            if (!version) {
                                throw new Error("\nThe web-component-tester Bower package is not installed as a dependency of this project (" + packageName + ").\n\nPlease run this command to install:\n    bower install --save-dev web-component-tester\n\nWeb Component Tester >=6.0 requires that support files needed in the browser are installed as part of the project's dependencies or dev-dependencies. This is to give projects greater control over the versions that are served, while also making Web Component Tester's behavior easier to understand.\n\nExpected to find a " + mdFilenames.join(' or ') + " at: " + pathToLocalWct_1 + "/\n");
                            }
                            allowedRange = require(path.join(__dirname, '..', 'package.json'))['--private-wct--']['client-side-version-range'];
                            if (!semver.satisfies(version, allowedRange)) {
                                throw new Error("\n    The web-component-tester Bower package installed is incompatible with the\n    wct node package you're using.\n\n    The test runner expects a version that satisfies " + allowedRange + " but the\n    bower package you have installed is " + version + ".\n");
                            }
                            hasWarnedBrowserJs_1 = false;
                            additionalRoutes.set('/browser.js', function (request, response) {
                                if (!hasWarnedBrowserJs_1) {
                                    console.warn("\n\n          WARNING:\n          Loading WCT's browser.js from /browser.js is deprecated.\n\n          Instead load it from ../web-component-tester/browser.js\n          (or with the absolute url /components/web-component-tester/browser.js)\n        ");
                                    hasWarnedBrowserJs_1 = true;
                                }
                                var browserJsPath = path.join(pathToLocalWct_1, 'browser.js');
                                send(request, browserJsPath).pipe(response);
                            });
                        }
                        pathToGeneratedIndex = "/components/" + packageName + "/generated-index.html";
                        additionalRoutes.set(pathToGeneratedIndex, function (_request, response) {
                            response.set(DEFAULT_HEADERS);
                            response.send(options.webserver._generatedIndexContent);
                        });
                        appMapper = function (app, options) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    // Using the define:webserver hook to provide a mapper function that
                                    // allows user to substitute their own app for the generated polyserve
                                    // app.
                                    return [4 /*yield*/, wct.emitHook('define:webserver', app, function (substitution) {
                                            app = substitution;
                                        }, options)];
                                    case 1:
                                        // Using the define:webserver hook to provide a mapper function that
                                        // allows user to substitute their own app for the generated polyserve
                                        // app.
                                        _a.sent();
                                        return [2 /*return*/, app];
                                }
                            });
                        }); };
                        return [4 /*yield*/, polyserve_1.startServers({
                                root: options.root,
                                componentDir: componentDir,
                                compile: options.compile,
                                hostname: options.webserver.hostname,
                                port: options.webserver.port,
                                headers: DEFAULT_HEADERS,
                                packageName: packageName,
                                additionalRoutes: additionalRoutes,
                                npm: !!options.npm,
                                moduleResolution: options.moduleResolution,
                                proxy: options.proxy
                            }, appMapper)];
                    case 1:
                        polyserveResult = _d.sent();
                        onDestroyHandlers = [];
                        registerServerTeardown = function (serverInfo) {
                            var destroyableServer = serverInfo.server;
                            serverDestroy(destroyableServer);
                            onDestroyHandlers.push(function () {
                                destroyableServer.destroy();
                                return new Promise(function (resolve) { return serverInfo.server.on('close', function () { return resolve(); }); });
                            });
                        };
                        if (polyserveResult.kind === 'mainline') {
                            servers = [polyserveResult];
                            registerServerTeardown(polyserveResult);
                            address = polyserveResult.server.address();
                            if (typeof address !== 'string') {
                                wsOptions.port = address.port;
                            }
                        }
                        else if (polyserveResult.kind === 'MultipleServers') {
                            servers = [polyserveResult.mainline];
                            servers = servers.concat(polyserveResult.variants);
                            address = polyserveResult.mainline.server.address();
                            if (typeof address !== 'string') {
                                wsOptions.port = address.port;
                            }
                            for (_a = 0, _b = polyserveResult.servers; _a < _b.length; _a++) {
                                server = _b[_a];
                                registerServerTeardown(server);
                            }
                        }
                        else {
                            never = polyserveResult;
                            throw new Error('Internal error: Got unknown response from polyserve.startServers: ' +
                                ("" + never));
                        }
                        wct._httpServers = servers.map(function (s) { return s.server; });
                        _c = 0, servers_1 = servers;
                        _d.label = 2;
                    case 2:
                        if (!(_c < servers_1.length)) return [3 /*break*/, 5];
                        server = servers_1[_c];
                        return [4 /*yield*/, wct.emitHook('prepare:webserver', server.app)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _c++;
                        return [3 /*break*/, 2];
                    case 5:
                        options.webserver._servers = servers.map(function (s) {
                            var address = s.server.address();
                            var port = typeof address === 'string' ? '' : ":" + address.port;
                            var hostname = s.options.hostname;
                            var url = "http://" + hostname + port + pathToGeneratedIndex;
                            return { url: url, variant: s.kind === 'mainline' ? '' : s.variantName };
                        });
                        cleankill.onInterrupt(function () {
                            return new Promise(function (resolve) {
                                interruptHandler().then(function () { return resolve(); }, resolve);
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
}
exports.webserver = webserver;
function exists(path) {
    try {
        fs.statSync(path);
        return true;
    }
    catch (_err) {
        return false;
    }
}
// HACK(rictic): remove this ES6-compat hack and export webserver itself
webserver['webserver'] = webserver;
module.exports = webserver;
