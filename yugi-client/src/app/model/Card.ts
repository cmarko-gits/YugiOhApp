import type { Card } from "../slices/gameSlice";

export type CardItem = {
  id: number;
  name: string;
  imageUrl: string;
  desc: string; 
  type:string;
  attack?:number;
  defense?:number
};

export interface CardSlot {
  card: Card | null;
  position?: "attack" | "defense"; // ako koristiš za režim čudovišta
}