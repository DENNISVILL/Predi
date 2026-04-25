import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, TrendingUp, Users, Briefcase, Plus, Trash2,
  ChevronDown, ChevronUp, AlertCircle, CheckCircle, Download, RefreshCw
} from 'lucide-react';

const CURRENCY = '$';

const defaultServices = [
  { id: 1, name: 'Gestión de Redes Sociales', hours: 20, rate: 45, monthly: true },
  { id: 2, name: 'Creación de Contenido (8 posts)', hours: 16, rate: 50, monthly: true },
  { id: 3, name: 'Pauta Publicitaria (setup)', hours: 5, rate: 60, monthly: false },
];

const defaultCosts = [
  { id: 1, name: 'Herramientas (Predix, Canva, etc.)', amount: 120 },
  { id: 2, name: 'Nómina / Freelancers', amount: 800 },
  { id: 3, name: 'Publicidad de la agencia', amount: 200 },
];

const MetricBadge = ({ label, value, sub, color = 'blue', icon: Icon }) => {
  const colors = {
    blue: 'from-blue-500/10 to-cyan-500/5 border-blue-500/20 text-blue-400',
    green: 'from-green-500/10 to-emerald-500/5 border-green-500/20 text-green-400',
    orange: 'from-orange-500/10 to-amber-500/5 border-orange-500/20 text-orange-400',
    red: 'from-red-500/10 to-rose-500/5 border-red-500/20 text-red-400',
    purple: 'from-purple-500/10 to-violet-500/5 border-purple-500/20 text-purple-400',
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-5 flex flex-col gap-1`}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest opacity-70">
        {Icon && <Icon className="w-3.5 h-3.5" />} {label}
      </div>
      <div className="text-2xl font-black text-white">{value}</div>
      {sub && <div className="text-xs opacity-60">{sub}</div>}
    </div>
  );
};

export default function AgencyFinancials() {
  const [clients, setClients] = useState(3);
  const [services, setServices] = useState(defaultServices);
  const [fixedCosts, setFixedCosts] = useState(defaultCosts);
  const [profitTarget, setProfitTarget] = useState(30);
  const [openSection, setOpenSection] = useState('services');

  const toggleSection = (s) => setOpenSection(openSection === s ? null : s);

  // Computed metrics
  const metrics = useMemo(() => {
    const revenuePerClient = services.reduce((sum, s) => sum + s.hours * s.rate, 0);
    const totalRevenue = revenuePerClient * clients;
    const totalFixed = fixedCosts.reduce((sum, c) => sum + c.amount, 0);
    const grossProfit = totalRevenue - totalFixed;
    const margin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0;
    const minClientNeeded = totalFixed > 0 ? Math.ceil(totalFixed / revenuePerClient) : 0;
    const targetRevenue = totalFixed / (1 - profitTarget / 100);
    const targetClients = revenuePerClient > 0 ? Math.ceil(targetRevenue / revenuePerClient) : 0;
    const hourlyLoad = services.reduce((sum, s) => sum + s.hours, 0) * clients;
    return { revenuePerClient, totalRevenue, totalFixed, grossProfit, margin, minClientNeeded, targetClients, hourlyLoad };
  }, [clients, services, fixedCosts, profitTarget]);

  const addService = () => setServices(prev => [...prev, { id: Date.now(), name: 'Nuevo Servicio', hours: 10, rate: 40, monthly: true }]);
  const removeService = (id) => setServices(prev => prev.filter(s => s.id !== id));
  const updateService = (id, field, value) => setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));

  const addCost = () => setFixedCosts(prev => [...prev, { id: Date.now(), name: 'Nuevo Costo', amount: 0 }]);
  const removeCost = (id) => setFixedCosts(prev => prev.filter(c => c.id !== id));
  const updateCost = (id, field, value) => setFixedCosts(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));

  const marginColor = metrics.margin >= 40 ? 'green' : metrics.margin >= 20 ? 'orange' : 'red';
  const marginStatus = metrics.margin >= 40 ? 'Excelente' : metrics.margin >= 20 ? 'Acceptable' : 'Crítico';

  const exportCSV = () => {
    const rows = [
      ['Modelo Financiero Agencia - Predix'],
      [],
      ['SERVICIOS', 'Horas/mes', 'Tarifa/hora', 'Total'],
      ...services.map(s => [s.name, s.hours, `${CURRENCY}${s.rate}`, `${CURRENCY}${s.hours * s.rate}`]),
      [],
      ['COSTOS FIJOS', 'Monto mensual'],
      ...fixedCosts.map(c => [c.name, `${CURRENCY}${c.amount}`]),
      [],
      ['MÉTRICAS CLAVE', 'Valor'],
      ['Clientes actuales', clients],
      ['Ingreso por cliente', `${CURRENCY}${metrics.revenuePerClient.toLocaleString()}`],
      ['Ingresos totales', `${CURRENCY}${metrics.totalRevenue.toLocaleString()}`],
      ['Costos totales', `${CURRENCY}${metrics.totalFixed.toLocaleString()}`],
      ['Utilidad bruta', `${CURRENCY}${metrics.grossProfit.toLocaleString()}`],
      ['Margen de utilidad', `${metrics.margin}%`],
      ['Clientes mínimos (punto de equilibrio)', metrics.minClientNeeded],
      [`Clientes para ${profitTarget}% margen`, metrics.targetClients],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'modelo-financiero-agencia.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const inputCls = "bg-[#0b0c10] border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-orange-500/60 transition-colors w-full";
  const sectionBtn = (id, label, icon) => (
    <button onClick={() => toggleSection(id)}
      className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-all ${openSection === id ? 'bg-orange-500/10 border-orange-500/30 text-white' : 'bg-[#111318] border-white/8 text-gray-400 hover:text-white hover:border-white/15'}`}>
      <span className="flex items-center gap-2 font-semibold text-sm">{icon} {label}</span>
      {openSection === id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        <MetricBadge label="Ingreso / Cliente" value={`${CURRENCY}${metrics.revenuePerClient.toLocaleString()}`} sub="por mes" color="blue" icon={DollarSign} />
        <MetricBadge label="Ingresos Totales" value={`${CURRENCY}${metrics.totalRevenue.toLocaleString()}`} sub={`${clients} cliente${clients !== 1 ? 's' : ''}`} color="green" icon={TrendingUp} />
        <MetricBadge label="Utilidad Bruta" value={`${CURRENCY}${metrics.grossProfit.toLocaleString()}`} sub={`Margen ${metrics.margin}% — ${marginStatus}`} color={marginColor} icon={Briefcase} />
        <MetricBadge label="Punto de Equilibrio" value={`${metrics.minClientNeeded} clientes`} sub="para cubrir costos" color="orange" icon={Users} />
        <MetricBadge label={`Meta ${profitTarget}% margen`} value={`${metrics.targetClients} clientes`} sub="objetivo de crecimiento" color="purple" icon={TrendingUp} />
      </div>

      {/* Controls Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111318] border border-white/8 rounded-xl p-4 flex flex-col gap-2">
          <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Clientes Actuales</label>
          <div className="flex items-center gap-3">
            <button onClick={() => setClients(c => Math.max(1, c - 1))} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center text-lg transition-colors">-</button>
            <span className="text-3xl font-black text-white flex-1 text-center">{clients}</span>
            <button onClick={() => setClients(c => c + 1)} className="w-8 h-8 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 flex items-center justify-center text-lg transition-colors">+</button>
          </div>
        </div>
        <div className="bg-[#111318] border border-white/8 rounded-xl p-4 flex flex-col gap-2">
          <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Meta de Margen (%)</label>
          <div className="flex items-center gap-3">
            <input type="range" min={10} max={80} value={profitTarget} onChange={e => setProfitTarget(+e.target.value)}
              className="flex-1 accent-orange-500" />
            <span className="text-2xl font-black text-orange-400 w-12 text-right">{profitTarget}%</span>
          </div>
        </div>
        <div className="bg-[#111318] border border-white/8 rounded-xl p-4 flex flex-col gap-2">
          <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Carga Horaria Total</label>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-black text-white">{metrics.hourlyLoad}</span>
            <span className="text-sm text-gray-500 mb-1">hrs/mes</span>
          </div>
          <div className="text-xs text-gray-500">{(metrics.hourlyLoad / 160 * 100).toFixed(0)}% de capacidad mensual (160h)</div>
        </div>
      </div>

      {/* Services Section */}
      <div className="flex flex-col gap-2">
        {sectionBtn('services', `Servicios Facturables (${services.length})`, <Briefcase className="w-4 h-4 text-orange-400" />)}
        <AnimatePresence>
          {openSection === 'services' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden">
              <div className="bg-[#0e1117] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-semibold uppercase tracking-wider px-1">
                  <div className="col-span-5">Nombre del Servicio</div>
                  <div className="col-span-2 text-center">Horas/mes</div>
                  <div className="col-span-2 text-center">Tarifa/hora</div>
                  <div className="col-span-2 text-center">Total/mes</div>
                  <div className="col-span-1" />
                </div>
                {services.map(s => (
                  <motion.div key={s.id} layout className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                      <input value={s.name} onChange={e => updateService(s.id, 'name', e.target.value)} className={inputCls} />
                    </div>
                    <div className="col-span-2">
                      <input type="number" value={s.hours} onChange={e => updateService(s.id, 'hours', +e.target.value)} className={`${inputCls} text-center`} min={0} />
                    </div>
                    <div className="col-span-2">
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{CURRENCY}</span>
                        <input type="number" value={s.rate} onChange={e => updateService(s.id, 'rate', +e.target.value)} className={`${inputCls} pl-6 text-center`} min={0} />
                      </div>
                    </div>
                    <div className="col-span-2 text-center font-bold text-green-400 text-sm">
                      {CURRENCY}{(s.hours * s.rate).toLocaleString()}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button onClick={() => removeService(s.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button onClick={addService} className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 transition-colors font-semibold">
                    <Plus className="w-3.5 h-3.5" /> Agregar servicio
                  </button>
                  <div className="text-sm font-bold text-white">
                    Total: <span className="text-green-400">{CURRENCY}{services.reduce((s, c) => s + c.hours * c.rate, 0).toLocaleString()}</span>/cliente/mes
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed Costs Section */}
      <div className="flex flex-col gap-2">
        {sectionBtn('costs', `Costos Fijos Mensuales (${fixedCosts.length})`, <DollarSign className="w-4 h-4 text-red-400" />)}
        <AnimatePresence>
          {openSection === 'costs' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden">
              <div className="bg-[#0e1117] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
                {fixedCosts.map(c => (
                  <motion.div key={c.id} layout className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-8">
                      <input value={c.name} onChange={e => updateCost(c.id, 'name', e.target.value)} className={inputCls} />
                    </div>
                    <div className="col-span-3">
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{CURRENCY}</span>
                        <input type="number" value={c.amount} onChange={e => updateCost(c.id, 'amount', +e.target.value)} className={`${inputCls} pl-6`} min={0} />
                      </div>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button onClick={() => removeCost(c.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button onClick={addCost} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors font-semibold">
                    <Plus className="w-3.5 h-3.5" /> Agregar costo
                  </button>
                  <div className="text-sm font-bold text-white">
                    Total: <span className="text-red-400">{CURRENCY}{metrics.totalFixed.toLocaleString()}</span>/mes
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Health Indicators */}
      <div className="bg-[#0e1117] border border-white/5 rounded-xl p-5 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Diagnóstico de Salud Financiera</h3>
        <div className="flex flex-col gap-3">
          {[
            {
              label: 'Margen de Utilidad',
              status: metrics.margin >= 40 ? 'ok' : metrics.margin >= 20 ? 'warn' : 'err',
              msg: metrics.margin >= 40 ? `${metrics.margin}% — Tu agencia es muy rentable. ¡Excelente gestión!`
                : metrics.margin >= 20 ? `${metrics.margin}% — Aceptable. Busca reducir costos o subir tarifas.`
                  : `${metrics.margin}% — Crítico. Con menos de 20% de margen, la agencia no es sostenible.`,
            },
            {
              label: 'Punto de Equilibrio',
              status: clients >= metrics.minClientNeeded ? 'ok' : 'err',
              msg: clients >= metrics.minClientNeeded
                ? `Cubierto con ${clients} clientes (mínimo: ${metrics.minClientNeeded}).`
                : `Necesitas ${metrics.minClientNeeded - clients} cliente(s) más para cubrir costos fijos.`,
            },
            {
              label: 'Carga Operativa',
              status: metrics.hourlyLoad <= 160 ? 'ok' : 'warn',
              msg: metrics.hourlyLoad <= 160 ? `${metrics.hourlyLoad}h/mes — Operación dentro de capacidad normal.`
                : `${metrics.hourlyLoad}h/mes — Superás la capacidad de una persona. Considera contratar.`,
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              {item.status === 'ok'
                ? <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                : item.status === 'warn'
                  ? <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  : <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />}
              <div>
                <p className="text-xs font-bold text-gray-300">{item.label}</p>
                <p className="text-xs text-gray-500">{item.msg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export */}
      <div className="flex justify-end">
        <button onClick={exportCSV}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 rounded-xl text-sm font-semibold transition-all">
          <Download className="w-4 h-4" /> Exportar a CSV
        </button>
      </div>
    </div>
  );
}
