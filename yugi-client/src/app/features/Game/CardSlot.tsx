/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from "@mui/material";

interface CardSlotProps {
  card: any | null;
  isFaceDown?: boolean;
}

export default function CardSlot({ card }: CardSlotProps) {
  return (
    <Box
      sx={{
        width: 80,
        height: 120,
        border: "2px solid #fff",
        borderRadius: 2,
        backgroundImage: card ? `url(${card.imageUrl || "/assets/loading_card.jpg"})` : "none",
        backgroundColor: card ? "transparent" : "#000", // prazni slotovi crni
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "transform 0.3s ease",
        "&:hover": { transform: card ? "scale(1.1)" : "none" },
      }}
    />
  );
}
