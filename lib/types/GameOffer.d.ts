export default interface GameOffer {
  /** provider name */
  provider: string;

  /** game title, `title title` */
  title: string;
  /** who published the game */
  publisher?: string;
  /** who is the developer */
  developer?: string;
  /** offer link */
  link: string;

  /** offer pricing */
  price?: {
    /** base/original price */
    base: number;
    /** price with discount */
    final: number;
    /** discount percentage */
    discount: number;
  };
}
