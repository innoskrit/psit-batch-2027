import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const jwtSecretFromEnv = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
if (!jwtSecretFromEnv) {
  throw new Error(
    "JWT_SECRET or JWT_SECRET_KEY environment variable is not set."
  );
}
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const verifyToken = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log("1 verifyToken");
  const authHeaders = request.headers.authorization;
  if (!authHeaders || !authHeaders.startsWith("Bearer")) {
    return response.status(401).json({
      error: "Access denied. No token provided.",
      message:
        "Please provide a valid Bearer token in the Authorization Header.",
    });
  }

  console.log("2 verifyToken");

  const token = authHeaders.split(" ")[1];
  try {
    const res = jwt.verify(token!, jwtSecretFromEnv) as JwtPayload;
    request.user = res;
    next();
  } catch (err) {
    console.error("Failed to verify the token.", err);
    if (err instanceof jwt.TokenExpiredError) {
      return response.status(401).json({
        error: "Access denied. Token expired.",
        message: "Please login again to get a new token.",
      });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return response.status(401).json({
        error: "Access denied. Invalid token.",
        message:
          "Please provide a valid Bearer token in the Authorization Header.",
      });
    } else {
      return response.status(500).json({
        error: "Token verification failed.",
        message: "Internal server error during token verification.",
      });
    }
  }
};

export const requireAdminRole = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (!request.user) {
    return response.status(500).json({
      error: "Token verification failed.",
      message: "Internal server error during token verification.",
    });
  }

  if (request.user.role != "ADMIN") {
    return response.status(401).json({
      error: "Admin access required.",
      message: "Please connect with your adminstrator to access this resource.",
    });
  }

  next();
};

// just created for the sake of understanding role specific middlewares.
export const requireAdminOrModeratorRole = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (!request.user) {
    return response.status(500).json({
      error: "Token verification failed.",
      message: "Internal server error during token verification.",
    });
  }

  if (request.user.role != "ADMIN" && request.user.role != "MODERATOR") {
    return response.status(401).json({
      error: "Admin/Moderator access required.",
      message: "Please connect with your adminstrator to access this resource.",
    });
  }

  next();
};
