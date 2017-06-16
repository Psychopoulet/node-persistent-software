
"use strict";

// deps

	const	spawn = require("child_process").spawn,
			events = require("asynchronous-eventemitter");

// module

module.exports = class PersistantSoftware {

	constructor(software, args, options) {

		this.software = software;
		this.args = ("object" === typeof args && args instanceof Array) ? args : null;
		this.options = ("object" === typeof options) ? options : null;
		
		this.currentChildProcess = null;

		this.ended = false;

		this.infinite();

		this.eventEmitter = new events().on("eventerror", (err) => {
			this.eventEmitter.emit("error", err);
		});

	}

	on(eventName, listener) {
		this.eventEmitter.on(eventName, listener);
		return this;
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
					this.eventEmitter.emit("error", err);
				});

				if (!this.currentChildProcess || !this.currentChildProcess.pid) {
					this.end();
				}
				else {

					++this.successCountRun;

					if (1 < this.successCountRun) {
						this.eventEmitter.emit("restart");
					}
					else {
						this.eventEmitter.emit("firststart");
					}

					this.eventEmitter.emit("start", this.currentChildProcess);

					this.currentChildProcess.on("exit", () => {

						this.eventEmitter.emit("stop");

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
			this.eventEmitter.emit("error", (e.message) ? e.message : e);
		}

		return this;

	}

	end() {

		this.ended = true;

		if (this.currentChildProcess && this.currentChildProcess.pid) {

			try {
				process.kill(this.currentChildProcess.pid);
				this.eventEmitter.emit("stop");
			}
			catch (e) {
				// nothing to do here
			}

		}

		this.eventEmitter.emit("end");

		return this;

	}

};
