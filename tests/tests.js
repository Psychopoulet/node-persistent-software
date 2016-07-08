
"use strict";

// deps

	const 	assert = require("assert"),
			PersistantSoftware = require(require("path").join(__dirname, "..", "lib", "main.js"));

// tests

describe("run", function() {

	it("should check wrong path running", function(done) {

		let ps = new PersistantSoftware(
			"C:\\Program Files\\Mozilla Firefo\\firefox.exe",
			["www.npmjs.com"]
		).on("error", function(msg) {
			assert.strictEqual("string", typeof msg, "the error is not a string");
		});

		ps.on("started", function() {
			done("software found");
		}).on("stopped", function() {

			assert.strictEqual(1, ps.countRun, "wrong count");
			assert.strictEqual(1, ps.maxCountRun, "wrong max");

			done();

		}).max(1).start();

	});

	it("should check no args running", function(done) {

		let ps = new PersistantSoftware(
			"C:\\Program Files\\Mozilla Firefox\\firefox.exe"
		).on("error", function(msg) {
			assert.strictEqual("string", typeof msg, "the error is not a string");
		}).on("stopped", function() {

			assert.strictEqual(1, ps.countRun, "wrong count");
			assert.strictEqual(1, ps.maxCountRun, "wrong max");

			done();

		}).max(1).start();

	}).timeout(10000);

	it("should check normal running with max", function(done) {

		let ps = new PersistantSoftware(
			"C:\\Program Files\\Mozilla Firefox\\firefox.exe",
			["www.npmjs.com"]
		).on("error", function(msg) {
			done(msg);
		});

		ps.on("started", function () {

			setTimeout(function () {

				try {
					process.kill(ps.process.pid);
				}
				catch(e) {
					// nothing to do here
				}
				
			}, 1500);
			
		}).on("stopped", function() {

			assert.strictEqual(3, ps.countRun, "wrong count");
			assert.strictEqual(3, ps.maxCountRun, "wrong max");

			done();

		}).max(3).start();

	}).timeout(10000);

	it("should check normal running with infinite and stop", function(done) {

		let ps = new PersistantSoftware(
			"C:\\Program Files\\Mozilla Firefox\\firefox.exe",
			["www.npmjs.com"]
		).on("error", function(msg) {
			done(msg);
		});

		ps.on("started", ps.stop).on("stopped", function() {

			assert.strictEqual(1, ps.countRun, "wrong count");
			assert.strictEqual(0, ps.maxCountRun, "wrong max");

			done();

		}).infinite().start();

	}).timeout(10000);

});
