import { Box } from "@mui/material";
import type { Card } from "../../slices/gameSlice";

interface CardWithMode extends Card {
  inAttackMode?: boolean; // true = napad, false = odbrana
}

interface Props {
  cards?: (CardWithMode | null)[];
  card?: CardWithMode | null; // pojedinačni slot
  isHand?: boolean;
  isPlayerMonsterZone?: boolean;
  onCardClick?: (card: CardWithMode) => void;
}

export default function GameSlot({ cards, card, isHand, isPlayerMonsterZone, onCardClick }: Props) {
  const cardArray = cards ?? (card !== undefined ? [card] : []);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        justifyContent: "center",
        padding: 1,
      }}
    >
      {cardArray.map((cardItem, index) =>
        cardItem ? (
          <div
            key={index}
            onClick={() => onCardClick?.(cardItem)}
            style={{
              cursor: isHand && onCardClick ? "pointer" : "default",
              display: "inline-block",
              width: isHand ? 90 : 80,
              height: isHand ? 130 : 110,
              border: "1px solid gray",
              userSelect: "none",
              transform:
                isPlayerMonsterZone && cardItem.inAttackMode === false
                  ? "rotate(-90deg)"
                  : "none",
              transformOrigin: "center center",
backgroundImage: `url(${cardItem.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 2,
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={e => {
              if (cardItem && isHand) e.currentTarget.style.transform += " scale(1.1)";
            }}
            onMouseLeave={e => {
              if (cardItem && isHand)
                e.currentTarget.style.transform = isPlayerMonsterZone && cardItem.inAttackMode === false ? "rotate(-90deg)" : "none";
            }}
          />
        ) : (
          <div
            key={index}
            style={{
              width: isHand ? 90 : 80,
              height: isHand ? 130 : 110,
              backgroundColor: "#333",
              border: "1px solid #555",
              borderRadius: 2,
            }}
          />
        )
      )}
    </Box>
  );
}
