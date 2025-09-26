import { http } from "./client";
import type {
  RegisterDto,
  LoginDto,
  RegisterRespWire,
  LoginRespWire,
  RegisterResp,
  LoginResp,
} from "../Components/types/auth";

const AUTH = "/api/auth/UserAuth";


function toRegisterWire(dto: RegisterDto) {
  return {
    Login: dto.login,
    Email: dto.email,
    Password: dto.password,
    Username: dto.username,
  };
}

function toLoginWire(dto: LoginDto) {
  return { Login: dto.login, Password: dto.password };
}

function normalizeRegister(res: RegisterRespWire): RegisterResp {
  return { userId: (res as any).userId ?? (res as any).UserId };
}

function normalizeLogin(res: LoginRespWire): LoginResp {
  return { login: (res as any).login ?? (res as any).Login };
}

/** POST /api/auth/UserAuth/register -> { userId } */
export async function register(dto: RegisterDto): Promise<RegisterResp> {
  const res = await http.post<RegisterRespWire>(`${AUTH}/register`, toRegisterWire(dto), {
    withCredentials: true,
  });
  return normalizeRegister(res.data);
}

/** POST /api/auth/UserAuth/login -> { login } */
export async function login(dto: LoginDto): Promise<LoginResp> {
  const res = await http.post<LoginRespWire>(`${AUTH}/login`, toLoginWire(dto), {
    withCredentials: true,
  });
  return normalizeLogin(res.data);
}

/**
 * POST /api/auth/UserAuth — без тіла; лише кука з токеном.
 * Якщо відповідь НЕ 401 — користувач авторизований.
 */
export async function checkAuth(): Promise<boolean> {
  try {
    await http.post(`${AUTH}`, null, { withCredentials: true });
    return true;
  } catch (e: any) {
    if (e?.response?.status === 401) return false;
    throw e;
  }
}

