# node-persistent-software
Spawn a software and keep it running

[![Build Status](https://api.travis-ci.org/Psychopoulet/node-persistent-software.svg?branch=master)](https://travis-ci.org/Psychopoulet/node-persistent-software)
[![Coverage Status](https://coveralls.io/repos/github/Psychopoulet/node-persistent-software/badge.svg?branch=master)](https://coveralls.io/github/Psychopoulet/node-persistent-software)
[![Dependency Status](https://img.shields.io/david/Psychopoulet/node-persistent-software/master.svg)](https://github.com/Psychopoulet/node-persistent-software)

## Installation

```bash
$ npm install node-persistent-software
```

## Doc (extends : [asynchronous-eventemitter](https://www.npmjs.com/package/asynchronous-eventemitter))

### Attributes

* ``` string software ``` path to the software
* ``` array arguments ``` arguments passed to the software
* ``` object options ``` options passed to the software
* ``` object currentChildProcess ``` current child_process
* ``` boolean ended ``` if ended, don't restart it
* ``` int maxCountRun ``` max start iteration
* ``` int successCountRun ``` current success start iteration
* ``` asynchronous-eventemitter eventEmitter ``` async events manager

### Constructor

* ``` constructor(string software [, array arguments [, object options ] ] ) ``` => see [spawn documentation](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)

### Methods

* ``` max(int maxIteration) : this ``` change max iterations and reset current
* ``` infinite() : this ``` no max iteration and reset current
* ``` start() : this ``` run the software for the first time
* ``` end() : this ``` stop the software and don't restart it

### Events

* ``` on("error", (string err) => {}) : this ``` fire if an error occurs (use try/catch to avoid loop)

* ``` on("firststart", () => {}) : this ``` fire if the software starts for the first time
* ``` on("restart", () => {}) : this ``` fire if the software restarts
* ``` on("start", (object child_process) => {}) : this ``` fire if the software starts (firststart && restart) => see [spawn documentation](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)

* ``` on("stop", () => {}) : this ``` fire if the software is killed
* ``` on("end", () => {}) : this ``` fire if the software is killed and cannot be restarted

## Examples

```js
const PersistantSoftware = require('node-persistent-software');

new PersistantSoftware(
  "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
  [ "https://www.npmjs.com/package/node-persistent-software" ]
).on("error", (msg) => {
  console.log(msg);
})

.infinite()

.on("firststart", () => {
  console.log("Firefox is started for the first time !");
}).on("restart", () => {
  console.log("Firefox is started again...");
}).on("start", (child_process) => {
  console.log("anyway, Firefox is started.");
})

.on("stop", () => {
  console.log("Firefox is stopped, trying to restart...");
}).on("end", () => {
  console.log("/!\\ Firefox is stopped and cannot be restarted /!\\");
}).start();


new PersistantSoftware(
  "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
  [ "https://github.com/Psychopoulet/node-persistent-software" ]
).on("error", (msg) {
  console.log(msg);
})

.max(5)

.on("firststart", () => {
  console.log("Firefox is started for the first time !");
}).on("restart", () => {
  console.log("Firefox is started again...");
}).on("start", () => {
  console.log("anyway, Firefox is started.");
})

.on("stop", () => {
  console.log("Firefox is stopped, trying to restart...");
}).on("end", () => {
  console.log("/!\\ Firefox is stopped and cannot be restarted /!\\");
}).start();
```

## Tests

```bash
$ gulp
```

## License

  [ISC](LICENSE)
