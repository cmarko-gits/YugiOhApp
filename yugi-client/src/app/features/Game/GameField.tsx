// components/GameField/GameField.tsx

import { Box, Button } from "@mui/material";
import { useEffect } from "react";
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

  // Pokreni igru kada se komponenta mount-uje
  useEffect(() => {
    dispatch(startGameAsync());
  }, [dispatch]);

  const handleCardClick = (card: Card) => {
    if (!card) return;
    if (card.type.includes("Monster")) {
      dispatch(summonCardAsync({ cardId: card.id, inAttackMode: true, isPlayer: true }));
    } else if (card.type.includes("Spell") || card.type.includes("Trap")) {
      dispatch(placeSpellTrapAsync({ cardId: card.id, isPlayer: true }));
    } else {
      console.warn("Nepoznat tip karte:", card);
    }
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
        position: "relative",
        overflow: "hidden",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      {/* DECK prikaz (u donjem desnom uglu) */}
      <Box
        sx={{
          position: "absolute",
          right: "calc(50% - 650px - 20px)",
          bottom: 50,
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
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          paddingY: 4,
        }}
      >
        {/* Protivnička zona */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          {/* Monster zona gore */}
          <GameSlot cards={opponentMonsterZone} />
          {/* Spell/Trap zona dole */}
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

        {/* Igračeva zona */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          {/* Monster zona gore */}
          <GameSlot cards={playerMonsterZone} />
          {/* Spell/Trap zona dole */}
          <GameSlot cards={playerSpellTrapZone} />
          {/* Ruka ispod */}
          <GameSlot cards={hand} isHand onCardClick={handleCardClick} />
        </Box>
      </Box>

      {/* Poruka o grešci */}
      {error && (
        <Box
          sx={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(255, 0, 0, 0.8)",
            padding: "8px 16px",
            borderRadius: 4,
            fontWeight: "bold",
          }}
        >
          {error}
        </Box>
      )}
    </Box>
  );
}
