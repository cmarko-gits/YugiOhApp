// src/features/deck/DeckSlot.tsx
import { Box, CardMedia, Card as MuiCard, Typography } from "@mui/material";
import React from "react";
import { useDrag, useDrop } from "react-dnd";
import type { CardItem } from "../../model/Card";
import { CARD } from "./DraggableCard";

interface DeckSlotProps {
  card: CardItem | null;
  index: number;
  onDropCard: (index: number, card: CardItem) => void;
  onRemoveCard: (card: CardItem) => void;
  onClick?: () => void; // <--- dodali smo optional onClick
}

interface DragItem {
  card: CardItem;
}

const DeckSlot: React.FC<DeckSlotProps> = ({ card, index, onDropCard, onRemoveCard, onClick }) => {
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: CARD,
    drop: (item) => {
      if (item && item.card) onDropCard(index, item.card);
    },
    collect: () => ({
      isOver: false,
    }),
  });

  const drag = useDrag<DragItem, void, unknown>({
    type: CARD,
    item: { card } as DragItem,
    canDrag: !!card,
    end: (item, monitor) => {
      if (item && item.card && !monitor.didDrop()) {
        onRemoveCard(item.card);
      }
    },
  })[1]; // samo ref

  return (
    <Box
      ref={drop}
      sx={{
        width: 140,
        height: 200,
        border: "2px dashed",
        borderRadius: 2,
        borderColor: isOver ? "primary.main" : "grey.300",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 2,
        backgroundColor: card ? "white" : "grey.100",
        boxShadow: card ? 2 : 0,
        transition: "all 0.2s ease",
      }}
      onClick={onClick} // <--- ovde pozivamo onClick
    >
      {card ? (
        <MuiCard
          ref={drag as unknown as React.Ref<HTMLDivElement>}
          sx={{
            width: 120,
            height: 180,
            cursor: "grab",
            borderRadius: 2,
            boxShadow: 2,
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.05)", boxShadow: 4 },
          }}
        >
          <CardMedia
            component="img"
            image={card.imageUrl || "/placeholder.png"}
            alt={card.name}
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </MuiCard>
      ) : (
        <Typography variant="body2" sx={{ color: "grey.400" }}>
          Empty
        </Typography>
      )}
    </Box>
  );
};

export default DeckSlot;
