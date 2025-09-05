export interface CardDto {
  id: number;
  name: string;
  type: string;
  race: string;
  attack: number;
  defense: number;
  desc: string;
  imageUrl: string;
}

export interface CardState {
  cards: CardDto[];
  totalCount: number;
  selectedCard?: CardDto;
  loading: boolean;
  error?: string;
}