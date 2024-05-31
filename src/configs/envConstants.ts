export const APP_PORT = Number(import.meta.env.VITE_APP_PORT) || 5173;

export const BACK_END_URL =
  import.meta.env.VITE_BACK_END_URL || `http://localhost:3000`;
export const FRONT_END_URL =
  import.meta.env.VITE_FRONT_END_URL || `http://localhost:5173`;

export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
export const API_KEY = import.meta.env.VITE_API_KEY;
