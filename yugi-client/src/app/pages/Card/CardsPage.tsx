import {
  Box,
  CardContent,
  CardMedia,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Card as MuiCard,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import agent from "../../api/agent";
import LoadingPage from "../../layout/Loading/LoadingPage";
import { type CardItem } from "../../model/Card";

const CardsPage = () => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // search i filter
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("");

  const observer = useRef<IntersectionObserver | null>(null);

  const lastCardRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return; // ne učitava dalje ako nema više podataka
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
      const response = await agent.Card.getAll(
        page,
        50,
        search, // name
        filter  // type
      );
      const newCards = response.data.data;

      if (reset) {
        setCards(newCards);
      } else {
        setCards((prev) => [...prev, ...newCards]);
      }

      // Ako nema novih karata ili je ukupno karata manje od jedne stranice, stopira paginaciju
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
      {/* Search i filter sekcija */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Search cards"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filter}
            label="Filter"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Monster">Monster</MenuItem>
            <MenuItem value="Spell">Spell</MenuItem>
            <MenuItem value="Trap">Trap</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Karte */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {cards.map((card, index) => (
          <Box
            key={card.id}
            ref={index === cards.length - 1 && hasMore ? lastCardRef : null}
            sx={{
              flex: "0 0 20%", // 4 u redu
              maxWidth: "20%",
              display: "flex",
            }}
          >
            <MuiCard sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <CardMedia
                component="img"
                image={card.imageUrl}
                alt={card.name}
                sx={{
                  width: "100%",
                  height: "auto", // cela slika se vidi
                  objectFit: "contain", // ili "cover" ako želiš da se popuni
                }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {card.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
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
