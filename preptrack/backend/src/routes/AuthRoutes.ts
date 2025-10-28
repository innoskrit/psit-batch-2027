import express from "express";
import { signIn, signInByGoogle, signUp } from "../controller/AuthController";

const authRouter = express.Router();

authRouter.post("/auth/signup", signUp);
authRouter.post("/auth/signin", signIn);
authRouter.post("/auth/signin/google", signInByGoogle);

export default authRouter;
