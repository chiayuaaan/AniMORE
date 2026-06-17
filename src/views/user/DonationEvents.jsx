import { useState } from 'react';
import { createPortal } from 'react-dom';
import { HeartHandshake, X, ChevronRight } from 'lucide-react';
import styled from 'styled-components'; 

const mockCampaigns = [
  { id: 1, name: 'Oyen', issue: 'Emergency Leg Surgery', goal: 2000, raised: 1550, image: 'https://placecats.com/300/200' },
  { id: 2, name: 'Bobby', issue: 'Heartworm Treatment', goal: 800, raised: 200, image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=300&auto=format&fit=crop' },
  { id: 3, name: 'Luna', issue: 'Dental Extraction', goal: 500, raised: 450, image: 'https://placecats.com/302/200' }
];

export default function DonationEvents() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [customAmount, setCustomAmount] = useState('');

  const handleDonateSubmit = (e) => {
    e.preventDefault();
    alert(`Successfully donated RM ${customAmount} to ${selectedCampaign.name}!`);
    setSelectedCampaign(null);
    setCustomAmount('');
  };

  // Prevent invalid math characters from being typed into the number input
  const handleKeyDown = (e) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) {
      e.preventDefault();
    }
  };

  // Safely handle the amount, stripping leading zeros and preventing negatives
  const handleAmountChange = (e) => {
    const val = e.target.value;
    
    if (val === '') {
      setCustomAmount('');
      return;
    }

    const num = Number(val);
    if (num > 0) {
      setCustomAmount(num); // Number() automatically strips leading zeros
    } else if (num === 0) {
      setCustomAmount(''); // Prevent '0' from getting stuck in the input
    }
  };

  return (
    <div className="page-transition" style={{ padding: '20px', overflowY: 'auto', paddingBottom: '90px' }}>
      
      <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        
        <h2 style={{ margin: '0 0 20px 0', color: 'var(--text)' }}>Urgent Medical Funds</h2>

        {/* Campaign List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {mockCampaigns.map(campaign => {
            const progressPercent = Math.min((campaign.raised / campaign.goal) * 100, 100);
            
            return (
              <div key={campaign.id} style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                <img src={campaign.image} alt={campaign.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', color: 'var(--text)', fontSize: '1.2rem' }}>{campaign.name}</h3>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--rescue)', fontWeight: 'bold' }}>{campaign.issue}</p>
                    </div>
                  </div>

                  {/* Progress Area */}
                  <div style={{ marginTop: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 'bold' }}>
                      <span style={{ color: 'var(--amber)' }}>RM {campaign.raised} raised</span>
                      <span style={{ color: 'var(--text-muted)' }}>Goal: RM {campaign.goal}</span>
                    </div>
                    
                    <GlassProgressBar value={progressPercent} />
                  </div>

                  <StyledDonateButton onClick={() => setSelectedCampaign(campaign)}>
                    <HeartHandshake size={18} /> Donate Now
                  </StyledDonateButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TELEPORT MODAL OUT OF SCROLL CONTAINER */}
      {selectedCampaign && createPortal(
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
          backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', 
          zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          
          {/* Modal Content */}
          <div style={{ 
            width: '90%', maxWidth: '400px', backgroundColor: 'var(--bg-page)', 
            borderRadius: '24px', padding: '24px', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
            animation: 'fadeInScale 0.2s ease-out'
          }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: 'var(--text)', fontSize: '1.3rem' }}>Help {selectedCampaign.name}</h3>
              <button onClick={() => setSelectedCampaign(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                <X size={24} />
              </button>
            </div>

            <p style={{ margin: '0 0 20px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Choose an amount to donate securely.</p>

            {/* Quick Amount Selectors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
              {[10, 20, 50].map(amount => (
                <AmountButton 
                  key={amount} 
                  active={customAmount === amount}
                  onClick={() => setCustomAmount(amount)}
                >
                  RM {amount}
                </AmountButton>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div style={{ display: 'flex', alignItems: 'center', border: `2px solid ${customAmount && ![10,20,50].includes(customAmount) ? 'var(--amber)' : 'var(--border)'}`, borderRadius: '12px', padding: '10px 15px', backgroundColor: 'var(--bg-surface)', marginBottom: '20px', transition: '0.2s' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text-muted)', marginRight: '10px' }}>RM</span>
              <input 
                type="number" 
                min="1"
                placeholder="Other amount" 
                value={customAmount} 
                onChange={handleAmountChange}
                onKeyDown={handleKeyDown}
                className="hide-arrows"
                style={{ border: 'none', background: 'transparent', fontSize: '1.1rem', width: '100%', outline: 'none', color: 'var(--text)', fontWeight: 'bold' }}
              />
            </div>

            <ConfirmButton onClick={handleDonateSubmit} disabled={!customAmount || customAmount <= 0}>
              Confirm Payment <ChevronRight size={20} />
            </ConfirmButton>
          </div>
        </div>,
        document.body 
      )}

      {/* Global styles for animations and hiding the input spinners */}
      <style>
        {`
          @keyframes fadeInScale {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
          
          /* Hide up/down arrows from number input */
          .hide-arrows::-webkit-outer-spin-button,
          .hide-arrows::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .hide-arrows {
            -moz-appearance: textfield; /* Firefox */
          }
        `}
      </style>
    </div>
  );
}

// ==========================================
// CUSTOM COMPONENTS & STYLES
// ==========================================

const GlassProgressBar = ({ value }) => {
  return (
    <div style={{ 
      position: 'relative', height: '10px', width: '100%', overflow: 'hidden', 
      borderRadius: '9999px', backgroundColor: 'rgba(150, 150, 150, 0.15)', 
      backdropFilter: 'blur(4px)', border: '1px solid rgba(150, 150, 150, 0.1)'
    }}>
      <div style={{ 
        height: '100%', width: '100%', backgroundColor: 'var(--amber)', 
        transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)', 
        transform: `translateX(-${100 - (value || 0)}%)`, borderRadius: '9999px'
      }} />
    </div>
  );
};

const StyledDonateButton = styled.button`
  width: 100%;
  margin-top: 20px;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background-color: var(--text);
  color: var(--bg-page);
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition: all 0.25s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
    opacity: 0.9;
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const ConfirmButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background-color: var(--amber);
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition: all 0.25s ease;
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(var(--amber-rgb, 245, 158, 11), 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const AmountButton = styled.button`
  padding: 10px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid ${props => props.active ? 'var(--amber)' : 'var(--border)'};
  background-color: ${props => props.active ? 'var(--bg-surface)' : 'transparent'};
  color: var(--text);

  &:hover {
    border-color: var(--amber);
    background-color: var(--bg-surface);
  }
`;