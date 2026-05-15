import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { apiFetch, setAuthToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";

interface LoginForm {
  email: string;
  password: string;
}

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginForm>();

  const onSubmit = async (values: LoginForm) => {
    setError(null);
    try {
      const res = await apiFetch<{ token: string; email: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
      });
      setAuthToken(res.token);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1e] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-[#6B7C99] mt-2 text-sm">Sign in to manage your portfolio</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-[#111827] border border-white/10 rounded-2xl p-8 space-y-6 shadow-[0_0_40px_rgba(0,212,255,0.05)]"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#A0B3FF] text-sm">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7C99]" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@portfolio.local"
                className="pl-10 bg-[#0a0a1e] border-white/10 text-white placeholder:text-[#6B7C99] focus:border-primary/50 focus:ring-primary/20"
                {...register("email", { required: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#A0B3FF] text-sm">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7C99]" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className="pl-10 pr-10 bg-[#0a0a1e] border-white/10 text-white placeholder:text-[#6B7C99] focus:border-primary/50 focus:ring-primary/20"
                {...register("password", { required: true })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7C99] hover:text-[#A0B3FF] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-[#0a0a1e] font-semibold py-5 rounded-xl shadow-[0_0_20px_rgba(0,212,255,0.25)] hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>

          <p className="text-center text-xs text-[#6B7C99]">
            <a href="/" className="hover:text-[#A0B3FF] transition-colors">
              Back to portfolio
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
