import React, { useState } from 'react';
import { Heart, Share2, MessageCircle, Gem, Bone, Fish, Star, Crown, Plus, X, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import myLiveVideo from '../../assets/cat-live.MOV'; // <-- 1. IMPORT YOUR VIDEO HERE

export default function Livestream() {
  const [likes, setLikes] = useState(1204);
  const [diamonds, setDiamonds] = useState(50);
  const [showTopUp, setShowTopUp] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null);
  const diamondPackages = [
    { id:1, amount: 100, price: 3},
    {id: 2, amount: 500, price: 14},
    {id: 3, amount: 1000, price: 25},
  ];
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [isLiked, setIsLiked] = useState(false);

  const handleClose = () => {
    setShowTopUp(false);
    setTimeout(() => {
      setSelectedPackage(null);
      setPaymentStatus('idle');
    }, 300); 
  };

  const handlePayment = () => {
    setPaymentStatus('processing'); 

    setTimeout(() => {
      setDiamonds(prev => prev + selectedPackage.amount);
      setPaymentStatus('success');
    }, 1500);
  };

  const handleLike = () => {
    if (!isLiked) setLikes(l => l + 1);
    else setLikes(l => l - 1);
    setIsLiked(!isLiked);
  };

  const handleSendGift = (cost) => {
    if (diamonds >= cost) {
      setDiamonds(d => d - cost);
      alert(`Gift sent! -${cost} diamonds`);
    } else {
      alert("Not enough diamonds! Please top up.");
    }
  };

  return (
    <>
      <style>
        {`
          .animate-spin { animation: spin 1s linear infinite; }
          .animate-bounce { animation: bounce 1s infinite; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
          @keyframes bounce { 
            0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
            50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); }
          }
        `}
      </style>

      <div style={{ height: '100%', width: '100%', backgroundColor: '#000', position: 'relative', overflow: 'hidden' }}>
        
        {/* 1. Background Video Player */}
        <video 
          autoPlay loop muted playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
          src={myLiveVideo} /* <-- 2. USE YOUR IMPORTED VIDEO HERE */
        />

        {/* 2. Top Bar: Live Badge & Diamond Balance */}
        <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ backgroundColor: 'var(--rescue)', color: 'white', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem', animation: 'pulse-ring 2s infinite' }}>
              LIVE
            </span>
            <span style={{ color: 'white', fontSize: '0.9rem', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>1.2K Viewers</span>
          </div>

          <button 
            onClick={() => setShowTopUp(true)}
            style={{ 
              backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid var(--amber)', borderRadius: '20px', padding: '6px 12px',
              color: 'white', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
              boxShadow: '0 0 10px rgba(232, 168, 124, 0.5)' 
            }}
          >
            <Gem size={16} color="var(--amber)" /> 
            <span style={{ fontWeight: 'bold' }}>{diamonds}</span>
            <Plus size={16} color="var(--amber)" />
          </button>
        </div>

        {/* The Top-Up Popup Menu */}
        {showTopUp && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 50,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', width: '320px', color: '#333' }}>

              {paymentStatus === 'idle' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {selectedPackage && (
                      <button onClick={() => setSelectedPackage(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                        <ArrowLeft size={20} />
                      </button>
                    )}
                    <h3 style={{ margin: 0 }}>{selectedPackage ? 'Select Payment' : 'Top Up Diamonds'}</h3>
                </div>
                <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
              </div>
            )}

            {paymentStatus === 'success' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', padding: '20px 0' }}>
                <CheckCircle size={60} color="#22c55e" className="animate-bounce" />
                <h3 style={{ margin: 0, color: '#22c55e' }}>Purchase Successful!</h3>
                <p style={{ margin: 0, color: '#666', fontWeight: 'bold' }}>+{selectedPackage.amount} Diamonds added.</p>
                <button onClick={handleClose} style={{ marginTop: '15px', width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--amber, #ffbf00)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                  Awesome!
                </button>
              </div>
            ) : paymentStatus === 'processing' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', padding: '40px 0' }}>
                <Loader2 size={40} color="var(--blue, #0066cc)" className="animate-spin" />
                <p style={{ margin: 0, color: '#666', fontWeight: 'bold' }}>Processing Payment...</p>
              </div>
            ) : !selectedPackage ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {diamondPackages.map((pkg) => (
                  <button 
                    key={pkg.id} type="button" onClick={() => setSelectedPackage(pkg)} 
                    style={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', 
                      backgroundColor: '#f9f9f9', cursor: 'pointer', fontWeight: 'bold'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Gem size={18} color="var(--amber, #ffbf00)" /> {pkg.amount}
                    </span>
                    <span style={{ color: 'var(--blue, #0066cc)' }}>RM {pkg.price}</span>
                  </button>
                ))}
              </div>
            ):(
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '15px', backgroundColor: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '8px', marginBottom: '10px', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>You are purchasing</p>
                  <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                    <Gem size={18} color="var(--amber, #ffbf00)" /> {selectedPackage.amount} Diamonds for RM {selectedPackage.price}
                  </p>
                </div>

                <button type="button" onClick={handlePayment} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid transparent', backgroundColor: '#00529C', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                  Pay with Touch 'n Go eWallet
                </button>
                <button type="button" onClick={handlePayment} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                  Pay with FPX (Online Banking)
                </button>
              </div>
            )}
          </div>
        </div>
        )}

        {/* 3. Right Side Action Column */}
        <div style={{ position: 'absolute', right: '15px', bottom: '150px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', zIndex: 10 }}>
          
          <button onClick={handleLike} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'white', cursor: 'pointer' }}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '50%' }}>
              <Heart size={28} fill={isLiked ? 'var(--rose)' : 'none'} color={isLiked ? 'var(--rose)' : 'white'} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>{likes}</span>
          </button>

          <button style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'white' }}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '50%' }}>
              <MessageCircle size={28} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>84</span>
          </button>

          <button style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'white' }}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '50%' }}>
              <Share2 size={28} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Share</span>
          </button>
        </div>

        {/* 4. Bottom Information Info */}
        <div style={{ position: 'absolute', bottom: '90px', left: '15px', color: 'white', width: '70%', textShadow: '1px 1px 2px rgba(0,0,0,0.8)', zIndex: 10 }}>
          <h3 style={{ margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            @HopeShelter <span style={{ backgroundColor: 'var(--blue)', borderRadius: '50%', padding: '2px' }}><Star size={10} color="white" fill="white" /></span>
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>
            Oyen is feeling playful today! Help us reach our goal for his vet checkup tomorrow. 🐾❤️
          </p>
        </div>

        {/* 5. Bottom Gift Selector Dock */}
        <div style={{ 
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', 
          backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', padding: '0 10px', gap: '10px', overflowX: 'auto', zIndex: 10
        }}>
          <GiftOption icon={<Bone size={24} color="var(--bg-page)"/>} price={1} onClick={() => handleSendGift(1)} />
          <GiftOption icon={<Fish size={24} color="var(--blue)"/>} price={5} onClick={() => handleSendGift(5)} />
          <GiftOption icon={<Heart size={24} color="var(--rose)" fill="var(--rose)"/>} price={10} onClick={() => handleSendGift(10)} />
          <GiftOption icon={<Star size={24} color="var(--amber)" fill="var(--amber)"/>} price={20} onClick={() => handleSendGift(20)} />
          <GiftOption icon={<Crown size={24} color="gold" fill="gold"/>} price={50} onClick={() => handleSendGift(50)} />
        </div>

      </div>
    </>
  );
}

// Reusable micro-component for the gift buttons
function GiftOption({ icon, price, onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '12px', minWidth: '65px', height: '65px', cursor: 'pointer', gap: '4px'
      }}
    >
      {icon}
      <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px' }}>
        {price} <Gem size={10} color="var(--amber)" />
      </span>
    </button>
  );
}