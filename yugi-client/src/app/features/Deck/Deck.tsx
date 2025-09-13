import { Box } from "@mui/material";
import loadingCard from "../../../assets/loading_card.jpg";

interface DeckProps {
  count: number;
  fusion?: boolean;
}

export default function Deck({ count }: DeckProps) {
  const cardWidth = 80;
  const cardHeight = 120;
  const maxOffset = 20; // maksimalno vizuelno pomeranje karata
  const maxCardsInPile = 15;

  if (count === 0) return null;

  const effectiveCount = Math.min(count, maxCardsInPile);
  const offsetStep = effectiveCount > 1 ? maxOffset / (effectiveCount - 1) : 0;

  return (
    <Box
      sx={{
        width: cardWidth + maxOffset,
        height: cardHeight + maxOffset,
        position: "relative",
      }}
    >
      {Array.from({ length: effectiveCount }).map((_, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            top: i * offsetStep,
            left: i * offsetStep,
            width: cardWidth,
            height: cardHeight,
            borderRadius: 2,
            border:"none",
            backgroundImage: `url(${loadingCard})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      <Box
        sx={{
          position: "absolute",
          top: 4,
          right: 4,
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        {count}
      </Box>
    </Box>
  );
}
