import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = (import.meta?.env?.VITE_API_URL) || 'http://localhost:8000/api/v1';

const BUSINESS_TYPES = [
  { id: 'ecommerce', label: '🛒 E-Commerce / Tienda Online' },
  { id: 'local', label: '🏪 Negocio Local' },
  { id: 'services', label: '💼 Servicios Profesionales' },
  { id: 'products_by_order', label: '🎨 Productos por Encargo' },
  { id: 'influencer', label: '⭐ Influencer / Creador de Contenido' },
  { id: 'education', label: '📚 Academia / Educación Online' },
  { id: 'health', label: '🏥 Salud y Bienestar' },
  { id: 'tech', label: '💻 Tecnología / Software' },
  { id: 'fashion', label: '👗 Moda y Estilo' },
  { id: 'real_estate', label: '🏠 Bienes Raíces' },
];

const PLATFORMS = ['Instagram', 'TikTok', 'Facebook', 'YouTube', 'LinkedIn', 'X (Twitter)'];

const COUNTRIES = [
  { code: 'MX', name: 'México' }, { code: 'ES', name: 'España' },
  { code: 'CO', name: 'Colombia' }, { code: 'AR', name: 'Argentina' },
  { code: 'PE', name: 'Perú' }, { code: 'EC', name: 'Ecuador' },
  { code: 'CL', name: 'Chile' }, { code: 'US', name: 'Estados Unidos' },
];

const TAB_PLAN = 'plan';
const TAB_IDEAS = 'ideas';
const TAB_KPIS = 'kpis';

