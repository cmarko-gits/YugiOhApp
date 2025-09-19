import { Box } from "@mui/material";
import loading_card from "../../../assets/loading_card.jpg";
import type { Card } from "../../slices/gameSlice";

interface CardWithMode extends Card {
  inAttackMode?: boolean;
  isFaceDown?: boolean;
}

interface Props {
  cards?: (CardWithMode | null)[];
  card?: CardWithMode | null;
  isHand?: boolean;
  onCardClick?: (card: Card) => void;
}

export default function GameSlot({ cards, card, isHand, onCardClick }: Props) {
  const cardArray = cards ?? (card ? [card] : []);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        justifyContent: "center",
        padding: 1,
        overflowX: isHand ? "auto" : "visible",
        flexWrap: isHand ? "nowrap" : "wrap",
      }}
    >
      {cardArray.map((cardItem, index) => {
        const isFaceDown = cardItem?.isFaceDown;
        const isDefense = cardItem?.inAttackMode === false && !isHand;
        const imgSrc = isFaceDown ? loading_card : cardItem?.imageUrl;

        return (
          <Box
            key={cardItem?.id ?? index}
            onClick={() => isHand && cardItem && onCardClick?.(cardItem)}
            sx={{
              width: isHand ? 70 : 100,
              height: isHand ? 100 : 110,
              border: "1px solid gray",
              borderRadius: 2,
              backgroundColor: cardItem ? "transparent" : "#333",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: isHand ? "pointer" : "default",
            }}
          >
            {cardItem && (
              <Box
                sx={{
                  width: isDefense ? 110 : "110%",
                  height: "90%",
                  backgroundImage: `url(${imgSrc})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  transform: isDefense ? "rotate(-90deg)" : "none",
                  transition: "transform 0.3s ease",
                  borderRadius: 1,
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}