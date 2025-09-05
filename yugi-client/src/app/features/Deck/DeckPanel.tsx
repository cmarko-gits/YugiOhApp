import { Box, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import agent from "../../api/agent";
import { type CardItem } from "../../model/Card";
import DeckSlotsPanel from "./DeckSlotsPanel";

const DeckPanel: React.FC = () => {
  const [mainDeck, setMainDeck] = useState<Array<CardItem | null>>([]);
  const [fusionDeck, setFusionDeck] = useState<Array<CardItem | null>>([]);

  const fetchDecks = async () => {
    try {
      const response = await agent.Deck.getDeck();
      const cards = response.data.cards as CardItem[];
      const fusionCards = response.data.fusionDeck as CardItem[];

      setMainDeck([...cards, ...Array(40 - cards.length).fill(null)]);

      setFusionDeck([...fusionCards, ...Array(10 - fusionCards.length).fill(null)]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  // --- MainDeck funkcije ---
  const handleAddMainCard = async (index: number, card: CardItem) => {
    try {
      await agent.Deck.addCard(card.id);
      fetchDecks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveMainCard = async (card: CardItem) => {
    try {
      await agent.Deck.removeCard(card.id);
      fetchDecks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddFusionCard = async (index: number, card: CardItem) => {
    try {
      await agent.Deck.addFusionCard(card.id);
      fetchDecks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveFusionCard = async (card: CardItem) => {
    try {
      await agent.Deck.removeFusionCard(card.id);
      fetchDecks();
    } catch (error) {
      console.error(error);
    }
  };

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
