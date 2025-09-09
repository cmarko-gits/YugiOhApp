import type { CardItem } from "./Card";

export interface  GameState {
  deck: CardItem[];
  hand: CardItem[];
  monsterZone: (CardItem | null)[];
  spellTrapZone: (CardItem | null)[];
  deckCount: number;
}