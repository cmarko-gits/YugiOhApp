/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import agent from "../api/agent";
import type { CardItem } from "../model/Card";

interface DeckState {
  deck: Array<CardItem | null>;
  fusionDeck: Array<CardItem | null>;
  availableCards: CardItem[];
  loading: boolean;
  loadingMore: boolean;
  page: number;
  hasMore: boolean;
  search: string;
  filter: string;
  error: string | null;
}

const initialState: DeckState = {
  deck: Array(40).fill(null),
  fusionDeck: Array(10).fill(null),
  availableCards: [],
  loading: true,
  loadingMore: false,
  page: 1,
  hasMore: true,
  search: "",
  filter: "",
  error: null,
};

// --- Async thunks ---
export const fetchDeck = createAsyncThunk("deck/fetchDeck", async (_, { rejectWithValue }) => {
  try {
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

    const filteredCards = allCards.filter(
      (card) => !userDeck.some(d => d.id === card.id) &&
                !userFusionDeck.some(f => f.id === card.id)
    );

    return {
      deck: fullDeckArray,
      fusionDeck: fullFusionArray,
      availableCards: filteredCards
    };
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch deck");
  }
});

export const fetchAvailableCards = createAsyncThunk(
  "deck/fetchAvailableCards",
  async ({ page, search, filter }: { page: number; search: string; filter: string }, { rejectWithValue }) => {
    try {
      const response = await agent.Card.getAll(page, 50, search, filter);
      const newCards: CardItem[] = response.data.data;
      return { newCards, page };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch cards");
    }
  }
);

// --- Slice ---
const deckSlice = createSlice({
  name: "deck",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    addCard: (state, action: PayloadAction<{ index: number; card: CardItem }>) => {
      state.deck[action.payload.index] = action.payload.card;
      state.availableCards = state.availableCards.filter(c => c.id !== action.payload.card.id);
    },
    removeCard: (state, action: PayloadAction<CardItem>) => {
      state.deck = state.deck.map(c => (c?.id === action.payload.id ? null : c));
      state.availableCards.push(action.payload);
    },
    addFusionCard: (state, action: PayloadAction<{ index: number; card: CardItem }>) => {
      state.fusionDeck[action.payload.index] = action.payload.card;
      state.availableCards = state.availableCards.filter(c => c.id !== action.payload.card.id);
    },
    removeFusionCard: (state, action: PayloadAction<CardItem>) => {
      state.fusionDeck = state.fusionDeck.map(c => (c?.id === action.payload.id ? null : c));
      state.availableCards.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeck.pending, (state) => { state.loading = true; })
      .addCase(fetchDeck.fulfilled, (state, action) => {
        state.loading = false;
        state.deck = action.payload.deck;
        state.fusionDeck = action.payload.fusionDeck;
        state.availableCards = action.payload.availableCards;
      })
      .addCase(fetchDeck.rejected, (state) => { state.loading = false; })
      .addCase(fetchAvailableCards.pending, (state) => { state.loadingMore = true; })
      .addCase(fetchAvailableCards.fulfilled, (state, action) => {
        state.loadingMore = false;
        const filtered = action.payload.newCards.filter(
          c => !state.deck.some(d => d?.id === c.id) &&
               !state.fusionDeck.some(f => f?.id === c.id) &&
               !state.availableCards.some(ac => ac.id === c.id)
        );
        if (action.payload.page === 1) {
          state.availableCards = filtered;
        } else {
          state.availableCards = [...state.availableCards, ...filtered];
        }
        state.hasMore = action.payload.newCards.length === 50;
      })
      .addCase(fetchAvailableCards.rejected, (state) => { state.loadingMore = false; });
  },
});

export const { setSearch, setFilter, setPage, addCard, removeCard, addFusionCard, removeFusionCard } = deckSlice.actions;
export default deckSlice.reducer;
