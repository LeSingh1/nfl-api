export interface Options {
  /** Abort after this many ms (default 12000). */
  timeout?: number;
  /** Retries on 429 / 5xx with backoff (default 3). */
  retries?: number;
}
export interface TeamSide {
  id?: string; abbr?: string; name?: string; score?: string; winner?: boolean;
}
export interface ScoreboardGame {
  id: string; name: string; shortName?: string; date?: string;
  state?: string; status?: string; completed: boolean;
  home: TeamSide | null; away: TeamSide | null;
}
export interface Team {
  id: string; abbr?: string; name?: string; location?: string; color?: string; logo?: string;
}
export interface RosterPlayer {
  id: string; name?: string; position?: string; jersey?: string; age?: number; height?: string; weight?: string;
}
export interface GamelogRow {
  eventId: string; date?: string; opponent?: string; atVs?: string;
  result?: string; score?: string;
  /** Stat name -> value, e.g. { PTS: "24", REB: "7" }. */
  stats: Record<string, string>;
}

// Raw endpoints (resolve to ESPN's JSON).
export function scoreboard(params?: Record<string, unknown>, opts?: Options): Promise<any>;
export function teams(opts?: Options): Promise<any>;
export function team(id: string, opts?: Options): Promise<any>;
export function roster(id: string, opts?: Options): Promise<any>;
export function athlete(id: string, opts?: Options): Promise<any>;
export function athletes(params?: { limit?: number; page?: number; active?: boolean }, opts?: Options): Promise<any>;
export function gamelog(id: string, opts?: Options): Promise<any>;
export function splits(id: string, opts?: Options): Promise<any>;
export function news(params?: Record<string, unknown>, opts?: Options): Promise<any>;
export function summary(eventId: string, opts?: Options): Promise<any>;
export function standings(opts?: Options): Promise<any>;
export function odds(eventId: string, opts?: Options): Promise<any>;
export function plays(eventId: string, params?: { limit?: number }, opts?: Options): Promise<any>;

// Parsed convenience (clean data).
export function scoreboardClean(params?: Record<string, unknown>, opts?: Options): Promise<ScoreboardGame[]>;
export function teamsClean(opts?: Options): Promise<Team[]>;
export function rosterClean(id: string, opts?: Options): Promise<RosterPlayer[]>;
export function gamelogClean(id: string, opts?: Options): Promise<GamelogRow[]>;
