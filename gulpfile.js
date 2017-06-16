
"use strict";

// deps

	const path = require("path");

	// gulp
	const gulp = require("gulp");
	const plumber = require("gulp-plumber");

	// tests
	const eslint = require("gulp-eslint");
	const mocha = require("gulp-mocha");

	// compile
	const babel = require("gulp-babel");
	require("babel-preset-es2015");

// private

	var _gulpFile = path.join(__dirname, "gulpfile.js");
	var _libFiles = path.join(__dirname, "lib", "*.js");
	var _dirFiles = path.join(__dirname, "dir", "*.js");
	var _unitTestsFiles = path.join(__dirname, "tests", "*.js");
	var _toTestFiles = [_gulpFile, _libFiles, _unitTestsFiles];

// tasks

	// tests

	gulp.task("eslint", () => {

		return gulp.src(_toTestFiles)
			.pipe(plumber())
			.pipe(eslint({
				"parserOptions": {
					"ecmaVersion": 6
				},
				"rules": {
					"linebreak-style": 0,
					"quotes": [ 1, "double" ],
					"indent": 0,
					// "indent": [ 2, "tab" ],
					"semi": [ 2, "always" ]
				},
				"env": {
					"node": true, "es6": true, "mocha": true
				},
				"extends": "eslint:recommended"
			}))
			.pipe(eslint.format())
			.pipe(eslint.failAfterError());

	});

	gulp.task("mocha", ["eslint"], () => {

		return gulp.src(_unitTestsFiles)
			.pipe(plumber())
			.pipe(mocha({reporter: "spec"}));

	});

	// compile

	gulp.task("babel", ["eslint"], function () {

		return gulp.src(_libFiles)
			.pipe(babel({
				presets: ["es2015"]
			}))
			.pipe(gulp.dest("dist"));

	});

// watcher

	gulp.task("watch", function () {
		gulp.watch(_allJSFiles, ["mocha"]);
	});

// default

	gulp.task("default", ["mocha"]);
	