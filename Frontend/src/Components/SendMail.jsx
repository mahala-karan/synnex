import React, { useState } from 'react';
import { FaShare, FaSpinner } from 'react-icons/fa';
import { getLoggedIn, getUserData } from '../services/authService';
import { Link, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'; // 🔥 Ye add karna zaroori hai!
import 'react-toastify/dist/ReactToastify.css';

const SendMail = () => {
  const loggedIn = getLoggedIn();
  const location = useLocation(); 
  const [loading, setLoading] = useState(false); // 🔥 Button spinner ke liye
  
  // SENDER KI DETAILS
  const userData = getUserData() || {};
  const senderEmail = userData.email || 'your-email@example.com';
  const senderName = userData.firstName || userData.adminName || 'User';

  // JOBS PAGE SE AAYA HUA DATA
  const queryParams = new URLSearchParams(location.search);
  const defaultTo = queryParams.get('to') || '';
  const defaultSubject = queryParams.get('subject') || '';

  // 🔥 UPDATE: Asli API Call!
  const handleSendMail = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const emailData = {
      to: formData.get('recipient'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      from: senderEmail // Taki reply sender ko aaye
    };

    try {
      // Backend ko request bhej rahe hain
      const res = await axios.post('https://synnex-backend.onrender.com/api/send-mail', emailData, {
        withCredentials: true
      });

      if (res.data.status === "success") {
        toast.success(`Mail sent successfully! 🚀`);
        e.target.reset(); // Form clear karna
      } else {
        toast.error(`Failed to send mail: ${res.data.message}`);
      }
    } catch (error) {
      console.error("Mail Error:", error);
      toast.error(`Something went wrong. Backend error!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-10 w-full">
      <ToastContainer position="top-right" autoClose={4000} />
      
      <div className="flex flex-col items-center justify-center w-full">
        {loggedIn ? (
          <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg border border-gray-200 mx-4">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 border-b pb-4">
              Send Direct Mail 📧
            </h2>

            <form onSubmit={handleSendMail}>
              <div className="space-y-5">
                
                {/* Sender Identity */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 font-semibold mb-1">Sending As (Reply-To):</p>
                  <p className="text-md text-gray-900 font-bold">{senderName}</p>
                  <p className="text-sm text-gray-600">{senderEmail}</p>
                </div>

                {/* RECIPIENT FIELD WITH AUTOFILL */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2 mt-4">
                    To: (Alumni Name or Email) <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black bg-gray-50"
                    type="text"
                    required
                    placeholder="Enter Alumni's Email or Name..."
                    name="recipient"
                    autoComplete="off"
                    defaultValue={defaultTo} 
                  />
                </div>

                {/* Subject Line WITH AUTOFILL */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2 mt-4">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black bg-gray-50"
                    type="text"
                    required
                    placeholder="E.g., Doubt regarding Data Analytics career"
                    name="subject"
                    autoComplete="off" 
                    defaultValue={defaultSubject} 
                  />
                </div>

                {/* Message Body */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                    rows="4"
                    placeholder="Type your message here..."
                    required
                    name="message"
                  />
                </div>

                {/* Submit Button with Loading State */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent text-md font-bold rounded-md text-white transition shadow-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black'}`}
                  >
                    {loading ? (
                       <><FaSpinner className="animate-spin mr-2" /> Sending...</>
                    ) : (
                       <>Send Mail <FaShare className="ml-2" /></>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-12 px-6 bg-white rounded-xl shadow-md">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">You're Not Logged In 🔒</h1>
            <p className="text-gray-600 mb-6">
              Please log in to access the mailing system.
            </p>
            <Link
              to="/login"
              className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition"
            >
              Login Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendMail;