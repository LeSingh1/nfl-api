import assert from "node:assert";
import * as api from "../src/api.js";
import { parseGamelog } from "../src/parse.js";

// Endpoints and parsed helpers exist.
for (const fn of ["scoreboard", "teams", "roster", "athlete", "gamelog", "odds", "scoreboardClean", "gamelogClean"]) {
  assert.strictEqual(typeof api[fn], "function", fn + " should be a function");
}
// Parser zips labels + stats and joins date/opponent.
const rows = parseGamelog({ labels: ["PTS"], events: { "1": { gameDate: "2026-01-01", opponent: { abbreviation: "NY" }, atVs: "vs" } }, seasonTypes: [{ categories: [{ events: [{ eventId: "1", stats: ["20"] }] }] }] });
assert.strictEqual(rows[0].stats.PTS, "20");
assert.strictEqual(rows[0].opponent, "NY");

console.log("ok: nfl-api endpoints + parser");
