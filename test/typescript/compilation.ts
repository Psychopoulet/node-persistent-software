/// <reference path="../../lib/index.d.ts" />

import PersistantSoftware = require("../../lib/main.js");

new PersistantSoftware("node", [ "-v" ]).on("error", (err: Error) => {
  console.log(err);
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


new PersistantSoftware("node", [ "-v" ]).on("error", (err: Error) => {
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
