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
var _ = require("lodash");
var path = require("path");
// Plugin module names can be prefixed by the following:
var PREFIXES = [
    'web-component-tester-',
    'wct-',
];
/**
 * A WCT plugin. This constructor is private. Plugins can be retrieved via
 * `Plugin.get`.
 */
var Plugin = /** @class */ (function () {
    function Plugin(packageName, metadata) {
        this.packageName = packageName;
        this.metadata = metadata;
        this.name = Plugin.shortName(packageName);
        this.cliConfig = this.metadata['cli-options'] || {};
    }
    /**
     * @param {!Context} context The context that this plugin should be evaluated
     *     within.
     */
    Plugin.prototype.execute = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var plugin;
            return __generator(this, function (_a) {
                try {
                    plugin = require(this.packageName);
                    plugin(context, context.pluginOptions(this.name), this);
                }
                catch (error) {
                    throw "Failed to load plugin \"" + this.name + "\": " + error;
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Retrieves a plugin by shorthand or module name (loading it as necessary).
     *
     * @param {string} name
     */
    Plugin.get = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var shortName, names, loaded, prettyNames;
            return __generator(this, function (_a) {
                shortName = Plugin.shortName(name);
                if (_loadedPlugins[shortName]) {
                    return [2 /*return*/, _loadedPlugins[shortName]];
                }
                names = [shortName].concat(PREFIXES.map(function (p) { return p + shortName; }));
                loaded = _.compact(names.map(_tryLoadPluginPackage));
                if (loaded.length > 1) {
                    prettyNames = loaded.map(function (p) { return p.packageName; }).join(' ');
                    throw "Loaded conflicting WCT plugin packages: " + prettyNames;
                }
                if (loaded.length < 1) {
                    throw "Could not find WCT plugin named \"" + name + "\"";
                }
                return [2 /*return*/, loaded[0]];
            });
        });
    };
    /**
     * @param {string} name
     * @return {string} The short form of `name`.
     */
    Plugin.shortName = function (name) {
        for (var _i = 0, PREFIXES_1 = PREFIXES; _i < PREFIXES_1.length; _i++) {
            var prefix = PREFIXES_1[_i];
            if (name.indexOf(prefix) === 0) {
                return name.substr(prefix.length);
            }
        }
        return name;
    };
    // HACK(rictic): Makes es6 style imports happy, so that we can do, e.g.
    //     import {Plugin} from './plugin';
    Plugin.Plugin = Plugin;
    return Plugin;
}());
exports.Plugin = Plugin;
// Plugin Loading
// We maintain an identity map of plugins, keyed by short name.
var _loadedPlugins = {};
/**
 * @param {string} packageName Attempts to load a package as a WCT plugin.
 * @return {Plugin}
 */
function _tryLoadPluginPackage(packageName) {
    var packageInfo;
    try {
        packageInfo = require(path.join(packageName, 'package.json'));
    }
    catch (error) {
        if (error.code !== 'MODULE_NOT_FOUND') {
            console.log(error);
        }
        return null;
    }
    // Plugins must have a (truthy) wct-plugin field.
    if (!packageInfo['wct-plugin']) {
        return null;
    }
    // Allow {"wct-plugin": true} as a shorthand.
    var metadata = _.isObject(packageInfo['wct-plugin']) ? packageInfo['wct-plugin'] : {};
    return new Plugin(packageName, metadata);
}
module.exports = Plugin;
