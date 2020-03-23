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
var fs = require("fs");
var glob = require("glob");
var _ = require("lodash");
var path = require("path");
var util_1 = require("util");
/**
 * Expands a series of path patterns (globs, files, directories) into a set of
 * files that represent those patterns.
 *
 * @param baseDir The directory that patterns are relative to.
 * @param patterns The patterns to expand.
 * @returns The expanded paths.
 */
function expand(baseDir, patterns) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = expandDirectories;
                    _b = [baseDir];
                    return [4 /*yield*/, unglob(baseDir, patterns)];
                case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
            }
        });
    });
}
exports.expand = expand;
/**
 * Expands any glob expressions in `patterns`.
 */
function unglob(baseDir, patterns) {
    return __awaiter(this, void 0, void 0, function () {
        var strs, pGlob, _i, patterns_1, pattern, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    strs = [];
                    pGlob = util_1.promisify(glob);
                    _i = 0, patterns_1 = patterns;
                    _c.label = 1;
                case 1:
                    if (!(_i < patterns_1.length)) return [3 /*break*/, 4];
                    pattern = patterns_1[_i];
                    _b = (_a = strs).push;
                    return [4 /*yield*/, pGlob(String(pattern), { cwd: baseDir, root: baseDir })];
                case 2:
                    _b.apply(_a, [_c.sent()]);
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: 
                // for non-POSIX support, replacing path separators
                return [2 /*return*/, _.union(_.flatten(strs)).map(function (str) { return str.replace(/\//g, path.sep); })];
            }
        });
    });
}
/**
 * Expands any directories in `patterns`, following logic similar to a web
 * server.
 *
 * If a pattern resolves to a directory, that directory is expanded. If the
 * directory contains an `index.html`, it is expanded to that. Otheriwse, the
 * it expands into its children (recursively).
 */
function expandDirectories(baseDir, paths) {
    return __awaiter(this, void 0, void 0, function () {
        var listsOfPaths, _i, paths_1, aPath, _a, _b, files;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    listsOfPaths = [];
                    _i = 0, paths_1 = paths;
                    _c.label = 1;
                case 1:
                    if (!(_i < paths_1.length)) return [3 /*break*/, 4];
                    aPath = paths_1[_i];
                    _b = (_a = listsOfPaths).push;
                    return [4 /*yield*/, expandDirectory(baseDir, aPath)];
                case 2:
                    _b.apply(_a, [_c.sent()]);
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    files = _.union(_.flatten(listsOfPaths));
                    return [2 /*return*/, files.filter(function (file) { return /\.(js|html)$/.test(file); })];
            }
        });
    });
}
function expandDirectory(baseDir, aPath) {
    return __awaiter(this, void 0, void 0, function () {
        var stat, files, children;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, util_1.promisify(fs.stat)(path.resolve(baseDir, aPath))];
                case 1:
                    stat = _a.sent();
                    if (!stat.isDirectory()) {
                        return [2 /*return*/, [aPath]];
                    }
                    return [4 /*yield*/, util_1.promisify(fs.readdir)(path.resolve(baseDir, aPath))];
                case 2:
                    files = _a.sent();
                    // We have an index; defer to that.
                    if (_.includes(files, 'index.html')) {
                        return [2 /*return*/, [path.join(aPath, 'index.html')]];
                    }
                    return [4 /*yield*/, expandDirectories(path.join(baseDir, aPath), files)];
                case 3:
                    children = _a.sent();
                    return [2 /*return*/, children.map(function (child) { return path.join(aPath, child); })];
            }
        });
    });
}
