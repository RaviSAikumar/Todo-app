import axios from "axios";
// const baseURL = import.meta.env.VITE_API_URL;
const API = axios.create({
  baseURL: "https://todo-app-vrev.onrender.com",
  withCredentials: true, // ✅ crucial
});

// console.log(baseURL);
export default API;
