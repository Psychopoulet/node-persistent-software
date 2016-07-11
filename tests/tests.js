
"use strict";

// deps

	const 	assert = require("assert"),
			PersistantSoftware = require(require("path").join(__dirname, "..", "lib", "main.js"));

// tests

describe("run", function() {

	it("should check wrong path running", function(done) {

		let ps = new PersistantSoftware("wsdvwsdvwsdvwsdvsdv").on("error", function () {});

		ps.on("started", function () {
			done("software found");
		}).on("stopped", function () {

			assert.strictEqual(1, ps.countRun, "wrong count");
			assert.strictEqual(1, ps.maxCountRun, "wrong max");

			done();

		}).max(1).start();

	});

	it("should check no args running", function(done) {

		let ps = new PersistantSoftware("node").on("error", function(msg) {
			(1, console).log("error", msg);
		});

		ps.on("started", function() {

			setTimeout(function() {
				ps.stop();
			}, 1500);

		}).on("stopped", function() {

			assert.strictEqual(1, ps.countRun, "wrong count");
			assert.strictEqual(1, ps.maxCountRun, "wrong max");

			done();

		}).max(1).start();

	}).timeout(5000);

	it("should check normal running with max", function(done) {

		let ps = new PersistantSoftware( "node", [ "-v" ] ).on("error", function(msg) {
			(1, console).log("error", msg);
		});

		ps.on("stopped", function() {

			assert.strictEqual(3, ps.countRun, "wrong count");
			assert.strictEqual(3, ps.maxCountRun, "wrong max");

			done();

		}).max(3).start();

	}).timeout(5000);

	it("should check normal running with infinite and stop", function(done) {

		let ps = new PersistantSoftware( "node", [ "-v" ] ).on("error", function(msg) {
			(1, console).log("error", msg);
		});

		ps.on("started", function() {
			ps.stop();
		}).on("stopped", function() {

			assert.strictEqual(1, ps.countRun, "wrong count");
			assert.strictEqual(0, ps.maxCountRun, "wrong max");

			done();

		}).infinite().start();

	}).timeout(5000);

});
