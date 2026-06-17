import React, { useState, useEffect } from 'react';
import { 
  ComposedChart, Bar, Line, Area, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Brush, Cell 
} from 'recharts';
import { Bell, CheckCircle2, ArrowUpRight, ArrowDownRight, Clock, MoreHorizontal } from 'lucide-react';

// --- DATA STRUCTURES ---

const FUND_DATA = {
  '1W': [
    { month: 'Mon', snack: 420, tips: 120, payout: 80 },
    { month: 'Tue', snack: 380, tips: 140, payout: 60 },
    { month: 'Wed', snack: 510, tips: 180, payout: 100 },
    { month: 'Thu', snack: 490, tips: 160, payout: 80 },
    { month: 'Fri', snack: 600, tips: 210, payout: 80 },
    { month: 'Sat', snack: 320, tips: 90, payout: 20 },
    { month: 'Sun', snack: 280, tips: 80, payout: 20 },
  ],
  '1M': [
    { month: 'Week 1', snack: 1800, tips: 600, payout: 300 },
    { month: 'Week 2', snack: 2100, tips: 700, payout: 400 },
    { month: 'Week 3', snack: 2400, tips: 850, payout: 300 },
    { month: 'Week 4', snack: 2200, tips: 750, payout: 400 },
  ],
  '6M': [
    { month: 'Jan', snack: 2100, tips: 900, payout: 400 },
    { month: 'Feb', snack: 2400, tips: 1100, payout: 600 },
    { month: 'Mar', snack: 2800, tips: 1300, payout: 500 },
    { month: 'Apr', snack: 3200, tips: 1500, payout: 700 },
    { month: 'May', snack: 2900, tips: 1200, payout: 500 },
    { month: 'Jun', snack: 3100, tips: 1200, payout: 500 },
  ],
  '1Y': [
    { month: 'Jan', snack: 1800, tips: 600, payout: 300 },
    { month: 'Feb', snack: 2100, tips: 700, payout: 400 },
    { month: 'Mar', snack: 2400, tips: 900, payout: 500 },
    { month: 'Apr', snack: 2800, tips: 1100, payout: 600 },
    { month: 'May', snack: 3200, tips: 1300, payout: 500 },
    { month: 'Jun', snack: 2900, tips: 1500, payout: 700 },
    { month: 'Jul', snack: 3100, tips: 1200, payout: 500 },
    { month: 'Aug', snack: 3400, tips: 1400, payout: 600 },
    { month: 'Sep', snack: 3000, tips: 1100, payout: 500 },
    { month: 'Oct', snack: 3600, tips: 1600, payout: 700 },
    { month: 'Nov', snack: 3200, tips: 1300, payout: 600 },
    { month: 'Dec', snack: 3900, tips: 1800, payout: 800 },
  ]
};

const TRANSACTIONS = [
  { id: 1, type: 'SnackUp deposit', amount: 1200, date: 'Today', isPositive: true },
  { id: 2, type: 'Checkout tip batch', amount: 340, date: 'Yesterday', isPositive: true },
  { id: 3, type: 'Driver payout #R-143', amount: -20, date: 'Yesterday', isPositive: false },
  { id: 4, type: 'Vet bill: Mochi surgery', amount: -500, date: '2 days ago', isPositive: false },
  { id: 5, type: 'Driver payout #R-142', amount: -20, date: '2 days ago', isPositive: false },
  { id: 6, type: 'SnackUp deposit', amount: 890, date: '3 days ago', isPositive: true },
  { id: 7, type: 'Direct donation', amount: 150, date: '4 days ago', isPositive: true },
  { id: 8, type: 'Driver payout #R-139', amount: -20, date: '4 days ago', isPositive: false },
];

const MONEY_SOURCES = [
  { name: 'SnackUp', percentage: 58, amount: '16,500', color: 'var(--accent)' },
  { name: 'Checkout tips', percentage: 29, amount: '8,200', color: 'var(--dark)' },
  { name: 'Direct donations', percentage: 13, amount: '3,750', color: 'var(--text-muted)' },
];

