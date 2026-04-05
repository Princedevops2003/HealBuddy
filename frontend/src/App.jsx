import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { AddEntry } from "./pages/AddEntry.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { History } from "./pages/History.jsx";
import { Login } from "./pages/Login.jsx";
import { Profile } from "./pages/Profile.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/add-entry" element={<AddEntry />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
