// src/features/deck/FusionDeckPanel.tsx
import { Box, Typography } from "@mui/material";
import React from "react";
import type { CardItem } from "../../model/Card";
import DeckSlot from "./DeckSlot";

interface FusionDeckPanelProps {
  fusionDeck: Array<CardItem | null>;
  onDropCard: (index: number, card: CardItem) => void;
  onRemoveCard: (card: CardItem) => void;
  onClickCard: (card: CardItem) => void;
}

const FusionDeckPanel: React.FC<FusionDeckPanelProps> = ({
  fusionDeck,
  onDropCard,
  onRemoveCard,
  onClickCard,
}) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Fusion Deck
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          p: 2,
          flex: 1,
          overflowY: "auto",
          justifyContent: "flex-start",
          border: "1px solid",
          borderColor: "grey.300",
          borderRadius: 2,
          backgroundColor: "grey.100",
        }}
      >
        {fusionDeck.map((card, index) => (
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
    </Box>
  );
};

export default FusionDeckPanel;
