
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
		
		this.process = null;

		this.stopped = false;

		this.infinite();

		this.eventEmitter = new events().on("eventerror", (err) => {
			this.eventEmitter.emit("error", (err.message) ? err.message : err);
		});

	}

	on(eventName, listener) {
		this.eventEmitter.on(eventName, listener);
		return this;
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

		try {

			if (!this.stopped) {

				++this.countRun;

				if (!this.args) {
					this.process = spawn(this.software);
				}
				else if (!this.options) {
					this.process = spawn(this.software, this.args);
				}
				else {
					this.process = spawn(this.software, this.args, this.options);
				}

				this.process.on("error", (err) => {
					this.eventEmitter.emit("error", (err.message) ? err.message : err);
				});

				if (!this.process || !this.process.pid) {
					this.stop();
				}
				else {

					this.eventEmitter.emit("started");

					this.process.on("exit", () => {

						this.eventEmitter.emit("ended");

						if (!this.stopped) {

							if (0 >= this.maxCountRun || (0 < this.maxCountRun && this.countRun < this.maxCountRun)) {
								this.start();
							}
							else {
								this.stop();
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

	stop() {

		this.stopped = true;

		if (this.process && this.process.pid) {

			try {
				process.kill(this.process.pid);
				this.eventEmitter.emit("ended");
			}
			catch (e) {
				// nothing to do here
			}

		}

		this.eventEmitter.emit("stopped");

		return this;

	}

};
