import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle2, Star, TrendingUp } from 'lucide-react';

const templates = [
  {
    id: 1, categoria: 'Bienvenida', icon: '👋', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    nombre: 'Email de Bienvenida Premium',
    asunto: '¡Bienvenid@ a [MARCA]! Tu [RECURSO] está aquí 🎁',
    tags: ['Alta apertura', 'Automático', 'TOFU'],
    cr: '45%', openRate: '72%',
    cuerpo: `Hola [NOMBRE] 👋

¡Bienvenido/a a la familia [MARCA]!

Estamos muy contentos de tenerte aquí. 

Tal como te prometí, aquí tienes acceso a tu [RECURSO GRATUITO]:

→ [ENLACE AL RECURSO]

Durante los próximos días te voy a compartir las mejores estrategias para [BENEFICIO PRINCIPAL que le interesa al suscriptor].

Pero antes, cuéntame: ¿cuál es tu mayor reto ahora mismo con [TEMA]?

Solo responde a este email. Lo leo todo personalmente.

Un abrazo,
[NOMBRE]
Fundador/a de [MARCA]

---
P.D. Si tienes preguntas, escríbeme directamente. ¡Estoy aquí para ayudarte!`,
  },
  {
    id: 2, categoria: 'Venta', icon: '🛒', color: 'text-red-400 bg-red-500/10 border-red-500/20',
    nombre: 'Email de Oferta con Urgencia',
    asunto: '⏰ Solo 48h: [DESCUENTO]% en [PRODUCTO] (se acaba pronto)',
    tags: ['Conversión', 'Urgencia', 'BOFU'],
    cr: '8.5%', openRate: '38%',
    cuerpo: `Hola [NOMBRE],

Sé directo/a contigo: hoy tengo algo especial.

Durante las próximas 48 horas, puedes acceder a [PRODUCTO/SERVICIO] con un [X]% de descuento exclusivo.

¿Por qué ahora? Porque [RAZÓN GENUINA: nuevo año, celebración, lanzamiento, etc.]

Lo que incluye:
✅ [BENEFICIO 1]
✅ [BENEFICIO 2]  
✅ [BENEFICIO 3]
✅ Bonus: [BONUS EXCLUSIVO]

→ Quiero acceder ahora: [ENLACE]

Precio normal: $[PRECIO] | HOY: $[PRECIO OFERTA]

Esta oferta vence el [FECHA] a las 23:59h.

[NOMBRE]

---
Garantía: Si en [X días] no estás satisfecho/a, te devuelvo el 100%. Sin preguntas.`,
  },
  {
    id: 3, categoria: 'Contenido', icon: '📚', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    nombre: 'Newsletter Semanal de Valor',
    asunto: '3 cosas que aprendí esta semana sobre [TEMA] 🧠',
    tags: ['Valor puro', 'Fidelización', 'Sin venta'],
    cr: '—', openRate: '28%',
    cuerpo: `Hola [NOMBRE],

Esta semana ha sido intensa. Y quiero compartir contigo las 3 cosas que más me han marcado:

**1. [APRENDIZAJE 1]**
[Explicación de 2-3 líneas. Ser concreto/a y accionable]

**2. [APRENDIZAJE 2]**
[Explicación de 2-3 líneas]

**3. [APRENDIZAJE 3]**  
[Explicación de 2-3 líneas]

La semana que viene te cuento sobre [PRÓXIMO TEMA]. Es algo que muy pocos saben y que cambia completamente la forma de [RESULTADO].

Cuídate,
[NOMBRE]

---
¿Conoces a alguien que se beneficiaría de estos tips? Reenvíale este email 🙏`,
  },
  {
    id: 4, categoria: 'Reactivación', icon: '🔄', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    nombre: 'Re-engagement de Inactivos',
    asunto: '¿Sigues ahí? No quiero molestarte más si no quieres 😕',
    tags: ['Reactivación', 'Lista limpia', 'Re-engagement'],
    cr: '12%', openRate: '25%',
    cuerpo: `Hola [NOMBRE],

Llevas un tiempo sin abrir mis emails y lo entiendo perfectamente.

La vida es muy ocupada y los inboxes están llenos.

Antes de despedirnos, quiero hacerte una pregunta directa:

¿Quieres seguir recibiendo mis emails sobre [TEMA]?

Si la respuesta es SÍ → Haz clic aquí para confirmar: [ENLACE]
(Y de regalo te envío [BONUS ESPECIAL])

Si la respuesta es NO → No pasa nada. Puedes darte de baja aquí: [ENLACE BAJA]
(Sin dramas, sin rencores 😊)

Gracias por haber estado en esta lista.

[NOMBRE]`,
  },
  {
    id: 5, categoria: 'Carrito Abandonado', icon: '🛒', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    nombre: 'Recuperación de Carrito Abandonado',
    asunto: 'Olvidaste algo importante... [NOMBRE] 🤔',
    tags: ['E-commerce', 'Recuperación', 'Alto ROI'],
    cr: '15%', openRate: '45%',
    cuerpo: `Hola [NOMBRE],

Veo que dejaste algo en tu carrito...

[IMAGEN DEL PRODUCTO]

[NOMBRE DEL PRODUCTO] — $[PRECIO]

¿Pasó algo? A veces hay una duda de última hora y lo entiendo perfectamente.

Pero si lo que te frenó fue el precio, tengo buenas noticias:

Durante las próximas 2 horas, te reservo el 10% de descuento adicional:

→ Completar mi compra ahora: [ENLACE CON DESCUENTO]

Si simplemente cambiaste de opinión, no hay problema. No volveré a escribirte sobre esto.

[NOMBRE]

---
⚠️ Este descuento expira en 2 horas.`,
  },
  {
    id: 6, categoria: 'Post-Compra', icon: '🎉', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    nombre: 'Bienvenida a Clientes Nuevos',
    asunto: '¡Listo [NOMBRE]! Tu acceso está listo (y hay algo más) 🎉',
    tags: ['Onboarding', 'Post-venta', 'Fidelización'],
    cr: '—', openRate: '68%',
    cuerpo: `Hola [NOMBRE] 🎉

¡Felicidades! Tu compra de [PRODUCTO] fue confirmada.

Aquí tienes tus accesos:
→ [ENLACE DE ACCESO]
→ Usuario: [EMAIL]
→ Contraseña: [PASSWORD o INSTRUCCIONES]

Para empezar con buen pie, te recomiendo hacer esto primero:

1️⃣ [PRIMER PASO concreto y sencillo]
2️⃣ [SEGUNDO PASO]
3️⃣ Únete a nuestra comunidad: [ENLACE GRUPO/COMUNIDAD]

Y recuerda: si tienes CUALQUIER duda, responde a este email. 
Estoy aquí para asegurarme de que obtienes resultados reales.

¡Nos vemos dentro!
[NOMBRE]

---
P.D. En 3 días te escribo con [SIGUIENTE PASO]. Así sabrás exactamente qué hacer.`,
  },
];

