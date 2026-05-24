import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://server09.onrender.com";

// পাবলিক রিকোয়েস্টের জন্য
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// অথেনটিকেটেড রিকোয়েস্টের জন্য (টোকেনসহ)
export const authApi = (token) =>
  axios.create({
    baseURL: API_URL,
    headers: { authorization: `Bearer ${token}` },
    withCredentials: true,
  });

export default API_URL;