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
var chai = require("chai");
var _ = require("lodash");
var path = require("path");
var sinon = require("sinon");
var cli = require("../../runner/cli");
var steps = require("../../runner/steps");
var expect = chai.expect;
var wctLocalBrowsers = require('wct-local/lib/browsers');
var FIXTURES = path.resolve(__dirname, '../fixtures/cli');
var LOCAL_BROWSERS = {
    aurora: { browserName: 'aurora', version: '1' },
    canary: { browserName: 'canary', version: '2' },
    chrome: { browserName: 'chrome', version: '3' },
    firefox: { browserName: 'firefox', version: '4' }
};
describe('cli', function () {
    var sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        sandbox.stub(steps, 'prepare')
            .callsFake(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, undefined];
        }); }); });
        sandbox.stub(steps, 'runTests')
            .callsFake(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, undefined];
        }); }); });
        sandbox.stub(wctLocalBrowsers, 'detect')
            .callsFake(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, _.omit(LOCAL_BROWSERS, 'aurora')];
        }); }); });
        sandbox.stub(wctLocalBrowsers, 'supported')
            .callsFake(function () { return _.keys(LOCAL_BROWSERS); });
    });
    afterEach(function () {
        sandbox.restore();
    });
    describe('.run', function () {
        var expectRun = function (args, logInput) { return __awaiter(void 0, void 0, void 0, function () {
            var log, stream, error_1, call;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log = logInput || [];
                        stream = { write: log.push.bind(log) };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, cli.run({}, args, stream)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        log.forEach(function (line) { return process.stderr.write(line); });
                        throw error_1;
                    case 4:
                        call = steps.runTests['getCall'](0);
                        return [2 /*return*/, call.args[0]];
                }
            });
        }); };
        it('honors --version flags', function () { return __awaiter(void 0, void 0, void 0, function () {
            var version, output;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        version = require('../../package.json').version;
                        return [4 /*yield*/, cli.run({}, ['--version'], { write: function (o) { return output = o; } })];
                    case 1:
                        _a.sent();
                        expect(output).to.eq(version + "\n");
                        return [4 /*yield*/, cli.run({}, ['-V'], { write: function (o) { return output = o; } })];
                    case 2:
                        _a.sent();
                        expect(output).to.eq(version + "\n");
                        return [2 /*return*/];
                }
            });
        }); });
        it('expands test/ by default, ' +
            'and serves from /components/<basename>', function () { return __awaiter(void 0, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        process.chdir(path.join(FIXTURES, 'standard'));
                        return [4 /*yield*/, expectRun([])];
                    case 1:
                        options = (_a.sent()).options;
                        expect(options.suites).to.have.members([
                            'test/a.html',
                            'test/b.js',
                        ]);
                        expect(options.root).to.equal(path.join(FIXTURES, 'standard'));
                        return [2 /*return*/];
                }
            });
        }); });
        it('honors globs', function () { return __awaiter(void 0, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        process.chdir(path.join(FIXTURES, 'standard'));
                        return [4 /*yield*/, expectRun(['**/*.html'])];
                    case 1:
                        options = (_a.sent()).options;
                        expect(options.suites).to.have.members([
                            'test/a.html',
                            'x-foo.html',
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('honors expanded files', function () { return __awaiter(void 0, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        process.chdir(path.join(FIXTURES, 'standard'));
                        return [4 /*yield*/, expectRun(['test/b.js', 'x-foo.html'])];
                    case 1:
                        options = (_a.sent()).options;
                        expect(options.suites).to.have.members([
                            'test/b.js',
                            'x-foo.html',
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('honors --root with no specified suites', function () { return __awaiter(void 0, void 0, void 0, function () {
            var root, options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        process.chdir(__dirname);
                        root = path.join(FIXTURES, 'standard');
                        return [4 /*yield*/, expectRun(['--root', root])];
                    case 1:
                        options = (_a.sent()).options;
                        expect(options.suites).to.have.members([
                            'test/a.html',
                            'test/b.js',
                        ]);
                        expect(options.root).to.equal(root);
                        return [2 /*return*/];
                }
            });
        }); });
        it('honors --root with specified suites', function () { return __awaiter(void 0, void 0, void 0, function () {
            var root, options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        process.chdir(__dirname);
                        root = path.join(FIXTURES, 'standard');
                        return [4 /*yield*/, expectRun(['--root', root, '**/*.html'])];
                    case 1:
                        options = (_a.sent()).options;
                        expect(options.suites).to.have.members([
                            'test/a.html',
                            'x-foo.html',
                        ]);
                        expect(options.root).to.equal(root);
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if no suites could be found', function () { return __awaiter(void 0, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, cli.run({}, ['404'], { write: function () { } })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        expect(error_2).to.match(/no.*suites.*found/i);
                        return [2 /*return*/];
                    case 3: throw new Error('cli.run should have failed');
                }
            });
        }); });
        it('loads the local and sauce plugins by default', function () { return __awaiter(void 0, void 0, void 0, function () {
            var context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        process.chdir(path.join(FIXTURES, 'standard'));
                        return [4 /*yield*/, expectRun([])];
                    case 1:
                        context = _a.sent();
                        expect(context.enabledPlugins()).to.have.members(['local', 'sauce']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('allows plugins to be diabled via --skip-plugin', function () { return __awaiter(void 0, void 0, void 0, function () {
            var context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        process.chdir(path.join(FIXTURES, 'standard'));
                        return [4 /*yield*/, expectRun(['--skip-plugin', 'sauce'])];
                    case 1:
                        context = _a.sent();
                        expect(context.enabledPlugins()).to.have.members(['local']);
                        return [2 /*return*/];
                }
            });
        }); });
        // TODO(nevir): Remove after deprecation period.
        it('throws an error when --webRunner is set', function () {
            return cli.run({}, ['--webRunner', 'foo'], { write: function () { } })
                .then(function () {
                throw new Error('cli.run should have failed');
            }, function (error) {
                expect(error.message).to.include('webRunner');
                expect(error.message).to.include('suites');
            });
        });
        describe('with wct.conf.js', function () {
            var ROOT = path.join(FIXTURES, 'conf');
            it('serves from /components/<basename>', function () { return __awaiter(void 0, void 0, void 0, function () {
                var options;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            process.chdir(ROOT);
                            return [4 /*yield*/, expectRun([])];
                        case 1:
                            options = (_a.sent()).options;
                            expect(options.suites).to.have.members([
                                'test/foo.js',
                            ]);
                            expect(options.root).to.equal(ROOT);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('walks the ancestry', function () { return __awaiter(void 0, void 0, void 0, function () {
                var options;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            process.chdir(path.join(ROOT, 'branch/leaf'));
                            return [4 /*yield*/, expectRun([])];
                        case 1:
                            options = (_a.sent()).options;
                            expect(options.suites).to.have.members([
                                'test/foo.js',
                            ]);
                            expect(options.root).to.equal(ROOT);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('honors specified values', function () { return __awaiter(void 0, void 0, void 0, function () {
                var options;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            process.chdir(ROOT);
                            return [4 /*yield*/, expectRun([])];
                        case 1:
                            options = (_a.sent()).options;
                            expect(options.plugins['sauce'].username).to.eq('abc123');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('honors root', function () { return __awaiter(void 0, void 0, void 0, function () {
                var options;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            process.chdir(path.join(ROOT, 'rooted'));
                            return [4 /*yield*/, expectRun([])];
                        case 1:
                            options = (_a.sent()).options;
                            expect(options.suites).to.have.members([
                                'cli/conf/test/foo.js',
                            ]);
                            expect(options.root).to.equal(path.dirname(FIXTURES));
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('deprecated flags', function () {
            beforeEach(function () {
                process.chdir(path.join(FIXTURES, 'standard'));
            });
            describe('--browsers', function () {
                it('warns when used', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var log, hasWarning;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                log = [];
                                return [4 /*yield*/, expectRun(['--browsers', 'firefox'], log)];
                            case 1:
                                _a.sent();
                                hasWarning = _.some(log, function (l) { return /--browsers.*deprecated/i.test(l); });
                                expect(hasWarning)
                                    .to.eq(true, 'Expected a warning that --browsers is deprecated');
                                return [2 /*return*/];
                        }
                    });
                }); });
                // Semi-integration test.
                // This also checks that wct-local (mostly) works.
                it('supports local browsers', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var args, options, names;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                args = ['--browsers', 'firefox', '-b', 'chrome'];
                                return [4 /*yield*/, expectRun(args)];
                            case 1:
                                options = (_a.sent()).options;
                                names = options.activeBrowsers.map(function (browser) { return browser.browserName; });
                                expect(names).to.have.members(['firefox', 'chrome']);
                                return [2 /*return*/];
                        }
                    });
                }); });
                // Semi-integration test.
                // This also checks that wct-sauce (mostly) works.
                it('supports sauce browsers', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var args, options, names;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                args = ['--browsers', 'linux/firefox', '-b', 'linux/chrome'];
                                return [4 /*yield*/, expectRun(args)];
                            case 1:
                                options = (_a.sent()).options;
                                names = options.activeBrowsers.map(function (browser) { return browser.browserName; });
                                expect(names).to.have.members(['firefox', 'chrome']);
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('--remote', function () {
                it('warns when used', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var log, hasWarning;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                log = [];
                                return [4 /*yield*/, expectRun(['--remote'], log)];
                            case 1:
                                _a.sent();
                                hasWarning = _.some(log, function (l) { return /--remote.*--sauce/.test(l); });
                                expect(hasWarning)
                                    .to.eq(true, 'Expected a warning that --remote is deprecated');
                                return [2 /*return*/];
                        }
                    });
                }); });
                // Semi-integration test.
                // This also checks that wct-sauce (mostly) works.
                it('sets up default sauce browsers', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var options, platforms;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, expectRun(['--remote'])];
                            case 1:
                                options = (_a.sent()).options;
                                platforms = options.activeBrowsers.map(function (browser) { return browser.platform; });
                                expect(_.compact(platforms).length).to.be.gt(0);
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
    });
});
