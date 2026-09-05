import { BrowserRouter, Routes, Route } from "react-router-dom";

import MenuPage from "./pages/menupage";
import AdminPage from "./pages/adminpage";
import LoginPage from "./pages/loginpage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
