import { parseScoreboard, parseTeams, parseRoster, parseGamelog } from "./parse.js";

const UA = "nfl-api (github.com/LeSingh1/nfl-api)";
const SITE = "https://site.api.espn.com/apis/site/v2/sports/football/nfl";
const WEB  = "https://site.web.api.espn.com/apis/common/v3/sports/football/nfl";
const CORE = "https://sports.core.api.espn.com/v2/sports/football/leagues/nfl";

const TRANSIENT = new Set([429, 500, 502, 503, 504]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const backoff = (n) => Math.min(8000, 400 * 2 ** n) + Math.floor(Math.random() * 200);
function qs(params) {
  const e = Object.entries(params || {}).filter(([, v]) => v != null);
  return e.length ? "?" + e.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&") : "";
}

// fetch with a timeout and retries on transient errors (429/5xx), honoring
// Retry-After. Throws a clear error with status and url on real failures.
async function get(url, { timeout = 12000, retries = 3 } = {}) {
  for (let attempt = 0; ; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeout);
    let res;
    try {
      res = await fetch(url, { headers: { "user-agent": UA }, signal: ctrl.signal });
    } catch (e) {
      clearTimeout(timer);
      if (attempt >= retries) throw new Error(`request failed for ${url}: ${e.message}`);
      await sleep(backoff(attempt));
      continue;
    }
    clearTimeout(timer);
    if (res.ok) return res.json();
    if (TRANSIENT.has(res.status) && attempt < retries) {
      const ra = Number(res.headers.get("retry-after"));
      await sleep(Number.isFinite(ra) && ra > 0 ? ra * 1000 : backoff(attempt));
      continue;
    }
    throw new Error(`ESPN ${res.status} ${res.statusText} for ${url}`);
  }
}

// ── raw endpoints (return ESPN JSON; every call takes { timeout, retries }) ──
export const scoreboard = (params, o) => get(`${SITE}/scoreboard${qs(params)}`, o);   // ?dates=YYYYMMDD
export const teams      = (o) => get(`${SITE}/teams`, o);
export const team       = (id, o) => get(`${SITE}/teams/${id}`, o);
export const roster     = (id, o) => get(`${SITE}/teams/${id}/roster`, o);
export const athlete    = (id, o) => get(`${WEB}/athletes/${id}`, o);
export const athletes   = ({ limit = 50, page = 1, active = true } = {}, o) => get(`${CORE}/athletes?limit=${limit}&page=${page}&active=${active}`, o);
export const gamelog    = (id, o) => get(`${WEB}/athletes/${id}/gamelog`, o);
export const splits     = (id, o) => get(`${WEB}/athletes/${id}/splits`, o);
export const news       = (params, o) => get(`${SITE}/news${qs(params)}`, o);
export const summary    = (eventId, o) => get(`${SITE}/summary${qs({ event: eventId })}`, o);
export const standings  = (o) => get(`${SITE}/standings`, o);
export const odds       = (eventId, o) => get(`${CORE}/events/${eventId}/competitions/${eventId}/odds`, o);
export const plays      = (eventId, { limit = 300 } = {}, o) => get(`${CORE}/events/${eventId}/competitions/${eventId}/plays?limit=${limit}`, o);

// ── parsed convenience (one call, clean data) ──
export const scoreboardClean = async (params, o) => parseScoreboard(await scoreboard(params, o));
export const teamsClean      = async (o) => parseTeams(await teams(o));
export const rosterClean     = async (id, o) => parseRoster(await roster(id, o));
export const gamelogClean    = async (id, o) => parseGamelog(await gamelog(id, o));
