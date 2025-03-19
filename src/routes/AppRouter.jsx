import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Mountains from "../pages/Mountains";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoutes";
import Profile from "../pages/Profile";
import TransactionPage from "../pages/TransactionPage";
import PaymentPage from "../pages/PaymentPage";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mountains" element={<Mountains />} />
        <Route path="/transaction/:id" element={<TransactionPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute requiredRole="admin">
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;