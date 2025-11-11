import type { SignInRequest } from "@/types/type";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8080/api/v1" });

api.interceptors.request.use((request) => {
  if (request.url?.startsWith("/api/v1/auth")) {
    return request;
  }

  const userSession = localStorage.getItem("userSession");
  if (userSession) {
    const { token } = JSON.parse(userSession);
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
  }
  return request;
});

export const signInAPI = (signInRequest: SignInRequest) =>
  api.post("/auth/signin", signInRequest);

export const signInByGoogleAPI = (code: string) =>
  api.post(`/auth/signin/google?code=${code}`);

export const findAllTracks = () => api.get("/tracks");
