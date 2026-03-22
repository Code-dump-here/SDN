import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Navbar from "./components/Navbar";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import QuizListPage from "./pages/QuizListPage";
import QuizTakePage from "./pages/QuizTakePage";
import AdminPage from "./pages/AdminPage";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ProtectedRoute><QuizListPage /></ProtectedRoute>} />
          <Route path="/quizzes/:id" element={<ProtectedRoute><QuizTakePage /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
