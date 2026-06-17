import { useState } from 'react';
import { Home, AlertCircle, Grid, PlaySquare, HeartHandshake, User, X, Menu, Settings, Video, Bot, LifeBuoy } from 'lucide-react'; // <-- Added 'Bot' icon
import HomePage from './views/user/HomePage'; 
import SOSForm from './views/user/SOSForm';
import AnimalGallery from './views/user/AnimalGallery';
import Livestream from './views/user/Livestream';
import DonationEvents from './views/user/DonationEvents';
import UserProfile from './views/user/UserProfile';
import RescueQueue from './views/user/RescueQueue'; 
import AdminQueue from './views/admin/AdminQueue'; 
import FundDashboard from './views/admin/FundDashboard'; 
import ShelterIoT from './views/admin/ShelterIoT'; 
import Chatbot from './views/user/chatbot'; // <-- Point this to your new chatbot view location

export default function App() {
  const [activePortal, setActivePortal] = useState('user');
  const [activeUserTab, setActiveUserTab] = useState('home');
  const [adminView, setAdminView] = useState('queue');
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigateTo = (tabName) => {
    setActiveUserTab(tabName);
    setIsSidebarOpen(false);
  };

  const navigateAdminTo = (viewName) => {
    setAdminView(viewName);
    setIsSidebarOpen(false);
  };

  return (
    <div style={{ width: '100%', height: '100dvh', backgroundColor: 'var(--bg-page, #FDF8F3)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      <style>
        {`
          .desktop-nav {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          @media (max-width: 850px) {
            .desktop-nav {
              display: none !important;
            }
          }
        `}
      </style>

      {/* =========================================
          GLOBAL HEADER
          ========================================= */}
      <header style={{ 
        flex: '0 0 70px',
        padding: '0 20px', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: 'var(--bg-page, #FDF8F3)', 
        borderBottom: '1px solid var(--border, #E8DDD0)',
        zIndex: 50 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--text, #2C1F14)', display: 'flex' }}
          >
            <Menu size={28} />
          </button>
          
          <span 
            onClick={() => activePortal === 'user' ? navigateTo('home') : navigateAdminTo('queue')} 
            style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.5px', cursor: 'pointer', color: 'var(--text, #2C1F14)' }}
          >
            AniMORE {activePortal === 'admin' && <span style={{ color: 'var(--rescue, #F4845F)' }}>Admin</span>}
          </span>
        </div>

        {/* CENTER: Desktop Pill Navigation */}
        <div className="desktop-nav">
          {activePortal === 'user' && (
            <>
              <TopNavLink label="Home" isActive={activeUserTab === 'home'} onClick={() => navigateTo('home')} />
              <TopNavLink label="SOS" isActive={activeUserTab === 'sos'} onClick={() => navigateTo('sos')} />
              <TopNavLink label="Gallery" isActive={activeUserTab === 'gallery'} onClick={() => navigateTo('gallery')} />
              <TopNavLink label="Live Cams" isActive={activeUserTab === 'live'} onClick={() => navigateTo('live')} />
              <TopNavLink label="Donate" isActive={activeUserTab === 'donate'} onClick={() => navigateTo('donate')} />
              <TopNavLink label="Rescue" isActive={activeUserTab === 'rescue'} onClick={() => navigateTo('rescue')} />
              {/* NEW: AI Guide added to Top Nav */}
              <TopNavLink label="AI Guide" isActive={activeUserTab === 'chat'} onClick={() => navigateTo('chat')} />
            </>
          )}

          {activePortal === 'admin' && (
            <>
              <TopNavLink label="Live Feed" isActive={adminView === 'queue'} onClick={() => navigateAdminTo('queue')} />
              <TopNavLink label="Finances" isActive={adminView === 'funds'} onClick={() => navigateAdminTo('funds')} />
              <TopNavLink label="Shelter Monitor" isActive={adminView === 'iot'} onClick={() => navigateAdminTo('iot')} />
            </>
          )}
        </div>

        <button 
          onClick={() => activePortal === 'user' ? navigateTo('profile') : null} 
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--text, #2C1F14)', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {activePortal === 'admin' ? (
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}></span>
          ) : (
            <User size={26} />
          )}
        </button>
      </header>

      {/* =========================================
          HIDDEN SIDEBAR OVERLAY
          ========================================= */}
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} style={{ position: 'absolute', inset: 0, zIndex: 99, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease-out' }} />
      )}

      {/* SIDEBAR PANEL */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: '80%', maxWidth: '300px', zIndex: 100,
        backgroundColor: 'var(--bg-page, #FDF8F3)', 
        borderRight: '1px solid var(--border, #E8DDD0)',
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: isSidebarOpen ? '10px 0 30px rgba(0,0,0,0.1)' : 'none'
      }}>
        <div style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border, #E8DDD0)' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text, #2C1F14)' }}>MENU</span>
          <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text, #2C1F14)' }}><X size={28} /></button>
        </div>
        
        {/* DYNAMIC SIDEBAR LINKS BASED ON PORTAL */}
        <div style={{ flex: 1, padding: '20px 0', overflowY: 'auto' }}>
          {activePortal === 'user' && (
            <>
              <SidebarLink icon={<Home />} label="Home" isActive={activeUserTab === 'home'} onClick={() => navigateTo('home')} />
              <SidebarLink icon={<AlertCircle />} label="Emergency SOS" isActive={activeUserTab === 'sos'} onClick={() => navigateTo('sos')} color="var(--rescue, #F4845F)" />
              <SidebarLink icon={<Grid />} label="Rescue Gallery" isActive={activeUserTab === 'gallery'} onClick={() => navigateTo('gallery')} />
              <SidebarLink icon={<PlaySquare />} label="Live Cams" isActive={activeUserTab === 'live'} onClick={() => navigateTo('live')} />
              <SidebarLink icon={<HeartHandshake />} label="Fund & Donate" isActive={activeUserTab === 'donate'} onClick={() => navigateTo('donate')} />
              <SidebarLink icon={<LifeBuoy />} label="Emergency Rescue" isActive={activeUserTab === 'rescue'} onClick={() => navigateTo('rescue')} />
              {/* NEW: AI Guide added to Sidebar */}
              <SidebarLink icon={<Bot />} label="AI Guide" isActive={activeUserTab === 'chat'} onClick={() => navigateTo('chat')} />
              <SidebarLink icon={<User />} label="My Profile" isActive={activeUserTab === 'profile'} onClick={() => navigateTo('profile')} />
            </>
          )}

          {activePortal === 'admin' && (
            <>
              <SidebarLink icon={<Grid />} label="Live Feed" isActive={adminView === 'queue'} onClick={() => navigateAdminTo('queue')} />
              <SidebarLink icon={<HeartHandshake />} label="Finances" isActive={adminView === 'funds'} onClick={() => navigateAdminTo('funds')} />
              <SidebarLink icon={<Video />} label="Shelter Monitor" isActive={adminView === 'iot'} onClick={() => navigateAdminTo('iot')} />
            </>
          )}
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid var(--border, #E8DDD0)', backgroundColor: 'var(--bg-card, #FAF4EE)' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text, #2C1F14)', opacity: 0.6, textTransform: 'uppercase' }}><Settings size={12} style={{ display: 'inline', marginRight: '5px' }}/> Portal Mode</p>
          <select value={activePortal} onChange={(e) => { setActivePortal(e.target.value); setIsSidebarOpen(false); }} style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-surface, #F3EBE1)', border: '1px solid var(--border, #E8DDD0)', color: 'var(--text, #2C1F14)', outline: 'none', fontWeight: 'bold' }}>
            <option value="user">User Portal</option>
            <option value="admin">Admin Portal</option>
          </select>
        </div>
      </div>

      {/* =========================================
          MAIN RENDER AREA
          ========================================= */}
      <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        
        {activePortal === 'user' && (
          <div style={{ height: '100%', overflowY: 'auto' }}>
            {activeUserTab === 'home' && <HomePage />}
            {activeUserTab === 'sos' && <SOSForm />}
            {activeUserTab === 'gallery' && <AnimalGallery />}
            {activeUserTab === 'live' && <Livestream />}
            {activeUserTab === 'donate' && <DonationEvents />}
            {activeUserTab === 'profile' && <UserProfile />}
            {activeUserTab === 'rescue' && <RescueQueue/>}
            {/* NEW: Render Chat component when active */}
            {activeUserTab === 'chat' && <Chatbot />}
          </div>
        )}

        {activePortal === 'admin' && (
          <div style={{ height: '100%', overflowY: 'auto' }}>
            {adminView === 'queue' && <AdminQueue />}
            {adminView === 'funds' && <FundDashboard />}
            {adminView === 'iot' && <ShelterIoT />}
          </div>
        )}
      </main>
      
    </div>
  );
}

// ------------------------------------------
// REUSABLE COMPONENTS
// ------------------------------------------

function TopNavLink({ label, isActive, onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: '20px',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: isActive ? 'var(--text, #1A1A1A)' : 'transparent',
        color: isActive ? 'white' : 'var(--text, #1A1A1A)',
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  );
}

function SidebarLink({ icon, label, isActive, onClick, color }) {
  const iconColor = color || (isActive ? 'var(--text, #2C1F14)' : 'var(--text, #2C1F14)');
  return (
    <button onClick={onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '15px', padding: '18px 25px', background: isActive ? 'var(--bg-surface, #F3EBE1)' : 'none', border: 'none', borderLeft: isActive ? `4px solid ${iconColor}` : '4px solid transparent', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s ease' }}>
      <div style={{ color: iconColor, opacity: isActive ? 1 : 0.6 }}>{icon}</div>
      <span style={{ fontSize: '1.1rem', fontWeight: isActive ? 'bold' : '500', color: isActive ? iconColor : 'var(--text, #2C1F14)', opacity: isActive ? 1 : 0.8 }}>{label}</span>
    </button>
  );
}