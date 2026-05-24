import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://drive-fleet-server.onrender.com";

export const api = axios.create({
  baseURL: API_URL,
});

// token সহ authenticated request এর জন্য
export const authApi = (token) =>
  axios.create({
    baseURL: API_URL,
    headers: { authorization: `Bearer ${token}` },
  });

export default API_URL;
