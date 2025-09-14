import { Box, Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useState } from "react";
import { placeSpellTrapAsync, summonCardAsync, type Card } from "../../slices/gameSlice";
import { useAppDispatch } from "../../store/configureStore";

interface CardWithMode extends Card {
  inAttackMode?: boolean;
}

interface Props {
  cards?: (CardWithMode | null)[];
  card?: CardWithMode | null;
  isHand?: boolean;
}

export default function GameSlot({ cards, card, isHand }: Props) {
  const dispatch = useAppDispatch();
  const [selectedCard, setSelectedCard] = useState<CardWithMode | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const cardArray = cards ?? (card ? [card] : []);

  const handleCardClick = (card: CardWithMode) => {
  if (card.type.includes("Monster")) {
    // Prikaz dijaloga za attack/defense
    setSelectedCard(card);
    setDialogOpen(true);
  } else if (card.type.includes("Spell") || card.type.includes("Trap")) {
    // Spell/Trap ide odmah u zonu
    dispatch(placeSpellTrapAsync({ cardId: card.id, isPlayer: true }));
  } else {
    console.warn("Nepoznat tip karte:", card.type);
  }
};


  const handleModeSelect = (inAttack: boolean) => {
    if (selectedCard) {
      dispatch(summonCardAsync({ cardId: selectedCard.id, inAttackMode: inAttack, isPlayer: true }));
    }
    setDialogOpen(false);
    setSelectedCard(null);
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 1, justifyContent: "center", padding: 1 }}>
        {cardArray.map((cardItem, index) => (
          <Box
            key={index}
            sx={{
              width: isHand ? 70 : 100,  // slot malo uži
              height: isHand ? 100 : 110, // slot malo niži
              border: "1px solid gray",
              borderRadius: 2,
              backgroundColor: cardItem ? "transparent" : "#333",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              cursor: isHand ? "pointer" : "default",
            }}
            onClick={() => isHand && cardItem && handleCardClick(cardItem)}
          >
            {cardItem && (
              <Box
                sx={{
                  width: cardItem.inAttackMode === false && !isHand ? 110 : "110%",  // karta veća od slot-a
                  height: "90%",
                  backgroundImage: `url(${cardItem.imageUrl})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  transform: cardItem.inAttackMode === false && !isHand ? "rotate(-90deg)" : "none",
                  transition: "transform 0.3s ease",
                  borderRadius: 1,
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Izaberite način za {selectedCard?.name}</DialogTitle>
        <DialogActions>
          <Button onClick={() => handleModeSelect(true)}>Attack ⚔️</Button>
          <Button onClick={() => handleModeSelect(false)}>Defense 🛡️</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
