"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff, FiCheckCircle, FiXCircle } from "react-icons/fi";

// পাথগুলো ম্যানুয়ালি ঠিক করা হলো যাতে Vercel বিল্ড ফেইল না করে
import { api } from "../../lib/axios"; 

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
      // আমরা আমাদের তৈরি করা api instance ব্যবহার করছি
      await api.post('/auth/register', {
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
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-2xl font-black tracking-tight">
            <span className="text-blue-600">DRIVE</span>
            <span className="text-gray-900">FLEET</span>
          </Link>
          <h1 className="text-xl font-extrabold text-gray-900 mt-3">Create your account</h1>
        </div>

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

        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" name="name" required placeholder="Full Name" className="w-full px-4 py-3 rounded-xl border outline-none" />
          <input type="email" name="email" required placeholder="Email Address" className="w-full px-4 py-3 rounded-xl border outline-none" />
          <input type="url" name="photo" placeholder="Photo URL (optional)" className="w-full px-4 py-3 rounded-xl border outline-none" />
          
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border outline-none"
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2">
              {showPass ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {password.length > 0 && (
            <ul className="space-y-1">
              <Rule ok={rules.uppercase} text="Uppercase (A-Z)" />
              <Rule ok={rules.lowercase} text="Lowercase (a-z)" />
              <Rule ok={rules.length} text="Min 6 characters" />
            </ul>
          )}

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
            {loading ? "Processing..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}