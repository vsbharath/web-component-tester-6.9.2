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
exports.__esModule = true;
var chalk = require("chalk");
var cleankill = require("cleankill");
var _ = require("lodash");
var stacky = require("stacky");
var util = require("util");
var STACKY_CONFIG = {
    indent: '    ',
    locationStrip: [
        /^https?:\/\/[^\/]+/,
        /\?[\d\.]+$/,
    ],
    unimportantLocation: [
        /^\/web-component-tester\//,
    ]
};
var STATE_ICONS = {
    passing: '✓',
    pending: '✖',
    failing: '✖',
    unknown: '?'
};
var STATE_COLORS = {
    passing: chalk.green,
    pending: chalk.yellow,
    failing: chalk.red,
    unknown: chalk.red,
    error: chalk.red
};
var SHORT = {
    'internet explorer': 'IE'
};
var BROWSER_PAD = 24;
var STATUS_PAD = 38;
var CliReporter = /** @class */ (function () {
    function CliReporter(emitter, stream, options) {
        var _this = this;
        this.prettyBrowsers = {};
        this.browserStats = {};
        this.emitter = emitter;
        this.stream = stream;
        this.options = options;
        var testEndEventExpectedNext = false;
        cleankill.onInterrupt(function () {
            return new Promise(function (resolve) {
                _this.flush();
                resolve();
            });
        });
        emitter.on('log:error', this.log.bind(this, chalk.red));
        if (!this.options.quiet) {
            emitter.on('log:warn', this.log.bind(this, chalk.yellow));
            emitter.on('log:info', this.log.bind(this));
            if (this.options.verbose) {
                emitter.on('log:debug', this.log.bind(this, chalk.dim));
            }
        }
        emitter.on('browser-init', function (browser, stats) {
            _this.browserStats[browser.id] = stats;
            _this.prettyBrowsers[browser.id] = _this.prettyBrowser(browser);
            _this.updateStatus();
        });
        emitter.on('browser-start', function (browser, data, stats) {
            _this.browserStats[browser.id] = stats;
            _this.log(browser, 'Beginning tests via', chalk.magenta(data.url));
            _this.updateStatus();
        });
        emitter.on('test-start', function (browser, data, stats) {
            testEndEventExpectedNext = true;
        });
        emitter.on('test-end', function (browser, data, stats) {
            testEndEventExpectedNext = false;
            _this.browserStats[browser.id] = stats;
            if (data.state === 'failing') {
                _this.writeTestError(browser, data);
            }
            else if (_this.options.expanded || _this.options.verbose) {
                _this.log(browser, _this.stateIcon(data.state), _this.prettyTest(data));
            }
            _this.updateStatus();
        });
        emitter.on('browser-end', function (browser, error, stats) {
            _this.browserStats[browser.id] = stats;
            if (error) {
                _this.log(chalk.red, browser, 'Tests failed:', error);
            }
            else {
                if (testEndEventExpectedNext) {
                    _this.log(chalk.red, browser, 'A test setup failed!');
                }
                else {
                    _this.log(chalk.green, browser, 'Tests passed');
                }
            }
        });
        emitter.on('run-end', function (error) {
            if (testEndEventExpectedNext) {
                error = 'A test setup failed!';
            }
            if (error) {
                _this.log(chalk.red, 'Test run ended in failure:', error);
            }
            else {
                _this.log(chalk.green, 'Test run ended with great success');
            }
            if (!_this.options.ttyOutput) {
                _this.updateStatus(true);
            }
        });
    }
    // Specialized Reporting
    CliReporter.prototype.updateStatus = function (force) {
        var _this = this;
        if (!this.options.ttyOutput && !force) {
            return;
        }
        // EXTREME TERMINOLOGY FAIL, but here's a glossary:
        //
        // stats:  An object containing test stats (total, passing, failing, etc).
        // state:  The state that the run is in (running, etc).
        // status: A string representation of above.
        var statuses = Object.keys(this.browserStats).map(function (browserIdStr) {
            var browserId = parseInt(browserIdStr, 10);
            var pretty = _this.prettyBrowsers[browserId];
            var stats = _this.browserStats[browserId];
            var status = '';
            var counts = [stats.passing, stats.pending, stats.failing];
            if (counts[0] > 0 || counts[1] > 0 || counts[2] > 0) {
                if (counts[0] > 0) {
                    counts[0] = chalk.green(counts[0].toString());
                }
                if (counts[1] > 0) {
                    counts[1] = chalk.yellow(counts[1].toString());
                }
                if (counts[2] > 0) {
                    counts[2] = chalk.red(counts[2].toString());
                }
                status = counts.join('/');
            }
            if (stats.status === 'error') {
                status = status + (status === '' ? '' : ' ') + chalk.red('error');
            }
            return padRight(pretty + ' (' + status + ')', STATUS_PAD);
        });
        this.writeWrapped(statuses, '  ');
    };
    CliReporter.prototype.writeTestError = function (browser, data) {
        this.log(browser, this.stateIcon(data.state), this.prettyTest(data));
        var error = data.error || {};
        this.write('\n');
        var prettyMessage = error.message || error;
        if (typeof prettyMessage !== 'string') {
            prettyMessage = util.inspect(prettyMessage);
        }
        this.write(chalk.red('  ' + prettyMessage));
        if (error.stack) {
            try {
                this.write(stacky.pretty(data.error.stack, STACKY_CONFIG));
            }
            catch (err) {
                // If we couldn't extract a stack (i.e. there was no stack), the message
                // is enough.
            }
        }
        this.write('\n');
    };
    // Object Formatting
    CliReporter.prototype.stateIcon = function (state) {
        var color = STATE_COLORS[state] || STATE_COLORS['unknown'];
        return color(STATE_ICONS[state] || STATE_ICONS.unknown);
    };
    CliReporter.prototype.prettyTest = function (data) {
        var color = STATE_COLORS[data.state] || STATE_COLORS['unknown'];
        return color(data.test.join(' » ') || '<unknown test>');
    };
    CliReporter.prototype.prettyBrowser = function (browser) {
        var parts = [];
        if (browser.platform && !browser.deviceName) {
            parts.push(browser.platform);
        }
        var name = browser.deviceName || browser.browserName;
        parts.push(SHORT[name] || name);
        if (browser.version) {
            parts.push(browser.version);
        }
        if (browser.variant) {
            parts.push("[" + browser.variant + "]");
        }
        return chalk.blue(parts.join(' '));
    };
    CliReporter.prototype.log = function () {
        var values = Array.from(arguments);
        var format;
        if (_.isFunction(values[0])) {
            format = values[0];
            values = values.slice(1);
        }
        if (values[0] && values[0].browserName) {
            values[0] = padRight(this.prettyBrowser(values[0]), BROWSER_PAD);
        }
        var line = _.toArray(values)
            .map(function (value) { return _.isString(value) ? value : util.inspect(value); })
            .join(' ');
        line = line.replace(/[\s\n\r]+$/, '');
        if (format) {
            line = format(line);
        }
        this.write(line);
    };
    CliReporter.prototype.writeWrapped = function (blocks, separator) {
        if (blocks.length === 0) {
            return;
        }
        var lines = [''];
        var width = this.stream.columns || 0;
        for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
            var block = blocks_1[_i];
            var line = lines[lines.length - 1];
            var combined = line + separator + block;
            if (line === '') {
                lines[lines.length - 1] = block;
            }
            else if (chalk.stripColor(combined).length <= width) {
                lines[lines.length - 1] = combined;
            }
            else {
                lines.push(block);
            }
        }
        this.writeLines(['\n'].concat(lines));
        if (this.options.ttyOutput) {
            this.stream.write('\r');
            this.stream.write('\u001b[' + (lines.length + 1) + 'A');
        }
    };
    CliReporter.prototype.write = function (line) {
        this.writeLines([line]);
        this.updateStatus();
    };
    CliReporter.prototype.writeLines = function (lines) {
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            if (line[line.length - 1] !== '\n') {
                line = line + '\n';
            }
            if (this.options.ttyOutput) {
                line = '\u001b[J' + line;
            }
            this.stream.write(line);
        }
        this.linesWritten = lines.length;
    };
    CliReporter.prototype.flush = function () {
        if (!this.options.ttyOutput) {
            return;
        }
        // Add an extra line for padding.
        for (var i = 0; i <= this.linesWritten; i++) {
            this.stream.write('\n');
        }
    };
    // HACK
    CliReporter.CliReporter = CliReporter;
    return CliReporter;
}());
exports.CliReporter = CliReporter;
// Yeah, yeah.
function padRight(str, length) {
    var currLength = chalk.stripColor(str).length;
    while (currLength < length) {
        currLength = currLength + 1;
        str = str + ' ';
    }
    return str;
}
module.exports = CliReporter;