// Safe CSS array (NO backticks) for fully responsive layout
const FUND_STYLES = [
  "@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap');",
  "*, *::before, *::after { box-sizing: border-box; }", 
  ":root { --bg: #F7F7F7; --surface: #FFFFFF; --text: #1A1A1A; --text-muted: #888888; --border: #F0F0F0; --accent: #C2FF47; --rescue: #F4845F; --dark: #1A1A1A; }",
  "body { background-color: var(--bg); font-family: 'Urbanist', sans-serif; color: var(--text); margin: 0; }",
  
  "/* Mobile Overflow Kill-Switch */",
  ".page-wrapper { width: 100%; max-width: 100%; overflow-x: hidden; min-height: 100%; background-color: var(--bg); padding-bottom: 60px; }",
  
  ".content-area { padding: 32px; max-width: 1000px; margin: 0 auto; width: 100%; min-width: 0; }",
  "@media (max-width: 768px) { .content-area { padding: 16px; } }",
  
  "/* Cards Design System */",
  ".card { background-color: var(--surface); border-radius: 16px; border: 1px solid var(--border); padding: 24px; width: 100%; box-shadow: none; min-width: 0; }",
  "@media (max-width: 768px) { .card { padding: 20px; } }",
  
  "/* Standard KPI Grid Layout */",
  ".kpi-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; width: 100%; box-sizing: border-box; }",
  "@media (max-width: 640px) { .kpi-container { grid-template-columns: repeat(2, 1fr); gap: 12px; } }",

  ".section-label { font-size: 11px; font-weight: 700; color: #AAA; letter-spacing: 0.08em; text-transform: uppercase; margin: 0; }",
  ".card-title { font-size: 15px; font-weight: 600; color: var(--dark); margin: 0; }",
  ".kpi-number { font-size: 28px; font-weight: 700; color: var(--text); margin: 0; line-height: 1.2; }",
  "@media (max-width: 640px) { .kpi-number { font-size: 22px !important; } }",
  
  "/* Status Badges */",
  ".badge { padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; white-space: nowrap; width: fit-content; }",
  ".badge-active { background: #C2FF4740; color: #3a7a00; }",
  ".badge-pending { background: #FFAA0020; color: #8a5500; }",
  ".badge-error { background: #FF444420; color: #cc0000; }",
  ".badge-light { background: #F7F7F7; color: var(--text-muted); }",
  
  "/* Buttons */",
  ".btn { border-radius: 10px; padding: 10px 16px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; white-space: nowrap; }",
  ".btn-primary { background: var(--dark); color: var(--accent); }",
  ".btn-primary:hover { opacity: 0.9; }",
  ".btn-secondary { background: var(--bg); color: var(--dark); border: 1px solid #E5E5E5; }",
  ".btn-secondary:hover { background: #E5E5E5; }",
  
  "/* STRICT GRID LAYOUTS */",
  ".grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 24px; width: 100%; }",
  "@media (max-width: 768px) { .grid-2 { grid-template-columns: 1fr; } }"
].join("\n");

// --- SUB-COMPONENTS ---

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--dark)', borderRadius: '10px', padding: '10px 14px',
        fontFamily: "'Urbanist', sans-serif", boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <p style={{ color: '#aaa', fontSize: '11px', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
        <p style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: 600, margin: '0 0 3px 0' }}>
          SnackUp: RM {payload[0]?.value?.toLocaleString()}
        </p>
        <p style={{ color: '#fff', fontSize: '13px', fontWeight: 600, margin: 0 }}>
          Tips: RM {payload[1]?.value?.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const FundChart = () => {
  const [period, setPeriod] = useState('6M');
  const [data, setData] = useState(FUND_DATA['6M']);
  const [rangeL, setRangeL] = useState(0);
  const [rangeR, setRangeR] = useState(FUND_DATA['6M'].length - 1);

  useEffect(() => {
    const newData = FUND_DATA[period];
    setData(newData);
    setRangeL(0);
    setRangeR(newData.length - 1);
  }, [period]);

  const visibleData = data.slice(rangeL, rangeR + 1);
  const totalSnack = visibleData.reduce((sum, d) => sum + d.snack, 0);
  const totalTips = visibleData.reduce((sum, d) => sum + d.tips, 0);
  const heroTotal = totalSnack + totalTips;

  return (
    <div className="card" style={{ marginBottom: '24px', overflow: 'hidden' }}>
      {/* HEADER ROW - Added flexWrap to stop clipping on thin screens */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <p className="section-label" style={{ marginBottom: '4px' }}>TOTAL FUND POOL · {period}</p>
          <h2 style={{ fontSize: 'clamp(28px, 6vw, 38px)', fontWeight: 700, color: 'var(--dark)', letterSpacing: '-1px', margin: 0, lineHeight: 1 }}>
            RM {heroTotal.toLocaleString()}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>SnackUp</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--dark)' }}></div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Tips</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E5E5E5' }}></div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Payouts</span>
            </div>
          </div>
        </div>

        {/* Period Selector Pills - scrollable on tiny screens */}
        <div style={{ display: 'flex', backgroundColor: '#F7F7F7', padding: '4px', borderRadius: '999px', border: '1px solid var(--border)', overflowX: 'auto', scrollbarWidth: 'none', maxWidth: '100%' }}>
          {['1W', '1M', '6M', '1Y'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: '6px 16px', fontSize: '13px', fontWeight: 600, borderRadius: '999px', border: 'none', cursor: 'pointer',
                backgroundColor: period === p ? 'var(--dark)' : 'transparent',
                color: period === p ? 'var(--accent)' : 'var(--text-muted)',
                transition: 'all 0.2s', flexShrink: 0
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* THE CHART */}
      <div style={{ width: '100%', height: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="snackGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="tipsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--dark)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--dark)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 11, fill: '#BBB', fontFamily: "'Urbanist', sans-serif" }} 
              axisLine={false} 
              tickLine={false} 
              dy={10}
            />
            <YAxis hide={true} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
            
            <Area type="monotone" dataKey="tips" stroke="var(--dark)" strokeWidth={2.5} fill="url(#tipsGrad)" dot={false} activeDot={{ r: 5, fill: 'var(--dark)' }} />
            <Bar dataKey="snack" barSize={18} radius={[4, 4, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={i === data.length - 1 ? 'var(--accent)' : 'var(--border)'} />
              ))}
            </Bar>
            <Line type="monotone" dataKey="snack" stroke="var(--accent)" strokeWidth={2.5} fill="url(#snackGrad)" dot={false} activeDot={{ r: 5, fill: 'var(--accent)' }} />
            <Brush 
              dataKey="month" height={28} stroke="var(--dark)" fill="var(--bg)" travellerWidth={8}
              startIndex={rangeL} endIndex={rangeR}
              onChange={({ startIndex, endIndex }) => { setRangeL(startIndex); setRangeR(endIndex); }}
              tickFormatter={() => ''}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


// --- MAIN PAGE COMPONENT ---

