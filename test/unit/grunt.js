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
var chai = require("chai");
var grunt = require("grunt");
var _ = require("lodash");
var path = require("path");
var sinon = require("sinon");
var steps = require("../../runner/steps");
var wctLocalBrowsers = require('wct-local/lib/browsers');
var expect = chai.expect;
chai.use(require('sinon-chai'));
var LOCAL_BROWSERS = {
    aurora: { browserName: 'aurora', version: '1' },
    canary: { browserName: 'canary', version: '2' },
    chrome: { browserName: 'chrome', version: '3' },
    firefox: { browserName: 'firefox', version: '4' }
};
describe('grunt', function () {
    // Sinon doesn't stub process.env very well.
    var origEnv, origArgv;
    beforeEach(function () {
        origEnv = _.clone(process.env);
        origArgv = process.argv;
    });
    afterEach(function () {
        _.assign(process.env, origEnv);
        _.difference(_.keys(process.env), _.keys(origEnv)).forEach(function (key) {
            delete process.env[key];
        });
        process.argv = origArgv;
    });
    before(function () {
        grunt.initConfig({
            'wct-test': {
                'passthrough': {
                    options: { foo: 1, bar: 'asdf' }
                },
                'override': {
                    options: { sauce: { username: '--real-sauce--' } }
                }
            }
        });
        grunt.loadTasks(path.resolve(__dirname, '../../tasks'));
    });
    function runTask(task) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            grunt.task['options']({ error: reject, done: resolve });
                            grunt.task.run('wct-test:' + task)['start']();
                        })];
                    case 1:
                        _a.sent();
                        // We shouldn't error before hitting it.
                        expect(steps.runTests).to.have.been.calledOnce;
                        return [2 /*return*/, steps.runTests['getCall'](0)];
                }
            });
        });
    }
    describe('wct-test', function () {
        var sandbox;
        beforeEach(function () {
            var _this = this;
            sandbox = sinon.sandbox.create();
            sandbox.stub(steps, 'prepare')
                .callsFake(function (_context) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, undefined];
            }); }); });
            sandbox.stub(wctLocalBrowsers, 'detect')
                .callsFake(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, LOCAL_BROWSERS];
            }); }); });
            sandbox.stub(wctLocalBrowsers, 'supported')
                .callsFake(function () { return _.keys(LOCAL_BROWSERS); });
            process.chdir(path.resolve(__dirname, '../fixtures/cli/standard'));
        });
        afterEach(function () {
            sandbox.restore();
        });
        describe('with a passing suite', function () {
            var _this = this;
            beforeEach(function () {
                var _this = this;
                sandbox.stub(steps, 'runTests')
                    .callsFake(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, undefined];
                }); }); });
            });
            it('passes configuration through', function () { return __awaiter(_this, void 0, void 0, function () {
                var call;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, runTask('passthrough')];
                        case 1:
                            call = _a.sent();
                            expect(call.args[0].options).to.include({ foo: 1, bar: 'asdf' });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('with a failing suite', function () {
            var _this = this;
            beforeEach(function () {
                var _this = this;
                sandbox.stub(steps, 'runTests').callsFake(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        throw 'failures';
                    });
                }); });
            });
            it('passes errors out', function () { return __awaiter(_this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, runTask('passthrough')];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            return [2 /*return*/]; // All's well!
                        case 3: throw new Error('Expected runTask to fail!');
                    }
                });
            }); });
        });
    });
});
