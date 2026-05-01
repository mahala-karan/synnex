import React, { useState, useEffect } from 'react';
import { getLoggedIn, getUserData } from "../services/authService"; 
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'; 

const Meeting = () => { 
  const loggedIn = getLoggedIn();
  const user = getUserData() || {}; 
  
  const userRole = user?.role?.toLowerCase();
  const canGenerateLink = userRole === 'alumni' || userRole === 'admin';
  
  // 🔥 FIX: User ka poora naam nikalne ka "Bulletproof" logic
  const creatorFullName = userRole === 'admin' 
    ? (user?.adminName || "Admin") 
    : (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user?.name || "Alumni"));
  
  const [meetingLink, setMeetingLink] = useState('');
  const [meetingTime, setMeetingTime] = useState(''); 
  const [meetingReason, setMeetingReason] = useState(''); 
  const [hostName, setHostName] = useState(''); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMeetingLink = async () => {
      try {
        const response = await axios.get('https://synnex-backend.onrender.com/api/meeting');
        if (response.data.status === 'success') {
          if (response.data.link) setMeetingLink(response.data.link);
          if (response.data.time) setMeetingTime(response.data.time);
          if (response.data.reason) setMeetingReason(response.data.reason); 
          if (response.data.creatorName) setHostName(response.data.creatorName);
        }
      } catch (error) {
        console.log("No active meeting found.");
      }
    };
    if (loggedIn) fetchMeetingLink();
  }, [loggedIn]);

  const handleSaveMeetingLink = async () => {
    if (!meetingLink || !meetingLink.startsWith('http')) {
      toast.error("⚠️ Error: Please paste a REAL Google Meet link!"); return;
    }
    if (!meetingTime) {
      toast.error("⚠️ Please select a Date and Time!"); return;
    }
    if (!meetingReason) {
      toast.error("⚠️ Please enter a Meeting Agenda/Reason!"); return;
    }

    setLoading(true);
    try {
      await axios.post('https://synnex-backend.onrender.com/api/meeting', {
        link: meetingLink,
        time: meetingTime,
        reason: meetingReason, 
        creatorName: creatorFullName, // 🔥 Ab ye kabhi Unknown nahi jayega!
        role: userRole
      });
      toast.success("Meeting Broadcasted to Everyone! 🚀");
      // 🔥 UI ko turant update karne ke liye hostName set kar rahe hain
      setHostName(creatorFullName);
    } catch (error) {
      toast.error("Database Error: Failed to save link.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={4000} />
      
      <div className="max-w-lg w-full p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        {loggedIn ? (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Alumni Meeting Room 🎥</h2>
              <p className="text-gray-500">
                {canGenerateLink ? "Create a new meeting broadcast." : "Latest active meeting details."}
              </p>
            </div>

            {/* 🔥 Meeting Host Info (Student view ke liye) */}
            {!canGenerateLink && hostName && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg mb-6 text-sm font-medium">
                🗣️ Hosted by: <span className="font-bold">{hostName}</span>
              </div>
            )}

            {/* Agenda/Reason Box */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meeting Agenda/Reason</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
                value={meetingReason}
                onChange={(e) => setMeetingReason(e.target.value)}
                placeholder={canGenerateLink ? "e.g., TCS Interview Prep" : "No agenda specified"}
                readOnly={!canGenerateLink} 
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meeting Link</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder={canGenerateLink ? "Paste real link here..." : "Waiting for meeting..."}
                readOnly={!canGenerateLink} 
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date & Time</label>
              <input
                type="datetime-local"
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                readOnly={!canGenerateLink} 
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              {canGenerateLink && (
                <button
                  className="flex-1 border-2 border-black text-black hover:bg-black hover:text-white px-4 py-3 rounded-lg font-bold transition duration-300 disabled:opacity-50"
                  onClick={handleSaveMeetingLink}
                  disabled={loading}
                >
                  {loading ? "Broadcasting..." : "Broadcast Meeting"}
                </button>
              )}
              <button
                className={`flex-1 px-4 py-3 rounded-lg font-bold transition duration-300 shadow-md ${meetingLink ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                onClick={() => meetingLink && window.open(meetingLink, '_blank')}
                disabled={!meetingLink}
              >
                Join Meeting
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <h1 className="text-3xl font-bold mb-4">You're Not Logged In 🔒</h1>
            <Link to="/login" className="bg-black text-white px-8 py-3 rounded-lg font-bold">Go to Login</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meeting;
