import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaArrowLeft, FaKey, FaLock } from 'react-icons/fa';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [secretAnswer, setSecretAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Direct password reset API call
      const res = await axios.post('https://synnex-backend.onrender.com/api/reset-password-direct', { 
        email, 
        secretAnswer: secretAnswer.toLowerCase(), 
        newPassword 
      });
      
      setMessage("Password successfully reset! You can now login.");
      setTimeout(() => navigate('/login'), 2000); // 2 second baad login page pe bhej dega
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Email or Security Answer. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-500 text-sm">
            Answer your security question to instantly reset your password.
          </p>
        </div>

        {message && <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm font-bold text-center border border-green-200">{message}</div>}
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm font-bold text-center border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input type="email" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" placeholder="you@college.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          {/* Secret Answer Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Security Question: Favorite City?</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaKey className="text-gray-400" />
              </div>
              <input type="text" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" placeholder="e.g., Mumbai" value={secretAnswer} onChange={(e) => setSecretAnswer(e.target.value)} />
            </div>
          </div>

          {/* New Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input type="password" required minLength="6" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
          </div>

          <button type="submit" disabled={loading} className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-800 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {loading ? 'Resetting...' : 'Change Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="font-medium text-gray-600 hover:text-black flex items-center justify-center transition">
            <FaArrowLeft className="mr-2 text-xs" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;