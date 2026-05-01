import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../features/authSlice";
import Loader from "../Components/Loader";
import { ShieldCheckIcon } from "@heroicons/react/24/solid"; // Heroicons zaroori hai

function AdminLogin() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Yahan URL apna Render wala daal dena baad mein agar live check karna ho
    const url = "https://synnex-backend.onrender.com/auth/login"; 

    // 🔥 JADOO: Role hamesha "admin" jayega, koi dropdown nahi!
    const userData = {
      email: user.email,
      password: user.password,
      role: "admin", 
    };

    try {
      const response = await axios.post(url, userData, {
    withCredentials: true
});
      const payload = {
        ...(response.data.user || response.data.admin || response.data),
        role: "admin",
      };

      dispatch(login(payload));
      toast.success("Admin Access Granted!");
      setLoading(false);
      navigate("/admin-dashboard"); // Login hote hi seedha Admin Dashboard!
      
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || "Access Denied. Invalid Admin Credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <ToastContainer />
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div className="flex flex-col items-center">
          <ShieldCheckIcon className="h-16 w-16 text-black" />
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
            HQ Control Panel
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Authorized Personnel Only
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              name="email"
              type="email"
              required
              value={user.email}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              placeholder="Admin Email"
            />
            <input
              name="password"
              type="password"
              required
              value={user.password}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              placeholder="Admin Password"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition"
            >
              {loading ? <Loader text="Authenticating..." /> : "Enter Control Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;