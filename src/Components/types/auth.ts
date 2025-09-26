// DTOs
export type LoginDto = { login: string; password: string };
export type RegisterDto = {
  login: string;
  email: string;
  password: string;
  username: string;
};

// Auth models
export type AuthUser = { id: string; login: string; email: string; username?: string };
export type AuthResponse = { token: string; user: AuthUser };

// Wire responses (можливі різні кейси від беку)
export type RegisterRespWire = { userId: string } | { UserId: string };
export type LoginRespWire = { login: string } | { Login: string };

// Normalized responses для UI
export type RegisterResp = { userId: string };
export type LoginResp = { login: string };
