import { useState } from 'react';
import { AlertTriangle, MapPin, CheckCircle2, Clock, ChevronRight, BellRing, ArrowLeft, Navigation } from 'lucide-react';

export default function RescueQueue() {
  const [requests, setRequests] = useState([]);
  const [showIncomingAlert, setShowIncomingAlert] = useState(false);
  
  // New state to track if we are looking at the map
  const [activeNavigation, setActiveNavigation] = useState(null);

  const simulateIncomingSOS = () => {
    setShowIncomingAlert(true);
    
    setTimeout(() => {
      const newRequest = {
        id: Date.now(),
        type: 'Dog',
        injury: 'Moderate',
        location: 'Bandar Perda, Bukit Mertajam', // The map will physically point here
        distance: '2.4 km',
        timeElapsed: 'Just now',
        status: 'pending'
      };
      setRequests([newRequest, ...requests]);
      setShowIncomingAlert(false);
    }, 2500);
  };

  const handleAcceptRescue = (request) => {
    // 1. Update the status in the background list
    setRequests(requests.map(req => 
      req.id === request.id ? { ...req, status: 'accepted' } : req
    ));
    // 2. Open the Navigation Map View
    setActiveNavigation(request);
  };

  // ==========================================
  // VIEW 2: FULL SCREEN NAVIGATION MAP
  // ==========================================
  if (activeNavigation) {
    // Creates a safe search URL for the Google Map iframe
    const mapQuery = encodeURIComponent(activeNavigation.location);

    return (
      <div className="page-transition" style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }}>
        
        {/* Top Header */}
        <div style={{ padding: '20px', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => setActiveNavigation(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px' }}
          >
            <ArrowLeft size={24} color="var(--text)" />
          </button>
          <h2 style={{ margin: 0, color: 'var(--text)', fontSize: '1.2rem' }}>Navigating to Rescue</h2>
        </div>

        {/* Real Interactive Google Map */}
        <div style={{ flex: 1, backgroundColor: '#e5e3df', position: 'relative' }}>
          <iframe 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`} 
            allowFullScreen 
            loading="lazy"
            title="Google Maps Navigation"
          ></iframe>
        </div>

        {/* Bottom Status Card */}
        <div style={{ padding: '20px', backgroundColor: 'var(--bg-page)', borderTop: '1px solid var(--border)', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', marginTop: '-20px', zIndex: 10, boxShadow: '0 -4px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
            <div>
              <span style={{ backgroundColor: 'var(--rescue)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                {activeNavigation.injury} Injury
              </span>
              <h3 style={{ margin: '8px 0 0 0', color: 'var(--text)' }}>{activeNavigation.type} Rescue</h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <strong style={{ display: 'block', fontSize: '1.2rem', color: 'var(--text)' }}>8 min</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{activeNavigation.distance}</span>
            </div>
          </div>
          
          <button style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--sage)', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <Navigation size={20} /> Slide to Arrive
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: RADAR LIST (Default)
  // ==========================================
  return (
    <div className="page-transition" style={{ padding: '20px', overflowY: 'auto', paddingBottom: '90px', height: '100%', position: 'relative' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: 'var(--text)' }}>Rescue Radar</h2>
        <button 
          onClick={simulateIncomingSOS} disabled={showIncomingAlert}
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', padding: '8px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--blue)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <BellRing size={16} /> Simulate SOS
        </button>
      </div>

      {showIncomingAlert && (
        <div className="page-transition" style={{ backgroundColor: 'var(--rescue)', borderRadius: '12px', padding: '15px', display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '20px', boxShadow: '0 10px 20px rgba(244, 132, 95, 0.3)', color: 'white', animation: 'pulse-ring 2s infinite' }}>
          <AlertTriangle size={28} color="white" />
          <div>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>Incoming Broadcast...</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>No Vet Students available. Routing emergency request to nearby volunteers.</p>
          </div>
        </div>
      )}

      {requests.length === 0 && !showIncomingAlert && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '60px' }}>
          <MapPin size={48} color="var(--border)" style={{ marginBottom: '10px' }} />
          <p>No active rescue broadcasts in your area.</p>
          <p style={{ fontSize: '0.85rem' }}>Stay on standby!</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {requests.map((req) => (
          <div key={req.id} className="page-transition" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '20px', border: `2px solid ${req.status === 'accepted' ? 'var(--sage)' : 'var(--amber)'}`, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '12px' }}>
              <div>
                <span style={{ backgroundColor: req.status === 'accepted' ? 'var(--sage)' : 'var(--amber)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {req.status === 'accepted' ? 'En Route' : 'Urgent Volunteer Needed'}
                </span>
                <h3 style={{ margin: '10px 0 0 0', color: 'var(--text)' }}>{req.type} Rescue</h3>
              </div>
              <span style={{ color: 'var(--rescue)', fontWeight: 'bold', fontSize: '0.9rem' }}>{req.injury}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <MapPin size={16} /> {req.location} <strong style={{ color: 'var(--text)' }}>({req.distance})</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <Clock size={16} /> Broadcasted {req.timeElapsed}
              </div>
            </div>

            {req.status === 'pending' ? (
              <button 
                onClick={() => handleAcceptRescue(req)}
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--text)', color: 'var(--bg-page)', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                Accept & Navigate <ChevronRight size={18} />
              </button>
            ) : (
              <button 
                onClick={() => setActiveNavigation(req)}
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid var(--sage)', backgroundColor: 'transparent', color: 'var(--sage)', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                <CheckCircle2 size={18} /> Resume Navigation
              </button>
            )}
            
          </div>
        ))}
      </div>

    </div>
  );
}