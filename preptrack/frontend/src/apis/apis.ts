import type { SignInRequest } from "@/types/type";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8080/api/v1" });

export const signInAPI = (signInRequest: SignInRequest) =>
  api.post("/auth/signin", signInRequest);
