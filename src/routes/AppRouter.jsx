import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import LoginAlternative from "../pages/LoginAlternative"
import Register from "../pages/Register"
import Mountains from "../pages/Mountains"
import Dashboard from "../pages/Dashboard"
import PrivateRoute from "./PrivateRoutes"
import Profile from "../pages/Profile"
import TransactionPage from "../pages/TransactionPage"
import PaymentPage from "../pages/PaymentPage"
import PaymentSuccessPage from "../pages/PaymentSuccessPage"
import MyBookingPage from "../pages/MyBookingPage"
import MountainPage from "../pages/MountainPage"
import RangersTable from "../pages/RangersTable"
import RangerDetail from "../pages/RangerDetail"
import MountainsTable from "../pages/MountainsTable"
import CreateMountain from "../pages/CreateMountain"
import EditMountain from "../pages/EditMountain"
import ViewMountain from "../pages/ViewMountain"
import RoutesManagement from "../pages/routes/RoutesManagement"
import CreateRoute from "../pages/routes/CreateRoute"
import MountainRoutesManagement from "../pages/mountainRoutes/MountainRoutesManagement"
import CreateMountainRoute from "../pages/mountainRoutes/CreateMountainRoute"
import CreateTransaction from "../pages/transactions/CreateTransaction"
import MyBookings from "../pages/transactions/MyBooking"

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
      <Route path="/payment/success" element={<PaymentSuccessPage />} />
      <Route
        path="/my-booking"
        element={
          <PrivateRoute>
            <MyBookingPage />
          </PrivateRoute>
        }
      />
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
      <Route
        path="/dashboard/mountains"
        element={
          <PrivateRoute requiredRole="SUPERADMIN">
            <MountainsTable />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/mountains/create"
        element={
          <PrivateRoute requiredRole="SUPERADMIN">
            <CreateMountain />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/mountains/edit/:id"
        element={
          <PrivateRoute requiredRole="SUPERADMIN">
            <EditMountain />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/mountains/view/:id"
        element={
          <PrivateRoute requiredRole="SUPERADMIN">
            <ViewMountain />
          </PrivateRoute>
        }
      />

      {/* Routes Management */}
      <Route
        path="/dashboard/routes"
        element={
          <PrivateRoute requiredRole="SUPERADMIN">
            <RoutesManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/routes/create"
        element={
          <PrivateRoute requiredRole="SUPERADMIN">
            <CreateRoute />
          </PrivateRoute>
        }
      />

      {/* Mountain Routes Management */}
      <Route
        path="/dashboard/mountain-routes"
        element={
          <PrivateRoute requiredRole="SUPERADMIN">
            <MountainRoutesManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/mountain-routes/create"
        element={
          <PrivateRoute requiredRole="SUPERADMIN">
            <CreateMountainRoute />
          </PrivateRoute>
        }
      />

      {/* Hiker Routes */}
      <Route
        path="/book/:mountainId"
        element={
          <PrivateRoute requiredRole="HIKER">
            <CreateTransaction />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <PrivateRoute requiredRole="HIKER">
            <MyBookings />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default AppRouter