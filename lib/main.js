
"use strict";

// deps

	const { spawn } = require("child_process");

// module

module.exports = class PersistantSoftware extends require("asynchronous-eventemitter") {

	constructor (software, args = null, options = null) {

		super();

		this._software = software;
		this._args = args && "object" === typeof args && args instanceof Array ? args : null;
		this._options = options && "object" === typeof options ? options : null;

		this._currentChildProcess = null;

		this._ended = false;

		this.infinite();

	}

	max (max) {

		this.maxCountRun = max;
		this.successCountRun = 0;

		return this;

	}

	infinite () {
		return this.max(0);
	}

	start () {

		try {

			if (!this._ended) {

				if (!this._args) {
					this._currentChildProcess = spawn(this._software);
				}
				else if (!this._options) {
					this._currentChildProcess = spawn(this._software, this._args);
				}
				else {
					this._currentChildProcess = spawn(this._software, this._args, this._options);
				}

				this._currentChildProcess.on("error", (err) => {
					this.emit("error", err);
				});

				if (!this._currentChildProcess || !this._currentChildProcess.pid) {
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

					this.emit("start", this._currentChildProcess);

					this._currentChildProcess.on("exit", () => {

						this.emit("stop");

						if (!this._ended) {

							if (0 >= this.maxCountRun) {
								this.start();
							}
							else if (0 < this.maxCountRun && this.successCountRun < this.maxCountRun) {
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
		catch (e) {
			this.emit("error", e);
		}

		return this;

	}

	end () {

		this._ended = true;

		if (this._currentChildProcess) {

			if (this._currentChildProcess.pid) {

				try {
					process.kill(this._currentChildProcess.pid);
				}
				catch (e) {
					// nothing to do here
				}

			}

			this._currentChildProcess = null;

		}

		return this.emit("end");

	}

};
