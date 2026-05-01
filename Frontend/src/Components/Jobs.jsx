import React, { useState, useEffect } from "react";
import axios from "axios";
import { getLoggedIn, getUserRole } from "../services/authService"; 
import { useNavigate } from "react-router-dom";
import NotLoggedIn from "./helper/NotLoggedIn";

function Jobs() {
  const loggedIn = getLoggedIn();
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const role = getUserRole(); 
  const userRole = role?.toLowerCase();

  const [jobs, setJobs] = useState([]);

  // 🔥 UPDATE: applyLink add kiya state mein
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    description: "",
    applyLink: "" 
  });

  // 1. SMART FETCH LOGIC (Normal + Fallback to Admin Route)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        let res = await axios.get('https://synnex-backend.onrender.com/api/jobs/all', {
          withCredentials: true 
        });
        
        // Data format check karke safe extract karna
        if (res.data?.data?.jobs) {
          setJobs(res.data.data.jobs);
        } else if (Array.isArray(res.data)) {
          setJobs(res.data);
        } else {
          // Fallback to admin route
          const adminRes = await axios.get('https://synnex-backend.onrender.com/api/admin/all-jobs');
          setJobs(adminRes.data);
        }
      } catch (error) {
        console.error("Job fetch error, trying fallback...", error);
        // Agar normal route 401/404 de, toh admin route se data khinch lo
        try {
           const adminRes = await axios.get('https://synnex-backend.onrender.com/api/admin/all-jobs');
           setJobs(adminRes.data);
        } catch(e) {
             console.error("Fallback also failed.");
        }
      }
    };

    if (loggedIn) {
      fetchJobs();
    }
  }, [loggedIn]);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://synnex-backend.onrender.com/api/jobs/create', newJob, {
        withCredentials: true
      });
      
      if (res.data?.status === 'success') {
        setJobs([...jobs, res.data.data.job]);
      } else {
        setJobs([...jobs, res.data]);
      }
      
      setShowForm(false);
      // 🔥 UPDATE: form reset karte waqt applyLink bhi reset kiya
      setNewJob({ title: "", company: "", location: "", type: "", description: "", applyLink: "" }); 
      alert("Job Posted Successfully! ✅");
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Failed to post job. Please try again.");
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job permanently?")) {
      try {
        await axios.delete(`https://synnex-backend.onrender.com/api/jobs/delete/${jobId}`, { 
          withCredentials: true 
        });
        
        setJobs(jobs.filter((job) => job._id !== jobId));
        alert("Job deleted permanently. 🗑️");
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Error deleting job.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 w-full">
      {loggedIn ? (
        <div className="max-w-6xl mx-auto">
          
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h1 className="text-3xl font-bold text-gray-900">Alumni Job Board 💼</h1>
            
            {/* FIXED: Sirf 'alumni' aur 'admin' ko button dikhega */}
            {(userRole === "alumni" || userRole === "admin") && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition shadow-lg font-medium"
              >
                {showForm ? "Cancel Posting ❌" : "+ Post a Job"}
              </button>
            )}
          </div>

          {/* FIXED: Sirf 'alumni' aur 'admin' ko form dikhega */}
          {(userRole === "alumni" || userRole === "admin") && showForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Post a New Opportunity</h2>
              
              <form onSubmit={handleCreateJob} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" required value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})} placeholder="Job Title (e.g., Frontend Developer)" className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black" />
                
                <input type="text" required value={newJob.company} onChange={(e) => setNewJob({...newJob, company: e.target.value})} placeholder="Company Name" className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black" />
                
                <input type="text" required value={newJob.location} onChange={(e) => setNewJob({...newJob, location: e.target.value})} placeholder="Location (e.g., Remote, Pune)" className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black" />
                
                <select required value={newJob.type} onChange={(e) => setNewJob({...newJob, type: e.target.value})} className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black">
                  <option value="">Select Job Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                </select>
                
                {/* 🔥 NAYA: Apply Link Input Field */}
                <input type="url" required value={newJob.applyLink} onChange={(e) => setNewJob({...newJob, applyLink: e.target.value})} placeholder="Application Link / URL (e.g., https://...)" className="border border-gray-300 p-2 rounded md:col-span-2 focus:outline-none focus:ring-2 focus:ring-black" />

                <textarea required value={newJob.description} onChange={(e) => setNewJob({...newJob, description: e.target.value})} placeholder="Job Description & Requirements..." className="border border-gray-300 p-2 rounded md:col-span-2 focus:outline-none focus:ring-2 focus:ring-black" rows="3"></textarea>
                
                <button type="submit" className="bg-green-600 text-white font-bold px-4 py-2 rounded hover:bg-green-700 md:col-span-2 transition shadow-sm">
                  Submit Job to Portal
                </button>
              </form>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center py-10">No jobs posted yet.</p>
            ) : (
              jobs.map((job) => (
                <div key={job._id} className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition duration-300 flex flex-col justify-between">
                  
                  {userRole === "admin" && (
                    <button 
                      onClick={() => handleDelete(job._id)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-bold px-2 py-1 bg-red-50 hover:bg-red-100 rounded text-sm transition"
                      title="Delete Job (Admin Only)"
                    >
                      Delete
                    </button>
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 pr-12">{job.title || "Job Title"}</h3>
                    <p className="text-gray-600 mt-1 font-medium">{job.company || "Company Name"}</p>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">{job.location || "Remote"}</span>
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-1 rounded-md">{job.type || "Full-time"}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4">
                    <div className="border-t border-gray-100 pt-3 pb-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Posted By</p>
                      <p className="text-sm font-bold text-gray-900">
                        {job.createdBy?.name || job.createdBy?.firstName || "Alumni User"} 
                        <span className="text-xs font-normal text-gray-500 ml-1">
                          ({job.createdBy?.role || "alumni"})
                        </span>
                      </p>
                    </div>

                    {/* 🔥 UPDATE: Dono buttons ko alag kiya aur styling theek ki */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                      {/* 🔥 FIX: Smart Apply Now Button (Handles missing https://) */}
                      <button 
                        onClick={() => {
                          if (!job.applyLink) {
                            alert("This job does not have a valid application link attached.");
                            return;
                          }
                          let finalUrl = job.applyLink;
                          // Check if link has protocol, if not add https://
                          if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
                            finalUrl = "https://" + finalUrl;
                          }
                          window.open(finalUrl, '_blank');
                        }}
                        className="flex-1 bg-black text-white font-bold px-4 py-2 rounded-lg hover:bg-gray-800 transition shadow-sm text-sm"
                      >
                        Apply Now 🚀
                      </button>
                      
                      <button 
                        onClick={() => navigate(`/send-mail?to=${encodeURIComponent(job.createdBy?.email || "admin@example.com")}&subject=${encodeURIComponent(`Job Application: ${job.title} at ${job.company}`)}`)}
                        className="flex-1 bg-white text-gray-800 border-2 border-gray-200 font-bold px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm text-sm"
                      >
                        Contact HR 📧
                      </button>
                    </div>

                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      ) : (
        <div className="flex h-screen items-center justify-center">
          <NotLoggedIn text="Jobs" />
        </div>
      )}
    </div>
  );
}

export default Jobs;