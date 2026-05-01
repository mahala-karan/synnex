import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getLoggedIn, getUserData } from '../services/authService';
import NotLoggedIn from './helper/NotLoggedIn';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Complaint() {
  const loggedIn = getLoggedIn();
  const user = getUserData() || {};
  
  const [loading, setLoading] = useState(false);
  const [complaintData, setComplaintData] = useState({ subject: "", message: "" });
  
  // 🔥 NAYA: Tracker ke liye state
  const [myComplaints, setMyComplaints] = useState([]);
  const [loadingTracker, setLoadingTracker] = useState(false);

  // 🔥 NAYA: Jab page khule toh user ki purani complaints fetch karo
  const fetchMyComplaints = async () => {
    setLoadingTracker(true);
    try {
      const res = await axios.get('https://synnex-backend.onrender.com/api/complaints/my-complaints', {
        withCredentials: true
      });
      setMyComplaints(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch complaints tracker", error);
    } finally {
      setLoadingTracker(false);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchMyComplaints();
    }
  }, [loggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('https://synnex-backend.onrender.com/api/complaints/submit', {
        subject: complaintData.subject,
        message: complaintData.message
      }, {
        withCredentials: true
      });

      toast.success("Complaint submitted! You can track it below. ✅");
      setComplaintData({ subject: "", message: "" });
      
      // 🔥 FIX: Submit hote hi list ko turant update (refresh) kar do
      fetchMyComplaints();
      
    } catch (error) {
      toast.error("Failed to send complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NAYA: Delete karne ka function
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this complaint record?")) {
      try {
        await axios.delete(`https://synnex-backend.onrender.com/api/complaints/${id}`, {
          withCredentials: true
        });
        setMyComplaints(myComplaints.filter(c => c._id !== id));
        toast.success("Complaint history deleted!");
      } catch (error) {
        toast.error("Failed to delete complaint.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center pt-10">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {loggedIn ? (
        <div className="w-full max-w-4xl space-y-8">
          
          {/* TOP SECTION: COMPLAINT FORM */}
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Support & Complaints 🛑</h1>
              <p className="text-gray-500 mt-2">Facing an issue? Report it directly to the admin team.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject / Issue Type</label>
                <input 
                  type="text" 
                  required 
                  value={complaintData.subject} 
                  onChange={(e) => setComplaintData({...complaintData, subject: e.target.value})} 
                  placeholder="E.g., Portal Login Issue, Incorrect Event Data..." 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Describe the Issue in Detail</label>
                <textarea 
                  required 
                  rows="4"
                  value={complaintData.message} 
                  onChange={(e) => setComplaintData({...complaintData, message: e.target.value})} 
                  placeholder="Please describe exactly what happened..." 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold text-white transition shadow-md ${loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {loading ? "Sending..." : "Submit Complaint"}
              </button>
            </form>
          </div>

          {/* BOTTOM SECTION: COMPLAINT TRACKER */}
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">My Complaint Tracker 📋</h2>
            
            {loadingTracker ? (
              <p className="text-center text-gray-500 animate-pulse">Loading your history...</p>
            ) : myComplaints.length === 0 ? (
              <p className="text-center text-gray-500 py-6 border-2 border-dashed border-gray-200 rounded-lg">
                You haven't raised any complaints yet. All good!
              </p>
            ) : (
              <div className="space-y-4">
                {myComplaints.map(c => {
                  const isResolved = c.status === 'Resolved';
                  return (
                    <div key={c._id} className={`border p-5 rounded-lg shadow-sm transition ${isResolved ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
                        <h3 className="font-bold text-lg text-gray-900">{c.subject}</h3>
                        <div className="flex items-center gap-3 mt-2 sm:mt-0">
                          {/* Status Badge */}
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isResolved ? 'bg-green-100 text-green-700 border-green-300' : 'bg-orange-100 text-orange-700 border-orange-300'}`}>
                            {isResolved ? "Solved ✅" : "Pending ⏳"}
                          </span>
                          {/* Delete Button */}
                          <button 
                            onClick={() => handleDelete(c._id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1.5 rounded transition"
                            title="Delete this record"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-3 bg-white p-3 border border-gray-100 rounded">
                        {c.message}
                      </p>
                      
                      <p className="text-xs text-gray-400 font-medium">
                        Reported on: {new Date(c.createdAt).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      ) : (
        <NotLoggedIn text="Complaints" />
      )}
    </div>
  );
}

export default Complaint;
