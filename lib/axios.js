import axios from "axios";

// Vercel Settings থেকে এই URL টি আসবে। যদি না পায় তবে fallback হিসেবে Render এর লিঙ্কটি নেবে।
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://server09.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // কুকি এবং সেশনের জন্য এটি জরুরি
});

export { api };
export default API_URL;
