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
var express = require("express");
var fs = require("fs");
var lodash = require("lodash");
var path = require("path");
var context_1 = require("../../runner/context");
var test_1 = require("../../runner/test");
var setup_test_dir_1 = require("./setup_test_dir");
function parseList(stringList) {
    return (stringList || '')
        .split(',')
        .map(function (item) { return item.trim(); })
        .filter(function (item) { return !!item; });
}
function loadOptionsFile(dir) {
    var filename = path.join(dir, 'wct.conf.json');
    try {
        var jsonOptions = fs.readFileSync(filename, 'utf-8').toString();
        var parsedOptions = JSON.parse(jsonOptions);
        if (parsedOptions !== null && typeof parsedOptions === 'object') {
            return parsedOptions;
        }
        else {
            return {};
        }
    }
    catch (e) {
        return {};
    }
}
var testLocalBrowsers = !process.env.SKIP_LOCAL_BROWSERS;
var testLocalBrowsersList = parseList(process.env.TEST_LOCAL_BROWSERS);
var testRemoteBrowsers = process.env.WCT_SAUCE === 'true';
if (testRemoteBrowsers &&
    !(process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY)) {
    throw new Error('Must set SAUCE_USERNAME and SAUCE_ACCESS_KEY when WCT_SAUCE is set.');
}
var testRemoteBrowsersList = parseList(process.env.TEST_REMOTE_BROWSERS);
if (testRemoteBrowsersList.length === 0) {
    testRemoteBrowsersList.push('default');
}
function isVariantsGolden(golden) {
    return !!golden['variants'];
}
var TestResults = /** @class */ (function () {
    function TestResults() {
        this.variants = {};
        this.runError = null;
        this.testRunnerError = null;
    }
    TestResults.prototype.getVariantResults = function (variantName) {
        this.variants[variantName] =
            this.variants[variantName] || new VariantResults();
        return this.variants[variantName];
    };
    return TestResults;
}());
var VariantResults = /** @class */ (function () {
    function VariantResults() {
        this.tests = {};
        this.testErrors = {};
        this.stats = {};
        this.errors = {};
    }
    return VariantResults;
}());
// Tests
/** Describes all suites, mixed into the environments being run. */
function runsAllIntegrationSuites(options) {
    if (options === void 0) { options = {}; }
    var integrationDirnames = fs.readdirSync(integrationDir).filter(function (fn) { return fn !== 'temp'; });
    var suitesToOnly = new Set([]);
    // TODO(#421): `missing` correctly fails, but currently it times out which
    //     takes ~2 minutes.
    var suitesToSkip = new Set([
        'missing',
        // https://github.com/Polymer/tools/issues/289
        'multiple-component_dirs',
    ]);
    for (var _i = 0, integrationDirnames_1 = integrationDirnames; _i < integrationDirnames_1.length; _i++) {
        var fn = integrationDirnames_1[_i];
        var config_1 = suitesToOnly.has(fn) ?
            'only' :
            suitesToSkip.has(fn) ? 'skip' : 'normal';
        runIntegrationSuiteForDir(fn, options, config_1);
    }
}
function runIntegrationSuiteForDir(dirname, options, howToRun) {
    runsIntegrationSuite(dirname, options, howToRun, function (testResults) {
        var golden = JSON.parse(fs.readFileSync(path.join(integrationDir, dirname, 'golden.json'), 'utf-8'));
        var variantsGolden;
        if (isVariantsGolden(golden)) {
            variantsGolden = golden;
        }
        else {
            variantsGolden = { variants: { '': golden } };
        }
        it('ran the correct variants', function () {
            chai_1.expect(Object.keys(testResults.variants).sort())
                .to.deep.equal(Object.keys(variantsGolden.variants).sort());
        });
        var _loop_1 = function (variantName) {
            var run = function () { return assertVariantResultsConformToGolden(variantsGolden.variants[variantName], testResults.getVariantResults(variantName)); };
            if (variantName !== '') {
                describe("the variant with bower_components-" + variantName, run);
            }
            else {
                run();
            }
        };
        for (var variantName in variantsGolden.variants) {
            _loop_1(variantName);
        }
    });
}
var integrationDir = path.resolve(__dirname, '../fixtures/integration');
/**
 * Creates a mocha context that runs an integration suite (once), and hangs onto
 * the output for tests.
 */
