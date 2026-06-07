import { teams, roster, gamelog } from "../src/api.js";

// Discover an athlete from a roster, then pull their per-game log.
const t = await teams();
const first = t.sports[0].leagues[0].teams[0].team;
const r = await roster(first.id);
const player = r.athletes?.[0]?.items?.[0] || r.athletes?.[0];
if (!player) { console.log("no roster, try another team"); process.exit(0); }
console.log(`${player.displayName} (${first.displayName}) id=${player.id}`);
const log = await gamelog(player.id);
const games = Object.values(log.events || {}).slice(0, 5);
console.log("recent games:", games.map((g) => `${g.opponent?.abbreviation || "?"} ${g.gameDate?.slice(0, 10) || ""}`));
