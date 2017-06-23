
"use strict";

// deps

	const assert = require("assert");
	const PersistantSoftware = require(require("path").join(__dirname, "..", "dist", "main.js"));

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

	/*

	// personnal check with firefox on Windows, based on the documentation

	it("should check normal running with infinite and end", () => {

		return new Promise((resolve) => {

			var ps = new PersistantSoftware(
				"C:\\Program Files\\Mozilla Firefox\\firefox.exe",
				[ "https://www.npmjs.com/package/node-persistent-software" ]
			).on("error", (msg) => {
				(1, console).log(msg);
			})

			.infinite()

			.on("firststart", () => {
				(1, console).log("Firefox is started for the first time !");
			}).on("restart", () => {
				(1, console).log("Firefox is started again...");
			}).on("start", () => {
				(1, console).log("Anyway, Firefox is started.");
			})

			.on("stop", () => {

				(1, console).log("Firefox is stopped, trying to restart...");

				if (1 <= ps.successCountRun) {
					ps.end();
					resolve();
				}

			}).on("end", () => {
				(1, console).log("/!\\ Firefox is stopped and cannot be restarted /!\\");
			}).start();

		});

	}).timeout(5 * 1000);

	*/

});
