import jwt from "jsonwebtoken";

export class JwtService {
  constructor() {}

  generateToken = (email: string, role: string, userId: string): string => {
    return jwt.sign(
      { email, role, userId },
      "dOJbhcdcszQTmsBnLfj5lDO56yRhyrmpGgJkc6xrIQY",
      { expiresIn: "60m" }
    );
  };
}
