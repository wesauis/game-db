# Game DB

Find free games or really good offers

# CLI

```sh
deno install --allow-net --name game-db https://github.com/wesauis/game-db/raw/0.1.0/mod.ts
```

Use `game-db --help` for help!

# API

```typescript
import {
  providers,
  queryOffers,
} from "https://github.com/wesauis/game-db/raw/0.1.0/mod.ts";

console.log(await queryOffers(Object.values(providers.free)));
```
