import axios, { AxiosInstance } from "axios";

export const customAxios: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/",
  timeout: 60_000, 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
