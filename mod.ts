import { parseArgs } from "./deps.ts";
import * as gameStores from './stores/all.ts'

if (import.meta.main) {
  const args = parseArgs(Deno.args)

  Object.entries(gameStores).forEach(([name, gameStore]) => {
    console.log(`finding games at ${name}`)
    
    gameStore()

    console.log()
  })
}


