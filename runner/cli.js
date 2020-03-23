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
var chalk = require("chalk");
var events = require("events");
var _ = require("lodash");
var clireporter_1 = require("./clireporter");
var config = require("./config");
var context_1 = require("./context");
var plugin_1 = require("./plugin");
var test_1 = require("./test");
var PACKAGE_INFO = require('../package.json');
var noopNotifier = {
    notify: function () { }
};
var updateNotifier = noopNotifier;
(function () {
    try {
        updateNotifier = require('update-notifier')({ pkg: PACKAGE_INFO });
    }
    catch (error) {
        // S'ok if we don't have update-notifier. It's optional.
    }
})();
function run(_env, args, output) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, wrapResult(output, _run(args, output))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.run = run;
function _run(args, output) {
    return __awaiter(this, void 0, void 0, function () {
        var options, context;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // If the "--version" or "-V" flag is ever present, just print
                    // the current version. Useful for globally installed CLIs.
                    if (args.includes('--version') || args.includes('-V')) {
                        output.write(PACKAGE_INFO.version + "\n");
                        return [2 /*return*/, Promise.resolve()];
                    }
                    options = config.preparseArgs(args);
                    // Depends on values from the initial merge:
                    options = config.merge(options, {
                        output: output,
                        ttyOutput: !process.env.CI && output['isTTY'] && !options.simpleOutput
                    });
                    context = new context_1.Context(options);
                    if (options.skipUpdateCheck) {
                        updateNotifier = noopNotifier;
                    }
                    // `parseArgs` merges any new configuration into `context.options`.
                    return [4 /*yield*/, config.parseArgs(context, args)];
                case 1:
                    // `parseArgs` merges any new configuration into `context.options`.
                    _a.sent();
                    return [4 /*yield*/, test_1.test(context)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Note that we're cheating horribly here. Ideally all of this logic is within
// wct-sauce. The trouble is that we also want WCT's configuration lookup logic,
// and that's not (yet) cleanly exposed.
function runSauceTunnel(_env, args, output) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, wrapResult(output, _runSauceTunnel(args, output))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.runSauceTunnel = runSauceTunnel;
function _runSauceTunnel(args, output) {
    return __awaiter(this, void 0, void 0, function () {
        var cmdOptions, context, diskOptions, baseOptions, plugin, parser, options, wctSauce, emitter, tunnelId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cmdOptions = config.preparseArgs(args);
                    context = new context_1.Context(cmdOptions);
                    diskOptions = context.options;
                    baseOptions = (diskOptions.plugins && diskOptions.plugins['sauce']) ||
                        diskOptions.sauce || {};
                    return [4 /*yield*/, plugin_1.Plugin.get('sauce')];
                case 1:
                    plugin = _a.sent();
                    parser = require('nomnom');
                    parser.script('wct-st');
                    parser.options(_.omit(plugin.cliConfig, 'browsers', 'tunnelId'));
                    options = _.merge(baseOptions, parser.parse(args));
                    wctSauce = require('wct-sauce');
                    wctSauce.expandOptions(options);
                    emitter = new events.EventEmitter();
                    new clireporter_1.CliReporter(emitter, output, {});
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            wctSauce.startTunnel(options, emitter, function (error, tunnelId) {
                                return error ? reject(error) : resolve(tunnelId);
                            });
                        })];
                case 2:
                    tunnelId = _a.sent();
                    output.write('\n');
                    output.write('The tunnel will remain active while this process is running.\n');
                    output.write('To use this tunnel for other WCT runs, export the following:\n');
                    output.write('\n');
                    output.write(chalk.cyan('export SAUCE_TUNNEL_ID=' + tunnelId) + '\n');
                    output.write('Press CTRL+C to close the sauce tunnel\n');
                    return [2 /*return*/];
            }
        });
    });
}
function wrapResult(output, promise) {
    return __awaiter(this, void 0, void 0, function () {
        var error, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promise];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    error = e_1;
                    return [3 /*break*/, 3];
                case 3:
                    if (!process.env.CI) {
                        updateNotifier.notify();
                    }
                    if (error) {
                        output.write('\n');
                        output.write(chalk.red(error) + '\n');
                        output.write('\n');
                        throw error;
                    }
                    return [2 /*return*/];
            }
        });
    });
}
