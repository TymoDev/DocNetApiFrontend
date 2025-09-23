import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import type { LoginDto } from "../../types/auth";

// рантайм-валідація під LoginDto
const loginSchema = z.object({
  login: z.string().trim().min(3, "Login is too short").max(50),
  password: z.string().min(6, "Password is too short"),
});

type Props = { onSubmit?: (dto: LoginDto) => Promise<void> | void };

export default function LoginPage({ onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({ resolver: zodResolver(loginSchema) });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (data: LoginDto) => {
    try {
      setLoading(true);
      setError(null);
      if (onSubmit) await onSubmit(data);
      else console.log("[Login demo]", data);
    } catch (e: any) {
      setError(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-xl font-semibold mb-1">Welcome back</h1>
      <p className="text-sm text-neutral-400 mb-6">Sign in to your account</p>

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

        {error && <div className="text-sm text-red-300">{error}</div>}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-white disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="mt-4 text-sm text-neutral-400">
        No account?{" "}
        <Link className="text-indigo-400 hover:text-indigo-300" to="/auth/register">
          Create one
        </Link>
      </div>
    </AuthLayout>
  );
}
