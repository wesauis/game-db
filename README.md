# Game DB

Find free games or really good offers

# CLI

```sh
# download
deno cache -r https://github.com/wesauis/game-db/raw/0.2.0/cli/cli.ts

# install/update
deno install -f --allow-net --allow-read --allow-write --allow-env --name game-db https://github.com/wesauis/game-db/raw/0.2.0/cli/cli.ts
```

Use `game-db --help` for help! Should give you this output:

```
Usage: game-db [OPTIONS]

find the best game offers from your terminal

OPTIONS:
  --help                                        show this help message
  --html                                        prints html to stdout
  --force                                       run all registered providers
  --free                                        show all always free games
  --discounted                                  show all discounted offers
  --json [raw|pretty]                           prints json to stdout
                                                 ↪ raw: minified
                                                 ↪ pretty: 2 spaces indent
  --ending [ms]                                 show games that will end soon
                                                 ↪ ms: millisseconds to end, defaults to 36 hours
  --best-offers [hide|([percentage][,amount])]  show best offers, enabled by default
                                                 ↪ hide: disables
                                                 ↪ percentage: greater/equal then this is a good offer, defaults to 90
                                                 ↪ amount: saved ammount, greater/equal then this is a good offer, defaults to 80
  --searcher-id-match <regex>                   filters what provider to be used using a regex to test against the provider id

ENVIRONMENT:
  NO_COLOR        disable colors
```

# API

```typescript
import { searchers } from "https://github.com/wesauis/game-db/raw/0.2.0/lib/lib.ts";

console.log(await searchers.epicStoreDiscounted());
```
