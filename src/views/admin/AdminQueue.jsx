import React, { useState, useEffect } from 'react';
import { Search, MapPin, Car, AlertCircle, Clock, CheckCircle2, Loader2, Image as ImageIcon, Bot } from 'lucide-react';

// The initial array of objects defining each row's state
const INITIAL_CASES = [
  { id: '#R-001', time: '2 min ago', animal: 'Dog', emoji: '🐕', injury: 'Severe', location: 'SS15 Subang', clinic: 'Paws Clinic KL', status: 'Pending', newlyAssigned: false },
  { id: '#R-002', time: '8 min ago', animal: 'Cat', emoji: '🐈', injury: 'Moderate', location: 'Bangsar KL', clinic: 'VetCare PJ', status: 'En Route', newlyAssigned: false },
  { id: '#R-003', time: '14 min ago', animal: 'Bird', emoji: '🐦', injury: 'Mild', location: 'Petaling Jaya', clinic: 'Subang Animal Hospital', status: 'Pending', newlyAssigned: false },
  { id: '#R-004', time: '22 min ago', animal: 'Dog', emoji: '🐕', injury: 'Moderate', location: 'Chow Kit KL', clinic: 'Bangsar Pet Clinic', status: 'En Route', newlyAssigned: false },
  { id: '#R-005', time: '1 hr ago', animal: 'Cat', emoji: '🐈', injury: 'Severe', location: 'Mont Kiara', clinic: 'Paws Clinic KL', status: 'Resolved', newlyAssigned: false },
  { id: '#R-006', time: '2 hr ago', animal: 'Dog', emoji: '🐕', injury: 'Mild', location: 'Ampang', clinic: 'VetCare PJ', status: 'Resolved', newlyAssigned: false },
];

