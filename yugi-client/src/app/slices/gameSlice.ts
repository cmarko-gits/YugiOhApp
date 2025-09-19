/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../api/agent";

// 🔹 Card tip
export interface Card {
  id: number;
  name: string;
  type: string; // "Effect Monster", "Spell Card", "Trap Card"
  imageUrl: string;
  inAttackMode?: boolean; // true = napad, false = odbrana
  level?: number;
  isFaceDown?: boolean;  // true = licem nadole
  isActivated?: boolean; // true = karta je aktivirana}
}
// 🔹 State igre
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

// 🔹 Početni state
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

// 🌟 Normalizacija karte
const normalizeCard = (card: any): Card => ({
  id: card.id,
  name: card.name || "Unknown Card",
  type: card.type || "Effect Monster",
  imageUrl:
    card.imageUrl ||
    `https://images.ygoprodeck.com/images/cards/${card.id}.jpg`,
  level: card.level,
  inAttackMode: true,
  isFaceDown: false,
});

// 🎯 Async Thunks
export const startGameAsync = createAsyncThunk("game/startGame", async () => {
  const res = await agent.Game.start();
  return res.data;
});

export const drawCardAsync = createAsyncThunk<Card>(
  "game/drawCard",
  async () => {
    const res = await agent.Game.draw();
    const handArray = res.data?.hand ?? [];
    if (!handArray.length) throw new Error("Nema karata za izvlačenje");
    return normalizeCard(handArray[handArray.length - 1]);
  }
);

export const summonCardAsync = createAsyncThunk<
  { cardId: number; inAttackMode: boolean; isPlayer: boolean },
  { cardId: number; inAttackMode: boolean; isPlayer: boolean }
>("game/summonCard", async ({ cardId, inAttackMode, isPlayer }) => {
  await agent.Game.summonMonster(cardId, [], inAttackMode);
  return { cardId, inAttackMode, isPlayer };
});

// 🎯 Spell/Trap async thunk
export const placeSpellTrapAsync = createAsyncThunk<
  { cardId: number; isPlayer: boolean; isFaceDown: boolean }, // <- vraća i info da li je faceDown
  { cardId: number; isPlayer: boolean; isFaceDown: boolean }  // <- očekuje i u argumentu
>("game/placeSpellTrap", async ({ cardId, isPlayer, isFaceDown }) => {
  await agent.Game.placeSpellTrap(cardId); // backend možeš proširiti da primi i isFaceDown ako treba
  return { cardId, isPlayer, isFaceDown };
});


export const tributeSummonAsync = createAsyncThunk(
  "game/tributeSummon",
  async ({
    cardId,
    tributeIds,
    inAttackMode,
  }: {
    cardId: number;
    tributeIds: number[];
    inAttackMode: boolean;
  }) => {
    const res = await agent.Game.summonMonster(
      cardId,
      tributeIds,
      inAttackMode
    );
    return res.data;
  }
);

// 🎯 Slice
const gameSlice = createSlice({
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
      const { cardId, inAttackMode, isPlayer } = action.payload;
      const handIndex = state.hand.findIndex((c) => c.id === cardId);
      if (handIndex !== -1) {
        const card = state.hand.splice(handIndex, 1)[0];
        const zone = isPlayer
          ? state.playerMonsterZone
          : state.opponentMonsterZone;
        const slotIndex = zone.findIndex((slot) => slot === null);
        if (slotIndex !== -1)
          zone[slotIndex] = { ...card, inAttackMode, isFaceDown: false };
      }
    });

    builder.addCase(placeSpellTrapAsync.fulfilled, (state, action) => {
  const { cardId, isPlayer, isFaceDown } = action.payload;
  const handIndex = state.hand.findIndex((c) => c.id === cardId);
  if (handIndex !== -1) {
    const card = state.hand.splice(handIndex, 1)[0];
    const zone = isPlayer
      ? state.playerSpellTrapZone
      : state.opponentSpellTrapZone;
    const slotIndex = zone.findIndex((slot) => slot === null);
    if (slotIndex !== -1) {
      zone[slotIndex] = {
        ...card,
        isFaceDown,
        isActivated: !isFaceDown, // ako nije face-down → aktivirano
      };
    }
  }
});



    builder.addCase(tributeSummonAsync.fulfilled, (state, action) => {
      const payload = action.payload;
      if (payload.hand) state.hand = payload.hand.map(normalizeCard);
      if (payload.deckCount !== undefined) state.deckCount = payload.deckCount;
      if (payload.monsterZone) state.playerMonsterZone = payload.monsterZone;
      if (payload.spellTrapZone) state.playerSpellTrapZone = payload.spellTrapZone;
      if (payload.message) console.log(payload.message);
    });

    builder.addMatcher(
      (action) => action.type.endsWith("/rejected"),
      (state, action: any) => {
        state.error = action.error.message;
      }
    );
  },
});

// 🔹 Exports
export const { clearError } = gameSlice.actions;
export const selectGame = (state: { game: GameState }) => state.game;
export default gameSlice.reducer;
