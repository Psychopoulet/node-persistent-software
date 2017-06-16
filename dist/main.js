
"use strict";

// deps

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var spawn = require("child_process").spawn,
    events = require("asynchronous-eventemitter");

// module

module.exports = function () {
	function PersistantSoftware(software, args, options) {
		var _this = this;

		_classCallCheck(this, PersistantSoftware);

		this.software = software;
		this.args = "object" === (typeof args === "undefined" ? "undefined" : _typeof(args)) && args instanceof Array ? args : null;
		this.options = "object" === (typeof options === "undefined" ? "undefined" : _typeof(options)) ? options : null;

		this.currentChildProcess = null;

		this.ended = false;

		this.infinite();

		this.eventEmitter = new events().on("eventerror", function (err) {
			_this.eventEmitter.emit("error", err);
		});
	}

	_createClass(PersistantSoftware, [{
		key: "on",
		value: function on(eventName, listener) {
			this.eventEmitter.on(eventName, listener);
			return this;
		}
	}, {
		key: "max",
		value: function max(_max) {
			this.maxCountRun = _max;
			this.successCountRun = 0;
			return this;
		}
	}, {
		key: "infinite",
		value: function infinite() {
			return this.max(0);
		}
	}, {
		key: "start",
		value: function start() {
			var _this2 = this;

			try {

				if (!this.ended) {

					if (!this.args) {
						this.currentChildProcess = spawn(this.software);
					} else if (!this.options) {
						this.currentChildProcess = spawn(this.software, this.args);
					} else {
						this.currentChildProcess = spawn(this.software, this.args, this.options);
					}

					this.currentChildProcess.on("error", function (err) {
						_this2.eventEmitter.emit("error", err);
					});

					if (!this.currentChildProcess || !this.currentChildProcess.pid) {
						this.end();
					} else {

						++this.successCountRun;

						if (1 < this.successCountRun) {
							this.eventEmitter.emit("restart");
						} else {
							this.eventEmitter.emit("firststart");
						}

						this.eventEmitter.emit("start", this.currentChildProcess);

						this.currentChildProcess.on("exit", function () {

							_this2.eventEmitter.emit("stop");

							if (!_this2.ended) {

								if (0 >= _this2.maxCountRun || 0 < _this2.maxCountRun && _this2.successCountRun < _this2.maxCountRun) {
									_this2.start();
								} else {
									_this2.end();
								}
							}
						});
					}
				}
			} catch (e) {
				this.eventEmitter.emit("error", e.message ? e.message : e);
			}

			return this;
		}
	}, {
		key: "end",
		value: function end() {

			this.ended = true;

			if (this.currentChildProcess && this.currentChildProcess.pid) {

				try {
					process.kill(this.currentChildProcess.pid);
					this.eventEmitter.emit("stop");
				} catch (e) {
					// nothing to do here
				}
			}

			this.eventEmitter.emit("end");

			return this;
		}
	}]);

	return PersistantSoftware;
}();