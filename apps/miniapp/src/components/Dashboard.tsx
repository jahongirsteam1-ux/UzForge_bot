import React from 'react';
import { GlassCard } from './GlassCard';

export const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">Asosiy panel</h2>
        <div className="text-sm text-secondary">Jahongir</div>
      </div>

      <GlassCard title="Sizning Botlaringiz" delay={100}>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center p-4" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
            <div className="flex items-center gap-3">
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                M
              </div>
              <div>
                <div className="font-semibold">Mening Do'konim</div>
                <div className="text-xs text-secondary">@shop_bot</div>
              </div>
            </div>
            <div className="text-xs font-bold" style={{ color: '#10b981' }}>Faol</div>
          </div>
          
          <button className="btn-secondary mt-2">+ Yangi bot yaratish</button>
        </div>
      </GlassCard>

      <GlassCard title="Statistika" delay={200}>
        <div className="flex gap-4">
          <div className="flex flex-col items-center flex-1" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
            <div className="text-2xl font-bold text-gradient">124</div>
            <div className="text-xs text-secondary mt-2">Mijozlar</div>
          </div>
          <div className="flex flex-col items-center flex-1" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
            <div className="text-2xl font-bold text-gradient">890</div>
            <div className="text-xs text-secondary mt-2">Xabarlar</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
