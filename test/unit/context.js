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
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var context_1 = require("../../runner/context");
var plugin_1 = require("../../runner/plugin");
var expect = chai.expect;
chai.use(sinonChai);
describe('Context', function () {
    var sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });
    afterEach(function () {
        sandbox.restore();
    });
    describe('.plugins', function () {
        it('excludes plugins with a falsy config', function () { return __awaiter(void 0, void 0, void 0, function () {
            var context, stub, plugins;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        context = new context_1.Context({ plugins: { local: false, sauce: {} } });
                        stub = sandbox.stub(plugin_1.Plugin, 'get').callsFake(function (name) {
                            return Promise.resolve(name);
                        });
                        return [4 /*yield*/, context.plugins()];
                    case 1:
                        plugins = _a.sent();
                        expect(stub).to.have.been.calledOnce;
                        expect(stub).to.have.been.calledWith('sauce');
                        expect(plugins).to.have.members(['sauce']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('excludes plugins disabled: true', function () { return __awaiter(void 0, void 0, void 0, function () {
            var context, stub, plugins;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        context = new context_1.Context({ plugins: { local: {}, sauce: { disabled: true } } });
                        stub = sandbox.stub(plugin_1.Plugin, 'get').callsFake(function (name) {
                            return Promise.resolve(name);
                        });
                        return [4 /*yield*/, context.plugins()];
                    case 1:
                        plugins = _a.sent();
                        expect(stub).to.have.been.calledOnce;
                        expect(stub).to.have.been.calledWith('local');
                        expect(plugins).to.have.members(['local']);
                        return [2 /*return*/];
                }
            });
        }); });
        describe('hook handlers with non-callback second argument', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it('are passed the "done" callback function instead of the argument passed to emitHook', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var context;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                context = new context_1.Context();
                                context.hook('foo', function (arg1, done) {
                                    expect(arg1).to.eq('hookArg');
                                    done();
                                });
                                return [4 /*yield*/, context.emitHook('foo', 'hookArg')];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe('hook handlers written to call callbacks', function () {
            it('passes additional arguments through', function () { return __awaiter(void 0, void 0, void 0, function () {
                var context, error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            context = new context_1.Context();
                            context.hook('foo', function (arg1, arg2, hookDone) {
                                expect(arg1).to.eq('one');
                                expect(arg2).to.eq(2);
                                hookDone();
                            });
                            // Tests the promise form of emitHook.
                            return [4 /*yield*/, context.emitHook('foo', 'one', 2)];
                        case 1:
                            // Tests the promise form of emitHook.
                            _a.sent();
                            return [4 /*yield*/, new Promise(function (resolve) {
                                    context.emitHook('foo', 'one', 2, resolve);
                                })];
                        case 2:
                            error = _a.sent();
                            expect(error).to.not.be.ok;
                            return [2 /*return*/];
                    }
                });
            }); });
            it('halts on error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var context, error_1, error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            context = new context_1.Context();
                            context.hook('bar', function (hookDone) {
                                hookDone('nope');
                            });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, context.emitHook('bar')];
                        case 2:
                            _a.sent();
                            throw new Error('emitHook should have thrown');
                        case 3:
                            error_1 = _a.sent();
                            expect(error_1).to.eq('nope');
                            return [3 /*break*/, 4];
                        case 4: return [4 /*yield*/, new Promise(function (resolve) {
                                context.emitHook('bar', resolve);
                            })];
                        case 5:
                            error = _a.sent();
                            expect(error).to.eq('nope');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('hooks handlers written to return promises', function () {
            it('passes additional arguments through', function () { return __awaiter(void 0, void 0, void 0, function () {
                var context, error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            context = new context_1.Context();
                            context.hook('foo', function (arg1, arg2) {
                                return __awaiter(this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        expect(arg1).to.eq('one');
                                        expect(arg2).to.eq(2);
                                        return [2 /*return*/];
                                    });
                                });
                            });
                            return [4 /*yield*/, context.emitHook('foo', 'one', 2)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, new Promise(function (resolve) {
                                    context.emitHook('foo', 'one', 2, resolve);
                                })];
                        case 2:
                            error = _a.sent();
                            expect(error).to.not.be.ok;
                            return [2 /*return*/];
                    }
                });
            }); });
            it('halts on error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var context, error_2, error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            context = new context_1.Context();
                            context.hook('bar', function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    throw 'nope';
                                });
                            }); });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, context.emitHook('bar')];
                        case 2:
                            _a.sent();
                            throw new Error('emitHook should have thrown');
                        case 3:
                            error_2 = _a.sent();
                            expect(error_2).to.eq('nope');
                            return [3 /*break*/, 4];
                        case 4: return [4 /*yield*/, new Promise(function (resolve) {
                                context.emitHook('bar', resolve);
                            })];
                        case 5:
                            error = _a.sent();
                            expect(error).to.eq('nope');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
