import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Plus, Star, Mail, Phone, Globe, DollarSign,
  Trash2, Edit3, CheckCircle, XCircle, Clock, TrendingUp,
  Filter, Search, MoreVertical, FileText, MessageSquare
} from 'lucide-react';

const STATUS_OPTIONS = ['Prospecto', 'En negociación', 'Cliente activo', 'En pausa', 'Perdido'];
const INDUSTRY_OPTIONS = ['Fitness', 'Gastronomía', 'Moda', 'Tech', 'Salud', 'Inmobiliaria', 'Educación', 'Retail', 'Servicios', 'Otro'];
const SOURCE_OPTIONS = ['LinkedIn', 'Referido', 'Instagram', 'Web', 'WhatsApp', 'Evento', 'Frío'];

const STATUS_COLORS = {
  'Prospecto': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'En negociación': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Cliente activo': 'bg-green-500/15 text-green-400 border-green-500/30',
  'En pausa': 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  'Perdido': 'bg-red-500/15 text-red-400 border-red-500/30',
};

const INITIAL_CLIENTS = [
  { id: 1, name: 'Café Aurora', industry: 'Gastronomía', status: 'Cliente activo', budget: 800, contact: 'María García', email: 'maria@cafeaurora.com', source: 'Instagram', rating: 5, notes: 'Excelente pagador. Quiere crecer en TikTok.', platforms: ['Instagram', 'TikTok'], joined: '2024-01-15', mrr: 800 },
  { id: 2, name: 'FitZone Gym', industry: 'Fitness', status: 'En negociación', budget: 1200, contact: 'Carlos López', email: 'carlos@fitzone.com', source: 'LinkedIn', rating: 4, notes: 'Presentación enviada. Esperar respuesta al miércoles.', platforms: ['Instagram', 'YouTube'], joined: '2024-02-01', mrr: 0 },
  { id: 3, name: 'ModaVerde', industry: 'Moda', status: 'Prospecto', budget: 600, contact: 'Ana Ruiz', email: 'ana@modaverde.co', source: 'Referido', rating: 3, notes: 'Reunión pendiente. Tiene presupuesto limitado.', platforms: ['Instagram', 'Pinterest'], joined: '2024-02-10', mrr: 0 },
];

const inputCls = "w-full bg-[#0b0c10] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 placeholder-gray-600 transition-colors";

