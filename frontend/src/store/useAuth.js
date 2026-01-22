import { create } from "zustand";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

export const useAuth = create((set) => ({
  user: user || null,
  token: token || null,
  
login: (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  set({ user: data.user, token: data.token });
},

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null });
     window.location.href = "/login";
  },
}));
