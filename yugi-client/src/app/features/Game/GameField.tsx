/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import agent from "../../api/agent";
import GameSlot from "./GameSlot";

export default function GameField() {
  const [hand, setHand] = useState<any[]>([]);
  const [monsterZone, setMonsterZone] = useState<any[]>(Array(5).fill(null));
  const [spellTrapZone, setSpellTrapZone] = useState<any[]>(Array(5).fill(null));
  const [deckCount, setDeckCount] = useState(0);

  const startGame = async () => {
    try {
      const res = await agent.Game.start();
      setHand(res.data.hand);
      setDeckCount(res.data.deckCount);
      setMonsterZone(Array(5).fill(null));
      setSpellTrapZone(Array(5).fill(null));
    } catch (err) {
      console.error(err);
    }
  };

  // Draw jednu kartu
  const  drawCard = async () => {
    try {
      const res = await agent.Game.draw(1);
      setHand(res.data.hand);
      setDeckCount(res.data.deckCount);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    startGame();
  }, []);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(to bottom, #0d0d0d, #1a1a1a)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        overflow: "hidden",
        p: 1,
      }}
    >
      {/* Protivnik */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1, justifyContent: "space-evenly" }}>
        <GameSlot cards={monsterZone} />
        <GameSlot cards={spellTrapZone} />
      </Box>

      {/* Dugmad */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={startGame}>Nova igra</Button>
        <Button variant="contained" onClick={drawCard}>Izvuci kartu</Button>
        <Box sx={{ color: "#fff", alignSelf: "center" }}>Deck: {deckCount}</Box>
      </Box>

      {/* Igrač */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1, justifyContent: "space-evenly" }}>
        <GameSlot cards={spellTrapZone} />
        <GameSlot cards={monsterZone} />
        <GameSlot cards={hand} />
      </Box>
    </Box>
  );
}
