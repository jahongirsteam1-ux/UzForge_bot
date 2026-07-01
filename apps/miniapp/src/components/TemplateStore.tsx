import type { FC } from 'react';
import { GlassCard } from './GlassCard';

export const TemplateStore: FC = () => {
  const templates = [
    { name: 'Internet Do\'kon', desc: 'Sotuvlar va to\'lovlar tizimi bilan to\'liq do\'kon', price: 'Tekin', icon: '🛒' },
    { name: 'Murojaat Bot', desc: 'Mijozlar bilan aloqa, adminga xabar yuborish', price: 'Tekin', icon: '✉️' },
    { name: 'Avto Kassa', desc: 'Avtomatik to\'lov qabul qilish boti', price: '15,000 UZS', icon: '💳' },
    { name: 'Kino Bot', desc: 'Kinolar izlash va saqlash kanali uchun', price: '25,000 UZS', icon: '🎬' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2">
        <h2 className="text-2xl font-bold">Shablonlar Do'koni</h2>
        <p className="text-sm text-secondary mt-2">Tayyor shablonlardan birini tanlang va o'z botingizni 1 daqiqada yarating.</p>
      </div>

      <div className="flex flex-col gap-4">
        {templates.map((tpl, i) => (
          <GlassCard key={i} delay={i * 100}>
            <div className="flex items-start gap-4">
              <div style={{ fontSize: '2rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                {tpl.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold">{tpl.name}</h3>
                  <span className="text-xs font-bold text-gradient">{tpl.price}</span>
                </div>
                <p className="text-xs text-secondary mb-3">{tpl.desc}</p>
                <button className="btn-primary" style={{ padding: '0.5rem', fontSize: '0.875rem' }}>O'rnatish</button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
