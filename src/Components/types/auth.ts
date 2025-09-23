export type LoginDto = { login: string; password: string };
export type RegisterDto = { login: string; email: string; password: string; username: string };

export type AuthUser = { id: string; login: string; email: string; username?: string };
export type AuthResponse = { token: string; user: AuthUser };
