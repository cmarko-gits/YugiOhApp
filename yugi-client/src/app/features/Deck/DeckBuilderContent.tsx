import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate } from "react-router-dom";
import agent from "../../api/agent";
import CardFilter from "../../layout/Filters/Filter";
import LoadingPage from "../../layout/Loading/LoadingPage";
import SearchBar from "../../layout/Search/Search";
import type { CardItem } from "../../model/Card";
import {
  addCard,
  addFusionCard,
  fetchAvailableCards,
  fetchDeck,
  removeCard,
  removeFusionCard,
  setFilter,
  setPage,
  setSearch
} from "../../slices/deckSlice";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import DeckSlot from "./DeckSlot";
import DraggableCard from "./DraggableCard";

const DeckBuilderContent: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    deck,
    fusionDeck,
    availableCards,
    loading,
    loadingMore,
    page,
    hasMore,
    search,
    filter
  } = useAppSelector(state => state.deck);

  // --- Fetch deck on mount ---
  useEffect(() => {
    dispatch(fetchDeck());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAvailableCards({ page, search, filter }));
  }, [dispatch, page, search, filter]);

  const handleDropCard = async (index: number, card: CardItem) => {
    dispatch(addCard({ index, card }));
    await agent.Deck.addCard(card.id);
  };

  const handleRemoveCard = async (card: CardItem) => {
    dispatch(removeCard(card));
    await agent.Deck.removeCard(card.id);
  };

  const handleDropFusionCard = async (index: number, card: CardItem) => {
    dispatch(addFusionCard({ index, card }));
    await agent.Deck.addFusionCard(card.id);
  };

  const handleRemoveFusionCard = async (card: CardItem) => {
    dispatch(removeFusionCard(card));
    await agent.Deck.removeFusionCard(card.id);
  };

  if (loading) return <LoadingPage />;

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* LEFT PANEL: Decks */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 4 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {deck.map((card, index) => (
              <DeckSlot
                key={`main-${index}`}
                card={card}
                index={index}
                onDropCard={handleDropCard}
                onRemoveCard={handleRemoveCard}
                onClick={() => card && navigate(`/card/${card.id}`)}
              />
            ))}
          </Box>

          <Typography>Fusion Cards</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {fusionDeck.map((card, index) => (
              <DeckSlot
                key={`fusion-${index}`}
                card={card}
                index={index}
                onDropCard={(i, c) => handleDropFusionCard(index, c)}
                onRemoveCard={handleRemoveFusionCard}
                onClick={() => card && navigate(`/card/${card.id}`)}
              />
            ))}
          </Box>
        </Box>

        {/* RIGHT PANEL: Available Cards */}
        <Box
          sx={{ width: 260, borderLeft: "1px solid grey", height: "100vh", overflowY: "auto", p: 2 }}
          onScroll={(e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
            if (scrollTop + clientHeight >= scrollHeight - 5 && !loadingMore && hasMore) {
              dispatch(setPage(page + 1));
            }
          }}
        >
          <Box sx={{ mb: 2 }}>
            <SearchBar value={search} onChange={(val) => dispatch(setSearch(val))} />
            <CardFilter value={filter} onChange={(val) => dispatch(setFilter(val))} />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
            {availableCards.map((card) => (
              <DraggableCard
                key={card.id}
                card={card}
                onClick={() => card && navigate(`/card/${card.id}`)}
              />
            ))}
            {loadingMore && <Typography>Loading more cards...</Typography>}
          </Box>
        </Box>
      </Box>
    </DndProvider>
  );
};

export default DeckBuilderContent;
