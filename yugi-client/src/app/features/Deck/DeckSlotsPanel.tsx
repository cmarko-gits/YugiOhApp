import { Box } from "@mui/material";
import React from "react";
import type { CardItem } from "../../model/Card";
import DeckSlot from "./DeckSlot";

interface DeckSlotsPanelProps {
  deck: Array<CardItem | null>;
  onDropCard: (index: number, card: CardItem) => void;
  onRemoveCard: (card: CardItem) => void;
  onClickCard: (card: CardItem) => void;
}

const DeckSlotsPanel: React.FC<DeckSlotsPanelProps> = ({
  deck,
  onDropCard,
  onRemoveCard,
  onClickCard,
}) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)", // 5 u redu
      gap: 2,
    }}
  >
    {deck.map((card, index) => (
      <DeckSlot
        key={index}
        card={card}
        index={index}
        onDropCard={onDropCard}
        onRemoveCard={onRemoveCard}
        onClick={() => card && onClickCard(card)}
      />
    ))}
  </Box>
);

export default DeckSlotsPanel;
