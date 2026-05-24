"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff, FiCheckCircle, FiXCircle } from "react-icons/fi";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function Rule({ ok, text }) {
  return (
    <li className={`flex items-center gap-1.5 text-xs font-medium ${ok ? "text-green-500" : "text-gray-400"}`}>
      {ok ? <FiCheckCircle className="shrink-0" /> : <FiXCircle className="shrink-0" />}
      {text}
    </li>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const rules = {
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    length:    password.length >= 6,
  };
  const allValid = Object.values(rules).every(Boolean);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!allValid) {
      setError("Please fix the password requirements below.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/register`, {
        name:     e.target.name.value.trim(),
        email:    e.target.email.value.trim(),
        photo:    e.target.photo.value.trim(),
        password: e.target.password.value,
      });
      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 border border-gray-100">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-2xl font-black tracking-tight">
            <span className="text-blue-600">DRIVE</span>
            <span className="text-gray-900">FLEET</span>
          </Link>
          <h1 className="text-xl font-extrabold text-gray-900 mt-3">Create your account</h1>
          <p className="text-gray-400 text-sm mt-1">Join DriveFleet today</p>
        </div>

        {/* Google */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl py-3 font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-all mb-5"
        >
          <FcGoogle className="text-xl" /> Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-xs font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name *</label>
            <input
              type="text" name="name" required placeholder="Your full name"
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Email *</label>
            <input
              type="email" name="email" required placeholder="name@example.com"
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
              Photo URL <span className="text-gray-400 font-normal normal-case">(optional)</span>
            </label>
            <input
              type="url" name="photo" placeholder="https://i.ibb.co/your-photo.jpg"
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Password *</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                required
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 text-sm rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Password rules */}
            {password.length > 0 && (
              <ul className="mt-2.5 space-y-1 pl-1">
                <Rule ok={rules.uppercase} text="At least one uppercase letter (A-Z)" />
                <Rule ok={rules.lowercase} text="At least one lowercase letter (a-z)" />
                <Rule ok={rules.length}    text="At least 6 characters long" />
              </ul>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm mt-2"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
