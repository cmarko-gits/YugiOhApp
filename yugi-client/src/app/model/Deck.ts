import { type CardItem } from "./Card";

export interface DeckResponse {
  cards: CardItem[];
  graveyard: CardItem[];
  banished: CardItem[];
}
