# node-persistent-software
Spawn a software and keep it running


## Installation

```bash
$ npm install node-persistent-software
```

## Doc

* ``` string software ``` path to the software
* ``` string args ``` arguments passed to the software
* ``` object process ``` current process
* ``` boolean stopped ``` if stopped, keep it stopped
* ``` int maxCountRun ``` max start iteration
* ``` int countRun ``` current start iteration

* ``` constructor(string software[, array arguments]) ```

* ``` max(int maxIteration) : return this ``` change max iterations and reset current
* ``` infinite() : return this ``` no max iteration and reset current
* ``` start() : return this ``` run the software for the first time
* ``` stop() : return this ``` stop the software and don't restart it
* ``` on("error", (err) => {}) : return this ``` fire if an error occurs
* ``` on("started", () => {}) : return this ``` fire if the software is started (or restarted)
* ``` on("ended", () => {}) : return this ``` fire if the software is killed
* ``` on("stopped", () => {}) : return this ``` fire if the software is stopped

## Examples

```js
const PersistantSoftware = require('node-persistent-software');

new PersistantSoftware(
  "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
  ["www.npmjs.com"]
).on("error", function(msg) {
  console.log(msg);
}).on("started", function() {
  console.log("software started");
}).on("ended", function() {
  console.log("software ended");
}).on("stopped", function() {
  console.log("software stopped");
}).infinite().start();

new PersistantSoftware(
  "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
  ["www.github.com"]
).on("error", function(msg) {
  console.log(msg);
}).on("started", function() {
  console.log("software started");
}).on("ended", function() {
  console.log("software ended");
}).on("stopped", function() {
  console.log("software stopped");
}).max(5).start();
```

## Tests

```bash
$ gulp
```

## License

  [ISC](LICENSE)
