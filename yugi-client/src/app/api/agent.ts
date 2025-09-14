// src/api/agents.ts
import axios from "axios";

// Kreiramo instancu Axios-a
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem("token"); 
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error("API error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const Card = {
  getAll: (
    page: number,
    pageSize: number,
    name?: string,
    type?: string,
    race?: string,
    minAtk?: number,
    maxAtk?: number
  ) =>
    axiosInstance.get(`/Card`, {
      params: { page, pageSize, name, type, race, minAtk, maxAtk },
    }),

  getById: (id: number) => axiosInstance.get(`/Card/${id}`),
};

const Deck = {
  getDeck: ()  => axiosInstance.get("/Deck"),
  addCard: (cardId: number) => axiosInstance.post(`/Deck/${cardId}`),
  removeCard: (cardId: number) => axiosInstance.delete(`/Deck/${cardId}`),
  addFusionCard: (cardId: number) => axiosInstance.post(`/Deck/Fusion/${cardId}`),
  removeFusionCard: (cardId: number) => axiosInstance.delete(`/Deck/Fusion/${cardId}`),
};

const User = {
  login: (data: { email: string; password: string }) =>
    axiosInstance.post("/User/login", data),
  register: (data: { email: string; password: string; username: string }) =>
    axiosInstance.post("/User/register", data),
};

const Game = {
  start: () => axiosInstance.post("/game/start"),
  draw: () => axiosInstance.post("/game/draw"),
  summonMonster: (cardId: number, inAttackMode: boolean) =>
    axiosInstance.post(`/game/summon?cardId=${cardId}&inAttackMode=${inAttackMode}`),
placeSpellTrap: (cardId: number) => axiosInstance.post(`/game/trapOrSpell?cardId=${cardId}`),
};


const agent = {
  Card,
  Deck,
  User,
  Game, // dodali smo Game
};

export default agent;