// Design System CSS array (NO backticks)
const ADMIN_STYLES = [
  "@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&display=swap');",
  ":root { --bg: #F7F7F7; --surface: #FFFFFF; --text: #1A1A1A; --text-muted: #888888; --border: #F0F0F0; --accent: #C2FF47; --rescue: #F4845F; --dark: #1A1A1A; }",
  "body { background-color: var(--bg); font-family: 'Urbanist', sans-serif; color: var(--text); }",
  
  "/* Layout Fixes to allow native page vertical scrolling */",
  ".page-wrapper { width: 100vw; max-width: 100%; overflow-x: hidden; display: flex; flex-direction: column; min-height: 100vh; box-sizing: border-box; background-color: var(--bg); }", 
  ".content-area { padding: 32px; max-width: 1200px; margin: 0 auto; box-sizing: border-box; width: 100%; display: flex; flex-direction: column; }",
  "@media (max-width: 768px) { .content-area { padding: 16px; } }",
  
  "/* Cards per Design System */",
  ".card { background-color: var(--surface); border-radius: 16px; border: 1px solid var(--border); padding: 24px; box-sizing: border-box; width: 100%; box-shadow: none; }",
  "@media (max-width: 768px) { .card { padding: 20px; } }",
  
  "/* KPI Grid Layout */",
  ".kpi-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin-bottom: 24px; width: 100%; box-sizing: border-box; }",
  
  "/* Liquid Glass KPI Cards */",
  ".kpi-glass-card { position: relative; border-radius: 20px; padding: 24px; box-sizing: border-box; width: 100%; backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.8); overflow: hidden; z-index: 1; border: 1px solid rgba(255,255,255,0.3); }",
  ".kpi-glass-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.05) 100%); z-index: -1; }",
  
  ".kpi-pending { background: rgba(244, 132, 95, 0.15); border-color: rgba(244, 132, 95, 0.3); }",
  ".kpi-label-pending { color: #c03010 !important; }",
  ".kpi-number-pending { color: #c03010 !important; }",
  
  ".kpi-enroute { background: rgba(114, 1, 255, 0.12); border-color: rgba(114, 1, 255, 0.25); }",
  ".kpi-label-enroute { color: #5500cc !important; }",
  ".kpi-number-enroute { color: #5500cc !important; }",
  
  ".kpi-resolved { background: rgba(136, 204, 0, 0.15); border-color: rgba(136, 204, 0, 0.3); }",
  ".kpi-label-resolved { color: #3a7a00 !important; }",
  ".kpi-number-resolved { color: #3a7a00 !important; }",
  
  ".kpi-avg { background: rgba(0, 180, 216, 0.12); border-color: rgba(0, 180, 216, 0.25); }",
  ".kpi-label-avg { color: #005f73 !important; }",
  ".kpi-number-avg { color: #005f73 !important; }",
  
  ".filter-tabs { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; width: 100%; scrollbar-width: none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; }", 
  ".filter-tabs::-webkit-scrollbar { display: none; }",
  
  ".table-container-wrapper { width: 100%; margin-bottom: 40px; }", 
  ".table-responsive { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: thin; border-radius: 16px; }",
  
  "/* Mobile Table Overrides */",
  "@media (max-width: 640px) {",
  "  .hide-mobile { display: none !important; }",
  "  .table-cell  { padding: 12px 10px; font-size: 13px; }",
  "  .table-header{ padding: 10px 10px; }",
  "  .kpi-number  { font-size: 24px !important; }",
  "}",
  
  "/* Typography per Design System */",
  ".page-title { font-size: 28px; font-weight: 700; color: var(--text); margin: 0; }",
  ".section-label { font-size: 11px; font-weight: 700; color: #AAA; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 8px 0; }",
  ".card-title { font-size: 15px; font-weight: 600; color: var(--text); }",
  ".body-text { font-size: 14px; font-weight: 400; color: #555; }",
  ".muted-text { font-size: 13px; font-weight: 400; color: #888; }",
  ".kpi-number { font-size: 32px; font-weight: 700; color: var(--text); line-height: 1.1; }",

  ".pulse-dot { width: 8px; height: 8px; background-color: #3a7a00; border-radius: 50%; animation: pulse 1.5s infinite; }",
  "@keyframes pulse { 0% { opacity: 1; box-shadow: 0 0 0 0 rgba(58, 122, 0, 0.4); } 50% { opacity: 0.4; box-shadow: 0 0 0 6px rgba(58, 122, 0, 0); } 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(58, 122, 0, 0); } }",
  "@keyframes spin { 100% { transform: rotate(360deg); } }",
  ".spin-icon { animation: spin 1s linear infinite; }",
  
  "/* Badges per Design System */",
  ".badge { padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; }",
  ".badge-active { background: #C2FF4720; color: #3a7a00; }",
  ".badge-pending { background: #FFAA0020; color: #8a5500; }",
  ".badge-enroute { background: #7201FF20; color: #5500cc; }",
  ".badge-error { background: #FF444420; color: #cc0000; }",
  ".badge-sos { background: #F4845F20; color: #c03010; }",
  
  "/* Buttons per Design System */",
  ".btn { border-radius: 10px; padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; white-space: nowrap; }",
  ".btn-primary { background: var(--dark); color: var(--accent); }",
  ".btn-secondary { background: var(--bg); color: var(--dark); border: 1px solid #E5E5E5; }",
  ".btn-disabled { background: var(--bg); color: var(--text-muted); cursor: not-allowed; border: 1px solid var(--border); }",
  
  ".table-header { padding: 10px 12px; font-size: 11px; font-weight: 700; color: #AAA; letter-spacing: 0.08em; text-transform: uppercase; text-align: left; border-bottom: 1px solid var(--border); white-space: nowrap; position: sticky; top: 0; background: var(--surface); z-index: 10; }",
  ".table-row { border-bottom: 1px solid var(--border); transition: background 0.2s; cursor: pointer; }",
  ".table-row:hover { background-color: #fafafa; }",
  ".table-cell { padding: 12px; font-size: 14px; white-space: nowrap; color: #555; }",
  
  ".expand-content { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; background: var(--bg); }",
  ".expand-content.open { max-height: 800px; border-bottom: 1px solid var(--border); }"
].join("\n");

