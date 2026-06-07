import { scoreboardClean } from "../src/api.js";

const games = await scoreboardClean();
console.log("NFL:", games.length, "events");
for (const g of games.slice(0, 10)) {
  const label = g.away && g.home ? `${g.away.abbr} @ ${g.home.abbr}` : g.name;
  console.log("  " + label + "  " + (g.status || g.date || ""));
}
