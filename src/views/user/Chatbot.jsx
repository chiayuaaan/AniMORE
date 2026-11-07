import React, { useState, useRef, useEffect, useId } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { 
  Paperclip, ArrowUp, Globe, BrainCog, FolderCode, 
  Square, Bot, User 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// ==========================================
// 1. ETHEREAL SHADOWS BACKGROUND COMPONENT
// ==========================================
function EtherealBackground() {
  const id = useId().replace(/:/g, "");
  const feColorMatrixRef = useRef(null);
  const hueRotateMotionValue = useMotionValue(180);

  useEffect(() => {
    const anim = animate(hueRotateMotionValue, 360, {
      duration: 4, // Speed of color shifting
      repeat: Infinity,
      repeatType: "loop",
      ease: "linear",
      onUpdate: (value) => {
        if (feColorMatrixRef.current) {
          feColorMatrixRef.current.setAttribute("values", String(value));
        }
      }
    });
    return () => anim.stop();
  }, [hueRotateMotionValue]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, backgroundColor: '#050505' }}>
      <div style={{ position: 'absolute', inset: -50, filter: `url(#${id}) blur(4px)` }}>
        <svg style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <filter id={id}>
              <feTurbulence result="undulation" numOctaves="2" baseFrequency="0.001,0.004" seed="0" type="turbulence" />
              <feColorMatrix ref={feColorMatrixRef} in="undulation" type="hueRotate" values="180" />
              <feColorMatrix in="dist" result="circulation" type="matrix" values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0" />
              <feDisplacementMap in="SourceGraphic" in2="circulation" scale="60" result="dist" />
              <feDisplacementMap in="dist" in2="undulation" scale="60" result="output" />
            </filter>
          </defs>
        </svg>
        <div style={{
            backgroundColor: 'rgba(155, 135, 245, 0.5)', // The primary glowing color
            maskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
            WebkitMaskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
            maskSize: 'cover',
            WebkitMaskSize: 'cover',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            width: '100%',
            height: '100%'
          }} 
        />
      </div>
      {/* Noise Overlay */}
      <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")`,
          backgroundSize: '240px', backgroundRepeat: 'repeat', opacity: 0.4
        }} 
      />
    </div>
  );
}

