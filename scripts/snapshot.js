import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { scoreboard } from "../src/api.js";
import { parseScoreboard } from "../src/parse.js";

// ESPN schedules by US Eastern. Build today's date as YYYYMMDD in that zone so
// the snapshot lines up with ESPN's "today" rather than the runner's UTC clock.
const ymd = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
}).format(new Date()).replaceAll("-", "");

const games = parseScoreboard(await scoreboard({ dates: ymd }));
mkdirSync("data", { recursive: true });

// Record every run, including days with no games. Out of season there is nothing
// to write for months, and GitHub disables a scheduled workflow after 60 days
// with no repository activity, so collection would switch itself off right
// before the season starts. Writing unconditionally also separates "checked,
// nothing on today" from "the job stopped running", which are indistinguishable
// when we only commit on change.
let previous = {};
try {
  previous = JSON.parse(readFileSync("data/status.json", "utf8"));
} catch {
  // First run, or an unreadable status file; the defaults below are correct.
}
writeFileSync(
  "data/status.json",
  JSON.stringify({
    sport: "football",
    league: "nfl",
    lastCheckedUtc: new Date().toISOString(),
    lastCheckedDate: ymd,
    gamesToday: games.length,
    lastGameDate: games.length > 0 ? ymd : (previous.lastGameDate ?? null),
  }, null, 2) + "\n",
);

if (games.length === 0) {
  console.log(`${ymd}: no NFL games today; leaving snapshot unchanged`);
  process.exit(0);
}
writeFileSync(
  "data/latest.json",
  JSON.stringify({ sport: "football", league: "nfl", date: ymd, count: games.length, games }, null, 2) + "\n",
);
console.log(`${ymd}: wrote ${games.length} NFL games -> data/latest.json`);
