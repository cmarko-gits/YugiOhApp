/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../api/agent";

export interface Card {
  id: number;
  name: string;
  type: string;
  imageUrl: string;
  inAttackMode?: boolean;
  level?: number;
  isFaceDown?: boolean;
  isActivated?: boolean;
}

interface GameState {
  playerMonsterZone: (Card | null)[];
  opponentMonsterZone: (Card | null)[];
  playerSpellTrapZone: (Card | null)[];
  opponentSpellTrapZone: (Card | null)[];
  hand: Card[];
  deckCount: number;
  gameStarted: boolean;
  error?: string;
}

const initialState: GameState = {
  hand: [],
  playerMonsterZone: [null, null, null, null, null],
  opponentMonsterZone: [null, null, null, null, null],
  playerSpellTrapZone: [null, null, null, null, null],
  opponentSpellTrapZone: [null, null, null, null, null],
  deckCount: 0,
  gameStarted: false,
  error: undefined,
};

const normalizeCard = (card: any): Card => ({
  id: card.id,
  name: card.name || "Unknown Card",
  type: card.type || "Effect Monster",
  imageUrl: card.imageUrl || `https://images.ygoprodeck.com/images/cards/${card.id}.jpg`,
  level: card.level,
  inAttackMode: true,
  isFaceDown: false,
});

export const startGameAsync = createAsyncThunk("game/startGame", async () => {
  const res = await agent.Game.start();
  return res.data;
});

export const drawCardAsync = createAsyncThunk<Card>("game/drawCard", async () => {
  const res = await agent.Game.draw();
  const handArray = res.data?.hand ?? [];
  if (!handArray.length) throw new Error("Nema karata za izvlačenje");
  return normalizeCard(handArray[handArray.length - 1]);
});

// 🔹 ispravljen summon
export const summonCardAsync = createAsyncThunk<
  { cardId: number; inAttackMode: boolean },
  { cardId: number; inAttackMode: boolean }
>("game/summonCard", async ({ cardId, inAttackMode }) => {
  await agent.Game.summonMonster(cardId, [], inAttackMode); // tributeIds = []
  return { cardId, inAttackMode };
});

export const placeSpellTrapAsync = createAsyncThunk<
  { cardId: number; isPlayer: boolean; isFaceDown: boolean },
  { cardId: number; isPlayer: boolean; isFaceDown: boolean }
>("game/placeSpellTrap", async ({ cardId, isPlayer, isFaceDown }) => {
  await agent.Game.placeSpellTrap(cardId);
  return { cardId, isPlayer, isFaceDown };
});

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    clearError(state) {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(startGameAsync.fulfilled, (state, action) => {
      const data = action.payload;
      state.hand = (data.hand ?? []).map(normalizeCard);
      state.deckCount = data.deckCount ?? 0;
      state.playerMonsterZone = data.monsterZone ?? [null, null, null, null, null];
      state.playerSpellTrapZone = data.spellTrapZone ?? [null, null, null, null, null];
      state.opponentMonsterZone = [null, null, null, null, null];
      state.opponentSpellTrapZone = [null, null, null, null, null];
      state.gameStarted = true;
      state.error = undefined;
    });

    builder.addCase(drawCardAsync.fulfilled, (state, action) => {
      state.hand.push(action.payload);
      state.deckCount -= 1;
    });

    builder.addCase(summonCardAsync.fulfilled, (state, action) => {
      const { cardId, inAttackMode } = action.payload;
      const handIndex = state.hand.findIndex(c => c.id === cardId);
      if (handIndex !== -1) {
        const card = state.hand.splice(handIndex, 1)[0];
        const zoneIndex = state.playerMonsterZone.findIndex(slot => slot === null);
        if (zoneIndex !== -1) {
          state.playerMonsterZone[zoneIndex] = { ...card, inAttackMode, isFaceDown: false };
        }
      }
    });

    builder.addCase(placeSpellTrapAsync.fulfilled, (state, action) => {
      const { cardId, isPlayer, isFaceDown } = action.payload;
      const handIndex = state.hand.findIndex(c => c.id === cardId);
      if (handIndex !== -1) {
        const card = state.hand.splice(handIndex, 1)[0];
        const zone = isPlayer ? state.playerSpellTrapZone : state.opponentSpellTrapZone;
        const slotIndex = zone.findIndex(slot => slot === null);
        if (slotIndex !== -1) {
          zone[slotIndex] = {
            ...card,
            isFaceDown,
            isActivated: !isFaceDown,
          };
        }
      }
    });

    builder.addMatcher(
      (action) => action.type.endsWith("/rejected"),
      (state, action: any) => {
        state.error = action.error.message;
      }
    );
  },
});

export const { clearError } = gameSlice.actions;
export const selectGame = (state: { game: GameState }) => state.game;
export default gameSlice.reducer;
