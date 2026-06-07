import { teamsClean, rosterClean, gamelogClean } from "../src/api.js";

const teams = await teamsClean();
const roster = await rosterClean(teams[0].id);
const p = roster[0];
console.log(`${p.name} (${teams[0].abbr})`);
const log = await gamelogClean(p.id);
console.log("games:", log.length);
for (const g of log.slice(0, 5)) {
  const stats = Object.entries(g.stats).slice(0, 4).map(([k, v]) => `${k} ${v}`).join("  ");
  console.log(`  ${g.date?.slice(0, 10)} ${g.atVs} ${g.opponent}  ${stats}`);
}
