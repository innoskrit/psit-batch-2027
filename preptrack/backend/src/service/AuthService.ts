import { sign } from "crypto";
import { User } from "../model/User";
import { UserService } from "./UserService";
import bcrypt from "bcrypt";
import { JwtService } from "./JwtService";
import { AuthResponse } from "../model/AuthResponse";
import { oauth2Client } from "../config/GoogleAuthConfig";
import axios from "axios";

export class AuthService {
  private userService: UserService;
  private jwtService: JwtService;

  constructor() {
    this.userService = new UserService();
    this.jwtService = new JwtService();
  }

  async signUp(signUpRequest: User): Promise<User | null> {
    const user = await this.userService.findByEmail(signUpRequest.email);

    if (user) {
      return null;
    }

    const hashedPassword = await bcrypt.hash(signUpRequest.password, 10);

    const createdUser = await this.userService.saveUser({
      name: signUpRequest.name,
      email: signUpRequest.email,
      password: hashedPassword,
    });
    return createdUser;
  }

  async signIn(signInRequest: User): Promise<AuthResponse | null> {
    const user = await this.userService.findByEmail(signInRequest.email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(
      signInRequest.password,
      user.password
    );

    if (isPasswordValid) {
      const token = this.jwtService.generateToken(
        user.email,
        user.role,
        user.id
      );
      return { token: token, email: user.email, name: user.name };
    }
    return null;
  }

  async signInByGoogle(code: string): Promise<AuthResponse | null> {
    console.log("Code sent from client: ", code);
    const googleResponse = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleResponse.tokens);
    const userResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`
    );

    const { email, name, verified_email, picture } = userResponse.data;
    const userInfo = await this.userService.saveUser({
      email,
      name,
      password: "",
      isVerified: verified_email,
      profileUrl: picture,
    });
    const token = this.jwtService.generateToken(
      email,
      userInfo.role,
      userInfo.id
    );
    return { token: token, email: userInfo.email, name: userInfo.name };
  }
}
