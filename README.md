# nfl-api

Small, unofficial Node client for ESPN's NFL data. ESPN serves NFL
under `football/nfl`, and this wraps those endpoints.

Part of the [espn-api](https://github.com/LeSingh1/espn-api) family. The parent
repo is one client for every sport. This one is just NFL, in the style of
swar/nba_api, for people who only want this league.

## Run it

No dependencies. Node 18+ (built-in fetch).

```
git clone https://github.com/LeSingh1/nfl-api
cd nfl-api
node examples/scoreboard.js   # NFL games on the board
node examples/gamelog.js      # a real player's game log
node tests/sports.test.js
```

## Use it

```js
import { scoreboard, gamelog } from "./src/api.js";

await scoreboard({ dates: "20260906" });
await gamelog("ATHLETE_ID");   // per-game log
```

Each call returns ESPN's raw JSON. Endpoints: `scoreboard`, `teams`, `team`, `roster`, `athlete`, `gamelog`, `splits`, `news`, `summary`, `standings`.

## Honest notes

- Unofficial. ESPN does not document or support these endpoints, so they can
  change or break without warning. Cache responses and do not hammer it.
- Endpoint map credit: [this community gist](https://gist.github.com/nntrn/ee26cb2a0716de0947a0a4e9a157bc1c).

## License

MIT.
