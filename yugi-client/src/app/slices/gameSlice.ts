import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../api/agent";
import type { CardItem } from "../model/Card";

interface GameState {
  deck: CardItem[];
  hand: CardItem[];
  monsterZone: (CardItem | null)[];
  spellTrapZone: (CardItem | null)[];
  deckCount: number;
}

const initialState: GameState = {
  deck: [],
  hand: [],
  monsterZone: Array(5).fill(null),
  spellTrapZone: Array(5).fill(null),
  deckCount: 0,
};

export const startGameAsync = createAsyncThunk("game/startGame", async () => {
  const res = await agent.Game.start(); 
  return res.data;
});

export const drawCardAsync = createAsyncThunk("game/drawCard", async () => {
  const res = await agent.Game.draw(1); 
  return res.data;
});

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(startGameAsync.fulfilled, (state, action) => {
      state.hand = action.payload.hand;
      state.deckCount = action.payload.deckCount;
      state.monsterZone = Array(5).fill(null);
      state.spellTrapZone = Array(5).fill(null);
      state.deck = action.payload.deck; // opcionalno čuvanje decka
    });
    builder.addCase(drawCardAsync.fulfilled, (state, action) => {
      state.hand = action.payload.hand;
      state.deckCount = action.payload.deckCount;
    });
  },
});

export default gameSlice.reducer;
