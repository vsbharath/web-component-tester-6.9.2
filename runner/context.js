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
var events = require("events");
var _ = require("lodash");
var config = require("./config");
var plugin_1 = require("./plugin");
var JSON_MATCHER = 'wct.conf.json';
var CONFIG_MATCHER = 'wct.conf.*';
/**
 * Exposes the current state of a WCT run, and emits events/hooks for anyone
 * downstream to listen to.
 *
 * TODO(rictic): break back-compat with plugins by moving hooks entirely away
 *     from callbacks to promises. Easiest way to do this would be to rename
 *     the hook-related methods on this object, so that downstream callers would
 *     break in obvious ways.
 *
 * @param {Object} options Any initially specified options.
 */
var Context = /** @class */ (function (_super) {
    __extends(Context, _super);
    function Context(options) {
        var _this = _super.call(this) || this;
        _this._hookHandlers = {};
        options = options || {};
        var matcher;
        if (options.configFile) {
            matcher = options.configFile;
        }
        else if (options.enforceJsonConf) {
            matcher = JSON_MATCHER;
        }
        else {
            matcher = CONFIG_MATCHER;
        }
        /**
         * The configuration for the current WCT run.
         *
         * We guarantee that this object is never replaced (e.g. you are free to
         * hold a reference to it, and make changes to it).
         */
        _this.options = config.merge(config.defaults(), config.fromDisk(matcher, options.root), options);
        return _this;
    }
    // Hooks
    //
    // In addition to emitting events, a context also exposes "hooks" that
    // interested parties can use to inject behavior.
    /**
     * Registers a handler for a particular hook. Hooks are typically configured
     * to run _before_ a particular behavior.
     */
    Context.prototype.hook = function (name, handler) {
        this._hookHandlers[name] = this._hookHandlers[name] || [];
        this._hookHandlers[name].unshift(handler);
    };
    /**
     * Registers a handler that will run after any handlers registered so far.
     *
     * @param {string} name
     * @param {function(!Object, function(*))} handler
     */
    Context.prototype.hookLate = function (name, handler) {
        this._hookHandlers[name] = this._hookHandlers[name] || [];
        this._hookHandlers[name].push(handler);
    };
    Context.prototype.emitHook = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var hooks, boundHooks, done, argsEnd, hookArgs, hookToPromise, _a, boundHooks_1, hook, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.emit('log:debug', 'hook:', name);
                        hooks = (this._hookHandlers[name] || []);
                        done = function (_err) { };
                        argsEnd = args.length - 1;
                        if (args[argsEnd] instanceof Function) {
                            done = args[argsEnd];
                            argsEnd = argsEnd--;
                        }
                        hookArgs = args.slice(0, argsEnd + 1);
                        // Not really sure what's going on with typings here.
                        boundHooks = hooks.map(function (hook) { return hook.bind.apply(hook, [null].concat(hookArgs)); });
                        if (!boundHooks) {
                            boundHooks = hooks;
                        }
                        hookToPromise = function (hook) {
                            return new Promise(function (resolve, reject) {
                                var maybePromise = hook(function (err) {
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        resolve();
                                    }
                                });
                                if (maybePromise) {
                                    maybePromise.then(resolve, reject);
                                }
                            });
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        _a = 0, boundHooks_1 = boundHooks;
                        _b.label = 2;
                    case 2:
                        if (!(_a < boundHooks_1.length)) return [3 /*break*/, 5];
                        hook = boundHooks_1[_a];
                        return [4 /*yield*/, hookToPromise(hook)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _a++;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        err_1 = _b.sent();
                        // TODO(rictic): stop silently swallowing the error here and just below.
                        //     Looks like we'll need to track down some error being thrown from
                        //     deep inside the express router.
                        try {
                            done(err_1);
                        }
                        catch (_) {
                        }
                        throw err_1;
                    case 7:
                        try {
                            done();
                        }
                        catch (_) {
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @param {function(*, Array<!Plugin>)} done Asynchronously loads the plugins
     *     requested by `options.plugins`.
     */
    Context.prototype.plugins = function () {
        return __awaiter(this, void 0, void 0, function () {
            var plugins, _i, _a, name_1, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        plugins = [];
                        _i = 0, _a = this.enabledPlugins();
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        name_1 = _a[_i];
                        _c = (_b = plugins).push;
                        return [4 /*yield*/, plugin_1.Plugin.get(name_1)];
                    case 2:
                        _c.apply(_b, [_d.sent()]);
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, plugins];
                }
            });
        });
    };
    /**
     * @return {!Array<string>} The names of enabled plugins.
     */
    Context.prototype.enabledPlugins = function () {
        // Plugins with falsy configuration or disabled: true are _not_ loaded.
        var pairs = _.reject(_.pairs(this.options.plugins), function (p) { return !p[1] || p[1].disabled; });
        return _.map(pairs, function (p) { return p[0]; });
    };
    /**
     * @param {string} name
     * @return {!Object}
     */
    Context.prototype.pluginOptions = function (name) {
        return this.options.plugins[plugin_1.Plugin.shortName(name)];
    };
    Context.Context = Context;
    return Context;
}(events.EventEmitter));
exports.Context = Context;
module.exports = Context;
