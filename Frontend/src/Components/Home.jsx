import React from 'react';
import { Link } from 'react-router-dom';
import graduationIllustration from '../assets/img/graduation_illustration.svg';
// import connectingTeamsIllustration from '../assets/img/connecting_teams.svg'; // Isko aage use kar sakte hain

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-black selection:text-white">
      
      {/* 🌟 HERO SECTION */}
      <header className="bg-black text-white py-20 lg:py-32 relative overflow-hidden">
        {/* Abstract background design */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-gray-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-gray-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white">Synnex</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto font-light">
            Your lifelong connection to your alma mater. Network with peers, explore career opportunities, and stay updated with the latest campus events.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/login" 
              className="px-8 py-4 bg-white text-black font-bold rounded-lg shadow-xl hover:bg-gray-200 hover:shadow-2xl transition transform hover:-translate-y-1 text-lg"
            >
              Login to Portal
            </Link>
            <Link 
              to="/register" 
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-black transition transform hover:-translate-y-1 text-lg"
            >
              Join the Network
            </Link>
          </div>
        </div>
      </header>

      {/* 🌟 MAIN CONTENT SECTION */}
      <main className="container mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Content */}
          <section className="lg:w-1/2">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Bridging the gap between <br/>
              <span className="text-blue-600">Past, Present, and Future.</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Synnex is more than just an alumni directory. It is a thriving community where graduates can mentor current students, share job postings, and organize grand reunions.
            </p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-700">
                <span className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 font-bold">✓</span>
                Access exclusive Alumni Job Boards
              </li>
              <li className="flex items-center text-gray-700">
                <span className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 font-bold">✓</span>
                Attend Campus & Virtual Events
              </li>
              <li className="flex items-center text-gray-700">
                <span className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 font-bold">✓</span>
                Directly interact via User Feedback & Notices
              </li>
            </ul>

            <Link to="/login" className="text-black font-bold underline hover:text-blue-600 transition">
              Explore Features &rarr;
            </Link>
          </section>

          {/* Illustration Section */}
          <section className="lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Decorative circle behind image */}
              <div className="absolute inset-0 bg-blue-50 rounded-full transform scale-110 -z-10"></div>
              <img 
                src={graduationIllustration} 
                alt="Alumni Graduation Illustration" 
                className="w-full max-w-lg object-contain drop-shadow-2xl hover:scale-105 transition duration-500" 
              />
            </div>
          </section>
          
        </div>
      </main>

      {/* 🌟 FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-10 mt-10">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Synnex Alumni Network. All rights reserved.</p>
          <p className="mt-2">Built for seamless college networking.</p>
        </div>
      </footer>
      
    </div>
  );
}

export default Home;