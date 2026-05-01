import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { login } from "../features/authSlice";
import { useNavigate, Link } from "react-router-dom"; 
import { useDispatch } from "react-redux";
import Loader from "../Components/Loader";

import bgImage from "../assets/img/college-bg.jpg";

function Login() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const roleOptions = [
    { value: "alumni", label: "Alumni" },
    { value: "faculty", label: "Faculty / Teacher" },
    { value: "student", label: "Student" },
  ];

  const handleRoleChange = (selectedOption) => {
    setSelectedRole(selectedOption);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }
    setLoading(true);
    const url = "https://synnex-backend.onrender.com/auth/login"; 
    
    const userData = {
      email: user.email,
      password: user.password,
      role: selectedRole.value,
    };

    try {
      const response = await axios.post(url, userData, {
        withCredentials: true
      });
      
      const payload = {
        ...(response.data.user || response.data[selectedRole.value] || response.data),
        role: selectedRole.value,
      };

      dispatch(login(payload));
      toast.success("Login Successful");

      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      if (err.response) {
        toast.error(err.response.data.message || err.message);
      } else {
        toast.error(err.message + "! Database server is down.");
      }
    }
  };

  return (
    <>
      <ToastContainer />
      {/* FULL SCREEN BACKGROUND IMAGE */}
      <div 
        className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bgImage})` }} 
      >
        {/* DARK OVERLAY TAQKI FORM CLEAR DIKHE */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative sm:mx-auto sm:w-full sm:max-w-md z-10">
          <h2 className="mt-6 text-center text-5xl font-extrabold text-white drop-shadow-lg tracking-wider">
            Synnex
          </h2>
          <p className="mt-2 text-center text-sm text-gray-200">
            Sign in to your account
          </p>
        </div>

        {/* LOGIN FORM CARD */}
        <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
          <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    onChange={handleChange}
                    value={user.email}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    onChange={handleChange}
                    value={user.password}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                    placeholder="Enter your password"
                  />
                </div>
                
                {/* 🔥 FORGOT PASSWORD LINK YAHAN ADD KIYA HAI */}
                <div className="flex justify-end mt-2">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm font-medium text-gray-500 hover:text-black hover:underline transition duration-200"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
              
              <div className="pt-2">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Role
                </label>
                <Select
                  id="role"
                  name="role"
                  options={roleOptions}
                  onChange={handleRoleChange}
                  value={selectedRole}
                  placeholder="Select your role"
                  className="text-sm text-gray-900"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`${
                    loading && "opacity-70 cursor-wait"
                  } w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-200`}
                >
                  {loading ? <Loader text={"Please Wait.."} /> : "Sign In"}
                </button>
              </div>

              <div className="mt-5 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-bold text-black hover:underline transition duration-200">
                    Register here
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

export default Login;