export default function FundDashboard() {
  const [billStatus, setBillStatus] = useState('pending'); 
  const [showModal, setShowModal] = useState(false);

  const handleApprove = () => {
    setBillStatus('approved');
    setTimeout(() => {
      setShowModal(false);
    }, 2000);
  };

  return (
    <React.Fragment>
      <style dangerouslySetInnerHTML={{ __html: FUND_STYLES }} />

      <div className="page-wrapper">
        <main className="content-area">
          
          {/* Page Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(24px, 5vw, 28px)', fontWeight: 700, color: 'var(--dark)', margin: '0 0 4px 0' }}>Fund Pool</h1>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>Real-time tracking of AniMORE rescue funds</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                Approve pending vet bill
              </button>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <MoreHorizontal size={24} />
              </button>
            </div>
          </div>

          {/* ROW 1: 4 KPI CARDS (Standard Design System) */}
          <div className="kpi-container">
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <p className="section-label" style={{ marginBottom: '8px' }}>TOTAL COLLECTED</p>
              <h3 className="kpi-number" style={{ marginBottom: '12px', color: 'var(--text)' }}>RM 28,450</h3>
              <span className="badge badge-active">+23% this month</span>
            </div>
            
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <p className="section-label" style={{ marginBottom: '8px' }}>PAID TO DRIVERS</p>
              <h3 className="kpi-number" style={{ marginBottom: '12px', color: 'var(--text)' }}>RM 3,200</h3>
              <span className="badge badge-light">160 payouts</span>
            </div>
            
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <p className="section-label" style={{ marginBottom: '8px' }}>REMAINING BALANCE</p>
              <h3 className="kpi-number" style={{ marginBottom: '12px', color: '#3a7a00' }}>RM 14,580</h3>
              <span className="badge badge-active" style={{ background: '#C2FF4720', color: '#3a7a00' }}>Healthy</span>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <p className="section-label" style={{ marginBottom: '8px' }}>ACTIVE RESCUES</p>
              <h3 className="kpi-number" style={{ marginBottom: '12px', color: '#c03010' }}>3</h3>
              <span className="badge badge-error">Live now</span>
            </div>
          </div>

          {/* ROW 2: MAIN CHART */}
          <FundChart />

          {/* ROW 3: MONEY SOURCES & RECENT TRANSACTIONS */}
          <div className="grid-2">
            
            {/* Money Sources */}
            <div className="card" style={{ minWidth: 0 }}>
              <h3 className="card-title" style={{ marginBottom: '24px' }}>MONEY SOURCES</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {MONEY_SOURCES.map((source, index) => (
                  <div key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: source.color, flexShrink: 0 }}></div>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{source.name}</span>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '10px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--dark)', display: 'block' }}>{source.percentage}%</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>RM {source.amount}</span>
                      </div>
                    </div>
                    {/* Progress Bar Track */}
                    <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg)', borderRadius: '2px', overflow: 'hidden' }}>
                      {/* Progress Bar Fill */}
                      <div style={{ width: `${source.percentage}%`, height: '100%', backgroundColor: source.color, borderRadius: '2px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transactions List */}
            <div className="card" style={{ minWidth: 0 }}>
              <h3 className="card-title" style={{ marginBottom: '20px' }}>RECENT TRANSACTIONS</h3>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {TRANSACTIONS.map((tx) => (
                  <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <div style={{ 
                        width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        backgroundColor: tx.isPositive ? '#C2FF4720' : '#FF444410',
                        color: tx.isPositive ? '#3a7a00' : '#cc0000'
                      }}>
                        {tx.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      </div>
                      <div style={{ minWidth: 0, overflow: 'hidden' }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--dark)', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.type}</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{tx.date}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: tx.isPositive ? '#3a7a00' : '#cc0000', flexShrink: 0, marginLeft: '10px' }}>
                      {tx.isPositive ? '+' : '-'}RM {Math.abs(tx.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* APPROVE BILL MODAL - Add explicit max-width scaling to prevent iPhone clipping */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--surface)', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            {billStatus === 'pending' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FFAA0020', color: '#8a5500', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={20} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--dark)', margin: 0 }}>Pending Vet Bill</h3>
                </div>
                
                <div style={{ backgroundColor: 'var(--bg)', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--dark)', margin: '0 0 4px 0' }}>Mochi · leg fracture surgery</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>Clinic: Paws Clinic KL</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--dark)', margin: 0 }}>RM 500</p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleApprove}>Approve & Pay</button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <CheckCircle2 size={48} color="#3a7a00" style={{ margin: '0 auto 16px auto' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--dark)', margin: '0 0 8px 0' }}>Payment Approved</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Paid RM 500 from SnackUp Pool.<br/>
                  <span style={{ fontWeight: 600, color: 'var(--dark)', marginTop: '8px', display: 'block' }}>Remaining balance: RM 14,080</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}