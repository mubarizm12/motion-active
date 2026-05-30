import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'http://192.168.0.93:5164/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

export const register = (email: string, password: string, displayName: string) =>
  api.post('/Auth/register', { email, password, displayName });

export const login = (email: string, password: string) =>
  api.post('/Auth/login', { email, password });

export const logSteps = (steps: number) =>
  api.post('/Steps/log', { steps });

export const getLeaderboard = () =>
  api.get('/Leaderboard/global');

export const getRewards = () =>
  api.get('/Rewards');

export const redeemReward = (rewardId: string) =>
  api.post('/Rewards/redeem', { rewardId });

export const getMyRedemptions = () =>
  api.get('/Rewards/my-redemptions');