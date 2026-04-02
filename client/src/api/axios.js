import axios from "axios";

const API = axios.create({
  //** LocalHost And when deploy this is very useful. */
  baseURL: import.meta.env.VITE_API_URL,
});

export default API;
