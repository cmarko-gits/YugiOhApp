import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Card } from "../../slices/gameSlice";
import {
  drawCardAsync,
  placeSpellTrapAsync,
  selectGame,
  startGameAsync,
  summonCardAsync,
} from "../../slices/gameSlice";
import type { AppDispatch } from "../../store/configureStore";
import Deck from "../Deck/Deck";
import GameSlot from "./GameSlot";

export default function GameField() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    hand,
    playerMonsterZone,
    opponentMonsterZone,
    playerSpellTrapZone,
    opponentSpellTrapZone,
    deckCount,
    error,
  } = useSelector(selectGame);

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [monsterDialogOpen, setMonsterDialogOpen] = useState(false);
  const [spellTrapDialogOpen, setSpellTrapDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(startGameAsync());
  }, [dispatch]);

  const handleCardClick = (card: Card) => {
    if (!card) return;

    if (card.type.includes("Monster")) {
      setSelectedCard(card);
      setMonsterDialogOpen(true);
    } else if (card.type.includes("Trap")) {
      dispatch(placeSpellTrapAsync({ cardId: card.id, isPlayer: true, isFaceDown: true }));
    } else if (card.type.includes("Spell")) {
      setSelectedCard(card);
      setSpellTrapDialogOpen(true);
    }
  };

const handleMonsterSummon = (inAttackMode: boolean) => {
  if (!selectedCard) return;
  dispatch(summonCardAsync({ cardId: selectedCard.id, inAttackMode }));
  setMonsterDialogOpen(false);
  setSelectedCard(null);
};


  const handleSpellTrapSet = (activate: boolean) => {
    if (!selectedCard) return;
    dispatch(placeSpellTrapAsync({ cardId: selectedCard.id, isPlayer: true, isFaceDown: !activate }));
    setSpellTrapDialogOpen(false);
    setSelectedCard(null);
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(to bottom, #0d0d0d, #1a1a1a)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      {/* Deck */}
      <Box
        sx={{
          position: "absolute",
          right: "20px",
          bottom: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Deck count={deckCount} />
      </Box>

      {/* Glavni kontejner */}
      <Box
        sx={{
          width: "1300px",
          height: "90%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          paddingY: 4,
        }}
      >
        {/* Protivnik */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
          <GameSlot cards={opponentMonsterZone} />
          <GameSlot cards={opponentSpellTrapZone} />
        </Box>

        {/* Kontrole */}
        <Box sx={{ display: "flex", gap: 2, marginY: 2 }}>
          <Button variant="contained" color="primary" onClick={() => dispatch(startGameAsync())}>
            Nova igra
          </Button>
          <Button variant="contained" color="secondary" onClick={() => dispatch(drawCardAsync())}>
            Izvuci kartu
          </Button>
        </Box>

        {/* Igrač */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%" }}>
          <GameSlot cards={playerMonsterZone} />
          <GameSlot cards={playerSpellTrapZone} />

          {/* Ruka ispod */}
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <GameSlot cards={hand} isHand onCardClick={handleCardClick} />
          </Box>
        </Box>
      </Box>

      {/* Error */}
      {error && (
        <Box
          sx={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(255,0,0,0.8)",
            padding: "8px 16px",
            borderRadius: 4,
            fontWeight: "bold",
          }}
        >
          {error}
        </Box>
      )}

      {/* Dialog Monster */}
      <Dialog open={monsterDialogOpen} onClose={() => setMonsterDialogOpen(false)}>
        <DialogTitle>Izaberi poziciju čudovišta</DialogTitle>
        <DialogContent>Da li želite da prizovete u Attack ili Defense poziciji?</DialogContent>
        <DialogActions>
          <Button onClick={() => handleMonsterSummon(true)}>Attack</Button>
          <Button onClick={() => handleMonsterSummon(false)}>Defense</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Spell */}
      <Dialog open={spellTrapDialogOpen} onClose={() => setSpellTrapDialogOpen(false)}>
        <DialogTitle>Spell/Trap opcija</DialogTitle>
        <DialogContent>Da li želite da aktivirate odmah ili postavite face-down?</DialogContent>
        <DialogActions>
          <Button onClick={() => handleSpellTrapSet(false)}>Set Face-Down</Button>
          <Button onClick={() => handleSpellTrapSet(true)}>Activate Immediately</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}