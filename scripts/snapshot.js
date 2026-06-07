import { writeFileSync, mkdirSync } from "node:fs";
import { scoreboard } from "../src/api.js";
import { parseScoreboard } from "../src/parse.js";

// ESPN schedules by US Eastern. Build today's date as YYYYMMDD in that zone so
// the snapshot lines up with ESPN's "today" rather than the runner's UTC clock.
const ymd = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
}).format(new Date()).replaceAll("-", "");

const games = parseScoreboard(await scoreboard({ dates: ymd }));
if (games.length === 0) {
  console.log(`${ymd}: no NFL games today; leaving snapshot unchanged`);
  process.exit(0);
}
mkdirSync("data", { recursive: true });
writeFileSync(
  "data/latest.json",
  JSON.stringify({ sport: "football", league: "nfl", date: ymd, count: games.length, games }, null, 2) + "\n",
);
console.log(`${ymd}: wrote ${games.length} NFL games -> data/latest.json`);
