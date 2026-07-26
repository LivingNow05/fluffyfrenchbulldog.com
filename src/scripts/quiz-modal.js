// Motor de Calificación de Leads & Modal Quiz — Dinastía Bulldog Fluffy
// Datos inyectados desde Base.astro: window.FLUFFY_WA, FLUFFY_BRAND, FLUFFY_CATALOGO, FLUFFY_VARIEDAD.

(function () {
  const NUMERO = (window.FLUFFY_WA || window.GATOS_WA || '573128375043').replace(/[^\d]/g, '');
  const MARCA = window.FLUFFY_BRAND || window.GATOS_BRAND || 'Dinastía Bulldog Fluffy';
  const CATALOGO = window.FLUFFY_CATALOGO || window.GATOS_CATALOGO || [];
  const razaContexto = window.FLUFFY_VARIEDAD || window.GATOS_RAZA || null;
  const razaCtx = razaContexto
    ? CATALOGO.find((r) => r.nombre === razaContexto || r.slug === razaContexto || r.nombreCorto === razaContexto)
    : null;

  const cop = (n) => '$' + Number(n).toLocaleString('es-CO') + ' COP';
  const usd = (n) => '$' + Number(n).toLocaleString('en-US') + ' USD';

  // Detección de ciudad por el título ("... en Bogotá") como respaldo.
  let detectadaCiudad = null;
  const matchEn = (document.title || '').match(/\s+en\s+/i);
  if (matchEn) {
    const p = document.title.split(matchEn[0])[1];
    if (p) {
      const posible = p.split(/[|\-–]/)[0].trim();
      if (posible && !/colombia/i.test(posible)) detectadaCiudad = posible;
    }
  }

  // ─── Presupuestos: techos en COP para filtrar el catálogo ─────────────────────
  const PRESUPUESTOS = {
    inicial: { techo: 12000000, label: 'Inicial ($8.5M – $12M COP / $2.3K – $3K USD)' },
    medio: { techo: 16000000, label: 'Medio ($12M – $16M COP / $3K – $4.2K USD)' },
    premium: { techo: 22000000, label: 'Premium Exclusivo ($16M – $22M COP / $4.2K – $5.8K USD)' },
    show: { techo: Infinity, label: 'Calidad Show / Isabella ($22M+ COP / $5.8K+ USD)' },
  };

  // ─── Pasos del quiz ──────────────────────────────────────────────────────────
  const getBaseSteps = () => [
    {
      key: 'vivienda',
      question: '1. ¿Dónde vivirá tu cachorro Bulldog Fluffy?',
      options: [
        { value: 'Apartamento', emoji: '🏢', label: 'Apartamento', sub: 'Espacio interior climatizado' },
        { value: 'Casa', emoji: '🏡', label: 'Casa con patio', sub: 'Espacio amplio para jugar' },
      ],
    },
    {
      key: 'actividad',
      question: '2. ¿Qué temperamento o carácter prefieres?',
      options: [
        { value: 'tranquilo', emoji: '🛋️', label: 'Tranquilo - Faldero', sub: 'Consentido y relajado de regazo' },
        { value: 'moderado', emoji: '🎾', label: 'Juguetón - Enérgico', sub: 'Activo, curioso y dinámico' },
      ],
    },
    {
      key: 'ninos',
      question: '3. ¿Habrá niños compartiendo con el cachorro?',
      options: [
        { value: 'Sí', emoji: '👶', label: 'Sí', sub: 'Menores de 12 años en casa' },
        { value: 'No', emoji: '🧑', label: 'No', sub: 'Solo adultos o adolescentes' },
      ],
    },
    {
      key: 'presupuesto',
      question: '4. ¿Qué rango de inversión estimas para tu Fluffy?',
      options: [
        { value: 'inicial', emoji: '💵', label: 'Inicial', sub: '$8.5M – $12M COP (~$2.3K USD)' },
        { value: 'medio', emoji: '💰', label: 'Medio', sub: '$12M – $16M COP (~$3.5K USD)' },
        { value: 'premium', emoji: '💎', label: 'Premium Exclusivo', sub: '$16M – $22M COP (~$4.5K USD)' },
        { value: 'show', emoji: '👑', label: 'Calidad Show Isabella', sub: 'Sin límite ($22M+ COP / $5.8K+ USD)' },
      ],
    },
    {
      key: 'sexo',
      question: '5. ¿Prefieres Macho o Hembra?',
      options: [
        { value: 'Macho', emoji: '♂️', label: 'Macho', sub: 'Robusto y carismático' },
        { value: 'Hembra', emoji: '♀️', label: 'Hembra', sub: 'Tierna y compacta' },
        { value: 'Indiferente', emoji: '🐶', label: 'Indiferente', sub: 'El cachorro de mayor conexión' },
      ],
    },
  ];

  const stepCiudad = {
    key: 'ciudad',
    question: '¿A dónde viajaría el cachorrito?',
    subtitle: 'Hacemos entregas personales a los principales aeropuertos y ciudades.',
    note: '✈️ <strong>Nota de viaje:</strong> El traslado más toda la documentación sanitaria/aduanera tiene un valor aproximado de <strong>$1,000 USD</strong> (o menos, dependiendo de tu ubicación exacta).',
    placeholder: 'Ej. CDMX, México o Miami, USA',
    isInput: true,
  };

  // ─── Estado ─────────────────────────────────────────────────────────────────
  const state = { vivienda: '', actividad: '', ninos: '', presupuesto: '', sexo: '', ciudad: '' };
  let steps = [];
  let currentStep = 0;
  let isAnimating = false;
  let recomendadas = [];

  // ─── Clasificación del lead → recomendación de variedades ────────────────────
  function clasificar() {
    const techo = PRESUPUESTOS[state.presupuesto] ? PRESUPUESTOS[state.presupuesto].techo : Infinity;
    const scored = CATALOGO.map((r) => {
      const perfil = r.perfil || {};
      let score = 0;
      const dentroPresupuesto = r.desde <= techo;
      if (dentroPresupuesto) score += 4;
      else score -= 3;

      if (state.vivienda === 'Apartamento' && perfil.apartamento) score += 2;
      if (state.vivienda === 'Casa') score += 2;
      if (perfil.actividad === state.actividad || perfil.actividad === 'ambos') score += 2;
      if (state.actividad === 'tranquilo' && perfil.actividad === 'tranquilo') score += 3;
      if (state.ninos === 'Sí' && perfil.ninos) score += 2;

      if ((state.presupuesto === 'premium' || state.presupuesto === 'show') && (r.slug === 'fluffy-visual-isabella' || r.slug === 'fluffy-merle')) {
        score += 3;
      }

      return Object.assign({}, r, { score: score, dentroPresupuesto: dentroPresupuesto });
    });
    scored.sort((a, b) => b.score - a.score || a.desde - b.desde);

    if (razaCtx) {
      const otras = scored.filter((r) => r.slug !== razaCtx.slug && r.nombre !== razaCtx.nombre).slice(0, 2);
      const primera = Object.assign({}, razaCtx, { score: 99, dentroPresupuesto: razaCtx.desde <= techo });
      return [primera].concat(otras);
    }
    return scored.slice(0, 3);
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  function buildProgressBar(total) {
    const bar = document.getElementById('qm-progress');
    if (!bar) return;
    bar.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const seg = document.createElement('div');
      seg.className = 'qm-progress-seg' + (i <= currentStep ? ' is-active' : '');
      bar.appendChild(seg);
    }
  }

  function buildStepHTML(step) {
    if (step.isInput) {
      const isLast = currentStep === steps.length - 1;
      const btn = isLast ? 'Enviar a WhatsApp' : 'Siguiente';
      return `
        <h3 class="qm-question" style="text-align:center; margin-bottom:6px;">${step.question}</h3>
        ${step.subtitle ? `<p class="qm-subtitle" style="text-align:center; margin-bottom:14px;">${step.subtitle}</p>` : ''}
        ${step.note ? `
          <div class="qm-note-box" style="background: rgba(232, 166, 61, 0.08); border: 1.5px solid rgba(232, 166, 61, 0.25); border-radius: 14px; padding: 14px 16px; font-size: 0.86rem; line-height: 1.55; margin-bottom: 16px; color: var(--moon);">
            ${step.note}
          </div>
        ` : ''}
        <input id="qm-ciudad-input" type="text" class="qm-input" placeholder="${step.placeholder || 'Ej. CDMX, México o Miami, USA'}">
        <button type="button" id="qm-ciudad-btn" class="qm-next">${btn}</button>`;
    }
    const cols = step.options.length > 2 ? ' qm-options--grid' : '';
    return `
      <h3 class="qm-question">${step.question}</h3>
      <div class="qm-options${cols}">
        ${step.options
          .map(
            (opt) => `
          <button type="button" class="qm-opt" data-key="${step.key}" data-val="${String(opt.value).replace(/"/g, '&quot;')}">
            <span class="qm-opt-emoji">${opt.emoji}</span>
            <span class="qm-opt-label">${opt.label}</span>
            ${opt.sub ? `<span class="qm-opt-sub">${opt.sub}</span>` : ''}
          </button>`
          )
          .join('')}
      </div>`;
  }

  function attachStepListeners(step) {
    if (step.isInput) {
      const input = document.getElementById('qm-ciudad-input');
      const btn = document.getElementById('qm-ciudad-btn');
      if (!input || !btn) return;
      const go = () => {
        if (isAnimating) return;
        state.ciudad = input.value.trim() || 'No indicada';
        advance();
      };
      btn.addEventListener('click', go);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
      input.focus();
    } else {
      document.querySelectorAll('#qm-steps .qm-opt').forEach((btn) => {
        btn.addEventListener('click', function () {
          if (isAnimating) return;
          state[this.dataset.key] = this.dataset.val;
          advance();
        });
      });
    }
  }

  function advance() {
    currentStep++;
    if (currentStep < steps.length) goToStep();
    else showResult();
  }

  function goToStep() {
    if (isAnimating) return;
    isAnimating = true;
    const c = document.getElementById('qm-steps');
    if (!c) return;
    c.style.opacity = '0';
    setTimeout(function () {
      buildProgressBar(steps.length);
      c.innerHTML = buildStepHTML(steps[currentStep]);
      attachStepListeners(steps[currentStep]);
      void c.offsetHeight;
      c.style.opacity = '1';
      isAnimating = false;
    }, 250);
  }

  function renderStep() {
    buildProgressBar(steps.length);
    const c = document.getElementById('qm-steps');
    if (!c) return;
    c.style.opacity = '1';
    c.innerHTML = buildStepHTML(steps[currentStep]);
    attachStepListeners(steps[currentStep]);
  }

  // ─── Paso de resultado: recomendación + precios reales ──────────────────────
  function showResult() {
    recomendadas = clasificar();
    const top = recomendadas[0];

    const badge = document.getElementById('qm-badge');
    const title = document.getElementById('qm-title');
    const subtitle = document.getElementById('qm-subtitle');

    if (badge) badge.textContent = '✓ EXPEDIENTE CALCULADO';
    if (razaCtx) {
      if (title) title.textContent = `El ${razaCtx.nombreCorto || razaCtx.nombre} encaja contigo 🐾`;
      if (subtitle)
        subtitle.textContent = top.dentroPresupuesto
          ? 'Está dentro de tu rango de inversión. Escríbenos para ver fotos y camadas disponibles en tiempo real.'
          : 'Revisa también estas excelentes alternativas según tu presupuesto.';
    } else {
      if (title) title.textContent = `Tu match ideal: ${top.nombreCorto || top.nombre} 🐾`;
      if (subtitle)
        subtitle.textContent =
          'Según tu perfil y requerimientos, estas son las variedades exóticas que mejor se adaptan a ti:';
    }

    const c = document.getElementById('qm-steps');
    if (!c) return;
    c.style.opacity = '0';
    setTimeout(() => {
      buildProgressBar(steps.length + 1);
      document.querySelectorAll('.qm-progress-seg').forEach((s) => s.classList.add('is-active'));
      c.innerHTML = `
        <div class="qm-result">
          ${recomendadas
            .map(
              (r, i) => `
            <button type="button" class="qm-rec${i === 0 ? ' is-top is-selected' : ''}" data-slug="${r.slug}">
              <span class="qm-rec-emoji">🐶</span>
              <span class="qm-rec-info">
                <span class="qm-rec-name">${r.nombreCorto || r.nombre}${i === 0 ? '<span class="qm-rec-badge">Mejor Match</span>' : ''}</span>
                <span class="qm-rec-tag">${(r.perfil && r.perfil.tagline) || ''}</span>
              </span>
              <span class="qm-rec-price">desde<br><strong>${cop(r.desde)}</strong><br><small>(${usd(r.desdeUSD)})</small></span>
            </button>`
            )
            .join('')}
        </div>
        <button type="button" id="qm-wa-btn" class="qm-next qm-next--wa">💬 Enviar Expediente por WhatsApp</button>
        <a class="qm-link" href="${top.url || '/#variedades'}">Ver detalles y ficha técnica de ${top.nombreCorto || top.nombre} →</a>`;
      void c.offsetHeight;
      c.style.opacity = '1';

      let elegido = top;
      c.querySelectorAll('.qm-rec').forEach((btn) => {
        btn.addEventListener('click', function () {
          elegido = recomendadas.find((r) => r.slug === this.dataset.slug) || top;
          c.querySelectorAll('.qm-rec').forEach((b) => b.classList.remove('is-selected'));
          this.classList.add('is-selected');
        });
      });
      const waBtn = document.getElementById('qm-wa-btn');
      if (waBtn) waBtn.addEventListener('click', () => finalize(elegido));
    }, 250);
  }

  // ─── Mensaje de WhatsApp ─────────────────────────────────────────────────────
  function buildMessage(elegido) {
    let msg = `Hola ${MARCA} 🐾\n`;
    if (elegido) {
      msg += `📦 ME INTERESA: ${elegido.nombre} (desde ${cop(elegido.desde)} / ${usd(elegido.desdeUSD)})\n`;
    }

    const tienePerfil = state.vivienda || state.actividad || state.ninos || state.presupuesto || state.sexo;
    if (tienePerfil) {
      msg += '\n📋 EXPEDIENTE DEL CLIENTE:\n';
      if (state.vivienda) msg += `🏠 Vivienda: ${state.vivienda}\n`;
      if (state.actividad) msg += `🛋️ Carácter: ${state.actividad === 'tranquilo' ? 'Tranquilo - Faldero' : 'Juguetón - Enérgico'}\n`;
      if (state.ninos) msg += `👶 Niños en casa: ${state.ninos}\n`;
      if (state.presupuesto && PRESUPUESTOS[state.presupuesto]) msg += `💰 Presupuesto: ${PRESUPUESTOS[state.presupuesto].label}\n`;
      if (state.sexo) msg += `⚥ Sexo preferido: ${state.sexo}\n`;
    }
    if (state.ciudad && state.ciudad !== 'No indicada') {
      msg += `📍 Ciudad / Entrega: ${state.ciudad} (Envío estimado ~$1.000 USD / $3.8M COP)\n`;
    } else if (detectadaCiudad) {
      msg += `📍 Ciudad / Entrega: ${detectadaCiudad} (Envío estimado ~$1.000 USD / $3.8M COP)\n`;
    }

    msg += '\nDeseo conocer disponibilidad actual de camadas, fotos/videos reales y proceso de reserva.';
    return msg;
  }

  function finalize(elegido) {
    const url = `https://wa.me/${NUMERO}?text=${encodeURIComponent(buildMessage(elegido))}`;
    closeModal();
    window.open(url, '_blank');
  }

  // ─── Control del modal ───────────────────────────────────────────────────────
  function openModal() {
    currentStep = 0;
    isAnimating = false;
    Object.keys(state).forEach((k) => (state[k] = ''));

    steps = getBaseSteps();
    if (!detectadaCiudad) steps.push(stepCiudad);

    const badge = document.getElementById('qm-badge');
    const title = document.getElementById('qm-title');
    const subtitle = document.getElementById('qm-subtitle');

    if (razaCtx) {
      if (badge) badge.textContent = 'CASI LISTO';
      if (title) title.textContent = `¿El ${razaCtx.nombreCorto || razaCtx.nombre} es para ti? 🐾`;
      if (subtitle) subtitle.textContent = 'Responde 6 preguntas breves para confirmar si encaja contigo y consultar disponibilidad con envío seguro a tu ciudad.';
    } else {
      if (badge) badge.textContent = 'ENCUENTRA TU BULLDOG FLUFFY IDEAL';
      if (title) title.textContent = 'Cuéntanos un poco sobre ti';
      if (subtitle) subtitle.textContent = 'Te recomendamos la variedad de Bulldog Fluffy perfecta según tu perfil, estilo de vida y presupuesto.';
    }

    renderStep();
    const overlay = document.getElementById('qm-overlay');
    if (overlay) {
      overlay.style.display = 'flex';
      overlay.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const overlay = document.getElementById('qm-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  }

  // Exponer funciones globales
  window.openQuizModal = openModal;
  window.closeQuizModal = closeModal;

  function initModalListeners() {
    const closeBtn = document.getElementById('qm-close');
    const backdrop = document.getElementById('qm-backdrop');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      const overlay = document.getElementById('qm-overlay');
      if (e.key === 'Escape' && overlay && overlay.style.display === 'flex') closeModal();
    });

    // Interceptar todos los enlaces a WhatsApp del sitio
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href*="wa.me"], a[href*="whatsapp.com"], a[href*="api.whatsapp"], .whatsapp-float, .btn-whatsapp');
      if (!link) return;
      if (link.closest('#qm-overlay')) return;
      e.preventDefault();
      openModal();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModalListeners);
  } else {
    initModalListeners();
  }
})();
