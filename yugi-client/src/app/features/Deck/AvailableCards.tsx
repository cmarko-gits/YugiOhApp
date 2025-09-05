// src/features/deck/AvailableCards.tsx
import { Box, Typography } from "@mui/material";

import CardFilter from "../../layout/Filters/Filter";
import LoadingPage from "../../layout/Loading/LoadingPage";
import SearchBar from "../../layout/Search/Search";
import type { CardItem } from "../../model/Card";
import DraggableCard from "./DraggableCard";

interface AvailableCardsProps {
  availableCards: CardItem[];
  onClickCard: (card: CardItem) => void;
  search: string;
  setSearch: (val: string) => void;
  filter: string;
  setFilter: (val: string) => void;
  loadingMore: boolean;
}

const AvailableCards: React.FC<AvailableCardsProps> = ({
  availableCards,
  onClickCard,
  search,
  setSearch,
  filter,
  setFilter,
  loadingMore
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        borderLeft: "1px solid grey",
        height: "100%",
        p: 2,
        overflowY: "auto",
        boxSizing: "border-box"
      }}
    >
      <Typography variant="h6" gutterBottom>
        Available Cards
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
        <SearchBar value={search} onChange={setSearch} />
        <CardFilter value={filter} onChange={setFilter} />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {loadingMore ? (
          <LoadingPage />
        ) : (
          availableCards.map((card) => (
            <DraggableCard key={card.id} card={card} onClick={() => onClickCard(card)} />
          ))
        )}
      </Box>
    </Box>
  );
};
export default AvailableCards;
