import { User, Star, Heart, Settings, ChevronRight, Bell, Shield, LogOut } from 'lucide-react';

export default function UserProfile() {
  // Basic user mock data
  const user = {
    name: 'Chiayuan',
    type: 'Premium',
    following: 14,
    rescues: 2
  };

  return (
    <div className="page-transition" style={{ padding: '20px', overflowY: 'auto', paddingBottom: '90px', paddingTop: '40px' }}>
      <h2 style={{ margin: '0 0 20px 0', color: 'var(--text)' }}>Profile</h2>

      {/* User ID Card */}
      <div style={{ 
        backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '20px', 
        border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '20px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.02)', marginBottom: '30px'
      }}>
        
        {/* Avatar */}
        <div style={{ 
          width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'var(--bg-surface)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--amber)' 
        }}>
          <User size={32} color="var(--text-muted)" />
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 5px 0', color: 'var(--text)', fontSize: '1.4rem' }}>{user.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ 
              backgroundColor: 'var(--amber)', color: 'white', padding: '4px 10px', 
              borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px'
            }}>
              <Star size={12} fill="white" /> {user.type}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <Heart size={24} color="var(--rose)" style={{ marginBottom: '5px' }} />
          <h4 style={{ margin: 0, color: 'var(--text)', fontSize: '1.2rem' }}>{user.following}</h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Animals Followed</span>
        </div>
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <Shield size={24} color="var(--sage)" style={{ marginBottom: '5px' }} />
          <h4 style={{ margin: 0, color: 'var(--text)', fontSize: '1.2rem' }}>{user.rescues}</h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rescues Supported</span>
        </div>
      </div>

      {/* Settings Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h4 style={{ margin: '0 0 10px 5px', color: 'var(--text-muted)' }}>Account Settings</h4>
        
        <SettingsRow icon={<Bell size={20} color="var(--blue)" />} label="Notifications" />
        <SettingsRow icon={<Settings size={20} color="var(--text-muted)" />} label="General Preferences" />
        <SettingsRow icon={<LogOut size={20} color="var(--rescue)" />} label="Log Out" hideArrow />
      </div>
    </div>
  );
}

// Reusable row for the checklist
function SettingsRow({ icon, label, hideArrow }) {
  return (
    <button style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px',
      backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)',
      cursor: 'pointer', width: '100%', textAlign: 'left'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {icon}
        <span style={{ color: 'var(--text)', fontWeight: 'bold' }}>{label}</span>
      </div>
      {!hideArrow && <ChevronRight size={20} color="var(--text-muted)" />}
    </button>
  );
}