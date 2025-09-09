/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from "@mui/material";
import CardSlot from "./CardSlot";

interface GameSlotProps {
  cards: any[];
}

export default function GameSlot({ cards }: GameSlotProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${cards.length}, 1fr)`,
        gap: "0.5vw",
        width: "700px",
      }}
    >
      {cards.map((card, i) => (
        <CardSlot key={i} card={card} isFaceDown={!card} />
      ))}
    </Box>
  );
}
