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
var wd = require("wd");
// Browser abstraction, responsible for spinning up a browser instance via wd.js
// and executing runner.html test files passed in options.files
var BrowserRunner = /** @class */ (function () {
    /**
     * @param emitter The emitter to send updates about test progress to.
     * @param def A BrowserDef describing and defining the browser to be run.
     *     Includes both metadata and a method for connecting/launching the
     *     browser.
     * @param options WCT options.
     * @param url The url of the generated index.html file that the browser should
     *     point at.
     * @param waitFor Optional. If given, we won't try to start/connect to the
     *     browser until this promise resolves. Used for serializing access to
     *     Safari webdriver, which can only have one instance running at once.
     */
    function BrowserRunner(emitter, def, options, url, waitFor) {
        var _this = this;
        this.emitter = emitter;
        this.def = def;
        this.options = options;
        this.timeout = options.testTimeout;
        this.emitter = emitter;
        this.url = url;
        this.stats = { status: 'initializing' };
        this.donePromise = new Promise(function (resolve, reject) {
            _this._resolve = resolve;
            _this._reject = reject;
        });
        waitFor = waitFor || Promise.resolve();
        waitFor.then(function () {
            _this.browser = wd.remote(_this.def.url);
            // never retry selenium commands
            _this.browser.configureHttp({ retries: -1 });
            cleankill.onInterrupt(function () {
                return new Promise(function (resolve) {
                    if (!_this.browser) {
                        return resolve();
                    }
                    _this.donePromise.then(function () { return resolve(); }, function () { return resolve(); });
                    _this.done('Interrupting');
                });
            });
            _this.browser.on('command', function (method, context) {
                emitter.emit('log:debug', _this.def, chalk.cyan(method), context);
            });
            _this.browser.on('http', function (method, path, data) {
                if (data) {
                    emitter.emit('log:debug', _this.def, chalk.magenta(method), chalk.cyan(path), data);
                }
                else {
                    emitter.emit('log:debug', _this.def, chalk.magenta(method), chalk.cyan(path));
                }
            });
            _this.browser.on('connection', function (code, message, error) {
                emitter.emit('log:warn', _this.def, 'Error code ' + code + ':', message, error);
            });
            _this.emitter.emit('browser-init', _this.def, _this.stats);
            // Make sure that we are passing a pristine capabilities object to
            // webdriver. None of our screwy custom properties!
            var webdriverCapabilities = _.clone(_this.def);
            delete webdriverCapabilities.id;
            delete webdriverCapabilities.url;
            delete webdriverCapabilities.sessionId;
            // Reusing a session?
            if (_this.def.sessionId) {
                _this.browser.attach(_this.def.sessionId, function (error) {
                    _this._init(error, _this.def.sessionId);
                });
            }
            else {
                _this.browser.init(webdriverCapabilities, _this._init.bind(_this));
            }
        });
    }
    BrowserRunner.prototype._init = function (error, sessionId) {
        if (!this.browser) {
            return; // When interrupted.
        }
        if (error) {
            // TODO(nevir): BEGIN TEMPORARY CHECK.
            // https://github.com/Polymer/web-component-tester/issues/51
            if (this.def.browserName === 'safari' && error.data) {
                // debugger;
                try {
                    var data = JSON.parse(error.data);
                    if (data.value && data.value.message &&
                        /Failed to connect to SafariDriver/i.test(data.value.message)) {
                        error = 'Until Selenium\'s SafariDriver supports ' +
                            'Safari 6.2+, 7.1+, & 8.0+, you must\n' +
                            'manually install it. Follow the steps at:\n' +
                            'https://github.com/SeleniumHQ/selenium/' +
                            'wiki/SafariDriver#getting-started';
                    }
                }
                catch (error) {
                    // Show the original error.
                }
            }
            // END TEMPORARY CHECK
            this.done(error.data || error);
        }
        else {
            this.sessionId = sessionId;
            this.startTest();
            this.extendTimeout();
        }
    };
    BrowserRunner.prototype.startTest = function () {
        var _this = this;
        var paramDelim = (this.url.indexOf('?') === -1 ? '?' : '&');
        var extra = paramDelim + "cli_browser_id=" + this.def.id;
        this.browser.get(this.url + extra, function (error) {
            if (error) {
                _this.done(error.data || error);
            }
            else {
                _this.extendTimeout();
            }
        });
    };
    BrowserRunner.prototype.onEvent = function (event, data) {
        this.extendTimeout();
        if (event === 'browser-start') {
            // Always assign, to handle re-runs (no browser-init).
            this.stats = {
                status: 'running',
                passing: 0,
                pending: 0,
                failing: 0
            };
        }
        else if (event === 'test-end') {
            this.stats[data.state] = this.stats[data.state] + 1;
        }
        if (event === 'browser-end' || event === 'browser-fail') {
            this.done(data);
        }
        else {
            this.emitter.emit(event, this.def, data, this.stats, this.browser);
        }
    };
    BrowserRunner.prototype.done = function (error) {
        var _this = this;
        // No quitting for you!
        if (this.options.persistent) {
            return;
        }
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        // Don't double-quit.
        if (!this.browser) {
            return;
        }
        var browser = this.browser;
        this.browser = null;
        this.stats.status = error ? 'error' : 'complete';
        if (!error && this.stats.failing > 0) {
            error = this.stats.failing + ' failed tests';
        }
        this.emitter.emit('browser-end', this.def, error, this.stats, this.sessionId, browser);
        // Nothing to quit.
        if (!this.sessionId) {
            error ? this._reject(error) : this._resolve();
        }
        browser.quit(function (quitError) {
            if (quitError) {
                _this.emitter.emit('log:warn', _this.def, 'Failed to quit:', quitError.data || quitError);
            }
            if (error) {
                _this._reject(error);
            }
            else {
                _this._resolve();
            }
        });
    };
    BrowserRunner.prototype.extendTimeout = function () {
        var _this = this;
        if (this.options.persistent) {
            return;
        }
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.timeoutId = setTimeout(function () {
            _this.done('Timed out');
        }, this.timeout);
    };
    BrowserRunner.prototype.quit = function () {
        this.done('quit was called');
    };
    // HACK
    BrowserRunner.BrowserRunner = BrowserRunner;
    return BrowserRunner;
}());
exports.BrowserRunner = BrowserRunner;
module.exports = BrowserRunner;
