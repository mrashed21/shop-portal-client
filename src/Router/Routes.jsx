import { createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "../Context/AuthContext";
import Dashboard from "../Dashboard/Dashboard";
import MainLayOut from "../Layout/MainLayOut";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import SignUp from "../Pages/Signup/SignUp";
import ShopSubdomain from "../ShopDashboard/ShopDashboard";
import PrivateRoute from "./PrivateRoute";
const Routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <MainLayOut />
      </AuthProvider>
    ),
    errorElement: <h1>not found</h1>,
    children: [
      { path: "/", element: <Home /> },

      { path: "/login", element: <Login /> },
      { path: "/signup", element: <SignUp /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <AuthProvider>
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      </AuthProvider>
    ),
  },

  {
    path: "/shop/:shopName",
    element: (
      <AuthProvider>
        <PrivateRoute>
          <ShopSubdomain />
        </PrivateRoute>
      </AuthProvider>
    ),
  },
]);

export default Routes;
