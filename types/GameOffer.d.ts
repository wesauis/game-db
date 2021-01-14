import { RegisteredProviders } from "../providers/registry.ts";

export default interface GameOffer {
  provider: RegisteredProviders;

  title: string;
  publisher?: string;
  link: string;

  price?: {
    base: number;
    final: number;
    discount: number;
  };
}
