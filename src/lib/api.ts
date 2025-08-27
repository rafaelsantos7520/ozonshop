import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://34.207.78.115/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
