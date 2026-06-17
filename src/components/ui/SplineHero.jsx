import React, { Suspense, lazy } from 'react';

// Lazy load spline to improve initial page load speed
const Spline = lazy(() => import('@splinetool/react-spline'));

// The glowing ambient spotlight effect in the background
function Spotlight() {
  return (
    <svg
      style={{
        pointerEvents: 'none', position: 'absolute', zIndex: 1, 
        height: '169%', width: '138%', left: '-10%', top: '-20%', opacity: 0.6
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse cx="1924.71" cy="273.501" rx="1924.71" ry="273.501" transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)" fill="white" fillOpacity="0.21"></ellipse>
      </g>
      <defs>
        <filter id="filter" x="0.860352" y="0.838989" width="3785.16" height="2840.26" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur_1065_8"></feGaussianBlur>
        </filter>
      </defs>
    </svg>
  );
}

export default function SplineHero() {
  return (
    <div style={{
      width: '100%',
      minHeight: '85vh',
      backgroundColor: '#050505', // Deep dark theme matching the demo
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      borderBottom: '1px solid var(--border)'
    }}>
      <Spotlight />
      
      {/* Left content - Text & CTA */}
      <div style={{
        flex: '1 1 400px',
        padding: '80px 40px',
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: '700px'
      }}>
        <p style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--sage, #eeb8c9ff' }}>
          Our Collective Vision
        </p>
        
        <h1 style={{ margin: 0, fontSize: 'clamp(3.5rem, 8vw, 5.5rem)', fontWeight: '700', letterSpacing: '-2px', lineHeight: '1.05', color: '#f5f5f5' }}>
          AniMORE
        </h1>
        
        <p style={{ marginTop: '24px', color: '#a3a3a3', maxWidth: '500px', fontSize: '1.2rem', lineHeight: '1.6' }}>
          Every stray animal deserves a chance to be seen, loved, and saved. This platform makes it possible to rescue animals anywhere, anytime, with just a simple action. Together, we can turn compassion into real-life and give every stray a better tomorrow.
        </p>
        
        <button 
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e5e5'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
          style={{
            marginTop: '40px', alignSelf: 'flex-start', padding: '16px 32px', borderRadius: '30px', 
            backgroundColor: '#ffffff', color: '#000000', fontWeight: 'bold', border: 'none', 
            cursor: 'pointer', fontSize: '1rem', transition: 'background-color 0.2s',
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
          }}
        >
          Join Today →
        </button>
      </div>

      {/* Right content - Spline 3D Scene */}
      <div style={{
        flex: '1 1 500px',
        position: 'relative',
        minHeight: '400px',
        zIndex: 5
      }}>
        <Suspense fallback={
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '1.2rem' }}>
            <span style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid #333', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '15px' }} />
            Loading 3D Experience...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        }>
          <Spline
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            style={{ width: '100%', height: '100%' }}
          />
        </Suspense>
      </div>
    </div>
  );
}