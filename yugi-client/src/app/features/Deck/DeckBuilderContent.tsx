// src/features/deck/DeckBuilderContent.tsx
import { Box, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate } from "react-router-dom";
import agent from "../../api/agent";
import CardFilter from "../../layout/Filters/Filter";
import LoadingPage from "../../layout/Loading/LoadingPage";
import SearchBar from "../../layout/Search/Search";
import type { CardItem } from "../../model/Card";
import DeckSlot from "./DeckSlot";
import DraggableCard from "./DraggableCard";

const DeckBuilderContent: React.FC = () => {
  const navigate = useNavigate();

  const [deck, setDeck] = useState<Array<CardItem | null>>(Array(40).fill(null));
  const [fusionDeck, setFusionDeck] = useState<Array<CardItem | null>>(Array(10).fill(null));
  const [availableCards, setAvailableCards] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        setLoading(true);
        const allCardsResponse = await agent.Card.getAll(1, 50);
        const allCards: CardItem[] = allCardsResponse.data.data;

        const deckResponse = await agent.Deck.getDeck();
        const userDeck: CardItem[] = deckResponse.data.cards;
        const userFusionDeck: CardItem[] = deckResponse.data.fusionDeck;

        const fullDeckArray: Array<CardItem | null> = Array(40).fill(null);
        for (let i = 0; i < userDeck.length && i < 40; i++) {
          const deckCard = userDeck[i];
          let fullCard = allCards.find(c => c.id === deckCard.id) ?? null;
          if (!fullCard) {
            const res = await agent.Card.getById(deckCard.id);
            fullCard = res.data ?? null;
          }
          fullDeckArray[i] = fullCard;
        }
        setDeck(fullDeckArray);

        const fullFusionArray: Array<CardItem | null> = Array(10).fill(null);
        for (let i = 0; i < userFusionDeck.length && i < 10; i++) {
          const fusionCard = userFusionDeck[i];
          let fullCard = allCards.find(c => c.id === fusionCard.id) ?? null;
          if (!fullCard) {
            const res = await agent.Card.getById(fusionCard.id);
            fullCard = res.data ?? null;
          }
          fullFusionArray[i] = fullCard;
        }
        setFusionDeck(fullFusionArray);

        const filteredCards = allCards.filter(
          (card) => !userDeck.some(d => d.id === card.id) &&
                    !userFusionDeck.some(f => f.id === card.id)
        );
        setAvailableCards(filteredCards);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeck();
  }, []);

  const fetchAvailableCards = useCallback(async () => {
    try {
      setLoadingMore(true);
      const response = await agent.Card.getAll(1, 50, search, filter);
      const newCards: CardItem[] = response.data.data;

      const filtered = newCards.filter(
        (c) => !deck.some((d) => d?.id === c.id) &&
               !fusionDeck.some((f) => f?.id === c.id)
      );

      setAvailableCards(filtered);
      setHasMore(newCards.length === 50);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  }, [search, filter, deck, fusionDeck]);

  useEffect(() => {
    const timeout = setTimeout(() => fetchAvailableCards(), 500);
    return () => clearTimeout(timeout);
  }, [search, filter, fetchAvailableCards]);

  const loadMoreCards = async (pageNumber: number) => {
    if (!hasMore) return;
    try {
      setLoadingMore(true);
      const response = await agent.Card.getAll(pageNumber, 50, search, filter);
      const newCards: CardItem[] = response.data.data;

      const filtered = newCards.filter(
        (c) => !deck.some((d) => d?.id === c.id) &&
               !fusionDeck.some((f) => f?.id === c.id) &&
               !availableCards.some((ac) => ac.id === c.id)
      );

      setAvailableCards((prev) => [...prev, ...filtered]);
      if (newCards.length < 50) setHasMore(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (page > 1) loadMoreCards(page);
  }, [page]);

  const handleDropCard = async (index: number, card: CardItem) => {
    setDeck((prev) => {
      const newDeck = [...prev];
      newDeck[index] = card;
      return newDeck;
    });
    setAvailableCards((prev) => prev.filter((c) => c.id !== card.id));
    await agent.Deck.addCard(card.id);
  };

  const handleRemoveCard = async (card: CardItem) => {
    setDeck((prev) => prev.map((c) => (c?.id === card.id ? null : c)));
    setAvailableCards((prev) => [...prev, card]);
    await agent.Deck.removeCard(card.id);
  };

  const handleDropFusionCard = async (index: number, card: CardItem) => {
    setFusionDeck((prev) => {
      const newDeck = [...prev];
      newDeck[index] = card;
      return newDeck;
    });
    setAvailableCards((prev) => prev.filter((c) => c.id !== card.id));
    await agent.Deck.addFusionCard(card.id);
  };

  const handleRemoveFusionCard = async (card: CardItem) => {
    setFusionDeck((prev) => prev.map((c) => (c?.id === card.id ? null : c)));
    setAvailableCards((prev) => [...prev, card]);
    await agent.Deck.removeFusionCard(card.id);
  };

  if (loading) return <LoadingPage />;

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        
        {/* LEFT PANEL: Decks */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 4
          }}
        >
          {/* Main Deck */}
          <Box>
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
          </Box>

          {/* Fusion Deck */}
          <Box>
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
        </Box>

        {/* RIGHT PANEL: Available Cards */}
        <Box
          sx={{
            width: 260,
            borderLeft: "1px solid grey",
            height: "100vh",
            overflowY: "auto",
            p: 2
          }}
          onScroll={(e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
            if (scrollTop + clientHeight >= scrollHeight - 5 && !loadingMore && hasMore) {
              setPage((prev) => prev + 1);
            }
          }}
        >
          <Box sx={{ mb: 2 }}>
            <SearchBar value={search} onChange={setSearch} />
            <CardFilter value={filter} onChange={setFilter} />
                    </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
            }}
          >
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