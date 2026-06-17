import React, { useState, createContext, useContext } from 'react';
import { Search, MapPin, Heart, ArrowLeft, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import cat1 from '../../assets/Bimay.jpg'
import cat2 from '../../assets/Bobbi.JPG'
import dog1 from '../../assets/Milo.jpeg'
import dog2 from '../../assets/Pho.jpeg'

// Expanded Mock Data (8 items) to perfectly demonstrate 2 rows of 4 on desktop
const mockAnimals = [
  { id: 1, name: 'Bimay', species: 'Cat', shelter: 'Hope Shelter', status: 'Available', image: cat1, age: '2 Years', desc: 'A very friendly orange tabby rescued from a drain. Loves head scratches.' },
  { id: 2, name: 'Milo', species: 'Dog', shelter: 'Pawsome Care', status: 'In Treatment', image: dog1, age: '4 Months', desc: 'Recovering from a leg injury. Very playful despite the cast.' },
  { id: 3, name: 'Bobbi', species: 'Cat', shelter: 'Hope Shelter', status: 'Available', image: cat2, age: '1 Year', desc: 'Quiet and sweet. Needs a calm home.' },
  { id: 4, name: 'Pho', species: 'Dog', shelter: 'Safe Haven', status: 'Adopted', image: dog2, age: '3 Years', desc: 'A loyal companion who loves long walks.' },
  { id: 5, name: 'Luna', species: 'Cat', shelter: 'Pawsome Care', status: 'Available', image: cat1, age: '1.5 Years', desc: 'Very playful and loves chasing feather toys.' },
  { id: 6, name: 'Max', species: 'Dog', shelter: 'Hope Shelter', status: 'In Treatment', image: dog1, age: '5 Years', desc: 'A gentle giant who needs a loving and patient home.' },
  { id: 7, name: 'Bella', species: 'Dog', shelter: 'Safe Haven', status: 'Available', image: dog2, age: '2 Years', desc: 'Loves treats, belly rubs, and learning new tricks.' },
  { id: 8, name: 'Oliver', species: 'Cat', shelter: 'Hope Shelter', status: 'Adopted', image: cat2, age: '3 Months', desc: 'Very tiny, very loud, and extremely affectionate.' }
];

// Safe CSS array (NO backticks) for responsive layout
// Using aspect-ratio (percentages) instead of fixed heights to perfectly scale on iPhones!
const GALLERY_STYLES = [
  ".animal-grid { display: grid; grid-template-columns: 1fr; gap: 15px; width: 100%; }", 
  ".animal-card-img { width: 100%; aspect-ratio: 1 / 1; object-fit: cover; display: block; }", 
  ".animal-card-content { padding: 12px; display: flex; flex-direction: column; gap: 6px; box-sizing: border-box; }",
  ".animal-card-title { font-size: 1.1rem; margin: 0; }",
  "@media (min-width: 480px) {", 
  "  .animal-grid { grid-template-columns: repeat(2, 1fr); }",
  "}",
  "@media (min-width: 768px) {",
  "  .animal-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; }",
  "  .animal-card-img { aspect-ratio: 4 / 3; }", 
  "  .animal-card-content { padding: 16px; gap: 8px; }",
  "  .animal-card-title { font-size: 1.25rem; }",
  "}",
  "@media (min-width: 1024px) {",
  "  .animal-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; }",
  "  .animal-card-img { aspect-ratio: 4 / 3; }",
  "  .animal-card-title { font-size: 1.4rem; }",
  "}"
].join("\n");

export default function AnimalGallery() {
  const [filter, setFilter] = useState('All');
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  // Filter logic
  const filteredAnimals = mockAnimals.filter(animal => 
    filter === 'All' ? true : animal.species === filter
  );

  // VIEW 2: Detailed Profile
  if (selectedAnimal) {
    return (
      <div style={{ width: '100%', maxWidth: '100vw', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)', overflowX: 'hidden', overflowY: 'auto', position: 'relative', boxSizing: 'border-box' }}>
        <button 
          onClick={() => setSelectedAnimal(null)}
          style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
        >
          <ArrowLeft size={24} color="var(--text)" />
        </button>
        
        {/* Changed from fixed 350px to percentage/viewport-relative height so it scales fluidly on iPhone */}
        <img src={selectedAnimal.image} alt={selectedAnimal.name} style={{ width: '100%', height: 'clamp(250px, 40vh, 450px)', objectFit: 'cover', display: 'block' }} />
        
        {/* Added boxSizing: 'border-box' so width: '100%' + padding: '20px' does not cause horizontal overflow */}
        <div style={{ padding: '20px 20px 100px 20px', display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '800px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--text)' }}>{selectedAnimal.name}</h1>
            <span style={{ 
              padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold',
              backgroundColor: selectedAnimal.status === 'Available' ? 'var(--sage)' : 'var(--amber)',
              color: 'white', whiteSpace: 'nowrap'
            }}>
              {selectedAnimal.status}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '15px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Info size={16}/> {selectedAnimal.species} • {selectedAnimal.age}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={16}/> {selectedAnimal.shelter}</span>
          </div>

          <div style={{ padding: '15px', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: "1px solid var(--border)", marginTop: '10px', boxSizing: 'border-box', width: '100%' }}>
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--text)' }}>About {selectedAnimal.name}</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.5' }}>{selectedAnimal.desc}</p>
          </div>

          {selectedAnimal.status === 'Available' && (
            <button style={{ 
              marginTop: '20px', padding: '15px', borderRadius: '8px', border: 'none', 
              backgroundColor: 'var(--rose)', color: 'white', fontWeight: 'bold', fontSize: '1.1rem',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
              cursor: 'pointer', width: '100%', boxSizing: 'border-box'
            }}>
              <Heart size={20} /> Apply to Adopt
            </button>
          )}
        </div>
      </div>
    );
  }

  // VIEW 1: Grid Gallery
  return (
    // OUTERMOST KILL-SWITCH WRAPPER: Forces 100vw and hidden horizontal overflow
    <div style={{ width: '100%', maxWidth: '100vw', height: '100%', overflowX: 'hidden', overflowY: 'auto', boxSizing: 'border-box', backgroundColor: 'var(--bg-page)' }}>
      
      {/* INNER WRAPPER: Houses the padding so it doesn't expand the outermost container */}
      <div style={{ padding: '20px', paddingBottom: '100px', maxWidth: '1400px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Inject responsive CSS securely */}
        <style dangerouslySetInnerHTML={{ __html: GALLERY_STYLES }} />

        <h2 style={{ margin: '0 0 20px 0', color: 'var(--text)' }}>Rescued Animals</h2>

        {/* FULL-WIDTH RESPONSIVE SWITCH COMPONENT */}
        <div style={{ marginBottom: '30px', width: '100%', maxWidth: '600px', margin: '0 auto 30px auto', boxSizing: 'border-box' }}>
          <Switch value={filter} onChange={setFilter}>
            <Switch.Control value="All" label="All" />
            <Switch.Control value="Dog" label="Dog" />
            <Switch.Control value="Cat" label="Cat" />
            <Switch.Control value="Bird" label="Bird" />
            <Switch.Control value="Other" label="Other" />
          </Switch>
        </div>

        {/* Animal Grid using the new responsive CSS classes */}
        <div className="animal-grid">
          {filteredAnimals.map(animal => (
            <div 
              key={animal.id} 
              onClick={() => setSelectedAnimal(animal)}
              style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <img src={animal.image} alt={animal.name} className="animal-card-img" />
              <div className="animal-card-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                  <strong className="animal-card-title" style={{ color: 'var(--text)' }}>{animal.name}</strong>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <MapPin size={14} style={{ flexShrink: 0 }} /> 
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{animal.shelter}</span>
                </span>
                <span style={{ 
                  fontSize: '0.8rem', padding: '6px 12px', borderRadius: '12px', marginTop: '8px', alignSelf: 'flex-start', fontWeight: 'bold',
                  backgroundColor: animal.status === 'Available' ? 'var(--sage)' : 'var(--bg-surface)',
                  color: animal.status === 'Available' ? 'white' : 'var(--text-muted)'
                }}>
                  {animal.status}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// =====================================================================
// CUSTOM SEGMENTED SWITCH COMPONENT 
// =====================================================================

const SwitchContext = createContext(null);

const Switch = ({ children, value, onChange }) => {
  return (
    <SwitchContext.Provider value={{ value, onChange }}>
      <div style={{
        display: 'flex', 
        width: '100%',   
        alignItems: 'center',
        backgroundColor: 'rgba(150, 150, 150, 0.08)', 
        backdropFilter: 'blur(8px)',
        padding: '6px',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        gap: '2px', // Reduced gap slightly
        boxSizing: 'border-box', 
        overflowX: 'auto', 
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none',
        flexWrap: 'nowrap',
        WebkitOverflowScrolling: 'touch'
      }}>
        {children}
      </div>
    </SwitchContext.Provider>
  );
};

Switch.Control = ({ value, label }) => {
  const context = useContext(SwitchContext);
  const checked = value === context?.value;

  return (
    <label 
      style={{ 
        position: 'relative', 
        cursor: 'pointer', 
        flex: '1 1 0%', // Allow tabs to shrink equally to fit within the container
        display: 'flex', 
        margin: 0,
        WebkitTapHighlightColor: 'transparent',
        minWidth: 0, // Allows flex items to shrink below their content size if needed
        boxSizing: 'border-box'
      }} 
      onClick={() => context?.onChange(value)}
    >
      <input
        type="radio"
        value={value}
        checked={checked}
        readOnly
        style={{ display: 'none' }}
      />
      
      {/* THE SLIDING PILL BACKGROUND */}
      {checked && (
        <motion.div
          layoutId="active-pill-background" 
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(150, 150, 150, 0.25)', 
            borderRadius: '12px',
            zIndex: 0
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      {/* THE TEXT FOREGROUND */}
      <span style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '10px 4px', // Reduced padding so texts don't push the screen out
        fontWeight: '600', 
        fontSize: 'clamp(0.75rem, 2vw, 0.95rem)', // Scales down efficiently
        whiteSpace: 'nowrap', 
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textAlign: 'center',
        transition: 'color 0.3s ease',
        color: checked ? 'var(--text)' : 'var(--text-muted)'
      }}>
        {label}
      </span>
    </label>
  );
};