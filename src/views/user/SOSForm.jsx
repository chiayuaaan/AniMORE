import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { MapPin, Clock, User, Loader2, CheckCircle2, Car, Camera } from 'lucide-react'; 
import { ShaderAnimation } from '../../components/ui/shader-lines';

export default function SOSForm() {
  const [viewState, setViewState] = useState('idle'); 
  const [driverType, setDriverType] = useState(null); 
  const [notification, setNotification] = useState(null);
  
  const [formData, setFormData] = useState({
    animalType: 'dog',
    injuryLevel: 'moderate',
    description: '' // Added description field to state
  });

  const handleEmergencyClick = () => setViewState('form');

  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const [locationName, setLocationName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleGetLocation = () => {
    setIsLoading(true);
    setErrorMsg(null);

    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          const city = data.address.city || data.address.town || data.address.state || "Unknown Area";
          setLocationName(`${city}, ${data.address.country || ""}`);
        } catch (err) {
          setLocationName(`Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`);
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setErrorMsg("Please allow location permissions.");
        setIsLoading(false);
      }
    );
  }; 

  const handleSubmit = (e) => {
    e.preventDefault();
    setViewState('searching_vet'); 

    setTimeout(() => {
      if (Math.random() > 0.5) {
        triggerNotification('vet', 'Vet Student Ahmad accepted your rescue!');
      } else {
        setViewState('searching_volunteer');
        setTimeout(() => triggerNotification('volunteer', 'Community Volunteer Sarah accepted your rescue!'), 2000);
      }
    }, 2000);
  };

  const triggerNotification = (type, message) => {
    setDriverType(type);
    setNotification(message);
    setViewState('tracking');
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleReset = () => {
    setViewState('idle');
    setLocationName(null);
    setPreviewUrl(null);
    setDriverType(null);
    setNotification(null);
    setFormData({ animalType: 'dog', injuryLevel: 'moderate', description: '' }); // Reset description too
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  // Reusable sleek glass panel style
  const glassPanelStyle = {
    width: '100%',
    backgroundColor: 'rgba(15, 15, 20, 0.65)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    boxSizing: 'border-box'
  };

  return (
    // 1. MAIN WRAPPER: Ensures the page takes up the full viewport minus your top nav bar
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      minHeight: 'calc(100vh - 64px)', // Adjusted for ATHLETA navbar
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      overflow: 'hidden', 
      backgroundColor: '#050505', 
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* 2. EDGE-TO-EDGE SHADER: Hardcoded to cover 100% of the parent container */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 0 
      }}>
        <ShaderAnimation />
      </div>

      {/* 3. FOREGROUND CONTENT: Floats securely over the shader */}
      <div style={{ 
        position: 'relative', 
        zIndex: 10, 
        width: '100%', 
        maxWidth: '450px', 
        padding: '20px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '24px',
        boxSizing: 'border-box'
      }}>

        <style>
          {`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .loading-spin { animation: spin 1s linear infinite; }
            * { box-sizing: border-box; }
          `}
        </style>

        {/* NOTIFICATION OVERLAY */}
        {notification && (
          <div style={{
            position: 'absolute', top: '20px', left: '20px', right: '20px', zIndex: 50,
            display: 'flex', alignItems: 'center', gap: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(34, 197, 94, 0.4)', borderRadius: '16px',
            padding: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
          }}>
            <CheckCircle2 size={24} color="#4ade80" />
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>Driver Found!</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#d1d5db' }}>{notification}</p>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', letterSpacing: '-0.5px', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
            {viewState === 'idle' ? 'Emergency Rescue' : 
             viewState === 'form' ? 'Rescue Details' : 
             viewState === 'searching_vet' ? 'Locating Vet...' : 
             viewState === 'searching_volunteer' ? 'Locating Volunteer...' : 
             'Rescue En Route'}
          </h2>
          {viewState === 'tracking' && (
            <button onClick={handleReset} style={{ 
              position: 'absolute', right: '10px', background: 'transparent', border: 'none', 
              color: '#60a5fa', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' 
            }}>
              Reset
            </button>
          )}
        </div>

        {/* STATE 1: IDLE BUTTON */}
        {viewState === 'idle' && (
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center', padding: '60px 0' }}>
            <CommandButton onClick={handleEmergencyClick} />
          </div>
        )}

        {/* STATE 2: FORM */}
        {viewState === 'form' && (
          <div style={glassPanelStyle}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
              
              {/* Animal Type */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#e5e7eb' }}>Animal Type</label>
                <select 
                  value={formData.animalType} onChange={(e) => setFormData({...formData, animalType: e.target.value})}
                  style={{ 
                    width: '100%', padding: '12px 16px', borderRadius: '12px', 
                    border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', 
                    color: '#ffffff', fontSize: '16px', outline: 'none' 
                  }}
                >
                  <option value="dog" style={{ color: 'black' }}>Dog</option>
                  <option value="cat" style={{ color: 'black' }}>Cat</option>
                  <option value="bird" style={{ color: 'black' }}>Bird</option>
                  <option value="other" style={{ color: 'black' }}>Other</option>
                </select>
              </div>

              {/* Photo Upload */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#e5e7eb' }}>Photo</label>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />

                {previewUrl ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                    <img src={previewUrl} alt="Preview" style={{ 
                      width: '100%', maxHeight: '250px', objectFit: 'cover', 
                      borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' 
                    }} />
                    <button type="button" onClick={handleButtonClick} style={{ 
                      background: 'none', border: 'none', color: '#60a5fa', 
                      fontWeight: 'bold', cursor: 'pointer', padding: 0 
                    }}>Change Photo</button>
                  </div>
                ):(
                  <button type="button" onClick={handleButtonClick} style={{ 
                    display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                    padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', 
                    backgroundColor: 'rgba(255,255,255,0.05)', color: '#ffffff', fontWeight: 'bold', cursor: 'pointer' 
                  }}>
                    <Camera size={20} /> Upload Photo
                  </button>
                )}
              </div>

              {/* Location */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#e5e7eb' }}>Location</label>
                {errorMsg && <span style={{ fontSize: '12px', color: '#f87171' }}>{errorMsg}</span>}
                
                {locationName ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', width: '100%' }}>
                    <div style={{ 
                      display: 'flex', width: '100%', alignItems: 'center', gap: '8px', 
                      padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.5)', 
                      backgroundColor: 'rgba(59,130,246,0.15)', color: '#dbeafe' 
                    }}>
                      <MapPin size={18} /> <span style={{ fontSize: '14px' }}>{locationName}</span>
                    </div>
                    <button type="button" onClick={() => setLocationName(null)} style={{ 
                      background: 'none', border: 'none', color: '#9ca3af', 
                      fontWeight: 'bold', cursor: 'pointer', padding: 0 
                    }}>Clear Location</button>
                  </div>
                ):(
                  <button type="button" onClick={handleGetLocation} disabled={isLoading} style={{ 
                    display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                    padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', 
                    backgroundColor: 'rgba(255,255,255,0.05)', color: '#ffffff', fontWeight: 'bold', 
                    cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 
                  }}>
                    {isLoading ? <Loader2 size={20} className="loading-spin" /> : <MapPin size={20} />} 
                    {isLoading ? 'Finding you...' : 'Use Live GPS'}
                  </button>
                )}
              </div>

              {/* Injury Level */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#e5e7eb' }}>
                  Injury Level: <span style={{ color: '#f87171' }}>{formData.injuryLevel.toUpperCase()}</span>
                </label>
                <input 
                  type="range" min="1" max="3" step="1" defaultValue="2"
                  onChange={(e) => setFormData({...formData, injuryLevel: ['mild', 'moderate', 'severe'][e.target.value - 1]})}
                  style={{ width: '100%', accentColor: '#ef4444' }}
                />
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', padding: '0 4px', fontSize: '12px', color: '#9ca3af', fontWeight: '500' }}>
                  <span>Mild</span><span>Moderate</span><span>Severe</span>
                </div>
              </div>

              {/* Description / Additional Notes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#e5e7eb' }}>Description (Optional)</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="E.g., It's hiding under a blue car, looks very scared..."
                  rows={3}
                  style={{ 
                    width: '100%', padding: '12px 16px', borderRadius: '12px', 
                    border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', 
                    color: '#ffffff', fontSize: '15px', outline: 'none', resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Submit Button */}
              <button type="submit" style={{ 
                marginTop: '16px', width: '100%', padding: '16px', borderRadius: '12px', 
                border: '1px solid rgba(239,68,68,0.5)', backgroundColor: 'rgba(220,38,38,0.85)', 
                color: '#ffffff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', 
                boxShadow: '0 4px 14px rgba(220,38,38,0.4)', transition: '0.2s'
              }}>
                Dispatch Rescue Team
              </button>
            </form>
          </div>
        )}

        {/* STATE 3: SEARCHING */}
        {(viewState === 'searching_vet' || viewState === 'searching_volunteer') && (
          <div style={{ ...glassPanelStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center' }}>
            <Loader2 size={48} color="#f87171" className="loading-spin" style={{ marginBottom: '16px' }} />
            <p style={{ fontSize: '18px', fontWeight: '500', color: '#ffffff', margin: 0, lineHeight: 1.5 }}>
              {viewState === 'searching_vet' ? 'Pinging nearby Vet Students...' : 'No Vets available.\nRouting to Volunteers...'}
            </p>
          </div>
        )}

        {/* STATE 4: TRACKING */}
        {viewState === 'tracking' && (
          <div style={{ display: 'flex', width: '100%', flexDirection: 'column', gap: '16px' }}>
            
            {/* Map Panel */}
            <div style={{ ...glassPanelStyle, padding: '8px' }}>
              <div style={{ position: 'relative', height: '250px', width: '100%', overflow: 'hidden', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <iframe width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.1)' }} src={`https://maps.google.com/maps?q=SS15+Courtyard,+Subang+Jaya&t=&z=16&ie=UTF8&iwloc=&output=embed`} allowFullScreen title="Map"></iframe>
                
                <div style={{ 
                  position: 'absolute', left: '35%', top: '40%', transform: 'translate(-50%, -50%)', 
                  display: 'flex', height: '32px', width: '32px', alignItems: 'center', justifyContent: 'center', 
                  borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', 
                  border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 0 15px rgba(255,255,255,0.2)' 
                }}>
                  <Car size={18} color="#ffffff" />
                </div>
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -100%)', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}>
                   <MapPin size={36} color="#ef4444" fill="#ffffff" />
                </div>
              </div>
            </div>

            {/* Driver Info Panel */}
            <div style={glassPanelStyle}>
              <div style={{ display: 'flex', width: '100%', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
                  <Clock size={20} color="#facc15" /> 
                  <span style={{ fontWeight: 'bold', color: '#ffffff' }}>{driverType === 'vet' ? 'Arriving in 4 min' : 'Arriving in 9 min'}</span>
                </div>
                <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    display: 'flex', height: '48px', width: '48px', flexShrink: 0, alignItems: 'center', justifyContent: 'center', 
                    borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)' 
                  }}>
                    <User size={24} color="#d1d5db" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#ffffff' }}>{driverType === 'vet' ? 'Ahmad (Vet Student)' : 'Sarah (Volunteer)'}</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#9ca3af' }}>{driverType === 'vet' ? 'White Perodua Myvi' : 'Silver Honda City'}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

// ==========================================
// Custom Clean Command Button
// ==========================================
const CommandButton = ({ onClick }) => {
  return (
    <ButtonWrapper>
      <button type="button" className="btn-clean" onClick={onClick}>
        <div className="btn-clean-content">
          <div className="btn-clean-icon">
            <svg xmlSpace="preserve" viewBox="0 0 80 80" height="40px" width="40px" xmlns="http://www.w3.org/2000/svg">
              <path d="M64,48L64,48h-8V32h8c8.836,0,16-7.164,16-16S72.836,0,64,0c-8.837,0-16,7.164-16,16v8H32v-8c0-8.836-7.164-16-16-16
          S0,7.164,0,16s7.164,16,16,16h8v16h-8l0,0l0,0C7.164,48,0,55.164,0,64s7.164,16,16,16c8.837,0,16-7.164,16-16l0,0v-8h16v7.98
          c0,0.008-0.001,0.014-0.001,0.02c0,8.836,7.164,16,16,16s16-7.164,16-16S72.836,48.002,64,48z M64,8c4.418,0,8,3.582,8,8
          s-3.582,8-8,8h-8v-8C56,11.582,59.582,8,64,8z M8,16c0-4.418,3.582-8,8-8s8,3.582,8,8v8h-8C11.582,24,8,20.417,8,16z M16,72
          c-4.418,0-8-3.582-8-8s3.582-8,8-8l0,0h8v8C24,68.418,20.418,72,16,72z M32,48V32h16v16H32z M64,72c-4.418,0-8-3.582-8-8l0,0v-8
          h7.999c4.418,0,8,3.582,8,8S68.418,72,64,72z" />
            </svg>
          </div>
          <p className="btn-clean-text">Help</p>
        </div>
      </button>
    </ButtonWrapper>
  );
}

const ButtonWrapper = styled.div`
  .btn-clean {
    position: relative;
    padding: 0;
    width: 120px;
    height: 120px;
    outline: none;
    background: transparent;
    border: none;
    cursor: pointer;
    border-radius: 30px;
    transition: 0.3s ease-in-out;
  }

  .btn-clean:hover {
    transform: scale(1.05);
  }

  .btn-clean:active {
    transform: scale(0.95);
  }

  .btn-clean-content {
    position: relative;
    display: grid;
    padding: 15px;
    width: 100%;
    height: 100%;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    border-radius: 30px;
    background-color: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    transition: 0.3s ease-in-out;
    z-index: 1;
    overflow: hidden;
  }

  .btn-clean:hover .btn-clean-content {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.25);
  }

  .btn-clean-icon {
    position: relative;
    display: flex;
    grid-column: 4;
    align-self: start;
    justify-self: end;
    transition: 0.3s ease-in-out;
  }

  .btn-clean:hover .btn-clean-icon {
    transform: translateY(-5px);
  }

  .btn-clean-icon svg {
    width: 20px;
    height: 20px;
    fill: #ffffff;
    opacity: 0.9;
  }

  .btn-clean-text {
    position: relative;
    margin: 0;
    align-self: end;
    grid-column: 1 / 5;
    grid-row: 2;
    text-align: left;
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
    opacity: 0.95;
    transition: 0.3s ease-in-out;
  }

  .btn-clean:hover .btn-clean-text {
    transform: translateY(-3px);
  }
`;