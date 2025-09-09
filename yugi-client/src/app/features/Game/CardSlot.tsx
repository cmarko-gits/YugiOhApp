import { Box } from "@mui/material";
import type { CardItem } from "../../model/Card";

interface CardSlotProps {
  card?: CardItem | null;
  isFaceDown?: boolean;
}

export default function CardSlot({ card, isFaceDown = false }: CardSlotProps) {
  return (
    <Box
      sx={{
        width: "6vw",
        height: "9vw",
        maxWidth: "80px",
        maxHeight: "120px",
        border: "2px solid #ccc",
        borderRadius: 4,
        backgroundColor: "#222",
        backgroundImage: card
          ? `url(${card.imageUrl})`
          : isFaceDown
          ? "url('/images/card-back.png')"
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.1)",
          cursor: "pointer",
        },
      }}
    />
  );
}
