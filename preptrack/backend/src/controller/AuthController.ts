import { Request, Response } from "express";
import { AuthService } from "../service/AuthService";
import { AuthResponse } from "../model/AuthResponse";
import { oauth2Client } from "../config/GoogleAuthConfig";
import axios from "axios";

const authService = new AuthService();

export const signUp = async (request: Request, response: Response) => {
  const createdUser = await authService.signUp(request.body);
  if (createdUser == null) {
    response.status(409).json({ message: "User already exists." });
    return;
  }

  if (createdUser) {
    response
      .status(201)
      .json({ message: "User registered successfully.", user: createdUser });
  } else {
    response
      .status(500)
      .json({ message: "User registration failed.", user: null });
  }
};

export const signIn = async (request: Request, response: Response) => {
  const userDetails: AuthResponse | null = await authService.signIn(
    request.body
  );
  if (userDetails == null) {
    response
      .status(400)
      .json({ message: "Please check your email or password." });
    return;
  }

  response
    .status(201)
    .json({ message: "User is logged in successfully.", userDetails });
};

export const signInByGoogle = async (request: Request, response: Response) => {
  const { code } = request.query as { code?: string };

  if (!code || (Array.isArray(code) && code.length === 0)) {
    response.status(400).json({ message: "Missing 'code' in query params." });
    return;
  }

  const codeStr = code ? code : "";

  const userDetails: AuthResponse | null = await authService.signInByGoogle(
    codeStr
  );
  if (userDetails == null) {
    response.status(400).json({ message: "Google authentication failed." });
    return;
  }

  response
    .status(201)
    .json({ message: "User is logged in successfully.", userDetails });
};
