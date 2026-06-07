// Turn ESPN's raw JSON into clean, usable shapes.

export function parseScoreboard(raw) {
  return (raw?.events || []).map((e) => {
    const c = e.competitions?.[0] || {};
    const side = (ha) => {
      const x = (c.competitors || []).find((m) => m.homeAway === ha);
      return x ? { id: x.team?.id, abbr: x.team?.abbreviation, name: x.team?.displayName, score: x.score, winner: x.winner } : null;
    };
    return {
      id: e.id, name: e.name, shortName: e.shortName, date: e.date,
      state: c.status?.type?.state, status: c.status?.type?.shortDetail, completed: !!c.status?.type?.completed,
      home: side("home"), away: side("away"),
    };
  });
}

export function parseTeams(raw) {
  return (raw?.sports?.[0]?.leagues?.[0]?.teams || []).map((t) => {
    const x = t.team || t;
    return { id: x.id, abbr: x.abbreviation, name: x.displayName, location: x.location, color: x.color, logo: x.logos?.[0]?.href };
  });
}

export function parseRoster(raw) {
  const out = [];
  for (const g of raw?.athletes || []) {
    const players = Array.isArray(g.items) ? g.items : [g];
    for (const p of players) {
      if (!p?.id) continue;
      out.push({ id: p.id, name: p.displayName, position: p.position?.abbreviation, jersey: p.jersey, age: p.age, height: p.displayHeight, weight: p.displayWeight });
    }
  }
  return out;
}

// Zip ESPN's label array with per-game stat rows and join date/opponent by
// eventId, so you get [{ date, opponent, atVs, stats: { PTS, REB, ... } }].
export function parseGamelog(raw) {
  const labels = raw?.labels || [];
  const meta = raw?.events || {};
  const rows = [];
  for (const st of raw?.seasonTypes || []) {
    for (const cat of st.categories || []) {
      for (const ev of cat.events || []) {
        const m = meta[ev.eventId] || {};
        const stats = {};
        (ev.stats || []).forEach((v, i) => { if (labels[i]) stats[labels[i]] = v; });
        rows.push({ eventId: ev.eventId, date: m.gameDate, opponent: m.opponent?.abbreviation, atVs: m.atVs, result: m.gameResult, score: m.score, stats });
      }
    }
  }
  return rows;
}
