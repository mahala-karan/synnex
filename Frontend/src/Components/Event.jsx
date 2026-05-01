import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getLoggedIn, getUserRole, getUserData } from '../services/authService'; 
import NotLoggedIn from './helper/NotLoggedIn';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Event() {
  const loggedIn = getLoggedIn();
  const userData = getUserData();
  const role = getUserRole();
  const userRole = role?.toLowerCase();

  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]); 

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    type: "",
    description: ""
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let res = await axios.get('https://synnex-backend.onrender.com/api/events/all', {
          withCredentials: true 
        });
        
        let fetchedEvents = res.data?.data?.events || res.data;
        setEvents(fetchedEvents);

        if (userData && Array.isArray(fetchedEvents)) {
            const currentUserId = userData._id || userData.id;
            const userRegEvents = fetchedEvents
                .filter(ev => ev.attendees && ev.attendees.includes(currentUserId))
                .map(ev => ev._id);
            setRegisteredEvents(userRegEvents);
        }

      } catch (error) {
        try {
           const adminRes = await axios.get('https://synnex-backend.onrender.com/api/admin/all-events');
           setEvents(adminRes.data);
        } catch(e) { console.error("Fallback also failed."); }
      }
    };

    if (loggedIn) fetchEvents();
  }, [loggedIn]);

  const handleRegister = async (eventId, eventName) => {
    try {
      const currentUserId = userData?._id || userData?.id;
      
      await axios.post(`https://synnex-backend.onrender.com/api/events/register/${eventId}`, {
        userId: currentUserId
      });
      
      setRegisteredEvents([...registeredEvents, eventId]);
      toast.success(`Successfully registered for: ${eventName}! 🎉`);
    } catch (error) {
      if (error.response?.status === 400) {
          toast.info("You are already registered!");
          setRegisteredEvents([...registeredEvents, eventId]); 
      } else {
          toast.error("Failed to register. Please try again.");
      }
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://synnex-backend.onrender.com/api/admin/event', newEvent, {
        withCredentials: true
      });
      
      const createdEvent = res.data?.data?.event || res.data;
      setEvents([...events, createdEvent]);
      toast.success("New Event Published! ✅");
      setShowForm(false);
      setNewEvent({ title: "", date: "", time: "", location: "", type: "", description: "" }); 
    } catch (error) { 
      console.error("Create Event Error:", error);
      toast.error("Failed to publish event."); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 w-full relative">
      <ToastContainer position="top-right" autoClose={3000} />
      {loggedIn ? (
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-gray-200 pb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upcoming Events 📅</h1>
              <p className="text-gray-500 mt-1">Discover and join events hosted by your alumni network.</p>
            </div>
            
            {/* 🔥 FIX: Yahan Admin aur Alumni dono ko button dikhega */}
            {(userRole === "admin" || userRole === "alumni") && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="mt-4 sm:mt-0 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition shadow-md font-medium z-10"
              >
                {showForm ? "Close Form ❌" : "+ Create Event"}
              </button>
            )}
          </div>

          {/* 🔥 FIX: Yahan Admin aur Alumni dono ko form dikhega */}
          {(userRole === "admin" || userRole === "alumni") && showForm && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Host a New Event</h2>
              <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" required value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} placeholder="Event Title" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" required value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                  <input type="time" required value={newEvent.time} onChange={(e) => setNewEvent({...newEvent, time: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <input type="text" required value={newEvent.location} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} placeholder="Location or Meeting Link" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                <select required value={newEvent.type} onChange={(e) => setNewEvent({...newEvent, type: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white">
                  <option value="">Event Type</option>
                  <option value="Online">Online / Virtual</option>
                  <option value="Offline">Offline / In-person</option>
                </select>
                <textarea required value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} placeholder="Event Description..." rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-md md:col-span-2"></textarea>
                <div className="md:col-span-2 flex justify-end">
                  <button type="submit" className="bg-green-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-green-700">Publish Event</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center py-10">No upcoming events found.</p>
            ) : (
              events.map((event) => {
                const isRegistered = registeredEvents.includes(event._id);

                return (
                  <div key={event._id} className="relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition duration-300 flex flex-col h-full overflow-hidden">
                    
                    <div className={`h-2 w-full ${event.type === 'Online' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${event.type === 'Online' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                          {event.type || "Event"}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">{event.date}</span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 pr-2">{event.title}</h3>
                      <div className="text-sm text-gray-600 mb-4 space-y-1">
                        <p>⏰ {event.time}</p>
                        <p className="truncate">📍 {event.location}</p>
                      </div>
                      <p className="text-gray-600 text-sm flex-grow line-clamp-3 mb-6">{event.description}</p>
                      
                      <button 
                        onClick={() => handleRegister(event._id, event.title)}
                        disabled={isRegistered}
                        className={`mt-auto w-full text-center border-2 font-semibold px-4 py-2 rounded-lg transition ${
                          isRegistered 
                            ? 'bg-gray-400 text-white border-gray-400 cursor-not-allowed'
                            : event.type === 'Online' 
                              ? 'border-black text-black hover:bg-black hover:text-white'
                              : 'bg-black text-white border-black hover:bg-gray-800'
                        }`}
                      >
                        {isRegistered ? "Registered ✅" : "Register Now"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div className="flex h-screen items-center justify-center">
          <NotLoggedIn text="Events" />
        </div>
      )}
    </div>
  );
}

export default Event;
