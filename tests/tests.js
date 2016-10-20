
"use strict";

// deps

	const 	assert = require("assert"),
			PersistantSoftware = require(require("path").join(__dirname, "..", "lib", "main.js"));

// tests

describe("run", () => {

	it("should check wrong path running", () => {

		return new Promise((resolve, reject) => {

			let ps = new PersistantSoftware("wsdvwsdvwsdvwsdvsdv").on("error", () => { }); // there IS an error. this is the point...

			ps.on("firststart", () => {
				reject("software found");
			}).on("end", () => {

				try {

					assert.strictEqual(0, ps.successCountRun, "wrong count");
					assert.strictEqual(1, ps.maxCountRun, "wrong max");

					resolve();

				}
				catch(e) {
					reject((e.message) ? e.message : e);
				}

			}).max(1).start();

		});

	}).timeout(1 * 1000);

	it("should check no args running", () => {

		return new Promise((resolve, reject) => {

			let ps = new PersistantSoftware("node").on("error", (err) => {
				(0, console).log(err);
			});

			ps.on("firststart", () => {

				setTimeout(() => {
					ps.end();
				}, 200);

			}).on("restart", () => {
				reject("restarted");
			}).on("end", () => {

				try {

					assert.strictEqual(1, ps.successCountRun, "wrong count");
					assert.strictEqual(1, ps.maxCountRun, "wrong max");

					resolve();

				}
				catch(e) {
					reject((e.message) ? e.message : e);
				}

			}).max(1).start();

		});

	}).timeout(1 * 1000);

	it("should check normal running with max", () => {

		return new Promise((resolve, reject) => {

			let version = "", ps = new PersistantSoftware( "node", [ "-v" ] ).on("error", (err) => {
				(1, console).log(err);
			});

			ps.on("start", (process) => {

				process.stdout.on("data", (data) => {
					version = data.toString("utf8").trim();
				});

			}).on("end", () => {

				try {

					assert.strictEqual(process.version, version, "wrong version");
					assert.strictEqual(2, ps.successCountRun, "wrong count");
					assert.strictEqual(2, ps.maxCountRun, "wrong max");

					resolve();

				}
				catch(e) {
					reject((e.message) ? e.message : e);
				}

			}).max(2).start();

		});

	}).timeout(1 * 1000);

	it("should check normal running with infinite and end", () => {

		return new Promise((resolve, reject) => {

			let ps = new PersistantSoftware( "node", [ "-v" ] ).on("error", (err) => {
				(1, console).log(err);
			});

			ps.on("restart", () => {
				ps.end();
			}).on("end", () => {

				try {

					assert.strictEqual(2, ps.successCountRun, "wrong count");
					assert.strictEqual(0, ps.maxCountRun, "wrong max");

					resolve();

				}
				catch(e) {
					reject((e.message) ? e.message : e);
				}

			}).infinite().start();

		});

	}).timeout(1 * 1000);

});
