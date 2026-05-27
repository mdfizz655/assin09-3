"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";

import { toast } from "react-hot-toast";

import { FcGoogle } from "react-icons/fc";

import { FiEye, FiEyeOff } from "react-icons/fi";






export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);

  const [showPass, setShowPass] = useState(false);

  const [error, setError] = useState("");



  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);




    const res = await signIn("credentials", {
      email:    e.target.email.value,

      password: e.target.password.value,

      redirect: false,
    });



    setLoading(false);





    if (res?.ok) {
      toast.success("Welcome back!");

      router.push("/");

      router.refresh();
    } else {
      const msg = res?.error || "Invalid email or password";

      setError(msg);

      toast.error(msg);
    }
  };








  const handleGoogle = async () => {
    setGoogleLoading(true);

    await signIn("google", { callbackUrl: "/" });
  };





  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4 py-10">
     
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 border border-gray-100">

        
        <div className="text-center mb-8">
       
          <Link href="/" className="inline-block text-2xl font-black tracking-tight">
          
            <span className="text-blue-600">DRIVE</span>
          
            <span className="text-gray-900">FLEET</span>
        
          </Link>
       
          <h1 className="text-xl font-extrabold text-gray-900 mt-3">Welcome back</h1>
     
          <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
     
        </div>

        




        <button
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl py-3 font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-all mb-5 disabled:opacity-60"
        >




          <FcGoogle className="text-xl" />
          {googleLoading ? "Redirecting..." : "Continue with Google"}
        </button>



        <div className="flex items-center gap-3 mb-5">

          <div className="flex-1 h-px bg-gray-200" />

          <span className="text-gray-400 text-xs font-medium">OR</span>

          <div className="flex-1 h-px bg-gray-200" />

        </div>

        





        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4 font-medium">
            {error}
          </div>
        )}





        
        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="name@example.com"
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />

          </div>




          <div>
          
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
          
            <div className="relative">
            
              <input
                type={showPass ? "text" : "password"}
                name="password"
                required
                placeholder="Enter your password"
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
          </div>




          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
        
        
          </button>
     
     
        </form>





        <p className="text-center text-gray-500 text-sm mt-6">
          Don&apos;t have an account?{" "}
         
          <Link href="/register" className="text-blue-600 font-bold hover:underline">
            Create one
         
          </Link>
       
        </p>
     
      </div>
    </div>
  );
}
