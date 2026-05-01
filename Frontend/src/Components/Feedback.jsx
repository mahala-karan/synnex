import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { getUserData } from '../services/authService'; // 🔥 NAYA: User ID nikalne ke liye

const Feedback = () => {
  const user = getUserData() || {}; // Logged-in user ka data
  const [experienceRating, setExperienceRating] = useState(5);
  const [agree, setAgree] = useState('');
  const [feedbackComments, setFeedbackComments] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if(!selectedOption) {
      toast.error("Please select a primary reason for using the platform.");
      return;
    }

    // 🔥 MAGIC: Saare form data ko ek sentence mein jod rahe hain Admin ke liye!
    const combinedMessage = `Rating: ${experienceRating}/5 | Reason: ${selectedOption} | Navigability: ${agree || 'Not answered'} | Comments: ${feedbackComments || 'None'}`;

    setLoading(true);
    try {
      // 🔥 NAYA: Asli API call jo data ko Database me bhejegi
      await axios.post('https://synnex-backend.onrender.com/api/admin/submit-feedback', {
        userId: user?._id, // User ki ID
        message: combinedMessage // Judwa message
      });

      toast.success("Thank you! Your feedback has been submitted successfully. 📝");
      
      // Reset form
      setExperienceRating(5);
      setAgree('');
      setFeedbackComments('');
      setSelectedOption('');
    } catch (error) {
      toast.error("Failed to submit feedback. Backend connection error.");
      console.error(error);
    }
    setLoading(false);
  };

  const agreeDisagreeOptions = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 w-full flex justify-center">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-10 border-b border-gray-100 pb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Help Us Improve 🚀</h2>
          <p className="text-gray-500">Provide your valuable feedback & suggestions for Synnex.</p>
        </div>

        <form onSubmit={handleFeedbackSubmit} className="space-y-8">
          
          {/* Experience Rating */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <label className="block text-base font-bold text-gray-800 mb-4">
              1. How would you rate your overall experience with Synnex?
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 font-medium">Poor</span>
              <input
                type="range"
                min="1"
                max="5"
                value={experienceRating}
                onChange={(e) => setExperienceRating(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-black"
              />
              <span className="text-sm text-gray-500 font-medium">Excellent</span>
            </div>
            <div className="text-center mt-3 font-bold text-xl text-black">{experienceRating} / 5</div>
          </div>

          {/* Meaningful Dropdown */}
          <div>
            <label className="block text-base font-bold text-gray-800 mb-3">
              2. What is your primary reason for using Synnex? <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none bg-white text-gray-700"
            >
              <option value="" disabled>Select an option...</option>
              <option value="jobSeeking">Looking for Jobs / Internships</option>
              <option value="networking">Professional Networking</option>
              <option value="keepingInTouch">Keeping in touch with classmates</option>
              <option value="events">Attending College Events</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Agree/Disagree Options */}
          <div>
            <label className="block text-base font-bold text-gray-800 mb-3">
              3. "The platform is easy to navigate and find relevant alumni."
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {agreeDisagreeOptions.map((option) => (
                <label 
                  key={option} 
                  className={`border rounded-lg p-3 text-center cursor-pointer text-sm font-medium transition ${
                    agree === option ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="agree"
                    value={option}
                    checked={agree === option}
                    onChange={() => setAgree(option)}
                    className="hidden"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Additional Feedback Comments */}
          <div>
            <label className="block text-base font-bold text-gray-800 mb-3">
              4. Do you have any additional comments or suggestions for improvement? (Optional)
            </label>
            <textarea
              rows="4"
              value={feedbackComments}
              onChange={(e) => setFeedbackComments(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="Tell us what you loved, or what we can do better..."
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex justify-center items-center bg-black hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition shadow-md disabled:opacity-50"
            >
              <FaCheck className="mr-2" />
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Feedback;
