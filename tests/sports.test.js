import assert from "node:assert";
import * as api from "../src/api.js";

// The client exposes the ESPN endpoints as functions.
for (const fn of ["scoreboard", "teams", "athlete", "gamelog", "news", "standings"]) {
  assert.strictEqual(typeof api[fn], "function", fn + " should be a function");
}
console.log("ok: nfl-api exposes the ESPN endpoints");
