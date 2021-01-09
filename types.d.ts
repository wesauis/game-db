import type * as gameStores from './stores/all.ts'

export interface GameOffer {
  store: keyof typeof gameStores
  name: string
  description: string
  price: [number, number] // original, actual
  discount: number
  link: string
  ended: boolean
}

export type GameStore = () => Promise<GameOffer[]>