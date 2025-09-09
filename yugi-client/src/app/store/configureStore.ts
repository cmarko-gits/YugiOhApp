import { configureStore } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import authSlice from "../slices/authSlice";
import cardSlice from "../slices/cardSlice";
import deckSlice from "../slices/deckSlice";
import gameSlice from "../slices/gameSlice";

const isDev = import.meta.env.MODE === "development";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    card : cardSlice,
    deck : deckSlice,
    game : gameSlice
  },
  devTools: isDev,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
