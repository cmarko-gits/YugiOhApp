import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../api/agent";
import type { CardItem } from "../model/Card";

interface GameState {
  hand: CardItem[];
  monsterZone: (CardItem | null)[];
  spellTrapZone: (CardItem | null)[];
  deck: CardItem[];         // običan deck
  fusionDeck: CardItem[];   // fusion deck
  deckCount: number;        // broj preostalih karata u običnom decku
  fusionDeckCount: number;  // broj preostalih karata u fusion decku
}

const initialState: GameState = {
  hand: [],
  monsterZone: Array(5).fill(null),
  spellTrapZone: Array(5).fill(null),
  deck: [],
  fusionDeck: [],
  deckCount: 0,
  fusionDeckCount: 0,
};

// Pokretanje igre
export const startGameAsync = createAsyncThunk(
  "game/startGame",
  async () => {
    const res = await agent.Game.start();
    return res.data;
  }
);

// Vućenje karata
export const drawCardAsync = createAsyncThunk(
  "game/drawCard",
  async () => {
    const res = await agent.Game.draw(1);
    return res.data;
  }
);

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Start igre
    builder.addCase(startGameAsync.fulfilled, (state, action) => {
      state.hand = action.payload.hand; // početna ruka (5 karata)
      state.deck = action.payload.cards ?? [];
      state.fusionDeck = action.payload.fusionDeck ?? [];
      state.monsterZone = Array(5).fill(null);
      state.spellTrapZone = Array(5).fill(null);

      // Deck count odmah smanjen za karte u ruci
      state.deckCount = (state.deck.length || 40) - state.hand.length;
      state.fusionDeckCount = state.fusionDeck.length || 10;
    });

    // Vućenje karte
    builder.addCase(drawCardAsync.fulfilled, (state, action) => {
      state.hand = action.payload.hand;
      state.deck = action.payload.cards ?? state.deck;

      // Ažuriranje preostalih karata
      state.deckCount = state.deckCount > 0 ? state.deckCount - 1 : 0;
      state.fusionDeckCount = state.fusionDeck.length || state.fusionDeckCount;
    });
  },
});

export default gameSlice.reducer;
