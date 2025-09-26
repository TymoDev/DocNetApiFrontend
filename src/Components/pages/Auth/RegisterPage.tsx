import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import type { RegisterDto } from "../../types/auth";
import { register as registerApi } from "../../../api/auth";
import { useUserState } from "../../state/userState"; // за потреби змініть шлях

const registerSchema = z.object({
  login: z.string().trim().min(3, "Login is too short").max(50),
  email: z.string().email("Invalid email").max(254),
  password: z.string().min(6, "Password is too short"),
  username: z.string().trim().min(2, "Username is too short").max(60),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setStatus } = useUserState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDto>({ resolver: zodResolver(registerSchema) });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (data: RegisterDto) => {
    try {
      setLoading(true);
      setError(null);

      await registerApi(data);
      setStatus("authenticated");           
      navigate("/chat", { replace: true });  
    } catch (e: any) {
      setError(e?.response?.data.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-xl font-semibold mb-1">Create your account</h1>
      <p className="text-sm text-neutral-400 mb-6">It takes less than a minute</p>

      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div>
          <label className="text-sm">Login</label>
          <input
            {...register("login")}
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-indigo-500"
            placeholder="your_login"
          />
          {errors.login && (
            <p className="text-xs text-red-400 mt-1">{errors.login.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm">Email</label>
          <input
            {...register("email")}
            type="email"
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-indigo-500"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm">Password</label>
          <input
            {...register("password")}
            type="password"
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-indigo-500"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-xs text-red-400 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm">Username</label>
          <input
            {...register("username")}
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-indigo-500"
            placeholder="Jane Doe"
          />
          {errors.username && (
            <p className="text-xs text-red-400 mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {error && <div className="text-sm text-red-300">{error}</div>}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-white disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>

      <div className="mt-4 text-sm text-neutral-400">
        Already have an account?{" "}
        <Link className="text-indigo-400 hover:text-indigo-300" to="/auth/login">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
