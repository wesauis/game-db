# Game DB

> v0.1.0

_find free or really good game offers_

# API

```typescript
import {
  providers,
  queryOffers,
} from "https://github.com/wesauis/game-db/raw/0.1.0/mod.ts";

console.log(await queryOffers(Object.values(providers.free)));
```

# CLI

## Intalation

```sh
deno install --allow-net --name game-db https://github.com/wesauis/game-db/raw/0.1.0/mod.ts
```

# Usage

```sh
game-db --help
```
