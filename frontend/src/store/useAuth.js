import { create } from "zustand";

// ==========================
// 🛡️ SAFE LOCALSTORAGE LOAD
// ==========================
let storedUser = null;
let storedToken = null;

try {
  const rawUser = localStorage.getItem("user");
  storedUser = rawUser && rawUser !== "undefined" ? JSON.parse(rawUser) : null;
} catch (e) {
  storedUser = null;
}

try {
  storedToken = localStorage.getItem("token");
} catch (e) {
  storedToken = null;
}

// ==========================
// 🧠 AUTH STORE
// ==========================
export const useAuth = create((set) => ({
  user: storedUser,
  token: storedToken,

  // ✅ Login
  login: (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
  },

  // ✅ Logout
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null });

    // Hard redirect to clean state
    window.location.href = "/login";
  },
}));
