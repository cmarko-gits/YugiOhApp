/* eslint-disable @typescript-eslint/no-explicit-any */

import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import agent from "../api/agent";

interface AuthState {
  token: string | null;
  username: string | null;
  playerId: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  username: localStorage.getItem("username"),
  playerId: localStorage.getItem("playerId")
    ? Number(localStorage.getItem("playerId"))
    : null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    data: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await agent.User.login(data);
      return response.data; 
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// REGISTER thunk
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    data: { username: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await agent.User.register(data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.username = null;
      state.playerId = null;
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("playerId");
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.token = action.payload?.token ?? null;
        state.username = action.payload?.username ?? null;
        state.playerId =
          action.payload?.playerId !== undefined &&
          action.payload?.playerId !== null
            ? Number(action.payload.playerId)
            : null;

        // localStorage save
        if (state.token) {
          localStorage.setItem("token", state.token);
        } else {
          localStorage.removeItem("token");
        }

        if (state.username) {
          localStorage.setItem("username", state.username);
        } else {
          localStorage.removeItem("username");
        }

        if (state.playerId !== null) {
          localStorage.setItem("playerId", state.playerId.toString());
        } else {
          localStorage.removeItem("playerId");
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
