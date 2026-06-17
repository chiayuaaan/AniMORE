import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, X, AlertTriangle, Video, VideoOff, Activity, 
  Thermometer, Droplets, HardDrive, Clock
} from 'lucide-react';
import cctv1 from '../../assets/cctv1.MOV';
import cctv2 from '../../assets/cctv2.MOV';
import cctv3 from '../../assets/cctv3.MOV';

// --- MOCK DATA ---
const INITIAL_CAMERAS = [
  { id: 'CAM-01', shelter: 'Paws Shelter', zone: 'Main Hall', status: 'Online', temp: '28°C', hum: '65%', videoSrc: cctv1},
  { id: 'CAM-02', shelter: 'Paws Shelter', zone: 'Recovery Ward', status: 'Online', temp: '29°C', hum: '60%', videoSrc: cctv2},
  { id: 'CAM-03', shelter: 'Paws Shelter', zone: 'Outdoor Play', status: 'Alert', temp: '30°C', hum: '55%', videoSrc: cctv3},
  { id: 'CAM-04', shelter: 'VetCare PJ', zone: 'Reception', status: 'Online', temp: '25°C', hum: '50%', videoSrc: cctv1},
  { id: 'CAM-05', shelter: 'VetCare PJ', zone: 'Surgery Room', status: 'Online', temp: '22°C', hum: '45%', videoSrc: cctv1},
  { id: 'CAM-06', shelter: 'VetCare PJ', zone: 'Kennels', status: 'Degraded', temp: '26°C', hum: '60%', videoSrc: cctv2},
  { id: 'CAM-07', shelter: 'Subang Animal Hospital', zone: 'Entry', status: 'Online', temp: '27°C', hum: '65%', videoSrc: cctv3},
  { id: 'CAM-08', shelter: 'Subang Animal Hospital', zone: 'Ward A', status: 'Offline', temp: '--', hum: '--'},
  { id: 'CAM-09', shelter: 'Bangsar Shelter', zone: 'Main', status: 'Online', temp: '28°C', hum: '60%', videoSrc: cctv1},
];

const RECENT_ALERTS = [
  { id: 1, time: '14:31:45', cam: 'CAM-03', issue: 'Motion detected (Restricted Area)', active: true },
  { id: 2, time: '12:05:10', cam: 'CAM-08', issue: 'Camera connection lost', active: false },
  { id: 3, time: '09:14:22', cam: 'CAM-05', issue: 'Temperature spike (29°C)', active: false },
];

