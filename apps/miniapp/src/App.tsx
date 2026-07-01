import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { TemplateStore } from './components/TemplateStore';
import { GlassCard } from './components/GlassCard';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'store' | 'profile'>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'store':
        return <TemplateStore />;
      case 'profile':
        return (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold mb-2">Shaxsiy Kabinet</h2>
            <GlassCard delay={100}>
              <div className="flex items-center gap-4 mb-6">
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-neon), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  J
                </div>
                <div>
                  <h3 className="font-bold text-xl">Jahongir</h3>
                  <p className="text-secondary text-sm">ID: 123456789</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4 p-3" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                <span className="text-secondary">Balans</span>
                <span className="font-bold text-gradient text-xl">0 UZS</span>
              </div>
              
              <div className="flex justify-between items-center mb-6 p-3" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                <span className="text-secondary">Status</span>
                <span className="font-bold" style={{ color: 'var(--accent-neon)' }}>FREE</span>
              </div>
              
              <button className="btn-primary">Hisobni to'ldirish</button>
            </GlassCard>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <div className="container">
        {renderContent()}
      </div>

      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'store' ? 'active' : ''}`}
          onClick={() => setActiveTab('store')}
        >
          <svg viewBox="0 0 24 24"><path d="M19 6h-2c0-2.8-2.2-5-5-5S7 3.2 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.7 0 3 1.3 3 3H9c0-1.7 1.3-3 3-3zm7 17H5V8h14v12zm-7-8c-1.7 0-3-1.3-3-3H7c0 2.8 2.2 5 5 5s5-2.2 5-5h-2c0 1.7-1.3 3-3 3z"/></svg>
          Do'kon
        </button>
        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <svg viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
          Asosiy
        </button>
        <button 
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <svg viewBox="0 0 24 24"><path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z"/></svg>
          Kabinet
        </button>
      </nav>
    </>
  );
}

export default App;
