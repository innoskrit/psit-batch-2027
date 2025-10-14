import { Request, Response } from "express";
import { AuthService } from "../service/AuthService";
import { AuthResponse } from "../model/AuthResponse";

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
