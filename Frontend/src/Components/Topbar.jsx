import React, { useState } from 'react';
// 🔥 FaSearch hata diya gaya hai
import { FaHome, FaCalendar, FaBriefcase, FaUserTie, FaBars, FaTimes, FaNewspaper, FaCommentDots, FaVideo, FaEnvelopeOpenText } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getLoggedIn } from '../services/authService';
import { logout } from '../features/authSlice';

function Topbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const loggedIn = getLoggedIn();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear(); // Safety ke liye clear kar rahe hain
    navigate('/login');
  };

  return (
    <div className="bg-slate-100 text-black p-4 flex flex-col lg:flex-row justify-between items-center shadow-sm sticky top-0 z-50">
      
      {/* Logo Section */}
      <div className="flex items-center mb-4 lg:mb-0 w-full lg:w-auto justify-between">
        <div className="flex items-center">
          <FaUserTie className="mr-2 h-6 w-8 text-black" />
          <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">
            Synnex
          </h2>
        </div>
        
        {/* Hamburger icon for mobile */}
        <div className="lg:hidden cursor-pointer p-2" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className={`w-full lg:w-auto lg:flex lg:flex-row lg:space-x-5 font-semibold items-center transition-all duration-300 ${isMobileMenuOpen ? 'flex flex-col space-y-4 pt-4 pb-2' : 'hidden'}`}>
        
        {loggedIn ? (
          <Link to="/dashboard" className="text-sm flex items-center hover:text-blue-600 transition">
            <FaHome className="mr-1.5" /> Dashboard
          </Link>
        ) : (
          <Link to="/home" className="text-sm flex items-center hover:text-blue-600 transition">
            <FaHome className="mr-1.5" /> Home
          </Link>
        )}

        <Link to="/events" className="text-sm flex items-center hover:text-blue-600 transition">
          <FaCalendar className="mr-1.5" /> Events
        </Link>
        
        <Link to="/jobs" className="text-sm flex items-center hover:text-blue-600 transition">
          <FaBriefcase className="mr-1.5" /> Jobs
        </Link>

        {/* 🔥 Meeting barabar set hai */}
        <Link to="/meeting" className="text-sm flex items-center hover:text-blue-600 transition">
          <FaVideo className="mr-1.5" /> Meeting
        </Link>

        {/* 🔥 NAYA: Send Mail hatakar Complaint lagaya */}
        <Link to="/complaint" className="text-sm flex items-center hover:text-red-600 transition">
          <FaEnvelopeOpenText className="mr-1.5" /> Complaint
        </Link>

        <Link to="/newsletter" className="text-sm flex items-center hover:text-blue-600 transition">
          <FaNewspaper className="mr-1.5" /> News & Notices
        </Link>

        <Link to="/feedback" className="text-sm flex items-center hover:text-blue-600 transition">
          <FaCommentDots className="mr-1.5" /> Feedback
        </Link>

        {/* Auth Buttons */}
        <div className="flex flex-col lg:flex-row gap-2 mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-200 w-full lg:w-auto">
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="border-2 border-black hover:bg-black hover:text-white px-5 py-2 rounded-lg text-sm font-bold transition w-full lg:w-auto text-center"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/register"
                className="border-2 border-black hover:bg-gray-100 text-black px-5 py-2 rounded-lg text-sm font-bold transition w-full lg:w-auto text-center"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="bg-black text-white hover:bg-gray-800 px-5 py-2 rounded-lg text-sm font-bold transition w-full lg:w-auto text-center"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Topbar;
