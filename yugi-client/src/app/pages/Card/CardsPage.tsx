import {
  Box,
  CardContent,
  CardMedia,
  Container,
  Card as MuiCard,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import agent from "../../api/agent";
import LoadingPage from "../../layout/Loading/LoadingPage";

import CardFilter from "../../layout/Filters/Filter";
import SearchBar from "../../layout/Search/Search";
import { type CardItem } from "../../model/Card";

const CardsPage: React.FC = () => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("");

  const observer = useRef<IntersectionObserver | null>(null);

  const lastCardRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchCards = async (page: number, reset: boolean = false) => {
    try {
      setLoading(true);
      const response = await agent.Card.getAll(page, 50, search, filter);
      const newCards = response.data.data;

      if (reset) setCards(newCards);
      else setCards((prev) => [...prev, ...newCards]);

      setHasMore(newCards.length === 50);
    } catch (error) {
      console.error("Failed to fetch cards:", error);
    } finally {
      setLoading(false);
    }
  };

  // učitavanje kada se promeni page
  useEffect(() => {
    fetchCards(page);
  }, [page]);

  // reset kada se promeni search ili filter
  useEffect(() => {
    setPage(1);
    fetchCards(1, true);
  }, [search, filter]);

  return (
    <Container sx={{ py: 4 }}>
      {/* Search + Filter */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <SearchBar value={search} onChange={setSearch} />
        <CardFilter value={filter} onChange={setFilter} />
      </Box>

      {/* Karte */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {cards.map((card, index) => (
          <Box
            key={card.id}
            ref={index === cards.length - 1 && hasMore ? lastCardRef : null}
            sx={{
              flex: "0 0 20%", // 5 karata po redu
              maxWidth: "20%",
              display: "flex",
            }}
          >
            <MuiCard
              component={Link}
              to={`/card/${card.id}`}
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                textDecoration: "none",
              }}
            >
              <CardMedia
                component="img"
                image={card.imageUrl}
                alt={card.name}
                sx={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
              <CardContent
                sx={{
                  maxHeight: 100,
                  overflowY: "auto",
                  padding: "16px",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {card.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.type}
                </Typography>
              </CardContent>
            </MuiCard>
          </Box>
        ))}
      </Box>

      {/* Loading ili kraj liste */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        {loading && <LoadingPage />}
        {!hasMore && !loading && <Typography>Nema više karata za prikaz</Typography>}
      </Box>
    </Container>
  );
};

export default CardsPage;
