import { scoreboard } from "../src/api.js";

const board = await scoreboard();
const events = (board.events || []).map((e) => e.name || e.shortName);
console.log("NFL events on the board:", events.length);
for (const e of events.slice(0, 10)) console.log("  " + e);