// ==========================================
// 2. MAIN CHATBOT COMPONENT
// ==========================================
export default function Chatbot() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Toggles for the input box
  const [showSearch, setShowSearch] = useState(false);
  const [showThink, setShowThink] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Auto-resize textarea
  const handleInput = (e) => {
    setValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px'; // reset
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleAction = (action) => {
    setShowSearch(action === 'search' ? !showSearch : false);
    setShowThink(action === 'think' ? !showThink : false);
    setShowCanvas(action === 'canvas' ? !showCanvas : false);
  };

  // 🌟 SEND TO BACKEND 🌟
  const handleSendMessage = async () => {
    if (!value.trim() || isLoading) return;
    
    // Add prefixes based on selected toggles
    let finalMessage = value.trim();
    if (showSearch) finalMessage = `[Web Search] ${finalMessage}`;
    if (showThink) finalMessage = `[Deep Think] ${finalMessage}`;

    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = '44px';
    
    const newHistory = [...messages, { role: 'user', content: finalMessage }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userMessage: finalMessage,
          conversationHistory: messages.map(m => ({ role: m.role, content: m.content })) 
        })
      });

      if (!response.ok) throw new Error('Network Error');
      const data = await response.json();
      
      setMessages([...newHistory, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setMessages([...newHistory, { role: 'assistant', content: "Server connection failed. 🔌" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#050505', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      
      <EtherealBackground />

      {/* Main Content Wrapper */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', width: '100%', maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
        
        {/* HEADER */}
        {messages.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <h1 style={{ fontSize: '3rem', fontWeight: 800, textAlign: 'center', letterSpacing: '-1px', background: 'linear-gradient(to right, #ffffff, #888888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              What Can I Help You With?
            </h1>
          </motion.div>
        )}

        {/* CHAT HISTORY */}
        {messages.length > 0 && (
          <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', marginBottom: '24px', paddingRight: '10px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {messages.map((msg, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex', gap: '16px', maxWidth: '85%',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                }}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: msg.role === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(155, 135, 245, 0.2)',
                  color: msg.role === 'user' ? '#fff' : '#9b87f5'
                }}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                
                <div style={{
                  padding: '16px 20px', borderRadius: '20px', fontSize: '15px', lineHeight: '1.6',
                  backgroundColor: msg.role === 'user' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: msg.role === 'user' ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  borderTopRightRadius: msg.role === 'user' ? '4px' : '20px',
                  borderTopLeftRadius: msg.role === 'assistant' ? '4px' : '20px',
                }}>
                  {msg.role === 'user' ? msg.content : (
                    <div className="ai-markdown">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* PROMPT INPUT BOX */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          style={{
            marginTop: 'auto',
            backgroundColor: '#1F2023',
            border: isLoading ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid #444444',
            borderRadius: '24px',
            padding: '12px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.24)',
            transition: 'border 0.3s ease'
          }}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={showSearch ? "Search the web..." : showThink ? "Think deeply..." : "Type your message here..."}
            className="custom-scrollbar"
            style={{
              width: '100%', minHeight: '44px', maxHeight: '200px', backgroundColor: 'transparent',
              border: 'none', color: '#fff', fontSize: '16px', resize: 'none', outline: 'none',
              padding: '8px 12px'
            }}
          />

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            
            {/* Left Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button style={iconButtonStyle}>
                <Paperclip size={18} />
              </button>

              {/* Toggles */}
              <button onClick={() => toggleAction('search')} style={getToggleStyle(showSearch, '#1EAEDB')}>
                <Globe size={14} color={showSearch ? '#1EAEDB' : '#9CA3AF'} />
                {showSearch && <span style={{ fontSize: '12px', color: '#1EAEDB', marginLeft: '4px' }}>Search</span>}
              </button>
              
              <div style={dividerStyle} />

              <button onClick={() => toggleAction('think')} style={getToggleStyle(showThink, '#8B5CF6')}>
                <BrainCog size={14} color={showThink ? '#8B5CF6' : '#9CA3AF'} />
                {showThink && <span style={{ fontSize: '12px', color: '#8B5CF6', marginLeft: '4px' }}>Think</span>}
              </button>
              
              <div style={dividerStyle} />

              <button onClick={() => toggleAction('canvas')} style={getToggleStyle(showCanvas, '#F97316')}>
                <FolderCode size={14} color={showCanvas ? '#F97316' : '#9CA3AF'} />
                {showCanvas && <span style={{ fontSize: '12px', color: '#F97316', marginLeft: '4px' }}>Canvas</span>}
              </button>
            </div>

            {/* Right Action (Send) */}
            <button 
              onClick={handleSendMessage}
              disabled={isLoading || !value.trim()}
              style={{
                width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: value.trim() && !isLoading ? '#fff' : 'transparent',
                color: value.trim() && !isLoading ? '#1F2023' : '#9CA3AF',
                cursor: value.trim() && !isLoading ? 'pointer' : 'default',
                transition: 'all 0.2s ease'
              }}
            >
              {isLoading ? <Square size={16} fill="#1F2023" /> : <ArrowUp size={18} />}
            </button>
          </div>
        </motion.div>

      </div>

      {/* Global Styles injected safely */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #444444; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #555555; }
        
        .ai-markdown p { margin: 0 0 12px 0; color: rgba(255,255,255,0.85); }
        .ai-markdown p:last-child { margin-bottom: 0; }
        .ai-markdown ul { margin: 0 0 12px 0; padding-left: 20px; list-style-type: disc; color: rgba(255,255,255,0.85); }
        .ai-markdown li { margin-bottom: 6px; }
        .ai-markdown strong { font-weight: 700; color: #fff; }
      `}</style>
    </div>
  );
}

// --- HELPER STYLES ---
const iconButtonStyle = {
  width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'transparent',
  border: 'none', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', transition: 'background 0.2s'
};

const dividerStyle = {
  width: '1px', height: '16px', background: 'linear-gradient(to top, transparent, rgba(155, 135, 245, 0.5), transparent)'
};

function getToggleStyle(isActive, activeColor) {
  return {
    display: 'flex', alignItems: 'center', height: '28px', padding: '0 8px', borderRadius: '14px', cursor: 'pointer',
    backgroundColor: isActive ? `${activeColor}20` : 'transparent',
    border: isActive ? `1px solid ${activeColor}` : '1px solid transparent',
    color: isActive ? activeColor : '#9CA3AF',
    transition: 'all 0.2s ease'
  };
}