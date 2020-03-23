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
var gulp = require("gulp");
var path = require("path");
var sinon = require("sinon");
var wctGulp = require("../../runner/gulp");
var plugin_1 = require("../../runner/plugin");
var steps = require("../../runner/steps");
var expect = chai.expect;
chai.use(require('sinon-chai'));
var FIXTURES = path.resolve(__dirname, '../fixtures/cli');
describe('gulp', function () {
    var _this = this;
    var pluginsCalled;
    var sandbox;
    var orch;
    var options;
    beforeEach(function () {
        var _this = this;
        orch = new gulp['Gulp']();
        wctGulp.init(orch);
        sandbox = sinon.sandbox.create();
        sandbox.stub(steps, 'prepare')
            .callsFake(function (_context) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, undefined];
        }); }); });
        sandbox.stub(steps, 'runTests').callsFake(function (context) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                options = context.options;
                return [2 /*return*/];
            });
        }); });
        pluginsCalled = [];
        sandbox.stub(plugin_1.Plugin.prototype, 'execute')
            .callsFake(function (context) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    pluginsCalled.push(this.name);
                    context.options.activeBrowsers.push({ browserName: 'fake for ' + this.name });
                    return [2 /*return*/];
                });
            });
        });
    });
    afterEach(function () {
        sandbox.restore();
    });
    function runGulpTask(name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            orch.task(name)(function (error) { return error ? reject(error) : resolve(); });
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    it('honors wcf.conf.js', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    process.chdir(path.join(FIXTURES, 'conf'));
                    return [4 /*yield*/, runGulpTask('wct:sauce')];
                case 1:
                    _a.sent();
                    expect(options.plugins['sauce'].username).to.eq('abc123');
                    return [2 /*return*/];
            }
        });
    }); });
    it('prefers wcf.conf.json', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    process.chdir(path.join(FIXTURES, 'conf', 'json'));
                    return [4 /*yield*/, runGulpTask('wct:sauce')];
                case 1:
                    _a.sent();
                    expect(options.plugins['sauce'].username).to.eq('jsonconf');
                    return [2 /*return*/];
            }
        });
    }); });
    describe('wct:local', function () {
        var _this = this;
        it('kicks off local tests', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, runGulpTask('wct:local')];
                    case 1:
                        _a.sent();
                        expect(steps.runTests).to.have.been.calledOnce;
                        expect(pluginsCalled).to.have.members(['local']);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('wct:sauce', function () {
        var _this = this;
        it('kicks off sauce tests', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, runGulpTask('wct:sauce')];
                    case 1:
                        _a.sent();
                        expect(steps.runTests).to.have.been.calledOnce;
                        expect(pluginsCalled).to.have.members(['sauce']);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
