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

* ``` maxCountRun: number ``` max start iteration
* ``` successCountRun: number ``` current success start iteration

### Constructor

* ``` constructor(software: string, args?: Array<string>, options?: object) ``` => see [spawn documentation](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)

### Methods

* ``` max(maxIteration: number) : this ``` change max iterations and reset current
* ``` infinite() : this ``` no max iteration and reset current
* ``` start() : this ``` run the software for the first time
* ``` end() : this ``` stop the software and does not restart it

### Events

* ``` on("error", (err: Error) => void) : this ``` fire if an error occurs (use try/catch to avoid loop)

* ``` on("firststart", () => void) : this ``` fire if the software starts for the first time
* ``` on("restart", () => void) : this ``` fire if the software restarts
* ``` on("start", (child_process: child_process.ChildProcess) => void) : this ``` fire if the software starts (firststart && restart) => see [spawn documentation](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)

* ``` on("stop", () => void) : this ``` fire if the software is killed
* ``` on("end", () => void) : this ``` fire if the software is killed and cannot be restarted

## Examples

### Native

```javascript
const PersistantSoftware = require("node-persistent-software");

new PersistantSoftware("node", [ "-v" ]).on("error", (msg) => {
  console.log(msg);
})

.infinite()

.on("firststart", () => {
  console.log("node is started for the first time !");
}).on("restart", () => {
  console.log("node is started again...");
}).on("start", (child_process) => {
  console.log("anyway, node is started.");
})

.on("stop", () => {
  console.log("node is stopped, trying to restart...");
}).on("end", () => {
  console.log("/!\\ node is stopped and cannot be restarted /!\\");
}).start();


new PersistantSoftware("node", [ "-v" ]).on("error", (err) => {
  console.log(err);
})

.max(5)

.on("firststart", () => {
  console.log("node is started for the first time !");
}).on("restart", () => {
  console.log("node is started again...");
}).on("start", () => {
  console.log("anyway, node is started.");
})

.on("stop", () => {
  console.log("node is stopped, trying to restart...");
}).on("end", () => {
  console.log("/!\\ node is stopped and cannot be restarted /!\\");
}).start();
```

### Typescript

```typescript
import PersistantSoftware = require("node-persistent-software");

new PersistantSoftware("node", [ "-v" ]).on("error", (err) => {
  console.log(err);
})

.infinite();
```

## Tests

```bash
$ gulp
```

## License

  [ISC](LICENSE)
