import { Navigate, useNavigate } from "react-router-dom";
import { getUserData, getLoggedIn } from "../services/authService";
import { useEffect } from "react"; // 🔥 NAYA
import axios from "axios"; // 🔥 NAYA
import { ToastContainer, toast } from 'react-toastify'; // 🔥 NAYA
import 'react-toastify/dist/ReactToastify.css'; // 🔥 NAYA

function Home() {
  const loggedin = getLoggedIn();
  const navigate = useNavigate();

  // 🔥 NAYA: Nayi Meeting Check Karne Aur Popup Dikhane Ka Logic
  useEffect(() => {
    const checkNewMeeting = async () => {
      try {
        const response = await axios.get('https://synnex-backend.onrender.com/api/meeting');
        if (response.data.status === 'success' && response.data.link) {
          const { link, time } = response.data;
          
          // Browser ki memory check karenge ki kya student ne ye link pehle dekh liya hai?
          const lastSeenMeeting = localStorage.getItem('lastSeenMeeting');
          
          if (lastSeenMeeting !== link) {
            // Agar link naya hai, toh Date ko mast format mein badlo
            const meetingDate = time ? new Date(time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Check Meeting Room';
            
            // Popup fek ke maaro
            toast.info(`📢 New meeting is scheduledd please join !\n📅 Time: ${meetingDate}`, {
              position: "top-center",
              autoClose: false, // Jab tak user 'X' na dabaye, ye screen par rahega
              theme: "dark", // Professional look ke liye
            });
            
            // Yaad rakho ki is student ne ye meeting dekh li hai
            localStorage.setItem('lastSeenMeeting', link);
          }
        }
      } catch (error) {
        console.log("No meeting fetched or server offline.");
      }
    };

    if (loggedin) {
      checkNewMeeting();
    }
  }, [loggedin]);

  if (!loggedin) {
    return <Navigate to="/login" />;
  }

  const { role, email, firstName, adminName } = getUserData();
  const displayName = role === "admin" ? adminName : firstName;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 w-full relative">
      <ToastContainer /> {/* 🔥 BOHOT ZAROORI: Iske bina popup nahi dikhega */}
      
      <div className="max-w-6xl mx-auto">
        
        {/* Dynamic Welcome Banner */}
        <div className="bg-black text-white rounded-2xl p-6 md:p-8 mb-8 shadow-lg flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {displayName || "User"}! 🎓</h1>
            <p className="text-gray-300">Manage your profile, connect with peers, and explore opportunities.</p>
          </div>
          <div className="hidden md:block">
            <span className="bg-white text-black px-4 py-2 rounded-full font-bold uppercase tracking-wide text-sm">
              {role} Portal
            </span>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold border-b pb-3 mb-4 text-gray-800">My Profile</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-gray-900">{displayName || "Not Provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-900">{email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Role</p>
                <p className="font-semibold text-blue-600 capitalize">{role}</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/profile')}
              className="mt-5 w-full bg-gray-100 text-black border border-gray-300 py-2 rounded-lg hover:bg-black hover:text-white transition font-medium"
            >
              Edit Profile
            </button>
          </div>

          {/* Highlights / Skills Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold border-b pb-3 mb-4 text-gray-800">Professional Highlights</h2>
            <p className="text-sm text-gray-600 mb-4">Top skills and interests added to your profile:</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">Data Analytics</span>
              <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium border border-purple-100">SQL</span>
              <span className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium border border-cyan-100">React.js</span>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-100">Python</span>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold border-b pb-3 mb-4 text-gray-800">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/jobs')} 
                className="block w-full text-center bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition shadow-sm"
              >
                Explore Jobs
              </button>
              
              <button 
                onClick={() => navigate('/events')} 
                className="block w-full text-center bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition shadow-sm font-medium"
              >
                Upcoming Events
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;