function runsIntegrationSuite(dirName, options, howToRun, contextFunction) {
    var suiteName = "integration fixture dir '" + dirName + "'";
    var describer = describe;
    if (howToRun === 'skip') {
        describer = describe.skip;
    }
    else if (howToRun === 'only') {
        describer = describe.only;
    }
    describer(suiteName, function () {
        var log = [];
        var testResults = new TestResults();
        before(function () {
            return __awaiter(this, void 0, void 0, function () {
                var suiteRoot, suiteOptions, allOptions, context, addEventHandler, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, setup_test_dir_1.makeProperTestDir(dirName)];
                        case 1:
                            suiteRoot = _a.sent();
                            suiteOptions = loadOptionsFile(path.join('test', 'fixtures', 'integration', dirName));
                            // Filter the list of browsers within the suite's options by the
                            // global overrides if they are present.
                            if (suiteOptions.plugins !== undefined) {
                                if (suiteOptions.plugins.local && !testLocalBrowsers) {
                                    delete suiteOptions.plugins.local;
                                }
                                else if (testLocalBrowsersList.length > 0 &&
                                    !testLocalBrowsersList.includes('default') &&
                                    suiteOptions.plugins.local !== undefined &&
                                    suiteOptions.plugins.local.browsers !== undefined) {
                                    suiteOptions.plugins.local.browsers =
                                        suiteOptions.plugins.local.browsers.filter(function (b) { return testLocalBrowsersList.includes(b); });
                                }
                                if (suiteOptions.plugins.sauce && !testRemoteBrowsers) {
                                    delete suiteOptions.plugins.sauce;
                                }
                                else if (testRemoteBrowsersList.length > 0 &&
                                    suiteOptions.plugins.sauce !== undefined &&
                                    suiteOptions.plugins.sauce.browsers !== undefined) {
                                    suiteOptions.plugins.sauce.browsers =
                                        suiteOptions.plugins.sauce.browsers.filter(function (b) { return testRemoteBrowsersList.includes(b); });
                                }
                            }
                            allOptions = Object.assign({
                                output: { write: log.push.bind(log) },
                                ttyOutput: false,
                                root: suiteRoot,
                                browserOptions: {
                                    name: 'web-component-tester',
                                    tags: ['org:Polymer', 'repo:web-component-tester']
                                }
                            }, options, suiteOptions);
                            context = new context_1.Context(allOptions);
                            addEventHandler = function (name, handler) {
                                context.on(name, function () {
                                    try {
                                        handler.apply(null, arguments);
                                    }
                                    catch (error) {
                                        console.error("Error inside " + name + " handler in integration tests:");
                                        console.error(error.stack);
                                    }
                                });
                            };
                            addEventHandler('test-end', function (browserDef, data, stats) {
                                var variantResults = testResults.getVariantResults(browserDef.variant || '');
                                var browserName = getBrowserName(browserDef);
                                variantResults.stats[browserName] = stats;
                                var testNode = (variantResults.tests[browserName] =
                                    variantResults.tests[browserName] || {});
                                var errorNode = variantResults.testErrors[browserName] =
                                    variantResults.testErrors[browserName] || {};
                                for (var i = 0; i < data.test.length; i++) {
                                    var name_1 = data.test[i];
                                    testNode = (testNode[name_1] = testNode[name_1] || {});
                                    if (i < data.test.length - 1) {
                                        errorNode = errorNode[name_1] = errorNode[name_1] || {};
                                    }
                                    else if (data.error) {
                                        errorNode[name_1] = data.error;
                                    }
                                }
                                testNode.state = data.state;
                            });
                            addEventHandler('browser-end', function (browserDef, error, stats) {
                                var variantResults = testResults.getVariantResults(browserDef.variant || '');
                                var browserName = getBrowserName(browserDef);
                                variantResults.stats[browserName] = stats;
                                variantResults.errors[browserName] = error || null;
                            });
                            addEventHandler('run-end', function (error) {
                                testResults.runError = error;
                            });
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, test_1.test(context)];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            testResults.testRunnerError = error_1.message;
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        });
        afterEach(function () {
            if (this.currentTest.state === 'failed') {
                process.stderr.write("\n    Output of wct for integration suite named `" + dirName + "`" +
                    "\n" +
                    "    ======================================================\n\n");
                for (var _i = 0, _a = log.join('').split('\n'); _i < _a.length; _i++) {
                    var line = _a[_i];
                    process.stderr.write("    " + line + "\n");
                }
                process.stderr.write("\n    ======================================================\n\n");
            }
        });
        contextFunction(testResults);
    });
}
if (testLocalBrowsers) {
    describe('Local Browser Tests', function () {
        runsAllIntegrationSuites({
            plugins: {
                local: {
                    browsers: testLocalBrowsersList,
                    skipSeleniumInstall: true
                }
            }
        });
    });
}
if (testRemoteBrowsers) {
    describe('Remote Browser Tests', function () {
        runsAllIntegrationSuites({
            plugins: {
                sauce: {
                    browsers: testRemoteBrowsersList
                }
            }
        });
    });
}
/** Assert that all browsers passed. */
function assertPassed(context) {
    if (context.runError) {
        console.error(context.runError.stack || context.runError.message || context.runError);
    }
    if (context.testRunnerError) {
        console.error(context.testRunnerError.stack || context.testRunnerError.message ||
            context.testRunnerError);
    }
    chai_1.expect(context.runError).to.not.be.ok;
    chai_1.expect(context.testRunnerError).to.not.be.ok;
    // expect(context.errors).to.deep.equal(repeatBrowsers(context, null));
}
function assertFailed(context, expectedError) {
    // expect(context.runError).to.eq(expectedError);
    // expect(context.testRunnerError).to.be.eq(expectedError);
    chai_1.expect(context.errors).to.deep.equal(repeatBrowsers(context, expectedError));
}
/** Asserts that all browsers match the given stats. */
function assertStats(context, passing, pending, failing, status) {
    var expected = { passing: passing, pending: pending, failing: failing, status: status };
    chai_1.expect(context.stats).to.deep.equal(repeatBrowsers(context, expected));
}
/** Asserts that all browsers match the given test layout. */
function assertTests(context, expected) {
    chai_1.expect(context.tests).to.deep.equal(repeatBrowsers(context, expected));
}
/** Asserts that all browsers emitted the given errors. */
function assertTestErrors(context, expected) {
    lodash.each(context.testErrors, function (actual, browser) {
        chai_1.expect(Object.keys(expected))
            .to.have.members(Object.keys(actual), 'Test file mismatch for ' + browser +
            (": expected " + JSON.stringify(Object.keys(expected)) + " - got " + JSON.stringify(Object.keys(actual))));
        lodash.each(actual, function (errors, file) {
            var expectedErrors = expected[file];
            // Currently very dumb for simplicity: We don't support suites.
            chai_1.expect(Object.keys(expectedErrors))
                .to.have.members(Object.keys(errors), "Test failure mismatch for " + file + " on " + browser);
            lodash.each(errors, function (error, test) {
                var locationInfo = "for " + file + " - \"" + test + "\" on " + browser;
                var expectedError = expectedErrors[test];
                var stackLines = error.stack.split('\n');
                chai_1.expect(error.message)
                    .to.eq(expectedError[0], "Error message mismatch " + locationInfo);
                // Chai fails to emit stacks for Firefox.
                // https://github.com/chaijs/chai/issues/100
                if (browser.match(/firefox|internet explorer 11/)) {
                    return;
                }
                var expectedErrorText = expectedError[0];
                var stackTraceMatcher = expectedError[1];
                chai_1.expect(stackLines[0]).to.eq(expectedErrorText);
                chai_1.expect(stackLines[stackLines.length - 1])
                    .to.match(new RegExp(stackTraceMatcher), "error.stack=\"" + error.stack + "\"");
            });
        });
    });
}
function assertVariantResultsConformToGolden(golden, variantResults) {
    // const variantResults = testResults.getVariantResults('');
    it('records the correct result stats', function () {
        try {
            assertStats(variantResults, golden.passing, golden.pending, golden.failing, golden.status);
        }
        catch (_) {
            // mocha reports twice the failures because reasons
            // https://github.com/mochajs/mocha/issues/2083
            assertStats(variantResults, golden.passing, golden.pending, golden.failing * 2, golden.status);
        }
    });
    if (golden.passing + golden.pending + golden.failing === 0 && !golden.tests) {
        return;
    }
    it('runs the correct tests', function () {
        assertTests(variantResults, golden.tests);
    });
    if (golden.errors || golden.failing > 0) {
        it('emits well formed errors', function () {
            assertTestErrors(variantResults, golden.errors);
        });
    }
    // it('passed the test', function() {
    //   assertPassed(testResults);
    // });
}
function getBrowserName(browser) {
    var parts = [];
    if (browser.platform && !browser.deviceName) {
        parts.push(browser.platform);
    }
    parts.push(browser.deviceName || browser.browserName);
    if (browser.version) {
        parts.push(browser.version);
    }
    if (browser.variant) {
        parts.push("[" + browser.variant + "]");
    }
    return parts.join(' ');
}
function repeatBrowsers(context, data) {
    chai_1.expect(Object.keys(context.stats).length)
        .to.be.greaterThan(0, 'No browsers were run. Bad environment?');
    return lodash.mapValues(context.stats, function () { return data; });
}
if (testLocalBrowsers) {
    describe('define:webserver hook', function () {
        it('supports substituting given app', function () {
            return __awaiter(this, void 0, void 0, function () {
                var suiteRoot, log, requestedUrls, options, context;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, setup_test_dir_1.makeProperTestDir('define-webserver-hook')];
                        case 1:
                            suiteRoot = _a.sent();
                            log = [];
                            requestedUrls = [];
                            options = {
                                output: { write: log.push.bind(log) },
                                ttyOutput: false,
                                root: suiteRoot,
                                browserOptions: {
                                    name: 'web-component-tester',
                                    tags: ['org:Polymer', 'repo:web-component-tester']
                                },
                                plugins: {
                                    local: {
                                        browsers: testLocalBrowsersList,
                                        skipSeleniumInstall: true
                                    }
                                }
                            };
                            context = new context_1.Context(options);
                            context.hook('define:webserver', function (app, assign, _options, done) {
                                var newApp = express();
                                newApp.get('*', function (request, _response, next) {
                                    requestedUrls.push(request.url);
                                    next();
                                });
                                newApp.use(app);
                                assign(newApp);
                                done();
                            });
                            return [4 /*yield*/, test_1.test(context)];
                        case 2:
                            _a.sent();
                            // Our middleware records all the requested urls into this requestedUrls
                            // array, so we can test that the middleware works by inspecting it for
                            // expected tests.html file which should be loaded by index.html
                            chai_1.expect(requestedUrls)
                                .to.include('/components/define-webserver-hook/test/tests.html');
                            return [2 /*return*/, true];
                    }
                });
            });
        });
    });
    describe('early failures', function () {
        it("wct doesn't start testing if it's not bower installed locally", function () {
            return __awaiter(this, void 0, void 0, function () {
                var log, options, context, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            log = [];
                            options = {
                                output: { write: log.push.bind(log) },
                                ttyOutput: false,
                                root: path.join(__dirname, '..', 'fixtures', 'integration', 'components_dir'),
                                browserOptions: {
                                    name: 'web-component-tester',
                                    tags: ['org:Polymer', 'repo:web-component-tester']
                                },
                                plugins: {
                                    local: { browsers: testLocalBrowsersList, skipSeleniumInstall: true }
                                }
                            };
                            context = new context_1.Context(options);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, test_1.test(context)];
                        case 2:
                            _a.sent();
                            throw new Error('Expected test() to fail!');
                        case 3:
                            e_1 = _a.sent();
                            chai_1.expect(e_1.message).to.match(/The web-component-tester Bower package is not installed as a dependency of this project/);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        });
        it('fails if the client side library is out of allowed version range', function () {
            return __awaiter(this, void 0, void 0, function () {
                var log, options, context, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            log = [];
                            options = {
                                output: { write: log.push.bind(log) },
                                ttyOutput: false,
                                root: path.join(__dirname, '..', 'fixtures', 'early-failure'),
                                browserOptions: {
                                    name: 'web-component-tester',
                                    tags: ['org:Polymer', 'repo:web-component-tester']
                                },
                                plugins: {
                                    local: { browsers: testLocalBrowsersList, skipSeleniumInstall: true }
                                }
                            };
                            context = new context_1.Context(options);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, test_1.test(context)];
                        case 2:
                            _a.sent();
                            throw new Error('Expected test() to fail!');
                        case 3:
                            e_2 = _a.sent();
                            chai_1.expect(e_2.message).to.match(/The web-component-tester Bower package installed is incompatible with the\n\s*wct node package you're using/);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        });
    });
}
