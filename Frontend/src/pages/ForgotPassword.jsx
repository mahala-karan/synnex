import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Components/Loader"; // Ensure path is correct based on your folder structure

// Aapka background image
import bgImage from "../assets/img/college-bg.jpg";

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    secretAnswer: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Passwords match check
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    const url = "https://synnex-backend.onrender.com/api/reset-password-direct";

    try {
      const response = await axios.post(url, {
        email: formData.email,
        secretAnswer: formData.secretAnswer,
        newPassword: formData.newPassword,
      });

      toast.success(response.data.message || "Password reset successfully!");
      
      // Thodi der rukk kar user ko wapas Login page bhej do
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message || "Failed to reset password.");
      } else {
        toast.error("Server is down. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div 
        className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bgImage})` }} 
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative sm:mx-auto sm:w-full sm:max-w-md z-10">
          <h2 className="mt-6 text-center text-4xl font-extrabold text-white drop-shadow-lg tracking-wider">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-200">
            Verify your identity to create a new password
          </p>
        </div>

        <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
          <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Registered Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Security Answer Input */}
              <div>
                <label htmlFor="secretAnswer" className="block text-sm font-medium text-gray-700">
                  Security Answer (City Name)
                </label>
                <div className="mt-1">
                  <input
                    id="secretAnswer"
                    name="secretAnswer"
                    type="text"
                    required
                    value={formData.secretAnswer}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                    placeholder="E.g. Dhenkanal"
                  />
                </div>
              </div>

              {/* New Password Input */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`${
                    loading && "opacity-70 cursor-wait"
                  } w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200`}
                >
                  {loading ? <Loader text="Resetting..." /> : "Reset Password"}
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{' '}
                  <Link to="/login" className="font-bold text-black hover:underline transition duration-200">
                    Back to Login
                  </Link>
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;