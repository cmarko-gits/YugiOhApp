// src/features/deck/AvailableCards.tsx
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import agent from "../../api/agent";
import CardFilter from "../../layout/Filters/Filter";
import LoadingPage from "../../layout/Loading/LoadingPage";
import SearchBar from "../../layout/Search/Search";
import type { CardItem } from "../../model/Card";
import DraggableCard from "./DraggableCard";

interface AvailableCardsProps {
  onSelectCard?: (card: CardItem) => void; // opciono za drag/drop
}

const AvailableCards: React.FC<AvailableCardsProps> = ({ onSelectCard }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("");

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await agent.Card.getAll(1, 50, search, filter);
      setCards(response.data.data);
    } catch (error) {
      console.error("Failed to fetch available cards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [search, filter]);

  return (
    <Box
      sx={{
        borderLeft: "1px solid grey",
        height: "100vh",
        p: 2,
        overflowY: "auto",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Available Cards
      </Typography>

      {/* Search i Filter */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
        <SearchBar value={search} onChange={setSearch} />
        <CardFilter value={filter} onChange={setFilter} />
      </Box>

      {/* Lista karata */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {loading ? (
          <LoadingPage />
        ) : (
          cards.map((card) => <DraggableCard key={card.id} card={card} />)
        )}
      </Box>
    </Box>
  );
};

export default AvailableCards;
