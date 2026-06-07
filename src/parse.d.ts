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

export function parseScoreboard(raw: unknown): ScoreboardGame[];
export function parseTeams(raw: unknown): Team[];
export function parseRoster(raw: unknown): RosterPlayer[];
export function parseGamelog(raw: unknown): GamelogRow[];
