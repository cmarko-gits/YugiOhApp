import type { CardDto } from "./CardDto";

export interface PaginatedCards {
  items: CardDto[];
  totalCount: number;
}