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
var bowerConfig = require("bower-config");
var fs = require("fs");
var path = require("path");
var rimraf = require("rimraf");
var baseDir = path.join(__dirname, '..', 'fixtures', 'integration');
/**
 * Sets up the given integration fixture with proper bower components.
 *
 * For wct to work it needs to be installed in the bower_components directory
 * (or, with variants, in each variant directory). So this copies the given
 * integration test fixture, then sets up symlinks from
 * bower_components/web-component-tester/browser.js to the browser.js of this
 * repo. It also makes symlinks for each of wct's bower dependencies into the
 * integration tests' bower_components dir.
 *
 * @param dirname The basename of an integration fixture directory.
 * @return A fully resolved path to a copy of the fixture directory with
 *   a proper bower_components directory.
 */
function makeProperTestDir(dirname) {
    return __awaiter(this, void 0, void 0, function () {
        var startingDir, tempDir, pathToTestDir, bowerDir, componentsDirs, _i, _a, baseFile, _b, componentsDirs_1, baseComponentsDir, componentsDir, bowerDeps, _c, bowerDeps_1, baseFile, wctDir;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    startingDir = path.join(baseDir, dirname);
                    tempDir = path.join(baseDir, 'temp');
                    return [4 /*yield*/, exists(tempDir)];
                case 1:
                    if (!_d.sent()) return [3 /*break*/, 3];
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            rimraf(tempDir, function (err) { return err ? reject(err) : resolve(); });
                        })];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    fs.mkdirSync(tempDir);
                    return [4 /*yield*/, copyDir(startingDir, tempDir)];
                case 4:
                    pathToTestDir = _d.sent();
                    bowerDir = bowerConfig.read(pathToTestDir).directory;
                    fs.mkdirSync(path.join(pathToTestDir, 'node_modules'));
                    fs.mkdirSync(path.join(pathToTestDir, 'node_modules', 'web-component-tester'));
                    componentsDirs = new Set([bowerDir]);
                    for (_i = 0, _a = fs.readdirSync(startingDir); _i < _a.length; _i++) {
                        baseFile = _a[_i];
                        if (new RegExp(bowerDir + "(-|$)").test(baseFile)) {
                            componentsDirs.add(baseFile);
                        }
                    }
                    _b = 0, componentsDirs_1 = componentsDirs;
                    _d.label = 5;
                case 5:
                    if (!(_b < componentsDirs_1.length)) return [3 /*break*/, 8];
                    baseComponentsDir = componentsDirs_1[_b];
                    componentsDir = path.join(pathToTestDir, baseComponentsDir);
                    return [4 /*yield*/, exists(componentsDir)];
                case 6:
                    if (!(_d.sent())) {
                        fs.mkdirSync(componentsDir);
                    }
                    bowerDeps = fs.readdirSync(path.join(__dirname, '../../bower_components'));
                    for (_c = 0, bowerDeps_1 = bowerDeps; _c < bowerDeps_1.length; _c++) {
                        baseFile = bowerDeps_1[_c];
                        fs.symlinkSync(path.join('../../../../../../bower_components', baseFile), path.join(componentsDir, baseFile));
                    }
                    wctDir = path.join(componentsDir, 'web-component-tester');
                    fs.mkdirSync(wctDir);
                    fs.symlinkSync('../../../../../../../browser.js', path.join(wctDir, 'browser.js'), 'file');
                    fs.symlinkSync('../../../../../../../package.json', path.join(wctDir, 'package.json'), 'file');
                    fs.symlinkSync('../../../../../../../data', path.join(wctDir, 'data'), 'dir');
                    _d.label = 7;
                case 7:
                    _b++;
                    return [3 /*break*/, 5];
                case 8: return [2 /*return*/, pathToTestDir];
            }
        });
    });
}
exports.makeProperTestDir = makeProperTestDir;
function copyDir(from, to) {
    return __awaiter(this, void 0, void 0, function () {
        var newDir, _i, _a, baseFile, file, newFile;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    newDir = path.join(to, path.basename(from));
                    fs.mkdirSync(newDir);
                    _i = 0, _a = fs.readdirSync(from);
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    baseFile = _a[_i];
                    file = path.join(from, baseFile);
                    if (!fs.statSync(file).isDirectory()) return [3 /*break*/, 3];
                    return [4 /*yield*/, copyDir(file, newDir)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    newFile = path.join(newDir, baseFile);
                    fs.writeFileSync(newFile, fs.readFileSync(file));
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/, newDir];
            }
        });
    });
}
function exists(fn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) { return fs.stat(fn, function (err) { return resolve(!err); }); })];
        });
    });
}