// --- CAMERA CARD COMPONENT ---
const CameraCard = ({ camera }) => {
  const [time, setTime] = useState('');

  // Live clock updating every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
      const timeStr = now.toLocaleTimeString('en-GB', { hour12: false });
      setTime(`${dateStr} · ${timeStr}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Status Styles
  let borderColor = '#2a2a2a';
  let dotColor = '#C2FF47';
  let pulseClass = '';

  if (camera.status === 'Offline') {
    borderColor = '#cc0000';
    dotColor = '#cc0000';
  } else if (camera.status === 'Degraded') {
    dotColor = '#FFAA00';
  } else if (camera.status === 'Alert') {
    borderColor = '#C2FF47';
    pulseClass = 'animate-border-pulse';
  }

  return (
    <div className={`cam-card ${pulseClass}`} style={{ border: `1px solid ${borderColor}` }}>
      
      {/* Top Bar */}
      <div className="cam-header">
        <span style={{ fontWeight: 600, fontSize: '13px', color: '#fff' }}>{camera.shelter}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={12} color={dotColor} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: dotColor }}></div>
        </div>
      </div>

      {/* Video Area */}
      <div className="cam-video">
        {/* CSS Scanline */}
        {camera.status !== 'Offline' && <div className="scanline" style={{ zIndex: 5 }}></div>}
        
        {/* 🌟 FIXED VIDEO PLAYER CSS 🌟 */}
        {camera.videoSrc && camera.status !== 'Offline' && (
          <video 
            src={camera.videoSrc}
            autoPlay loop muted playsInline
            style={{ 
              position: 'absolute', // Keeps it anchored behind overlays
              top: 0, left: 0, zIndex: 1, 
              width: '100%', height: '100%', objectFit: 'cover', 
              opacity: camera.status === 'Degraded' ? 0.6 : 0.85 
            }}
          />
        )}

        {/* Offline Overlay */}
        {camera.status === 'Offline' && (
          <div className="offline-overlay">
            <VideoOff size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
            <span>OFFLINE</span>
          </div>
        )}

        {/* Cam ID (Top Left) */}
        <div className="cam-overlay top-left" style={{ fontFamily: 'monospace', fontSize: '12px', zIndex: 10 }}>
          {camera.id}
        </div>

        {/* REC Indicator (Top Right) */}
        {camera.status !== 'Offline' && (
          <div className="cam-overlay top-right rec-indicator" style={{ zIndex: 10 }}>
            <div className="rec-dot"></div> REC
          </div>
        )}

        {/* Timestamp (Bottom Left) */}
        <div className="cam-overlay bottom-left" style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.05em', zIndex: 10 }}>
          {camera.status === 'Offline' ? '-- -- ---- · --:--:--' : time}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="cam-footer">
        <div>
          <span style={{ color: '#888', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>ZONE</span>
          <p style={{ margin: 0, color: '#fff', fontSize: '13px', fontWeight: 600 }}>{camera.zone}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#888' }}>
            <Thermometer size={14} /> <span style={{ fontSize: '12px', color: '#fff' }}>{camera.temp}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#888' }}>
            <Droplets size={14} /> <span style={{ fontSize: '12px', color: '#fff' }}>{camera.hum}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function ShelterIoT() {
  const [showAlert, setShowAlert] = useState(true);
  
  // Calculate stats
  const onlineCount = INITIAL_CAMERAS.filter(c => c.status === 'Online' || c.status === 'Alert').length;
  const offlineCount = INITIAL_CAMERAS.filter(c => c.status === 'Offline').length;
  const degradedCount = INITIAL_CAMERAS.filter(c => c.status === 'Degraded').length;

  return (
    <>
      <style>{`
        /* Scoped Dark Mode Design System for IoT Page */
        .iot-monitor {
          --bg-dark: #0F0F0F;
          --surface-dark: #1A1A1A;
          --text-dark: #FFFFFF;
          --text-muted: #888888;
          --border-dark: #2a2a2a;
          --accent: #C2FF47;
          --danger: #cc0000;
          font-family: 'Urbanist', sans-serif;
          background-color: var(--bg-dark);
          color: var(--text-dark);
          min-height: 100vh;
        }

        /* Base Typography */
        .iot-title { font-size: 28px; font-weight: 700; color: var(--text-dark); margin: 0; }
        .iot-subtitle { font-size: 14px; font-weight: 400; color: var(--text-muted); margin: 4px 0 0 0; }
        .iot-section-label { font-size: 11px; font-weight: 700; color: #AAA; letter-spacing: 0.08em; text-transform: uppercase; margin: 0; }
        
        /* Layout */
        .iot-content { padding: 32px; max-width: 1400px; margin: 0 auto; }
        .iot-grid-layout {
          display: grid;
          grid-template-columns: 1fr 280px; /* Enforced constraint: CSS Grid, NO fixed positioning */
          gap: 24px;
          margin-top: 24px;
          align-items: start;
        }

        /* Camera Grid */
        .cam-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        /* Camera Card Styles */
        .cam-card {
          background-color: var(--surface-dark);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .cam-header {
          padding: 10px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-dark);
          background-color: #111;
        }
        .cam-video {
          position: relative;
          height: 180px;
          background-color: #050505;
          /* Static noise pattern */
          background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 4px 4px;
          overflow: hidden;
        }
        .cam-overlay {
          position: absolute;
          color: #fff;
          text-shadow: 1px 1px 2px #000;
          z-index: 10;
        }
        .top-left { top: 8px; left: 8px; }
        .top-right { top: 8px; right: 8px; }
        .bottom-left { bottom: 8px; left: 8px; }
        
        .rec-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          font-size: 11px;
          color: #ff4444;
        }
        .rec-dot {
          width: 8px; height: 8px; background-color: #ff4444; border-radius: 50%;
          animation: blink 1s step-end infinite;
        }

        .offline-overlay {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background-color: rgba(204,0,0,0.1); color: #cc0000; font-weight: 700; font-size: 14px; letter-spacing: 2px;
          z-index: 5;
        }

        .cam-footer {
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-top: 1px solid var(--border-dark);
        }

        /* Side Panel */
        .side-panel-card {
          background-color: var(--surface-dark);
          border: 1px solid var(--border-dark);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .sensor-row { margin-bottom: 16px; }
        .sensor-header { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; }
        .sensor-track { height: 6px; background-color: #333; border-radius: 3px; overflow: hidden; }
        .sensor-fill { height: 100%; background-color: var(--accent); }

        /* Animations */
        @keyframes scanline {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        .scanline {
          position: absolute;
          left: 0; right: 0; height: 2px;
          background: rgba(255,255,255,0.1);
          box-shadow: 0 0 10px rgba(255,255,255,0.2);
          animation: scanline 4s linear infinite;
          z-index: 5;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes borderPulse {
          0% { box-shadow: 0 0 0 0 rgba(194, 255, 71, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(194, 255, 71, 0); }
          100% { box-shadow: 0 0 0 0 rgba(194, 255, 71, 0); }
        }
        .animate-border-pulse {
          animation: borderPulse 2s infinite;
        }

        /* Responsive tweaks */
        @media (max-width: 1100px) {
          .iot-grid-layout { grid-template-columns: 1fr; }
          .cam-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .cam-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="iot-monitor">
        
        {/* ALERT BANNER */}
        {showAlert && (
          <div style={{ 
            backgroundColor: 'var(--accent)', color: 'var(--surface-dark)', 
            padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, fontSize: '14px' }}>
              <AlertTriangle size={18} />
              ⚠ Motion detected — Paws Shelter, Outdoor Play · CAM-03 · 14:31:45
            </div>
            <button onClick={() => setShowAlert(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--surface-dark)' }}>
              <X size={20} />
            </button>
          </div>
        )}

        {/* STATUS BAR */}
        <div style={{ 
          backgroundColor: 'var(--surface-dark)', borderBottom: '1px solid var(--border-dark)', 
          padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '24px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
            <span style={{ color: '#C2FF47' }}>● {onlineCount} cameras online</span>
            <span style={{ color: '#cc0000' }}>● {offlineCount} cameras offline</span>
            <span style={{ color: '#FFAA00' }}>◐ {degradedCount} degraded signal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <span>Last refresh: 2s ago</span>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        <div className="iot-content">
          
          <div style={{ marginBottom: '16px' }}>
            <h1 className="iot-title">Shelter Monitor</h1>
            <p className="iot-subtitle">Live IoT feed from partner shelters</p>
          </div>

          {/* MAIN LAYOUT: Grid 1fr 280px */}
          <div className="iot-grid-layout">
            
            {/* LEFT: CAMERA GRID */}
            <div className="cam-grid">
              {INITIAL_CAMERAS.map(cam => (
                <CameraCard key={cam.id} camera={cam} />
              ))}
            </div>

            {/* RIGHT: SIDE PANEL */}
            <div>
              {/* Sensor Readings Card */}
              <div className="side-panel-card">
                <p className="iot-section-label" style={{ marginBottom: '20px' }}>SENSOR READINGS</p>
                
                {/* Shelter 1 */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#fff' }}>Paws Shelter</h4>
                  <div className="sensor-row">
                    <div className="sensor-header">
                      <span style={{ color: '#888' }}>Temperature</span>
                      <span style={{ color: '#fff', fontWeight: 600 }}>29.5°C</span>
                    </div>
                    <div className="sensor-track"><div className="sensor-fill" style={{ width: '75%' }}></div></div>
                  </div>
                  <div className="sensor-row">
                    <div className="sensor-header">
                      <span style={{ color: '#888' }}>Humidity</span>
                      <span style={{ color: '#fff', fontWeight: 600 }}>60%</span>
                    </div>
                    <div className="sensor-track"><div className="sensor-fill" style={{ width: '60%' }}></div></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderTop: '1px solid #2a2a2a', paddingTop: '12px', marginTop: '12px' }}>
                    <span style={{ color: '#888' }}>Last Feeding</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>11:30 AM</span>
                  </div>
                </div>

                {/* Shelter 2 */}
                <div>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#fff' }}>VetCare PJ</h4>
                  <div className="sensor-row">
                    <div className="sensor-header">
                      <span style={{ color: '#888' }}>Temperature</span>
                      <span style={{ color: '#fff', fontWeight: 600 }}>24.0°C</span>
                    </div>
                    <div className="sensor-track"><div className="sensor-fill" style={{ width: '50%', backgroundColor: '#fff' }}></div></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderTop: '1px solid #2a2a2a', paddingTop: '12px', marginTop: '12px' }}>
                    <span style={{ color: '#888' }}>Motion Zones</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#C2FF47' }}></div>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#C2FF47' }}></div>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#333' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alerts Log Card */}
              <div className="side-panel-card">
                <p className="iot-section-label" style={{ marginBottom: '16px' }}>RECENT ALERTS LOG</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {RECENT_ALERTS.map(alert => (
                    <div key={alert.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ 
                        width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                        backgroundColor: alert.active ? '#C2FF4720' : '#2a2a2a',
                        color: alert.active ? '#C2FF47' : '#888',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {alert.active ? <AlertTriangle size={16} /> : <Clock size={16} />}
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 600, color: alert.active ? '#fff' : '#888' }}>
                          {alert.issue}
                        </p>
                        <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#666', fontWeight: 600, fontFamily: 'monospace' }}>
                          <span>{alert.cam}</span>
                          <span>·</span>
                          <span>{alert.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* FOOTER BAR */}
        <div style={{ 
          borderTop: '1px solid var(--border-dark)', backgroundColor: 'var(--surface-dark)', 
          padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <HardDrive size={16} color="#888" />
              <div style={{ width: '150px', height: '6px', backgroundColor: '#333', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '42%', height: '100%', backgroundColor: '#fff' }}></div>
              </div>
              <span style={{ fontSize: '12px', color: '#888', fontWeight: 600 }}>Storage: 847 GB / 2 TB</span>
            </div>
            <span style={{ fontSize: '12px', color: '#888', fontWeight: 600 }}>Retention: 7 days</span>
          </div>
          <span style={{ fontSize: '12px', color: '#888', fontWeight: 600 }}>All times in MYT (UTC+8)</span>
        </div>

      </div>
    </>
  );
}