
"use strict";

// deps

	const	spawn = require("child_process").spawn;

// module

module.exports = class PersistantSoftware extends require("async-eventemitter") {

	constructor(exe, args) {

		super();

		this.exe = exe;
		this.args = args;
		this.process = null;

		this.stopped = false;

		this.infinite();

	}

	max(max) {
		this.maxCountRun = max;
		this.countRun = 0;
		return this;
	}

	infinite() {
		return this.max(0);
	}

	start() {

		++this.countRun;

		try {

			if (!this.stopped) {

				this.process = spawn(this.exe, this.args).on("error", (err) => {
					this.emit("error", (err.message) ? err.message : err);
				});

				if (!this.process || !this.process.pid) {
					this.stop();
				}
				else {

					this.emit("started");

					this.process.on("exit", () => {

						this.emit("ended");

						if (0 >= this.maxCountRun || (0 < this.maxCountRun && this.countRun < this.maxCountRun)) {
							this.start();
						}
						else {
							this.stop();
						}
						
					});

				}

			}
			
		}
		catch(e) {
			this.emit("error", (e.message) ? e.message : e);
		}

		return this;

	}

	stop() {

		if (this.process && this.process.pid) {

			try {
				process.kill(this.process.pid);
				this.emit("ended");
			}
			catch (e) {
				// nothing to do here
			}

		}

		this.stopped = true;
		this.emit("stopped");

		return this;

	}

};
