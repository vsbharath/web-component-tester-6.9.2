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
var chai_1 = require("chai");
var path = require("path");
var paths = require("../../runner/paths");
describe('paths', function () {
    describe('.expand', function () {
        var _this = this;
        var baseDir = path.resolve(__dirname, '../fixtures/paths');
        function expectExpands(patterns, expected) {
            return __awaiter(this, void 0, void 0, function () {
                var actual;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, paths.expand(baseDir, patterns)];
                        case 1:
                            actual = _a.sent();
                            // for non-POSIX support
                            expected = expected.map(function (str) { return str.replace(/\//g, path.sep); });
                            chai_1.expect(actual).to.have.members(expected);
                            return [2 /*return*/];
                    }
                });
            });
        }
        it('is ok with an empty list', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expectExpands([], [])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('ignores explicit files that are missing', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expectExpands(['404.js'], [])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, expectExpands(['404.js', 'foo.html'], ['foo.html'])];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('does not expand explicit files', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expectExpands(['foo.js'], ['foo.js'])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, expectExpands(['foo.html'], ['foo.html'])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, expectExpands(['foo.js', 'foo.html'], ['foo.js', 'foo.html'])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('expands directories into their files', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expectExpands(['foo'], ['foo/one.js', 'foo/two.html'])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, expectExpands(['foo/'], ['foo/one.js', 'foo/two.html'])];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('expands directories into index.html when present', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expectExpands(['bar'], ['bar/index.html'])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, expectExpands(['bar/'], ['bar/index.html'])];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('expands directories recursively, honoring all rules', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expectExpands(['baz'], [
                            'baz/a/fizz.html',
                            'baz/b/index.html',
                            'baz/a.html',
                            'baz/b.js',
                        ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('accepts globs for explicit file matches', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expectExpands(['baz/*.js'], ['baz/b.js'])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, expectExpands(['baz/*.html'], ['baz/a.html'])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, expectExpands(['baz/**/*.js'], [
                                'baz/b/deep/stuff.js',
                                'baz/b/one.js',
                                'baz/b.js',
                            ])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, expectExpands(['baz/**/*.html'], [
                                'baz/a/fizz.html',
                                'baz/b/deep/index.html',
                                'baz/b/deep/stuff.html',
                                'baz/b/index.html',
                                'baz/a.html',
                            ])];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('accepts globs for directories, honoring directory behavior', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expectExpands(['*'], [
                            'bar/index.html',
                            'baz/a/fizz.html',
                            'baz/b/index.html',
                            'baz/a.html',
                            'baz/b.js',
                            'foo/one.js',
                            'foo/two.html',
                            'foo.html',
                            'foo.js',
                        ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, expectExpands(['baz/*'], [
                                'baz/a/fizz.html',
                                'baz/b/index.html',
                                'baz/a.html',
                                'baz/b.js',
                            ])];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('deduplicates', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expectExpands(['bar/a.js', 'bar/*.js', 'bar', 'bar/*.html'], [
                            'bar/a.js',
                            'bar/index.html',
                            'bar/index.js',
                        ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
