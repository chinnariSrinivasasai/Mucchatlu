import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", { name, email, password });
      alert("Account created! Please login.");
      nav("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-600">
      <div className="bg-white w-[380px] rounded-2xl shadow-2xl p-8">

        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-green-600">Mucchatlu</h1>
          <p className="text-gray-500 text-sm">Create a new account</p>
        </div>

        <div className="space-y-4">
          <input
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
          />

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
            onClick={handleRegister}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold transition"
          >
            Create Account
          </button>
        </div>

        <div className="text-center mt-5 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-semibold">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}
