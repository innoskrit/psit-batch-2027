import jwt, { SignOptions } from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET environment variable is not set.");
}

if (!process.env.JWT_TIMEOUT) {
  throw new Error("JWT_TIMEOUT environment variable is not set.");
}

const jwtSecretKey: jwt.Secret = process.env.JWT_SECRET_KEY;
const jwtExpiration = process.env.JWT_TIMEOUT;

export class JwtService {
  constructor() {}

  generateToken = (email: string, role: string, userId: string): string => {
    return jwt.sign({ email, role, userId }, jwtSecretKey, {
      expiresIn: jwtExpiration,
    } as SignOptions);
  };
}