export default function CommunityManagerModule() {
  const [activeTab, setActiveTab] = useState(TAB_PLAN);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Form state
  const [form, setForm] = useState({
    business_type: 'ecommerce',
    business_name: '',
    target_audience: '',
    main_goal: '',
    platforms: ['Instagram', 'TikTok'],
    country: 'MX',
    budget_level: 'bajo (menos de $200/mes)',
    niche: '',
    platform_single: 'instagram',
    quantity: 10,
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const togglePlatform = (p) => {
    setForm(f => ({
      ...f,
      platforms: f.platforms.includes(p)
        ? f.platforms.filter(x => x !== p)
        : [...f.platforms, p]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      let res;
      if (activeTab === TAB_PLAN) {
        res = await axios.post(`${API_BASE}/cm/plan`, {
          business_type: form.business_type,
          business_name: form.business_name,
          target_audience: form.target_audience,
          main_goal: form.main_goal,
          platforms: form.platforms,
          country: form.country,
          budget_level: form.budget_level,
        }, { headers });
        setResult(res.data);
      } else if (activeTab === TAB_IDEAS) {
        res = await axios.post(`${API_BASE}/cm/content-ideas`, {
          business_type: form.business_type,
          niche: form.niche || form.main_goal,
          platform: form.platform_single.toLowerCase(),
          quantity: form.quantity,
          country: form.country,
        }, { headers });
        setResult(res.data);
      } else {
        res = await axios.post(`${API_BASE}/cm/kpis`, {
          business_type: form.business_type,
          platforms: form.platforms,
          main_goal: form.main_goal,
        }, { headers });
        setResult(res.data);
      }
    } catch (err) {
      setError(err?.response?.data?.detail || 'Error al generar. Verifica que el backend esté corriendo.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0b0c10 0%, #0d1117 50%, #0b0c10 100%)', color: '#fff', fontFamily: 'Inter, sans-serif', padding: '24px' }}>
      {/* Header */}
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 50, padding: '6px 18px', marginBottom: 16 }}>
            <span style={{ fontSize: 18 }}>🤖</span>
            <span style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600, letterSpacing: 1 }}>PREDIX AI — COMMUNITY MANAGER</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 800, background: 'linear-gradient(90deg,#818cf8,#a78bfa,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 12px' }}>
            Tu Community Manager IA
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 17, maxWidth: 520, margin: '0 auto' }}>
            Ingresa los datos de tu negocio y la IA generará tu estrategia completa de redes sociales en segundos.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { id: TAB_PLAN, label: '📋 Plan Completo', desc: 'Estrategia + Calendario + KPIs' },
            { id: TAB_IDEAS, label: '💡 Ideas de Contenido', desc: 'Posts listos para publicar' },
            { id: TAB_KPIS, label: '📊 Dashboard KPIs', desc: 'Métricas y objetivos' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setResult(null); setError(''); }}
              style={{
                padding: '12px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', textAlign: 'left', minWidth: 160,
                background: activeTab === tab.id ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.05)',
                color: '#fff', fontFamily: 'inherit', transition: 'all 0.2s',
                boxShadow: activeTab === tab.id ? '0 4px 20px rgba(99,102,241,0.4)' : 'none',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 14 }}>{tab.label}</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{tab.desc}</div>
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: 24, alignItems: 'start' }}>
          {/* Form */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28 }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: 18 }}>

                {/* Business Type */}
                <div>
                  <label style={labelStyle}>Tipo de Negocio</label>
                  <select value={form.business_type} onChange={e => setForm(f => ({ ...f, business_type: e.target.value }))} style={inputStyle} required>
                    {BUSINESS_TYPES.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                  </select>
                </div>

                {/* Business Name */}
                <div>
                  <label style={labelStyle}>Nombre del Negocio</label>
                  <input value={form.business_name} onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))} placeholder="ej. Café La Flor" style={inputStyle} required />
                </div>

                {/* Target Audience */}
                <div>
                  <label style={labelStyle}>Audiencia Objetivo</label>
                  <input value={form.target_audience} onChange={e => setForm(f => ({ ...f, target_audience: e.target.value }))} placeholder="ej. Mujeres 25-40 años, interesadas en moda" style={inputStyle} required />
                </div>

                {/* Main Goal */}
                <div>
                  <label style={labelStyle}>Objetivo Principal</label>
                  <input value={form.main_goal} onChange={e => setForm(f => ({ ...f, main_goal: e.target.value }))} placeholder="ej. Aumentar ventas online un 30% en 3 meses" style={inputStyle} required />
                </div>

                {/* Content Ideas: niche + platform */}
                {activeTab === TAB_IDEAS && (
                  <>
                    <div>
                      <label style={labelStyle}>Nicho / Tema específico</label>
                      <input value={form.niche} onChange={e => setForm(f => ({ ...f, niche: e.target.value }))} placeholder="ej. recetas saludables, outfit del día" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Plataforma Principal</label>
                      <select value={form.platform_single} onChange={e => setForm(f => ({ ...f, platform_single: e.target.value }))} style={inputStyle}>
                        {PLATFORMS.map(p => <option key={p} value={p.toLowerCase().replace(/\s.*/, '')}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Cantidad de Ideas: {form.quantity}</label>
                      <input type="range" min={3} max={20} value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: +e.target.value }))}
                        style={{ width: '100%', accentColor: '#8b5cf6' }} />
                    </div>
                  </>
                )}

                {/* Platforms (multi-select for Plan & KPIs) */}
                {activeTab !== TAB_IDEAS && (
                  <div>
                    <label style={labelStyle}>Plataformas a usar</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {PLATFORMS.map(p => (
                        <button key={p} type="button" onClick={() => togglePlatform(p)}
                          style={{ padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
                            background: form.platforms.includes(p) ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.08)',
                            color: '#fff', fontWeight: form.platforms.includes(p) ? 700 : 400 }}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Country */}
                <div>
                  <label style={labelStyle}>País</label>
                  <select value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} style={inputStyle}>
                    {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                </div>

                {/* Budget (plan only) */}
                {activeTab === TAB_PLAN && (
                  <div>
                    <label style={labelStyle}>Presupuesto Mensual</label>
                    <select value={form.budget_level} onChange={e => setForm(f => ({ ...f, budget_level: e.target.value }))} style={inputStyle}>
                      {['muy bajo (menos de $50/mes)', 'bajo (menos de $200/mes)', 'medio ($200 - $500/mes)', 'alto ($500 - $1000/mes)', 'premium (más de $1000/mes)'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                )}

                {error && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', padding: 12, borderRadius: 10, fontSize: 13 }}>{error}</div>}

                <button type="submit" disabled={loading} style={{
                  padding: '14px 24px', borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'inherit', width: '100%',
                  boxShadow: '0 4px 20px rgba(99,102,241,0.4)', transition: 'all 0.2s',
                }}>
                  {loading ? '⏳ Generando con IA...' : activeTab === TAB_PLAN ? '🚀 Generar Mi Plan de CM' : activeTab === TAB_IDEAS ? '💡 Generar Ideas de Contenido' : '📊 Generar Dashboard KPIs'}
                </button>
              </div>
            </form>
          </div>

          {/* Results */}
          {result && (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 20, padding: 28, maxHeight: '80vh', overflowY: 'auto' }}>
              {activeTab === TAB_PLAN && result.plan && <PlanResult plan={result.plan} businessName={result.business_name} />}
              {activeTab === TAB_IDEAS && result.ideas && <IdeasResult ideas={result.ideas} platform={result.platform} />}
              {activeTab === TAB_KPIS && result.kpis_principales && <KPIResult data={result} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────

function PlanResult({ plan, businessName }) {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div>
        <h2 style={{ color: '#a78bfa', fontWeight: 800, fontSize: 20, margin: '0 0 8px' }}>📋 Plan para {businessName}</h2>
        <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>{plan.resumen_ejecutivo}</p>
      </div>

      {plan.kpis?.length > 0 && (
        <Section title="📊 KPIs Clave">
          {plan.kpis.map((k, i) => (
            <div key={i} style={cardStyle}>
              <div style={{ fontWeight: 700, color: '#c084fc', marginBottom: 4 }}>{k.nombre}</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>{k.objetivo}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Formula: {k.formula}</div>
            </div>
          ))}
        </Section>
      )}

      {plan.frecuencia_publicacion?.length > 0 && (
        <Section title="📅 Frecuencia de Publicación">
          {plan.frecuencia_publicacion.map((f, i) => (
            <div key={i} style={cardStyle}>
              <div style={{ fontWeight: 700, color: '#818cf8' }}>{f.plataforma}</div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{f.posts_por_semana} posts/semana · {f.mejor_hora}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{f.tipo_contenido_principal}</div>
            </div>
          ))}
        </Section>
      )}

      {plan.ideas_contenido?.length > 0 && (
        <Section title="💡 Ideas de Contenido">
          {plan.ideas_contenido.map((idea, i) => (
            <div key={i} style={cardStyle}>
              <div style={{ fontWeight: 700, color: '#f0abfc', marginBottom: 4 }}>{idea.titulo}</div>
              <div style={{ fontSize: 12, color: '#a78bfa', marginBottom: 6 }}>{idea.tipo} · {idea.proposito}</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>{idea.descripcion}</div>
              {idea.caption_ejemplo && <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(139,92,246,0.1)', borderRadius: 8, fontSize: 12, color: '#c4b5fd', lineHeight: 1.5 }}>{idea.caption_ejemplo}</div>}
            </div>
          ))}
        </Section>
      )}

      {plan.proximos_pasos?.length > 0 && (
        <Section title="🎯 Próximos Pasos">
          {plan.proximos_pasos.map((paso, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: '#6366f1', fontWeight: 800, minWidth: 20 }}>{i + 1}.</span>
              <span style={{ color: '#cbd5e1', fontSize: 14 }}>{paso}</span>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function IdeasResult({ ideas, platform }) {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2 style={{ color: '#a78bfa', fontWeight: 800, fontSize: 18, margin: 0 }}>💡 {ideas.length} Ideas para {platform}</h2>
      {ideas.map((idea, i) => (
        <div key={i} style={{ ...cardStyle, borderLeft: '3px solid #6366f1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 15 }}>{idea.titulo}</div>
            <span style={{ background: idea.potencial_viral === 'Alto' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', color: idea.potencial_viral === 'Alto' ? '#6ee7b7' : '#fcd34d', fontSize: 10, padding: '2px 8px', borderRadius: 10, whiteSpace: 'nowrap', marginLeft: 8 }}>{idea.potencial_viral}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <Tag color="#6366f1">{idea.formato}</Tag>
            <Tag color="#8b5cf6">{idea.proposito}</Tag>
            <Tag color="#64748b">{idea.dificultad_produccion}</Tag>
          </div>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, lineHeight: 1.5 }}>{idea.descripcion}</p>
          {idea.caption && <div style={{ padding: '8px 12px', background: 'rgba(99,102,241,0.1)', borderRadius: 8, fontSize: 12, color: '#a5b4fc', lineHeight: 1.6 }}>{idea.caption}</div>}
          {idea.mejor_momento && <div style={{ marginTop: 6, fontSize: 11, color: '#64748b' }}>⏰ {idea.mejor_momento}</div>}
        </div>
      ))}
    </div>
  );
}

function KPIResult({ data }) {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <h2 style={{ color: '#a78bfa', fontWeight: 800, fontSize: 18, margin: 0 }}>📊 Dashboard de KPIs</h2>
      {data.kpis_principales?.map((kpi, i) => (
        <div key={i} style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontWeight: 700, color: '#e2e8f0' }}>{kpi.nombre}</div>
            <Tag color="#6366f1">{kpi.categoria}</Tag>
          </div>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 10 }}>{kpi.descripcion}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <KPIGoal label="Mes 1" value={kpi.objetivo_mes1} />
            <KPIGoal label="Mes 3" value={kpi.objetivo_mes3} />
            <KPIGoal label="Mes 6" value={kpi.objetivo_mes6} />
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: '#64748b' }}>📐 {kpi.formula}</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>🔧 {kpi.herramienta_medicion} · {kpi.frecuencia}</div>
        </div>
      ))}
      {data.reporte_sugerido && (
        <div style={cardStyle}>
          <div style={{ fontWeight: 700, color: '#c084fc', marginBottom: 8 }}>📝 Reporte Sugerido ({data.reporte_sugerido.frecuencia})</div>
          {data.reporte_sugerido.secciones?.map((s, i) => (
            <div key={i} style={{ fontSize: 13, color: '#94a3b8', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>• {s}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 14, fontFamily: 'Inter,sans-serif', outline: 'none', boxSizing: 'border-box' };
const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16 };

function Section({ title, children }) {
  return (
    <div>
      <h3 style={{ color: '#818cf8', fontWeight: 700, fontSize: 15, margin: '0 0 12px' }}>{title}</h3>
      <div style={{ display: 'grid', gap: 10 }}>{children}</div>
    </div>
  );
}

function Tag({ children, color }) {
  return (
    <span style={{ background: `${color}20`, color, fontSize: 11, padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>{children}</span>
  );
}

function KPIGoal({ label, value }) {
  return (
    <div style={{ background: 'rgba(99,102,241,0.1)', borderRadius: 8, padding: '6px 10px', textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: '#64748b' }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#a5b4fc' }}>{value || '-'}</div>
    </div>
  );
}