export default function AdminQueue() {
  const [cases, setCases] = useState(INITIAL_CASES);
  const [filter, setFilter] = useState('All');
  const [expandedRow, setExpandedRow] = useState(null);
  
  // Track loading state for individual rows by their ID
  const [loadingRows, setLoadingRows] = useState({});

  const filteredCases = cases.filter(c => filter === 'All' ? true : c.status === filter);
  
  const pendingCount = cases.filter(c => c.status === 'Pending').length;
  const enrouteCount = cases.filter(c => c.status === 'En Route').length;

  // ==========================================
  // AUTO AI-ASSIGNMENT ENGINE (RUNS ON LOAD)
  // ==========================================
  useEffect(() => {
    // 1. Find all cases that are currently pending
    const pendingCases = INITIAL_CASES.filter(c => c.status === 'Pending');

    pendingCases.forEach(caseData => {
      // 2. Generate a random delay for each case (between 2 to 10 seconds)
      const randomDelay = Math.floor(Math.random() * 8000) + 2000;

      // 3. Immediately set the row to "Loading/Thinking" state
      setLoadingRows(prev => ({ ...prev, [caseData.id]: true }));

      // 4. Execute the match after the random timer finishes
      setTimeout(() => {
        // Dynamic AI Reasoning Variables
        let driverName = "Ahmad Razif";
        let vehicle = "White Perodua Myvi";
        let eta = Math.floor(Math.random() * 5) + 3; // Random ETA 3-7 mins
        
        if (caseData.animal === 'Bird') {
          driverName = "Jessica Lin";
          vehicle = "Honda City";
        } else if (caseData.injury === 'Severe') {
          driverName = "Marcus (Vet Tech)";
          vehicle = "Toyota Hilux (Spacious)";
        }

        const aiReasoning = `AI matched ${driverName} (ETA ${eta}m) because they are closest to ${caseData.location} and have experience handling ${caseData.injury.toLowerCase()} ${caseData.animal} cases.`;

        // Update the specific case with the AI data
        setCases(prevCases => prevCases.map(c => 
          c.id === caseData.id 
            ? { 
                ...c, 
                status: 'En Route', 
                newlyAssigned: true,
                driverDetails: `${driverName} · ${vehicle} · ETA ${eta} min`,
                aiLog: aiReasoning
              } 
            : c
        ));
        
        // Turn off the loading spinner
        setLoadingRows(prev => ({ ...prev, [caseData.id]: false }));
      }, randomDelay);
    });
  }, []);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <React.Fragment>
      <style dangerouslySetInnerHTML={{ __html: ADMIN_STYLES }} />

      <div className="page-wrapper">
        <main className="content-area">
          
          {/* HEADER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 className="page-title">Rescue Queue</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#C2FF4720', padding: '4px 8px', borderRadius: '20px' }}>
                  <div className="pulse-dot"></div>
                  <span className="badge-active" style={{ background: 'transparent', padding: 0 }}>Live</span>
                </div>
              </div>
              <p className="muted-text" style={{ margin: '4px 0 0 0' }}>Live incoming rescue requests</p>
            </div>
          </div>

          {/* 4 KPI CARDS (Liquid Glass Style) */}
          <div className="kpi-container">
            <div className="kpi-glass-card kpi-pending">
              <p className="section-label kpi-label-pending">PENDING</p>
              <span className="kpi-number kpi-number-pending">{pendingCount}</span>
            </div>
            
            <div className="kpi-glass-card kpi-enroute">
              <p className="section-label kpi-label-enroute">EN ROUTE</p>
              <span className="kpi-number kpi-number-enroute">{enrouteCount}</span>
            </div>
            
            <div className="kpi-glass-card kpi-resolved">
              <p className="section-label kpi-label-resolved">RESOLVED TODAY</p>
              <span className="kpi-number kpi-number-resolved">18</span>
            </div>
            
            <div className="kpi-glass-card kpi-avg">
              <p className="section-label kpi-label-avg">AVG RESPONSE TIME</p>
              <span className="kpi-number kpi-number-avg">6.4m</span>
            </div>
          </div>

          {/* FILTER BAR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div className="filter-tabs">
              {['All', 'Pending', 'En Route', 'Resolved'].map(tab => (
                <button 
                  key={tab} onClick={() => setFilter(tab)}
                  style={{ 
                    padding: '6px 14px', borderRadius: '16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: '1px solid', whiteSpace: 'nowrap', flexShrink: 0,
                    backgroundColor: filter === tab ? 'var(--dark)' : 'transparent', 
                    color: filter === tab ? 'var(--accent)' : 'var(--text-muted)',
                    borderColor: filter === tab ? 'var(--dark)' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" placeholder="Search cases..." style={{ 
                  padding: '8px 12px 8px 32px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border)', 
                  fontSize: '13px', 
                  fontFamily: 'inherit',
                  outline: 'none',
                  minWidth: '180px',
                  width: '100%'
                }} />
              </div>
            </div>
          </div>

          {/* MAIN TABLE CARD */}
          <div className="table-container-wrapper">
            <div className="card table-responsive" style={{ padding: 0 }}>
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', minWidth: '500px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr>
                      <th className="table-header">Case ID</th>
                      <th className="table-header hide-mobile">Time</th>
                      <th className="table-header">Animal & Injury</th>
                      <th className="table-header">Location</th>
                      <th className="table-header hide-mobile">Injury Level</th>
                      <th className="table-header hide-mobile">Assigned Clinic</th>
                      <th className="table-header">Status</th>
                      <th className="table-header">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCases.map(c => (
                      <React.Fragment key={c.id}>
                        
                        {/* MAIN ROW */}
                        <tr className="table-row" onClick={() => toggleRow(c.id)}>
                          <td className="table-cell" style={{ fontFamily: 'monospace', fontWeight: 600 }}>{c.id}</td>
                          <td className="table-cell hide-mobile muted-text" style={{ fontSize: '13px' }}>{c.time}</td>
                          <td className="table-cell">
                            <span style={{ fontSize: '14px', marginRight: '6px' }}>{c.emoji}</span> 
                            <span className="card-title">{c.animal}</span> <span style={{ color: 'var(--border)', margin: '0 4px' }}>|</span> <span className="muted-text">{c.injury}</span>
                          </td>
                          <td className="table-cell body-text" style={{ fontWeight: 500 }}>{c.location}</td>
                          <td className="table-cell hide-mobile">
                            <span className={"badge " + (c.injury === 'Severe' ? 'badge-sos' : c.injury === 'Moderate' ? 'badge-pending' : 'badge-active')}>
                              {c.injury}
                            </span>
                          </td>
                          <td className="table-cell hide-mobile">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span className="card-title" style={{ fontSize: '13px' }}>{c.clinic}</span>
                              <span style={{ fontSize: '9px', background: 'var(--bg)', padding: '2px 6px', borderRadius: '4px', width: 'fit-content', color: '#AAA', fontWeight: 700, letterSpacing: '0.05em' }}>AUTO</span>
                            </div>
                          </td>
                          <td className="table-cell">
                            <span className={"badge " + (c.status === 'Pending' ? 'badge-pending' : c.status === 'En Route' ? 'badge-enroute' : 'badge-active')}>
                              {c.status}
                            </span>
                          </td>
                          <td className="table-cell">
                            
                            {/* ACTION BUTTONS */}
                            {c.status === 'Pending' && (
                              <button 
                                className="btn btn-primary" 
                                disabled={true} 
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
                              >
                                {loadingRows[c.id] ? (
                                  <React.Fragment><Loader2 size={12} className="spin-icon" /> AI Matching</React.Fragment>
                                ) : 'Assign'}
                              </button>
                            )}

                            {c.status === 'En Route' && !c.newlyAssigned && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button className="btn btn-secondary" onClick={(e) => e.stopPropagation()}>View Map</button>
                                <span className="muted-text" style={{ fontSize: '11px', fontWeight: 600 }}>RM20 Locked</span>
                              </div>
                            )}

                            {c.status === 'En Route' && c.newlyAssigned && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button className="btn btn-disabled" onClick={(e) => e.stopPropagation()}>Assigned ✓</button>
                                <span className="badge badge-active" style={{ fontSize: '11px' }}>RM20 Locked</span>
                              </div>
                            )}

                            {c.status === 'Resolved' && (
                              <a href="#" className="card-title" style={{ fontSize: '13px', textDecoration: 'underline' }} onClick={(e) => e.stopPropagation()}>View Report</a>
                            )}

                          </td>
                        </tr>

                        {/* DYNAMIC AI ASSIGNMENT SUB-ROW */}
                        {c.newlyAssigned && (
                          <tr style={{ background: 'var(--bg)' }}>
                            <td colSpan="8" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#5500cc', fontWeight: 600 }}>
                                  <Car size={14} /> 
                                  <span>{c.driverDetails}</span>
                                </div>
                                
                                {/* AI LOG DISPLAY */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#7733DD' }}>
                                  <div style={{ background: 'var(--dark)', padding: '4px', borderRadius: '50%', display: 'flex' }}>
                                    <Bot size={10} color="var(--accent)" />
                                  </div>
                                  <span style={{ fontStyle: 'italic', whiteSpace: 'normal', fontWeight: 400 }}>{c.aiLog}</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}

                        {/* EXPANDABLE DETAIL ACCORDION */}
                        <tr>
                          <td colSpan="8" style={{ padding: 0 }}>
                            <div className={"expand-content " + (expandedRow === c.id ? 'open' : '')}>
                              <div style={{ padding: '24px', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                                
                                <div style={{ width: '80px', height: '64px', background: '#E5E5E5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#AAA', flexShrink: 0 }}>
                                  <ImageIcon size={24} />
                                </div>
                                
                                <div style={{ flex: '1 1 250px', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                                  <div style={{ flex: '1 1 120px' }}>
                                    <p className="section-label">REPORTER DETAILS</p>
                                    <p className="card-title" style={{ margin: 0, fontSize: '13px', whiteSpace: 'normal' }}>Sarah Jenkins (+60 12-345 6789)</p>
                                  </div>
                                  <div style={{ flex: '1 1 120px' }}>
                                    <p className="section-label">GPS COORDINATES</p>
                                    <p className="body-text" style={{ margin: 0, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'normal' }}>
                                      <MapPin size={14}/> 3.0738° N, 101.5859° E
                                    </p>
                                  </div>
                                  <div style={{ flex: '1 1 100%' }}>
                                    <p className="section-label">NOTES</p>
                                    <p className="body-text" style={{ margin: 0, fontSize: '13px', whiteSpace: 'normal', lineHeight: 1.5 }}>"Found near the drain, looks like a broken leg. Breathing heavily."</p>
                                  </div>
                                </div>

                              </div>
                            </div>
                          </td>
                        </tr>

                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </React.Fragment>
  );
}