"use strict";
/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var chalk = require("chalk");
var child_process_1 = require("child_process");
var Mocha = require("mocha");
var retryTargets = parseJSONArray(process.env['TEST_RETRY_TARGETS']);
var retryTargetMax = parseInt(process.env['TEST_RETRY_TARGET_MAX'], 10) || 0;
var retryCount = parseInt(process.env['TEST_RETRY_COUNT'], 10) || 0;
var retryMax = parseInt(process.env['TEST_RETRY_MAX'], 10) || 3;
var initialCurrentWorkingDirectory = process.cwd();
/**
 * The `mocha` command-line *requires* the reporter module to export via:
 * `module.exports =`.
 */
module.exports = /** @class */ (function (_super) {
    __extends(RetryFailuresReporter, _super);
    function RetryFailuresReporter(runner) {
        var _this = _super.call(this, runner) || this;
        var passed = [];
        var fails = [];
        runner.on('pass', function (test) { return passed.push(getFullTitle(test)); });
        runner.on('fail', function (test, _) { return fails.push(getFullTitle(test)); });
        runner.on('end', function () {
            if (retryTargets.length > 0) {
                var missedTargets = getMissedTargets(passed.concat(fails), retryTargets);
                if (missedTargets.length > 0) {
                    runner.abort();
                    console.error(banner("Failed to run intented test target(s):\n" +
                        missedTargets.map(function (t) { return " - " + t; }).join('\n')));
                    process.exit(Math.min(missedTargets.length, 255));
                    return;
                }
            }
            if (fails.length === 0) {
                return;
            }
            if (retryCount >= retryMax) {
                console.error(banner(retryMax + " retries attempted, but still " +
                    ("have " + fails.length + " failure(s).")));
                return;
            }
            if (retryTargetMax > 0 && fails.length > retryTargetMax) {
                console.error(banner("Number of failures (" + fails.length + ") exceeds the specified " +
                    ("maximum number of test targets to retry(" + retryTargetMax + ").")));
                return;
            }
            var args = stripGrepArgs(process.argv.slice(1).concat(process.execArgv))
                .concat(['--grep', __spreadArrays(fails).map(grepEscape).join('|')]);
            runner.abort();
            console.error(banner("Test run produced " + fails.length + " failure(s).\n" +
                "Attempting rerun of failed test targets:\n" +
                fails.map(function (t) { return ' - ' + t; }).join('\n')));
            var retryResults = child_process_1.spawnSync(process.argv0, args, {
                cwd: initialCurrentWorkingDirectory,
                env: Object.assign({}, process.env, {
                    'TEST_RETRY_TARGETS': JSON.stringify(fails),
                    'TEST_RETRY_COUNT': "" + (retryCount + 1)
                }),
                stdio: 'inherit'
            });
            process.exit(retryResults.status);
        });
        return _this;
    }
    return RetryFailuresReporter;
}(Mocha.reporters.Spec));
/**
 * Standard output block to help call out these interstitial messages amidst
 * large test suite outputs.
 */
function banner(text) {
    return chalk.white.bgRed("*************************\n\n" + text + "\n\n*************************");
}
/**
 * When failures happen inside of hooks like "before each" etc, they include the
 * mention of the hook, but since the hook is not a target, we have to strip out
 * those mentions before we can make use of them for `mocha --grep` purposes.
 */
function getFullTitle(test) {
    return test.fullTitle()
        .replace(/^".+" hook for "(.+)"/, '$1')
        .replace(/^(.+) "[^"]+" hook$/, '$1');
}
/**
 * Returns an array of all the expected test targets to retry which do not
 * match any of the actual test targets that were run.
 */
function getMissedTargets(actual, expected) {
    var missedTargets = [];
    var matchedTargets = new Set();
    var _loop_1 = function (a) {
        var match = expected.find(function (e) { return a.startsWith(e); });
        if (match) {
            matchedTargets.add(match);
        }
    };
    for (var _i = 0, actual_1 = actual; _i < actual_1.length; _i++) {
        var a = actual_1[_i];
        _loop_1(a);
    }
    for (var _a = 0, expected_1 = expected; _a < expected_1.length; _a++) {
        var e = expected_1[_a];
        if (!matchedTargets.has(e)) {
            missedTargets.push(e);
        }
    }
    return missedTargets;
}
/**
 * Why is this not a standard function in JavaScript?  Sigh.  Escapes a string
 * to be a literal string for use in a RegExp.
 */
function grepEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
/**
 * Returns an Array parsed from json string, or an empty array if parse fails.
 */
function parseJSONArray(json) {
    try {
        var array = JSON.parse(json);
        if (Array.isArray(array)) {
            return array;
        }
    }
    catch (e) {
    }
    return [];
}
/**
 * Given an array of args from argv, return an array without any grep/fgrep
 * arguments and their values.
 */
function stripGrepArgs(args) {
    var filteredArgs = [];
    var _loop_2 = function (a) {
        var arg = args[a];
        if (['--grep', '-g', '--fgrep', '-f'].includes(arg)) {
            ++a;
            return out_a_1 = a, "continue";
        }
        if (['--grep=', '-g=', 'fgrep=', '-f='].some(function (p) { return arg.startsWith(p); })) {
            return out_a_1 = a, "continue";
        }
        filteredArgs.push(arg);
        out_a_1 = a;
    };
    var out_a_1;
    for (var a = 0; a < args.length; ++a) {
        _loop_2(a);
        a = out_a_1;
    }
    return filteredArgs;
}
