/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import agent from "../api/agent";
import type { CardItem } from "../model/Card";

interface CardState {
  cards: CardItem[];
  selectedCard: CardItem | null;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

const initialState: CardState = {
  cards: [],
  selectedCard: null,
  loading: false,
  error: null,
  hasMore: true,
};

// Fetch single card by ID
export const fetchCardById = createAsyncThunk(
  "card/fetchCardById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await agent.Card.getById(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch available cards with pagination, search, filter
export const fetchAvailableCards = createAsyncThunk(
  "card/fetchAvailableCards",
  async (
    { page, search, filter }: { page: number; search: string; filter: string },
    { rejectWithValue }
  ) => {
    try {
      const pageSize = 20;
      const response = await agent.Card.getAll(page, pageSize, search, filter);
      return response.data; // { cards: CardItem[], hasMore: boolean }
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    clearCard: (state) => {
      state.selectedCard = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch single card
      .addCase(fetchCardById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCardById.fulfilled, (state, action: PayloadAction<CardItem>) => {
        state.loading = false;
        state.selectedCard = action.payload;
      })
      .addCase(fetchCardById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch available cards
      .addCase(fetchAvailableCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAvailableCards.fulfilled,
        (state, action: PayloadAction<{ cards: CardItem[]; hasMore: boolean }>) => {
          state.loading = false;
          const { cards, hasMore } = action.payload;
          if (action.meta.arg.page === 1) {
            state.cards = cards;
          } else {
            state.cards = [...state.cards, ...cards];
          }
          state.hasMore = hasMore;
        }
      )
      .addCase(fetchAvailableCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCard } = cardSlice.actions;
export default cardSlice.reducer;
