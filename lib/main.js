
"use strict";

// deps

	const spawn = require("child_process").spawn;

// module

module.exports = class PersistantSoftware extends require("asynchronous-eventemitter")  {

	constructor(software, args, options) {

		super();

		this.software = software;
		this.args = ("object" === typeof args && args instanceof Array) ? args : null;
		this.options = ("object" === typeof options) ? options : null;
		
		this.currentChildProcess = null;

		this.ended = false;

		this.infinite();

	}

	max(max) {
		this.maxCountRun = max;
		this.successCountRun = 0;
		return this;
	}

	infinite() {
		return this.max(0);
	}

	start() {

		try {

			if (!this.ended) {

				if (!this.args) {
					this.currentChildProcess = spawn(this.software);
				}
				else if (!this.options) {
					this.currentChildProcess = spawn(this.software, this.args);
				}
				else {
					this.currentChildProcess = spawn(this.software, this.args, this.options);
				}

				this.currentChildProcess.on("error", (err) => {
					this.emit("error", err);
				});

				if (!this.currentChildProcess || !this.currentChildProcess.pid) {
					this.end();
				}
				else {

					++this.successCountRun;

					if (1 < this.successCountRun) {
						this.emit("restart");
					}
					else {
						this.emit("firststart");
					}

					this.emit("start", this.currentChildProcess);

					this.currentChildProcess.on("exit", () => {

						this.emit("stop");

						if (!this.ended) {

							if (0 >= this.maxCountRun || (0 < this.maxCountRun && this.successCountRun < this.maxCountRun)) {
								this.start();
							}
							else {
								this.end();
							}
							
						}
						
					});

				}

			}
			
		}
		catch(e) {
			this.emit("error", e);
		}

		return this;

	}

	end() {

		this.ended = true;

		if (this.currentChildProcess) {

			if (this.currentChildProcess.pid) {

				try {
					process.kill(this.currentChildProcess.pid);
				}
				catch (e) {
					// nothing to do here
				}

			}

			this.currentChildProcess = null;

		}

		this.emit("end")
			.removeAllListeners("start")
			.removeAllListeners("firststart")
			.removeAllListeners("restart")
			.removeAllListeners("stop")
			.removeAllListeners("end");

		return this;

	}

};
