
"use strict";

// deps

	const assert = require("assert");
	const PersistantSoftware = require(require("path").join(__dirname, "..", "lib", "main.js"));

// consts

	const IPCONFIG = "win32" === require("os").platform() ? "ipconfig" : "ifconfig";

// tests

describe("run", () => {

	it("should check wrong path running", () => {

		return new Promise((resolve, reject) => {

			// there IS an error. this is the point.
			const ps = new PersistantSoftware("wsdvwsdvwsdvwsdvsdv").on("error", () => {
				// nothing to do here
			});

			ps.on("firststart", () => {
				reject(new Error("software found"));
			}).on("end", () => {

				assert.strictEqual(0, ps.successCountRun, "wrong count");
				assert.strictEqual(1, ps.maxCountRun, "wrong max");

				resolve();

			}).max(1).start();

		});

	}).timeout(1 * 1000);

	it("should check no args running", () => {

		return new Promise((resolve, reject) => {

			const ps = new PersistantSoftware("node").on("error", reject);

			ps.on("firststart", () => {

				setTimeout(() => {
					ps.end();
				}, 200);

			}).on("restart", () => {
				reject(new Error("restarted"));
			}).on("end", () => {

				assert.strictEqual(1, ps.successCountRun, "wrong count");
				assert.strictEqual(1, ps.maxCountRun, "wrong max");

				resolve();

			}).max(1).start();

		});

	}).timeout(1 * 1000);

	it("should check normal running with max", () => {

		return new Promise((resolve, reject) => {

			let version = "";
			const ps = new PersistantSoftware("node", [ "-v" ]).on("error", reject);

			ps.on("start", (process) => {

				process.stdout.on("data", (data) => {
					version = data.toString("utf8").trim();
				});

			}).on("end", () => {

				assert.strictEqual(process.version, version, "wrong version");
				assert.strictEqual(2, ps.successCountRun, "wrong count");
				assert.strictEqual(2, ps.maxCountRun, "wrong max");

				resolve();

			}).max(2).start();

		});

	}).timeout(1 * 1000);

	it("should check normal running with infinite and end", () => {

		return new Promise((resolve, reject) => {

			const ps = new PersistantSoftware("node", [ "-v" ], {
				"cwd": __dirname
			}).on("error", reject);

			ps.on("restart", () => {
				ps.end();
			}).on("end", () => {

				assert.strictEqual(2, ps.successCountRun, "wrong count");
				assert.strictEqual(0, ps.maxCountRun, "wrong max");

				resolve();

			}).infinite().start();

		});

	}).timeout(1 * 1000);

	it("should check normal running with infinite and end", () => {

		return new Promise((resolve, reject) => {

			let firstStarted = false;
			let restarted = false;
			let started = false;

			const ps = new PersistantSoftware(IPCONFIG).on("error", reject).infinite()

			.on("firststart", () => {
				firstStarted = true;
			}).on("restart", () => {
				restarted = true;
			}).on("start", () => {
				started = true;
			})

			.on("stop", () => {

				if (2 <= ps.successCountRun) {
					ps.end();
				}

			}).on("end", () => {

				assert.strictEqual(firstStarted, true, "not started for the first time");
				assert.strictEqual(restarted, true, "not restarted");
				assert.strictEqual(started, true, "not started at all");

				resolve();

			}).start();

		});

	}).timeout(5 * 1000);

});
