import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleShopClick = (shopName) => {
    // Redirect to subdomain
    window.location.href = `http://${shopName}.shop-portal-client.vercel.app`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <p className="font-medium">Welcome, {user?.username}</p>
                  </div>
                  <div className="px-4 py-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      Your Shops
                    </h3>
                    <ul className="mt-2 space-y-1">
                      {user.shopNames.map((shop, index) => (
                        <li key={index}>
                          <button
                            onClick={() => handleShopClick(shop)}
                            className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
                          >
                            {shop}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="px-4 py-2 border-t">
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-2 py-1 rounded"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Welcome to your dashboard
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Click on your profile icon to see your shops
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Logout
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
