import React, { useState } from "react";
import { getUserData } from "../services/authService";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // 🔥 API call ke liye
import { toast, ToastContainer } from "react-toastify"; // 🔥 Notification ke liye

function Profile() {
  const userData = getUserData();
  const navigate = useNavigate();

  // Profile Data State
  const [formData, setFormData] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
    role: userData.role || "",
    skills: "Data Analytics, SQL, React.js",
  });

  // 🔥 NAYA: Password Change State
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 NAYA: Password Change Handler
  const handlePassChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Updated Data ready to send to backend:", formData);
    alert("Profile saved successfully (Dummy action for now)!");
    navigate("/dashboard");
  };

  // 🔥 NAYA: Password Change Submit Function
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      const res = await axios.put("https://synnex-backend.onrender.com/api/change-password", {
        userId: userData._id, // User ki ID service se
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });

      toast.success("Password updated successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" }); // Reset form
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 w-full flex flex-col items-center gap-8">
      <ToastContainer />

      {/* --- EDIT PROFILE SECTION --- */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-4">Edit Profile</h2>
        
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input 
                type="text" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input 
                type="text" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={formData.email} 
              disabled
              className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Key Skills (Comma separated)</label>
            <input 
              type="text" 
              name="skills" 
              value={formData.skills} 
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
            />
          </div>

          <div className="flex gap-4 pt-4 mt-6 border-t">
            <button 
              type="submit" 
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition font-medium"
            >
              Save Changes
            </button>
            <button 
              type="button" 
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* --- 🔥 NAYA: CHANGE PASSWORD SECTION --- */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Security & Password</h2>
        
        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input 
              type="password" 
              name="currentPassword"
              required
              value={passwords.currentPassword}
              onChange={handlePassChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input 
                type="password" 
                name="newPassword"
                required
                value={passwords.newPassword}
                onChange={handlePassChange}
                placeholder="New Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input 
                type="password" 
                name="confirmPassword"
                required
                value={passwords.confirmPassword}
                onChange={handlePassChange}
                placeholder="Confirm Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full md:w-auto px-8 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-bold"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;