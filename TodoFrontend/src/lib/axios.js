import axios from "axios";
// const baseURL = import.meta.env.VITE_API_URL;
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // ✅ crucial
});

// console.log(baseURL);
export default API;
