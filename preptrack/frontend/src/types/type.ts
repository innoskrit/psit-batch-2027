export interface UserSession {
  email: string;
  name: string;
  token: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface Track {
  id: string;
  slug: string;
  name: string;
  description: string;
  isActive: boolean;
  isNew: boolean;
}
