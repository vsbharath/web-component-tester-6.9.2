"use strict";
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
var http = require("http");
var _ = require("lodash");
var socketIO = require("socket.io");
var browserrunner_1 = require("./browserrunner");
var config = require("./config");
var webserver_1 = require("./webserver");
// Steps (& Hooks)
function setupOverrides(context) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (context.options.registerHooks) {
                context.options.registerHooks(context);
            }
            return [2 /*return*/];
        });
    });
}
exports.setupOverrides = setupOverrides;
function loadPlugins(context) {
    return __awaiter(this, void 0, void 0, function () {
        var plugins;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    context.emit('log:debug', 'step: loadPlugins');
                    return [4 /*yield*/, context.plugins()];
                case 1:
                    plugins = _a.sent();
                    // built in quasi-plugin.
                    webserver_1.webserver(context);
                    // Actual plugins.
                    return [4 /*yield*/, Promise.all(plugins.map(function (plugin) { return plugin.execute(context); }))];
                case 2:
                    // Actual plugins.
                    _a.sent();
                    return [2 /*return*/, plugins];
            }
        });
    });
}
exports.loadPlugins = loadPlugins;
function configure(context) {
    return __awaiter(this, void 0, void 0, function () {
        var options, cleanOptions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    context.emit('log:debug', 'step: configure');
                    options = context.options;
                    return [4 /*yield*/, config.expand(context)];
                case 1:
                    _a.sent();
                    // Note that we trigger the configure hook _after_ filling in the `options`
                    // object.
                    //
                    // If you want to modify options prior to this; do it during plugin init.
                    return [4 /*yield*/, context.emitHook('configure')];
                case 2:
                    // Note that we trigger the configure hook _after_ filling in the `options`
                    // object.
                    //
                    // If you want to modify options prior to this; do it during plugin init.
                    _a.sent();
                    cleanOptions = _.omit(options, 'output');
                    context.emit('log:debug', 'configuration:', cleanOptions);
                    return [4 /*yield*/, config.validate(options)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.configure = configure;
/**
 * The prepare step is where a lot of the runner's initialization occurs. This
 * is also typically where a plugin will want to spin up any long-running
 * process it requires.
 *
 * Note that some "plugins" are also built directly into WCT (webserver).
 */
function prepare(context) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, context.emitHook('prepare')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.prepare = prepare;
function runTests(context) {
    return __awaiter(this, void 0, void 0, function () {
        var suites, result, runners;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    context.emit('log:debug', 'step: runTests');
                    suites = context.options.suites;
                    context.emit('log:info', 'Running Suite: ' + suites[0]);
                    result = runBrowsers(context);
                    runners = result.runners;
                    context._testRunners = runners;
                    context._socketIOServers = context._httpServers.map(function (httpServer) {
                        var socketIOServer = socketIO(httpServer);
                        socketIOServer.on('connection', function (socket) {
                            context.emit('log:debug', 'Test client opened sideband socket');
                            socket.on('client-event', function (data) {
                                var runner = runners[data.browserId];
                                if (!runner) {
                                    throw new Error("Unable to find browser runner for " +
                                        ("browser with id: " + data.browserId));
                                }
                                runner.onEvent(data.event, data.data);
                            });
                        });
                        return socketIOServer;
                    });
                    return [4 /*yield*/, result.completionPromise];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.runTests = runTests;
function cancelTests(context) {
    if (!context._testRunners) {
        return;
    }
    context._testRunners.forEach(function (tr) {
        tr.quit();
    });
}
exports.cancelTests = cancelTests;
// Helpers
function runBrowsers(context) {
    var options = context.options;
    var numActiveBrowsers = options.activeBrowsers.length;
    if (numActiveBrowsers === 0) {
        throw new Error('No browsers configured to run');
    }
    // TODO(nevir): validate browser definitions.
    // Up the socket limit so that we can maintain more active requests.
    // TODO(nevir): We should be queueing the browsers above some limit too.
    http.globalAgent.maxSockets =
        Math.max(http.globalAgent.maxSockets, numActiveBrowsers * 2);
    context.emit('run-start', options);
    var errors = [];
    var promises = [];
    var runners = [];
    var id = 0;
    for (var _i = 0, _a = options.activeBrowsers; _i < _a.length; _i++) {
        var originalBrowserDef = _a[_i];
        var waitFor = undefined;
        var _loop_1 = function (server) {
            // Needed by both `BrowserRunner` and `CliReporter`.
            var browserDef = _.clone(originalBrowserDef);
            browserDef.id = id++;
            browserDef.variant = server.variant;
            _.defaultsDeep(browserDef, options.browserOptions);
            var runner = new browserrunner_1.BrowserRunner(context, browserDef, options, server.url, waitFor);
            promises.push(runner.donePromise.then(function () {
                context.emit('log:debug', browserDef, 'BrowserRunner complete');
            }, function (error) {
                context.emit('log:debug', browserDef, 'BrowserRunner complete');
                errors.push(error);
            }));
            runners.push(runner);
            if (browserDef.browserName === 'safari') {
                // Control to Safari must be serialized. We can't launch two instances
                // simultaneously, because security lol.
                // https://webkit.org/blog/6900/webdriver-support-in-safari-10/
                waitFor = runner.donePromise["catch"](function () {
                    // The next runner doesn't care about errors, just wants to know when
                    // it can start.
                    return undefined;
                });
            }
        };
        for (var _b = 0, _c = options.webserver._servers; _b < _c.length; _b++) {
            var server = _c[_b];
            _loop_1(server);
        }
    }
    return {
        runners: runners,
        completionPromise: (function () {
            return __awaiter(this, void 0, void 0, function () {
                var error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Promise.all(promises)];
                        case 1:
                            _a.sent();
                            error = errors.length > 0 ? _.union(errors).join(', ') : null;
                            context.emit('run-end', error);
                            // TODO(nevir): Better rationalize run-end and hook.
                            return [4 /*yield*/, context.emitHook('cleanup')];
                        case 2:
                            // TODO(nevir): Better rationalize run-end and hook.
                            _a.sent();
                            if (error) {
                                throw new Error(error);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }())
    };
}
