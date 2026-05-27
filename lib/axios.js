import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://server09.onrender.com";





export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
});




export const authApi = (token) => axios.create({
  baseURL: API_URL,
  headers: { authorization: `Bearer ${token}` },
  withCredentials: true,
});