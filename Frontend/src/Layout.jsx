import React from 'react'
import Topbar from './Components/Topbar'
import { Outlet, useLocation } from 'react-router-dom' // 🔥 useLocation import kiya
import { getLoggedIn } from './services/authService'
import { ToastContainer } from 'react-toastify'

function Layout() {
  const loggedIn = getLoggedIn();
  const location = useLocation(); // 🔥 Ye batayega ki user kis page par hai

  // Check kar rahe hain ki kya user Login ya Register page par hai?
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      <ToastContainer/>
  
      {/* 🔥 JADOO: Agar page Login ya Register NAHI hai, tabhi Topbar dikhao */}
      {!isAuthPage && <Topbar />}
      
      {/* Outlet mein tere pages load honge (jaise Login form ya Dashboard) */}
      <Outlet />

    </>
  )
}

export default Layout