import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import axios from "axios";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom"; 
import Loader from "../Components/Loader";

// 🔥 IMAGE YAHAN IMPORT KI HAI
import bgImage from "../assets/img/college-bg.jpg";

function Register() {
  const [selectedDegree, setSelectedDegree] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 NAYA: OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    startYear: "",
    endYear: "",
    degree: "",
    branch: "",
    rollNumber: "",
    firstName: "",
    lastName: "",
    role: "",
    secretAnswer: "",
    otp: "", // 🔥 NAYA: OTP field in state
  });

  const navigate = useNavigate();

  const roleOptions = [
    { value: "alumni", label: "Alumni" },
    { value: "student", label: "Student" },
    { value: "teacher", label: "Teacher / Faculty" }
  ];

  const degreeOptions = [
    { value: "bachelor", label: "Bachelor" },
    { value: "master", label: "Master" },
    { value: "phd", label: "PhD" },
  ];

  const handleDegreeChange = (selectedOption) => {
    setSelectedDegree(selectedOption);
    setFormData({ ...formData, degree: selectedOption.value });
  };

  const handleRoleChange = (selectedOption) => {
    setSelectedRole(selectedOption);
    setFormData({ ...formData, role: selectedOption.value });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 NAYA: OTP Bhejne ka function
  const handleSendOTP = async () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email first!");
      return;
    }

    setSendingOtp(true);
    try {
      // 🔥 YAHAN /api LAGA DIYA HAI
      const res = await axios.post("https://synnex-backend.onrender.com/api/register/send-otp", { 
        email: formData.email 
      });
      toast.success(res.data.message || "OTP Sent to your Email!");
      setOtpSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP. Try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 🔥 Strict check, takki bina OTP dale form aage na badhe
    if (!otpSent) {
      toast.error("Please click 'Get OTP' first.");
      return;
    }

    if (!formData.otp || formData.otp.length < 4) {
      toast.error("Please enter the 4-digit OTP sent to your email.");
      return;
    }

    if (!selectedDegree) {
      toast.error("Please select a degree");
      return;
    }
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    setLoading(true);

    try {
      // 🔥 YAHAN BHI /api LAGA DIYA HAI
      const response = await axios.post(
        "https://synnex-backend.onrender.com/api/register/user", 
        formData
      );
      
      if (response.data.status === "success" || response.status === 200 || response.status === 201) {
        toast.success(response.data.message || "Registration successful!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setLoading(false);
        toast.error("Registration failed. Please check your details.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during registration:", error);
      const errorMsg = error.response?.data?.message || "Registration failed. Try again.";
      toast.error(errorMsg);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div 
        className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bgImage})` }} 
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative sm:mx-auto sm:w-full sm:max-w-md z-10">
          <div className="flex justify-center items-center space-x-2 mt-6">
            <AcademicCapIcon className="h-10 w-10 text-white drop-shadow-lg" />
            <h2 className="text-center text-4xl font-extrabold text-white drop-shadow-lg tracking-wider">
              Synnex
            </h2>
          </div>
          <p className="mt-2 text-center text-sm text-gray-200">
            Create your new account
          </p>
        </div>

        <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
          <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-gray-100">
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-3">
                
                {/* 🔥 EMAIL WITH OTP BUTTON */}
                <div className="flex space-x-2">
                  <input
                    name="email"
                    type="email"
                    required
                    disabled={otpSent} // OTP jane ke baad email lock
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black sm:text-sm"
                    placeholder="Email address"
                  />
                  <button 
                    type="button" 
                    onClick={handleSendOTP} 
                    disabled={sendingOtp || otpSent || !formData.email}
                    className="bg-black text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-gray-800 disabled:opacity-50 whitespace-nowrap transition"
                  >
                    {sendingOtp ? "Sending..." : otpSent ? "Sent ✔" : "Get OTP"}
                  </button>
                </div>

                {/* 🔥 OTP INPUT BOX (Only visible after OTP is sent) */}
                {otpSent && (
                  <input
                    name="otp"
                    type="text"
                    required
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-green-400 rounded-md focus:ring-green-600 focus:border-green-600 sm:text-sm bg-green-50 placeholder-green-700 font-bold tracking-widest text-center"
                    placeholder="Enter 4-digit OTP"
                    maxLength="4"
                  />
                )}
                
                <input
                  name="password"
                  type="password"
                  required
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black sm:text-sm"
                  placeholder="Password"
                />

                <Select
                  options={roleOptions}
                  value={selectedRole}
                  onChange={handleRoleChange}
                  placeholder="Select your role"
                  className="text-sm text-left"
                />

                {(formData.role === "student" || formData.role === "alumni") && (
                  <div className={`grid ${formData.role === "alumni" ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
                    <input
                      name="startYear"
                      type="text"
                      required
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm"
                      placeholder="Start Year"
                    />
                    
                    {formData.role === "alumni" && (
                      <input
                        name="endYear"
                        type="text"
                        required
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm"
                        placeholder="End Year"
                      />
                    )}
                  </div>
                )}

                <Select
                  options={degreeOptions}
                  value={selectedDegree}
                  onChange={handleDegreeChange}
                  placeholder="Select Degree"
                  className="text-sm text-left"
                />
                
                <input
                  name="branch"
                  type="text"
                  required
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm"
                  placeholder="Branch (e.g. CSE)"
                />

                <input
                  name="rollNumber"
                  type="text"
                  required
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm"
                  placeholder="Roll Number"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="firstName"
                    type="text"
                    required
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-md sm:text-sm"
                    placeholder="First Name"
                  />
                  <input
                    name="lastName"
                    type="text"
                    required
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-md sm:text-sm"
                    placeholder="Last Name"
                  />
                </div>

                <input
                  name="secretAnswer"
                  type="text"
                  required
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black sm:text-sm bg-blue-50"
                  placeholder="Security Q: What is your favorite city?"
                />

              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || !otpSent}
                  className={`${
                    (loading || !otpSent) && "opacity-70 cursor-not-allowed"
                  } w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-200`}
                >
                  {loading ? <Loader text="Registering..." /> : "Register Now"}
                </button>
              </div>

              <div className="mt-5 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-bold text-black hover:underline transition duration-200">
                    Sign in here
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

export default Register;