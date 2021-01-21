export default interface GameOffer {
  provider: string;

  title: string;
  publisher?: string;
  developer?: string;
  link: string;

  price?: {
    base: number;
    final: number;
    discount: number;
  };
}
