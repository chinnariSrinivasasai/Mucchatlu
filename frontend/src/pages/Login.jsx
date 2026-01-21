import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../store/useAuth";
import { useToast } from "../store/useToast";

export default function Login() {
   const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuth((s) => s.login);
  const nav = useNavigate();
   const showToast = useToast((s) => s.showToast);

 const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      nav("/chat");
    } catch (err) {
      showToast("Login failed", "error");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-600">
      <div className="bg-white w-[380px] rounded-2xl shadow-2xl p-8">
        
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-green-600">Mucchatlu</h1>
          <p className="text-gray-500 text-sm">Sign in to continue</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <input
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold transition"
          >
            Login
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-5 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-600 font-semibold">
            Create one
          </Link>
        </div>

      </div>
    </div>
  );
}
