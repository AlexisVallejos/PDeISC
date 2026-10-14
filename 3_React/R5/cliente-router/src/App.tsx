import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminRoute } from "./components/guards/AdminRoute";
import { PrivateRoute } from "./components/guards/PrivateRoute";
import { AppLayout } from "./components/layout/AppLayout";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import OAuthCallbackPage from "./pages/OAuthCallbackPage";
import UsersPage from "./pages/UsersPage";

// sistema con React Router: cada pantalla tiene su ruta
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/ingresar" element={<AuthPage key="login" mode="login" />} />
          <Route path="/registro" element={<AuthPage key="register" mode="register" />} />
          <Route path="/auth/:provider/callback" element={<OAuthCallbackPage />} />

          <Route element={<PrivateRoute />}>
            <Route index element={<HomePage />} />
            <Route element={<AdminRoute />}>
              <Route path="/usuarios" element={<UsersPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