function ClientModal({ client, onSave, onClose }) {
  const [form, setForm] = useState(client || {
    name: '', industry: '', status: 'Prospecto', budget: 0, contact: '', email: '',
    source: '', rating: 4, notes: '', platforms: [], mrr: 0
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggle = (arr, val) => form[arr].includes(val) ? form[arr].filter(v => v !== val) : [...form[arr], val];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="bg-[#0e1117] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="font-bold text-white">{client ? 'Editar Cliente' : 'Nuevo Cliente / Lead'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><XCircle className="w-5 h-5" /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input placeholder="Nombre empresa *" value={form.name} onChange={e => set('name', e.target.value)} className={inputCls} />
            <select value={form.industry} onChange={e => set('industry', e.target.value)} className={inputCls}>
              <option value="">Industria</option>
              {INDUSTRY_OPTIONS.map(i => <option key={i}>{i}</option>)}
            </select>
            <input placeholder="Nombre del contacto" value={form.contact} onChange={e => set('contact', e.target.value)} className={inputCls} />
            <input placeholder="Email del contacto" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} />
            <select value={form.status} onChange={e => set('status', e.target.value)} className={inputCls}>
              {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={form.source} onChange={e => set('source', e.target.value)} className={inputCls}>
              <option value="">Cómo llegó</option>
              {SOURCE_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input type="number" placeholder="Presupuesto mensual" value={form.budget} onChange={e => set('budget', +e.target.value)} className={`${inputCls} pl-7`} />
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0b0c10] border border-white/10 rounded-xl">
              <span className="text-xs text-gray-500 mr-1">Rating:</span>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => set('rating', n)}>
                  <Star className={`w-4 h-4 transition-colors ${n <= form.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
                </button>
              ))}
            </div>
          </div>
          <textarea rows={3} placeholder="Notas internas..." value={form.notes} onChange={e => set('notes', e.target.value)} className={`${inputCls} resize-none`} />
          <div>
            <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Plataformas gestionadas</p>
            <div className="flex flex-wrap gap-2">
              {['Instagram', 'TikTok', 'Facebook', 'LinkedIn', 'YouTube', 'Twitter/X', 'Pinterest', 'WhatsApp'].map(p => (
                <button key={p} onClick={() => set('platforms', toggle('platforms', p))}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${form.platforms.includes(p) ? 'bg-orange-500/20 border-orange-500/50 text-orange-300' : 'bg-[#111318] border-white/8 text-gray-500 hover:text-white'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-white/5">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
          <button onClick={() => onSave({ ...form, id: client?.id || Date.now(), joined: client?.joined || new Date().toISOString().split('T')[0], mrr: form.status === 'Cliente activo' ? form.budget : 0 })}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 transition-all">
            {client ? 'Guardar cambios' : 'Agregar Lead'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ClientCRM() {
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [modal, setModal] = useState(null); // null | 'new' | client obj
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');

  const saveClient = (data) => {
    setClients(prev => prev.find(c => c.id === data.id)
      ? prev.map(c => c.id === data.id ? data : c)
      : [...prev, data]);
    setModal(null);
  };

  const removeClient = (id) => setClients(prev => prev.filter(c => c.id !== id));

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.contact.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'Todos' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalMRR = clients.filter(c => c.status === 'Cliente activo').reduce((s, c) => s + c.budget, 0);
  const activeCount = clients.filter(c => c.status === 'Cliente activo').length;
  const pipeline = clients.filter(c => ['Prospecto', 'En negociación'].includes(c.status)).reduce((s, c) => s + c.budget, 0);

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'MRR Total', value: `$${totalMRR.toLocaleString()}`, sub: 'ingresos recurrentes', color: 'text-green-400' },
          { label: 'Clientes Activos', value: activeCount, sub: 'contratos vigentes', color: 'text-blue-400' },
          { label: 'Pipeline', value: `$${pipeline.toLocaleString()}`, sub: 'en negociación', color: 'text-amber-400' },
          { label: 'Total Leads', value: clients.length, sub: 'en CRM', color: 'text-purple-400' },
        ].map((k, i) => (
          <div key={i} className="bg-[#111318] border border-white/8 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{k.label}</p>
            <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
            <p className="text-xs text-gray-600">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input placeholder="Buscar por empresa o contacto..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#111318] border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 placeholder-gray-600" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['Todos', ...STATUS_OPTIONS].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${filterStatus === s ? 'bg-orange-500/20 border-orange-500/40 text-orange-300' : 'bg-[#111318] border-white/8 text-gray-500 hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={() => setModal('new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 rounded-xl text-sm font-bold transition-all whitespace-nowrap">
          <Plus className="w-4 h-4" /> Nuevo Lead
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#0e1117] border border-white/5 rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-white/5 text-xs text-gray-500 font-semibold uppercase tracking-wider">
          <div className="col-span-3">Empresa</div>
          <div className="col-span-2">Estado</div>
          <div className="col-span-2">Presupuesto</div>
          <div className="col-span-2">Rating</div>
          <div className="col-span-2">Plataformas</div>
          <div className="col-span-1" />
        </div>
        <AnimatePresence>
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-600 text-sm">No hay resultados. Prueba otro filtro.</div>
          ) : filtered.map(c => (
            <motion.div key={c.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-12 gap-2 px-5 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center">
              <div className="col-span-3">
                <p className="font-semibold text-white text-sm truncate">{c.name}</p>
                <p className="text-xs text-gray-500 truncate">{c.contact} · {c.industry}</p>
              </div>
              <div className="col-span-2">
                <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${STATUS_COLORS[c.status]}`}>{c.status}</span>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-bold text-white">${c.budget.toLocaleString()}/mes</p>
                <p className="text-xs text-gray-500">vía {c.source}</p>
              </div>
              <div className="col-span-2 flex">
                {[1, 2, 3, 4, 5].map(n => (
                  <Star key={n} className={`w-3.5 h-3.5 ${n <= c.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-700'}`} />
                ))}
              </div>
              <div className="col-span-2 flex flex-wrap gap-1">
                {c.platforms.slice(0, 3).map(p => (
                  <span key={p} className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-gray-400">{p}</span>
                ))}
                {c.platforms.length > 3 && <span className="text-[10px] text-gray-500">+{c.platforms.length - 3}</span>}
              </div>
              <div className="col-span-1 flex justify-end gap-1">
                <button onClick={() => setModal(c)} className="text-gray-600 hover:text-orange-400 transition-colors p-1">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => removeClient(c.id)} className="text-gray-600 hover:text-red-400 transition-colors p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {modal && (
          <ClientModal client={modal === 'new' ? null : modal} onSave={saveClient} onClose={() => setModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
