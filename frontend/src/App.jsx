import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import ToastContainer from "./components/ToastContainer";
import { useAuth } from "./store/useAuth";

export default function App() {
  const token = useAuth((s) => s.token);
  return (
    <>
    <Routes>
      <Route path="/" element={<Navigate to={token ? "/chat" : "/login"} />} />
      <Route path="/login" element={token ? <Navigate to="/chat" /> : <Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chat" element={token ? <Chat /> : <Navigate to="/login" />} />
    </Routes>
    <ToastContainer />
    </>
  );
}
