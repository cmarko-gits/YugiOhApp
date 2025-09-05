/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Paper } from "@mui/material";
import React, { useEffect } from "react";
import {
  addCardToDeck,
  addFusionCardToDeck,
  fetchDeck,
  removeCardFromDeck,
  removeFusionCardFromDeck,
} from "../../slices/deckSlice";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import DeckSlotsPanel from "./DeckSlotsPanel";

const DeckPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { deck: mainDeck, fusionDeck, loading } = useAppSelector((state) => state.deck);

  useEffect(() => {
    dispatch(fetchDeck());
  }, [dispatch]);

  const handleAddMainCard = (index: number, card: any) => {
    dispatch(addCardToDeck(card.id));
  };

  const handleRemoveMainCard = (card: any) => {
    dispatch(removeCardFromDeck(card.id));
  };

  const handleAddFusionCard = (index: number, card: any) => {
    dispatch(addFusionCardToDeck(card.id));
  };

  const handleRemoveFusionCard = (card: any) => {
    dispatch(removeFusionCardFromDeck(card.id));
  };

  if (loading) return <div>Loading deck...</div>;

  return (
    <Box sx={{ p: 4 }}>
      {/* Main Deck */}
      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <DeckSlotsPanel
          deck={mainDeck}
          onDropCard={handleAddMainCard}
          onRemoveCard={handleRemoveMainCard}
          onClickCard={(card) => console.log("MainDeck clicked:", card)}
        />
      </Paper>

      {/* Fusion Deck */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <DeckSlotsPanel
          deck={fusionDeck}
          onDropCard={handleAddFusionCard}
          onRemoveCard={handleRemoveFusionCard}
          onClickCard={(card) => console.log("FusionDeck clicked:", card)}
        />
      </Paper>
    </Box>
  );
};

export default DeckPanel;
