import axios from "axios";
import "../App.css"; 

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const API_TOKEN = process.env.REACT_APP_TMDB_API_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

console.log("API Key:", API_KEY);
console.log("API Token:", API_TOKEN);

export const tmdbApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
  params: {
    api_key: API_KEY,
  },
});