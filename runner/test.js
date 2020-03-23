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
var cleankill = require("cleankill");
var clireporter_1 = require("./clireporter");
var context_1 = require("./context");
var steps = require("./steps");
/**
 * Runs a suite of web component tests.
 *
 * The returned Context (a kind of EventEmitter) fires various events to allow
 * you to track the progress of the tests:
 *
 * Lifecycle Events:
 *
 * `run-start`
 *   WCT is ready to begin spinning up browsers.
 *
 * `browser-init` {browser} {stats}
 *   WCT is ready to begin spinning up browsers.
 *
 * `browser-start` {browser} {metadata} {stats}
 *   The browser has begun running tests. May fire multiple times (i.e. when
 *   manually refreshing the tests).
 *
 * `sub-suite-start` {browser} {sharedState} {stats}
 *   A suite file has begun running.
 *
 * `test-start` {browser} {test} {stats}
 *   A test has begun.
 *
 * `test-end` {browser} {test} {stats}
 *  A test has ended.
 *
 * `sub-suite-end` {browser} {sharedState} {stats}
 *   A suite file has finished running all of its tests.
 *
 * `browser-end` {browser} {error} {stats}
 *   The browser has completed, and it shutting down.
 *
 * `run-end` {error}
 *   WCT has run all browsers, and is shutting down.
 *
 * Generic Events:
 *
 *  * log:debug
 *  * log:info
 *  * log:warn
 *  * log:error
 *
 * @param {!Config|!Context} options The configuration or an already formed
 *     `Context` object.
 */
function test(options) {
    return __awaiter(this, void 0, void 0, function () {
        var context;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    context = (options instanceof context_1.Context) ? options : new context_1.Context(options);
                    // We assume that any options related to logging are passed in via the initial
                    // `options`.
                    if (context.options.output) {
                        new clireporter_1.CliReporter(context, context.options.output, context.options);
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 7, 10]);
                    return [4 /*yield*/, steps.setupOverrides(context)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, steps.loadPlugins(context)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, steps.configure(context)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, steps.prepare(context)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, steps.runTests(context)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 7:
                    if (!!context.options.skipCleanup) return [3 /*break*/, 9];
                    return [4 /*yield*/, cleankill.close()];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9: return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.test = test;
// HACK
test['test'] = test;
module.exports = test;
