import { GameStore } from "../types.d.ts"

const epicstore: GameStore = async () => {
  await fetch('').catch(() => {})

  return [{
    store: 'epicstore',
    name: '',
    description: '',
    discount: 0,
    price: [-1, 1],
    link: 'http://test.jpg',
    ended: false,
  }];
}

export default epicstore