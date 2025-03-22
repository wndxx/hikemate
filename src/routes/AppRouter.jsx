import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import LoginAlternative from "../pages/LoginAlternative";
import Register from "../pages/Register";
import Mountains from "../pages/Mountains";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoutes";
import Profile from "../pages/Profile";
import TransactionPage from "../pages/TransactionPage";
import PaymentPage from "../pages/PaymentPage";
import MyBookingPage from "../pages/MyBookingPage";
import MountainPage from "../pages/MountainPage";
import RangersTable from "../pages/RangersTable";
import RangerDetail from "../pages/RangerDetail";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login-alt" element={<LoginAlternative />} />
      <Route path="/register" element={<Register />} />
      <Route path="/mountains" element={<Mountains />} />
      <Route path="/transaction/:id" element={<TransactionPage />} />
      <Route path="/mountain/:id" element={<MountainPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/my-booking" element={<MyBookingPage />} />
      <Route path="/rangers" element={<RangersTable />} />
      <Route path="/ranger/:id" element={<RangerDetail />} />
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
          <PrivateRoute requiredRole="SUPERADMIN">
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;