const categorias = ['Todos', 'Bienvenida', 'Venta', 'Contenido', 'Reactivación', 'Carrito Abandonado', 'Post-Compra'];

const EmailTemplates = () => {
  const [filtro, setFiltro] = useState('Todos');
  const [copiado, setCopiado] = useState(null);
  const [abierto, setAbierto] = useState(null);

  const filtrados = filtro === 'Todos' ? templates : templates.filter(t => t.categoria === filtro);

  const copiar = (texto, id) => {
    navigator.clipboard.writeText(texto);
    setCopiado(id);
    setTimeout(() => setCopiado(null), 2000);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Biblioteca de Plantillas de Email</h3>
          <p className="text-gray-400 text-sm">Templates probados y listos para personalizar. Basados en las mejores marcas del sector.</p>
        </div>
        <div className="text-xs text-gray-500 bg-violet-500/10 border border-violet-500/20 px-3 py-2 rounded-xl flex-shrink-0">
          ✨ {templates.length} templates disponibles
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
        {categorias.map(cat => (
          <button key={cat} onClick={() => setFiltro(cat)}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 border transition-all ${
              filtro === cat ? 'bg-violet-500/15 border-violet-500/50 text-white' : 'bg-[#1a1d24] border-white/5 text-gray-400 hover:text-white'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtrados.map(template => (
          <motion.div key={template.id}
            className={`bg-[#1a1d24] rounded-2xl border overflow-hidden ${template.color}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{template.icon}</span>
                  <div>
                    <h4 className="font-bold text-white text-sm">{template.nombre}</h4>
                    <span className={`text-xs font-bold ${template.color.split(' ')[0]}`}>{template.categoria}</span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => copiar(`Asunto: ${template.asunto}\n\n${template.cuerpo}`, template.id)}
                    className="p-1.5 bg-[#111318] rounded-lg hover:bg-white/10 transition-colors" title="Copiar template completo">
                    {copiado === template.id ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-500" />}
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-1.5 mb-3 flex-wrap">
                {template.tags.map(tag => (
                  <span key={tag} className="text-xs bg-[#111318] text-gray-400 px-2 py-0.5 rounded-md border border-white/5">{tag}</span>
                ))}
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-[#111318] rounded-lg p-2 text-center">
                  <div className={`font-black text-sm ${template.color.split(' ')[0]}`}>{template.openRate}</div>
                  <div className="text-xs text-gray-500">Open Rate</div>
                </div>
                <div className="bg-[#111318] rounded-lg p-2 text-center">
                  <div className={`font-black text-sm ${template.color.split(' ')[0]}`}>{template.cr}</div>
                  <div className="text-xs text-gray-500">Conv. Rate</div>
                </div>
              </div>

              {/* Asunto */}
              <div className="bg-[#111318] rounded-xl p-3 mb-3">
                <div className="text-xs text-gray-500 mb-1">📧 Línea de asunto:</div>
                <p className="text-xs text-white font-medium leading-relaxed">{template.asunto}</p>
              </div>

              {/* Preview / Expandir */}
              <button onClick={() => setAbierto(abierto === template.id ? null : template.id)}
                className={`w-full text-xs font-bold py-2 rounded-xl border transition-all ${template.color}`}>
                {abierto === template.id ? '↑ Cerrar plantilla' : '↓ Ver plantilla completa'}
              </button>
            </div>

            {abierto === template.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                className="border-t border-white/5 bg-[#0e1117] overflow-hidden">
                <div className="p-5">
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed font-sans max-h-64 overflow-y-auto">
                    {template.cuerpo}
                  </pre>
                  <button onClick={() => copiar(template.cuerpo, `body-${template.id}`)}
                    className="mt-3 w-full flex items-center justify-center gap-2 bg-violet-500/15 border border-violet-500/30 text-violet-300 font-bold py-2 rounded-xl text-xs hover:bg-violet-500/25 transition-colors">
                    {copiado === `body-${template.id}` ? <><CheckCircle2 className="w-3.5 h-3.5" /> ¡Copiado!</> : <><Copy className="w-3.5 h-3.5" /> Copiar cuerpo del email</>}
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EmailTemplates;
