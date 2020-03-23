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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var chalk = require("chalk");
var test_1 = require("./test");
function init(gulp, dependencies) {
    if (!dependencies) {
        dependencies = [];
    }
    gulp.task('wct:local', gulp.series(__spreadArrays(dependencies, [
        function () { return test_1.test({ plugins: { local: {}, sauce: false } })["catch"](cleanError); }
    ])));
    gulp.task('wct:sauce', gulp.series(__spreadArrays(dependencies, [
        function () { return test_1.test({ plugins: { local: false, sauce: {} } })["catch"](cleanError); }
    ])));
    // TODO(nevir): Migrate fully to wct:local/etc.
    gulp.task('test', gulp.series(['wct:local']));
    gulp.task('test:local', gulp.series(['wct:local']));
    gulp.task('test:remote', gulp.series(['wct:sauce']));
    gulp.task('wct', gulp.series(['wct:local']));
}
exports.init = init;
// Utility
function cleanError(error) {
    // Pretty error for gulp.
    error = new Error(chalk.red(error.message || error));
    error.showStack = false;
    throw error;
}
