import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, BriefcaseIcon, CalendarIcon, ChartBarIcon, ArrowRightOnRectangleIcon,
  DocumentTextIcon, ChatBubbleLeftEllipsisIcon, VideoCameraIcon, ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getLoggedIn, getUserRole } from '../services/authService';

function AdminDashboard() {
  const navigate = useNavigate();
  const loggedIn = getLoggedIn();
  const role = getUserRole();
  const userRole = role?.toLowerCase();

  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]); 
  const [feedbacks, setFeedbacks] = useState([]); 
  const [meetings, setMeetings] = useState([]);
  const [complaints, setComplaints] = useState([]); // 🔥 NAYA: Complaints State
  const [loading, setLoading] = useState(false);

  // Modals States
  const [showEventModal, setShowEventModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  
  // ATTENDEES MODAL STATE
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);
  const [attendeesList, setAttendeesList] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null); 

  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '', description: '' });
  const [newNotice, setNewNotice] = useState({ title: '', content: '', type: 'Notice' });

  useEffect(() => {
    if (!loggedIn || userRole !== 'admin') {
      navigate('/login'); 
    }
  }, [loggedIn, userRole, navigate]);

  // API Functions
  const fetchUsers = async () => { 
    try { 
      const res = await axios.get('https://synnex-backend.onrender.com/api/admin/all-users', { withCredentials: true }); 
      if (res.data && res.data.data && Array.isArray(res.data.data.users)) setUsers(res.data.data.users);
      else if (res.data && Array.isArray(res.data.users)) setUsers(res.data.users);
      else if (Array.isArray(res.data)) setUsers(res.data);
      else setUsers([]);
    } catch (err) { console.error("Failed to fetch users", err); } 
  };
  
  const fetchJobs = async () => { try { const res = await axios.get('https://synnex-backend.onrender.com/api/admin/all-jobs', { withCredentials: true }); setJobs(res.data); } catch (err) {} };
  const fetchEvents = async () => { try { const res = await axios.get('https://synnex-backend.onrender.com/api/admin/all-events', { withCredentials: true }); setEvents(res.data); } catch (err) {} };
  const fetchNews = async () => { try { const res = await axios.get('https://synnex-backend.onrender.com/api/admin/all-news', { withCredentials: true }); setNews(res.data); } catch (err) {} };
  
  const fetchFeedbacks = async () => { 
    try { 
      const res = await axios.get('https://synnex-backend.onrender.com/api/admin/all-feedback', { withCredentials: true }); 
      if (res.data && Array.isArray(res.data.data)) setFeedbacks(res.data.data);
      else if (Array.isArray(res.data)) setFeedbacks(res.data);
      else setFeedbacks([]);
    } catch (err) { console.error("Feedback fetch error:", err); } 
  };

  const fetchMeetings = async () => { 
    try { 
      const res = await axios.get('https://synnex-backend.onrender.com/api/meeting/all', { withCredentials: true }); 
      if (res.data && Array.isArray(res.data.data)) setMeetings(res.data.data);
      else if (Array.isArray(res.data)) setMeetings(res.data);
      else setMeetings([]);
    } catch (err) { console.error("Meeting fetch error:", err); } 
  };

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('https://synnex-backend.onrender.com/api/admin/all-complaints', { withCredentials: true });
      if (res.data && Array.isArray(res.data.data)) setComplaints(res.data.data);
      else if (Array.isArray(res.data)) setComplaints(res.data);
      else setComplaints([]);
    } catch (err) { console.error("Complaints fetch error:", err); }
  };

  useEffect(() => {
    if (userRole === 'admin') {
      setLoading(true);
      Promise.all([fetchUsers(), fetchJobs(), fetchEvents(), fetchNews(), fetchFeedbacks(), fetchMeetings(), fetchComplaints()]).finally(() => setLoading(false));
    }
  }, [userRole]);

  // Handlers
  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Warning: Delete ${userName}? This cannot be undone.`)) {
      try {
        await axios.delete(`https://synnex-backend.onrender.com/api/admin/user/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
      } catch (error) { alert("Failed to delete user."); }
    }
  };

  const handleResetPassword = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to reset the password for ${userName}? It will be changed to 'synnex123'.`)) {
      try {
        await axios.put(`https://synnex-backend.onrender.com/api/admin/reset-password/${userId}`, {}, { withCredentials: true });
        alert(`Success! Password for ${userName} is now 'synnex123'.`);
      } catch (error) { alert("Failed to reset password."); }
    }
  };

  const handleApproveUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to approve ${userName} to access the platform?`)) {
      try {
        await axios.put(`https://synnex-backend.onrender.com/api/admin/user/${userId}/approve`, {}, { withCredentials: true });
        setUsers(users.map(u => u._id === userId ? { ...u, isApproved: true } : u));
        alert(`${userName} has been successfully approved!`);
      } catch (error) { alert("Failed to approve user."); }
    }
  };

  const handleDeleteJob = async (jobId, jobTitle) => {
    if(window.confirm(`Delete job: ${jobTitle}?`)) {
      try {
        await axios.put(`https://synnex-backend.onrender.com/api/admin/job/${jobId}/delete`);
        setJobs(jobs.filter(j => j._id !== jobId));
      } catch(error) { alert("Failed to delete job."); }
    }
  };

  const handleDeleteEvent = async (eventId, eventTitle) => {
    if(window.confirm(`Delete event: ${eventTitle}?`)) {
      try {
        await axios.delete(`https://synnex-backend.onrender.com/api/admin/event/${eventId}`, { withCredentials: true });
        setEvents(events.filter(e => e._id !== eventId));
      } catch(error) { alert("Failed to delete event."); }
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://synnex-backend.onrender.com/api/admin/event', newEvent, { withCredentials: true });
      setEvents([...events, res.data]); 
      setShowEventModal(false); 
      setNewEvent({ title: '', date: '', location: '', description: '' }); 
      alert("Event Created Successfully!");
    } catch (error) { alert("Failed to create event."); }
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://synnex-backend.onrender.com/api/admin/news', newNotice, { withCredentials: true });
      setNews([res.data, ...news]);
      setShowNewsModal(false);
      setNewNotice({ title: '', content: '', type: 'Notice' });
      alert("Notice Published!");
    } catch (err) { alert("Failed to publish notice."); }
  };

  const handleDeleteNews = async (id) => {
    if (window.confirm("Delete this notice?")) {
      try {
        await axios.delete(`https://synnex-backend.onrender.com/api/admin/news/${id}`, { withCredentials: true });
        setNews(news.filter(n => n._id !== id));
      } catch (err) { alert("Error deleting notice."); }
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    if (window.confirm("Are you sure you want to delete this meeting history?")) {
      try {
        await axios.delete(`https://synnex-backend.onrender.com/api/meeting/${meetingId}`, { withCredentials: true });
        setMeetings(meetings.filter(m => m._id !== meetingId)); 
      } catch (error) { 
        alert("Failed to delete meeting."); 
      }
    }
  };

  // 🔥 NAYA: Resolve & Delete Complaint Handlers
  const handleResolveComplaint = async (id) => {
    if (window.confirm("Mark this complaint as Solved?")) {
      try {
        await axios.put(`https://synnex-backend.onrender.com/api/admin/complaint/${id}/resolve`, {}, { withCredentials: true });
        setComplaints(complaints.map(c => c._id === id ? { ...c, status: 'Resolved' } : c));
      } catch (error) { alert("Failed to resolve complaint."); }
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      try {
        await axios.delete(`https://synnex-backend.onrender.com/api/admin/complaint/${id}`, { withCredentials: true });
        setComplaints(complaints.filter(c => c._id !== id));
      } catch (error) { alert("Failed to delete complaint."); }
    }
  };

  const viewAttendees = async (eventId) => {
    setCurrentEventId(eventId);
    setShowAttendeesModal(true);
    setLoadingAttendees(true);
    try {
      const res = await axios.get(`https://synnex-backend.onrender.com/api/admin/event-attendees/${eventId}`, { withCredentials: true });
      setAttendeesList(res.data);
      setEvents(prevEvents => prevEvents.map(ev => {
          if (ev._id === eventId) return { ...ev, attendees: res.data.map(u => u._id) };
          return ev;
      }));
    } catch (error) {
      alert("Could not fetch attendees list.");
      setAttendeesList([]);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const handleRemoveAttendee = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to remove ${userName} from this event?`)) {
      try {
        await axios.delete(`https://synnex-backend.onrender.com/api/admin/event/${currentEventId}/attendee/${userId}`, { withCredentials: true });
        setAttendeesList(attendeesList.filter(user => user._id !== userId && user.email !== `ID: ${userId}`));
        setEvents(events.map(ev => {
            if (ev._id === currentEventId) {
                return { ...ev, attendees: ev.attendees.filter(id => id !== userId && id !== userId.toString()) };
            }
            return ev;
        }));
      } catch (error) { alert("Failed to remove user."); }
    }
  };

  const renderContent = () => {
    if (loading) return <div className="p-10 text-center font-bold">Loading Admin Data...</div>;

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100"><p className="text-gray-500 text-sm">Total Users</p><h3 className="text-3xl font-bold">{users.length}</h3></div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100"><p className="text-gray-500 text-sm">Jobs Listed</p><h3 className="text-3xl font-bold">{jobs.length}</h3></div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100"><p className="text-gray-500 text-sm">Active Events</p><h3 className="text-3xl font-bold">{events.length}</h3></div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100"><p className="text-gray-500 text-sm">Feedback Received</p><h3 className="text-3xl font-bold">{feedbacks.length}</h3></div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-red-200 bg-red-50"><p className="text-red-500 text-sm font-bold">Pending Complaints</p><h3 className="text-3xl font-bold text-red-700">{complaints.filter(c => c.status !== 'Resolved').length}</h3></div>
          </div>
        );

      case 'users':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-bold px-4 py-1 rounded-full">Total: {users.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                    <th className="p-4 font-bold">Name</th>
                    <th className="p-4 font-bold">Email</th>
                    <th className="p-4 font-bold">Role</th>
                    <th className="p-4 font-bold">Status</th> 
                    <th className="p-4 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="p-4 font-medium text-gray-900">{user.firstName} {user.lastName}</td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4 capitalize font-medium">{user.role}</td>
                        
                        <td className="p-4">
                          {user.isApproved === true ? (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-200">Approved</span>
                          ) : (
                            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold border border-orange-200 animate-pulse">Pending</span>
                          )}
                        </td>

                        <td className="p-4 text-center space-x-2 flex justify-center">
                          {user.isApproved !== true && (
                            <button onClick={() => handleApproveUser(user._id, user.firstName)} className="text-green-600 hover:text-green-800 font-bold text-sm bg-green-50 px-3 py-1 rounded transition hover:bg-green-100 border border-green-200 mr-2">
                              Approve
                            </button>
                          )}
                          <button onClick={() => handleResetPassword(user._id, user.firstName)} className="text-blue-600 hover:text-blue-800 font-bold text-sm bg-blue-50 px-3 py-1 rounded transition hover:bg-blue-100 border border-blue-200 mr-2">Reset Pass</button>
                          <button onClick={() => handleDeleteUser(user._id, user.firstName)} className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-1 rounded transition hover:bg-red-100 border border-red-200">Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-10 text-center text-gray-500 font-medium">
                        No users found in the database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'news':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">News & Notices</h2>
              <button onClick={() => setShowNewsModal(true)} className="bg-black text-white px-4 py-2 rounded-lg">+ Add Notice</button>
            </div>
            <div className="space-y-4">
              {news.map(n => (
                <div key={n._id} className="border p-4 rounded-lg flex justify-between">
                  <div><span className="text-xs font-bold uppercase bg-blue-100 px-2 py-1 rounded text-blue-700">{n.type}</span><h3 className="font-bold mt-2">{n.title}</h3><p className="text-gray-600 text-sm">{n.content}</p></div>
                  <button onClick={() => handleDeleteNews(n._id)} className="text-red-500 font-bold">Delete</button>
                </div>
              ))}
            </div>
            {showNewsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Post New Notice</h2>
                        <form onSubmit={handleCreateNews} className="space-y-4">
                            <input type="text" placeholder="Title" required className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black" value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} />
                            <select className="w-full border p-3 rounded-lg outline-none" value={newNotice.type} onChange={e => setNewNotice({...newNotice, type: e.target.value})}><option value="Notice">Notice</option><option value="News">News</option><option value="Update">Update</option></select>
                            <textarea placeholder="Content..." required className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black" rows="4" value={newNotice.content} onChange={e => setNewNotice({...newNotice, content: e.target.value})}></textarea>
                            <div className="flex justify-end space-x-2 pt-4"><button type="button" onClick={() => setShowNewsModal(false)} className="px-4 py-2 font-bold text-gray-500">Cancel</button><button type="submit" className="bg-black text-white px-6 py-2 rounded-lg font-bold">Publish Now</button></div>
                        </form>
                    </div>
                </div>
            )}
          </div>
        );

      case 'feedback':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6">User Feedback Dashboard</h2>
            <div className="space-y-4">
              {feedbacks.length === 0 ? <p className="text-gray-400 text-center py-10">No feedback received yet.</p> : feedbacks.map(f => (
                <div key={f._id} className="border-b pb-4 last:border-0"><p className="font-bold text-gray-800">{f.userId?.firstName || 'User'} {f.userId?.lastName || ''}:</p><p className="text-gray-600 italic">"{f.message}"</p><p className="text-xs text-gray-400 mt-1">{new Date(f.createdAt).toLocaleString()}</p></div>
              ))}
            </div>
          </div>
        );

      // 🔥 UPDATED: Complaints UI Section with Delete and Resolve Buttons
      case 'complaints':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <ExclamationTriangleIcon className="h-7 w-7 text-red-600 mr-2" />
                User Complaints
              </h2>
            </div>
            
            {complaints.length === 0 ? (
              <p className="text-gray-500 p-4 text-center border-2 border-dashed border-gray-200 rounded-lg">
                No complaints found. Everything is smooth! 🎉
              </p>
            ) : (
              <div className="space-y-4">
                {complaints.map(c => {
                  const isResolved = c.status === 'Resolved';
                  return (
                    <div key={c._id} className={`border p-5 rounded-lg transition shadow-sm ${isResolved ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50 hover:bg-red-100'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-bold text-lg ${isResolved ? 'text-green-900' : 'text-red-900'}`}>{c.subject}</h3>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${isResolved ? 'bg-green-200 text-green-800 border-green-300' : 'bg-red-200 text-red-800 border-red-300'}`}>
                          {c.status || "Pending"}
                        </span>
                      </div>
                      <p className={`mb-4 p-3 rounded border ${isResolved ? 'bg-white text-gray-700 border-green-100' : 'bg-white text-gray-800 border-red-100'}`}>
                        {c.message}
                      </p>
                      
                      <div className={`text-sm pt-3 flex flex-col md:flex-row md:justify-between md:items-center border-t ${isResolved ? 'border-green-200 text-gray-600' : 'border-red-200 text-gray-600'}`}>
                        <span>
                          Reported by: <strong className="text-black">{c.raisedBy?.firstName || 'Unknown'} {c.raisedBy?.lastName || 'User'}</strong> 
                          <span className="text-blue-600 ml-1">({c.raisedBy?.email || 'No Email'})</span>
                        </span>
                        
                        <div className="flex items-center gap-2 mt-3 md:mt-0">
                          <span className="font-medium mr-2">📅 {new Date(c.createdAt).toLocaleString()}</span>
                          
                          {/* 🔥 MARK SOLVED BUTTON */}
                          {!isResolved && (
                            <button 
                              onClick={() => handleResolveComplaint(c._id)} 
                              className="bg-green-100 text-green-700 border border-green-300 hover:bg-green-200 px-3 py-1.5 rounded text-xs font-bold transition shadow-sm"
                            >
                              Mark Solved ✅
                            </button>
                          )}
                          
                          {/* 🔥 DELETE BUTTON */}
                          <button 
                            onClick={() => handleDeleteComplaint(c._id)} 
                            className="bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 px-3 py-1.5 rounded text-xs font-bold transition shadow-sm"
                          >
                            Delete 🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'meetings':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
            <h2 className="text-2xl font-bold mb-6">Meeting History Logs</h2>
            {meetings.length === 0 ? ( 
              <p className="text-gray-500 p-4 text-center border-2 border-dashed border-gray-200 rounded-lg">No meetings have been broadcasted yet.</p> 
            ) : (
              <div className="space-y-4">
                {meetings.map(m => (
                  <div key={m._id} className="border border-gray-200 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-50 transition">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{m.reason || "General Meetup"}</h3>
                      <p className="text-sm text-gray-600">🗣 Hosted by: <span className="font-semibold text-black">{m.creatorName || "Alumni"}</span> ({m.hostRole})</p>
                      <p className="text-xs text-gray-500 mt-1">📅 Scheduled for: {m.time ? new Date(m.time).toLocaleString() : "N/A"}</p>
                      <a href={m.link} target="_blank" rel="noreferrer" className="text-blue-500 text-sm hover:underline mt-2 inline-block">🔗 {m.link}</a>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2 mt-4 md:mt-0">
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Created: {new Date(m.createdAt).toLocaleDateString()}</span>
                      <button 
                        onClick={() => handleDeleteMeeting(m._id)} 
                        className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 rounded font-bold text-sm transition border border-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'jobs':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
            <h2 className="text-2xl font-bold mb-6">Job Board Control</h2>
            {jobs.length === 0 ? ( <p className="text-gray-500 p-4 text-center border-2 border-dashed border-gray-200 rounded-lg">No jobs posted yet.</p> ) : (
                <div className="space-y-4">
                    {jobs.map(job => (
                        <div key={job._id} className="border border-gray-200 p-4 rounded-lg flex justify-between items-center hover:bg-gray-50 transition">
                            <div><h3 className="font-bold text-lg text-gray-900">{job.title || "Job Title"}</h3><p className="text-sm text-gray-600">{job.company || "Company"} • {job.location || "Location"}</p></div>
                            <button onClick={()=> handleDeleteJob(job._id, job.title)} className="text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded font-bold text-sm transition">Delete Job</button>
                        </div>
                    ))}
                </div>
            )}
          </div>
        );

      case 'events':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Event Manager</h2>
                <button onClick={() => setShowEventModal(true)} className="bg-black hover:bg-gray-800 transition text-white px-4 py-2 rounded-lg font-bold shadow-lg">+ Create New Event</button>
            </div>
             {events.length === 0 ? (
                <p className="text-gray-500 p-4 text-center border-2 border-dashed border-gray-200 rounded-lg">No events found.</p>
            ) : (
                 <div className="space-y-4">
                     {events.map(event => (
                         <div key={event._id} className="border border-gray-200 p-4 rounded-lg flex justify-between items-center hover:bg-gray-50">
                             <div>
                               <h3 className="font-bold text-lg text-black">{event.title}</h3>
                               <p className="text-sm text-gray-600 font-medium">{new Date(event.date).toDateString()} • {event.location}</p>
                             </div>
                             
                             <div className="flex items-center space-x-3">
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold border border-green-200">Upcoming</span>
                                
                                <button 
                                  onClick={() => viewAttendees(event._id)} 
                                  className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded font-bold text-sm transition"
                                >
                                  👥 View ({event.attendees ? event.attendees.length : 0})
                                </button>
                                
                                <button 
                                  onClick={() => handleDeleteEvent(event._id, event.title)} 
                                  className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 rounded font-bold text-sm transition"
                                >
                                  Delete
                                </button>
                             </div>
                         </div>
                     ))}
                 </div>
            )}

            {/* EVENT CREATION MODAL */}
            {showEventModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-100">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Event</h2>
                  <form onSubmit={handleCreateEvent} className="space-y-4">
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Event Title</label><input type="text" required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black outline-none transition" /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Date</label><input type="date" required value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black outline-none transition" /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Location / Venue</label><input type="text" required value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black outline-none transition" /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Description</label><textarea required value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black outline-none transition" rows="3"></textarea></div>
                    <div className="flex justify-end space-x-3 mt-8"><button type="button" onClick={() => setShowEventModal(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-bold transition">Cancel</button><button type="submit" className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg font-bold shadow-lg transition">Publish Event</button></div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );

      default: return <div className="p-10 text-center">Section under maintenance.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <div className="w-64 bg-black text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 text-2xl font-bold border-b border-gray-800 tracking-wider">
          SYNNEX <span className="text-sm font-light block text-gray-400">Admin Panel</span>
        </div>
        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><ChartBarIcon className="h-5 w-5 mr-3"/>Dashboard</button>
          <button onClick={() => setActiveTab('users')} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'users' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><UsersIcon className="h-5 w-5 mr-3"/>Manage Users</button>
          <button onClick={() => setActiveTab('jobs')} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'jobs' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><BriefcaseIcon className="h-5 w-5 mr-3"/>Job Approvals</button>
          <button onClick={() => setActiveTab('events')} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'events' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><CalendarIcon className="h-5 w-5 mr-3"/>Event Manager</button>
          <button onClick={() => setActiveTab('news')} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'news' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><DocumentTextIcon className="h-5 w-5 mr-3"/>News & Notices</button>
          
          <button onClick={() => setActiveTab('complaints')} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'complaints' ? 'bg-red-800 text-white' : 'text-red-400 hover:bg-red-900 hover:text-white font-bold'}`}>
            <ExclamationTriangleIcon className="h-5 w-5 mr-3"/>Manage Complaints
          </button>

          <button onClick={() => setActiveTab('feedback')} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'feedback' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><ChatBubbleLeftEllipsisIcon className="h-5 w-5 mr-3"/>User Feedback</button>
          <button onClick={() => setActiveTab('meetings')} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'meetings' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <VideoCameraIcon className="h-5 w-5 mr-3"/>Meeting History
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={() => navigate('/login')} className="flex items-center w-full p-3 text-red-400 hover:bg-gray-800 rounded-lg transition font-medium"><ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" /> Logout</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center px-8 z-0">
            <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide">{activeTab.replace('-', ' ')}</h1>
            <div className="flex items-center space-x-3">
                <span className="font-bold text-gray-600">Admin Mode</span>
                <div className="w-10 h-10 bg-black rounded-full text-white flex justify-center items-center shadow-lg font-bold">A</div>
            </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
            {renderContent()}
        </main>
      </div>

      {/* Attendees Modal */}
      {showAttendeesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative">
            
            <div className="flex justify-between items-center p-5 border-b bg-gray-50 w-full">
              <h3 className="text-lg font-bold text-gray-900">👥 Registered Attendees</h3>
              <button 
                onClick={() => setShowAttendeesModal(false)} 
                className="text-gray-500 hover:text-red-600 text-3xl font-bold leading-none focus:outline-none transition"
              >
                &times;
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto">
                {loadingAttendees ? (
                    <div className="flex justify-center py-8"><p className="text-gray-500 font-medium animate-pulse">Loading data...</p></div>
                ) : attendeesList.length === 0 ? (
                    <div className="text-center py-8"><p className="text-gray-400">No one has registered yet.</p></div>
                ) : (
                    <ul className="space-y-3">
                        {attendeesList.map((user, idx) => (
                            <li key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                                <div>
                                  <p className="font-bold text-gray-800">{user.firstName} {user.lastName}</p>
                                  <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <span className={`text-xs px-2 py-1 rounded font-bold capitalize ${user.role === 'student' ? 'bg-blue-100 text-blue-700' : user.role === 'alumni' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {user.role || 'User'}
                                  </span>
                                  <button 
                                    onClick={() => handleRemoveAttendee(user._id || user.email.replace('ID: ', ''), user.firstName)}
                                    className="text-red-500 hover:text-white hover:bg-red-500 border border-red-500 px-3 py-1 rounded text-xs font-bold transition"
                                  >
                                    Remove
                                  </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            <div className="p-4 border-t bg-gray-50 w-full">
               <button onClick={() => setShowAttendeesModal(false)} className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 font-bold transition">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;
