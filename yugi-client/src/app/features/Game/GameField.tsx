import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { drawCardAsync, startGameAsync } from "../../slices/gameSlice";
import type { AppDispatch, RootState } from "../../store/configureStore";
import Deck from "../Deck/Deck";
import GameSlot from "./GameSlot";

export default function GameField() {
  const dispatch = useDispatch<AppDispatch>();

  const { hand, monsterZone, spellTrapZone, deckCount } = useSelector(
    (state: RootState) => state.game
  );

  useEffect(() => {
    dispatch(startGameAsync());
  }, [dispatch]);

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
      }}
    >
      {/* Običan deck - desno izvan containera */}
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

      {/* Container za ruku i arenu */}
      <Box
        sx={{
          width: "1300px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Protivnik */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <GameSlot cards={monsterZone} />
          <GameSlot cards={spellTrapZone} />
        </Box>

        {/* Dugmad */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" onClick={() => dispatch(startGameAsync())}>
            Nova igra
          </Button>
          <Button variant="contained" onClick={() => dispatch(drawCardAsync())}>
            Izvuci kartu
          </Button>
        </Box>

        {/* Igrač */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <GameSlot cards={spellTrapZone} />
          <GameSlot cards={monsterZone} />
          <GameSlot cards={hand} />
        </Box>
      </Box>
    </Box>
  );
}
