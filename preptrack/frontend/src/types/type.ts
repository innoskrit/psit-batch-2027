export interface UserSession {
  email: string;
  name: string;
  token: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}
