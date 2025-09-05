// src/features/deck/DraggableCard.tsx
import { CardMedia, Card as MuiCard, Typography } from "@mui/material";
import React from "react";
import { useDrag } from "react-dnd";
import type { CardItem } from "../../model/Card";

export const CARD = "CARD";

interface DraggableCardProps {
  card: CardItem;
  onClick?: () => void; // dodali optional onClick
}

const DraggableCard: React.FC<DraggableCardProps> = ({ card, onClick }) => {
  const [, dragRef] = useDrag({
    type: CARD,
    item: { card },
  });

  return (
    <MuiCard
      ref={dragRef as unknown as React.Ref<HTMLDivElement>}
      sx={{
        width: 140,
        height: 180,
        cursor: "grab",
        borderRadius: 2,
        boxShadow: 2,
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.05)", boxShadow: 4 },
      }}
      onClick={(e) => {
        e.stopPropagation(); // sprečava conflict sa drag
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        onClick && onClick();
      }}
    >
      <CardMedia
        component="img"
        image={card.imageUrl || "/placeholder.png"}
        alt={card.name}
        sx={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
      <Typography variant="body2" sx={{ textAlign: "center", mt: 0.5 }}>
        {card.name}
      </Typography>
    </MuiCard>
  );
};

export default DraggableCard;
