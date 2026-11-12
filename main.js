(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  $('#year').textContent = new Date().getFullYear();

  /* ---------- Menú móvil ---------- */
  const burger = $('#burger'), links = $('#navLinks');
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', e => {
    if (e.target.tagName === 'A') { links.classList.remove('open'); burger.setAttribute('aria-expanded', false); }
  });

  /* ---------- Formulario -> WhatsApp ---------- */
  const form = $('#quoteForm'), msg = $('#formMsg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    $$('input[required]', form).forEach(i => {
      const bad = !i.value.trim();
      i.parentElement.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });
    msg.classList.remove('ok');
    if (!ok) { msg.textContent = 'Completá los campos marcados para continuar.'; return; }
    const d = Object.fromEntries(new FormData(form));
    const text = [
      '| desde Web | Consulta de póliza para vehículo',
      `Nombre: ${d.nombre}`,
      `Vehículo: ${d.marca} ${d.modelo} (${d.anio})`,
      `Código postal: ${d.cp}`,
      `Celular: ${d.tel}`,
      d.mail ? `Mail: ${d.mail}` : ''
    ].filter(Boolean).join('\n');
    msg.classList.add('ok');
    msg.textContent = '¡Listo! Te abrimos WhatsApp para enviar tu consulta.';
    window.open(`https://api.whatsapp.com/send/?phone=5491133971956&text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
  $$('input', form).forEach(i => i.addEventListener('input', () => i.parentElement.classList.remove('invalid')));

  /* ---------- Animaciones ---------- */
  if (!window.gsap || !window.ScrollTrigger) return; // sin GSAP el sitio sigue funcionando
  gsap.registerPlugin(ScrollTrigger);

  // Parte textos en palabras (respeta <em>)
  function splitWords(el) {
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(' '); return; }
            const w = document.createElement('span'); w.className = 'w';
            const s = document.createElement('span'); s.textContent = part;
            w.append(s); frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    return $$('.w > span', el);
  }

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    /* Barra de progreso */
    gsap.to('.progress span', { scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.2 } });

    /* Nav: se oculta al bajar, vuelve al subir */
    const nav = $('#nav');
    ScrollTrigger.create({
      start: 120,
      onUpdate: self => {
        const hide = self.direction === 1 && self.scroll() > 200 && !links.classList.contains('open');
        gsap.to(nav, { yPercent: hide ? -160 : 0, duration: .35, ease: 'power2.out', overwrite: true });
      }
    });

    /* Intro del hero */
    const words = splitWords($('.hero h1'));
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(nav, { y: -80, opacity: 0, duration: .8 })
      .from('.hero .eyebrow', { y: 20, opacity: 0, duration: .6 }, '-=.4')
      .from(words, { yPercent: 115, duration: .9, stagger: .06 }, '-=.4')
      .from('.hero .lead', { y: 24, opacity: 0, duration: .7 }, '-=.5')
      .from('.hero__actions > *', { y: 20, opacity: 0, stagger: .1, duration: .6 }, '-=.5')
      .from('.hero__trust li', { y: 14, opacity: 0, stagger: .08, duration: .5 }, '-=.4')
      .from('.photo', { clipPath: 'inset(0 0 100% 0 round 36px)', duration: 1.2, ease: 'power4.out' }, 0.3)
      .from('.float', { scale: .6, opacity: 0, stagger: .15, duration: .7, ease: 'back.out(1.7)' }, '-=.5');

    /* Flotado continuo de las tarjetas del hero */
    $$('.float').forEach((f, i) => gsap.to(f, { y: i % 2 ? 12 : -12, duration: 2.4 + i * .4, repeat: -1, yoyo: true, ease: 'sine.inOut' }));

    /* Parallax: elementos con data-parallax se mueven a distinta velocidad */
    $$('[data-parallax]').forEach(el => {
      const amt = +el.dataset.parallax;
      const target = el.classList.contains('photo') ? $('img', el) : el;
      gsap.to(target, { y: el.classList.contains('photo') ? amt : amt, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    });
    gsap.to('.blob--1', { y: 200, x: -60, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.blob--2', { y: -160, x: 80, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__copy', { y: -60, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: '55% top', end: 'bottom top', scrub: true } });
    gsap.to('.scrollhint', { opacity: 0, scrollTrigger: { trigger: '.hero', start: '5% top', end: '15% top', scrub: true } });

    /* Títulos de sección: palabra por palabra al entrar */
    $$('.section h2.split, .quote h2.split').forEach(h => {
      const w = splitWords(h);
      gsap.from(w, { yPercent: 115, duration: .9, stagger: .05, ease: 'power3.out',
        scrollTrigger: { trigger: h, start: 'top 85%', once: true } });
    });

    /* Entradas generales */
    gsap.utils.toArray('.section__head .eyebrow,.section__head .lead,.steps__head > *:not(h2),.quote__copy > *:not(h2),.logos__title').forEach(el =>
      gsap.from(el, { y: 30, opacity: 0, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));

    gsap.from('.logos .marquee', { opacity: 0, y: 20, duration: 1, scrollTrigger: { trigger: '.logos', start: 'top 90%', once: true } });

    /* Tarjetas: aparecen en cascada con leve rotación */
    ScrollTrigger.batch('.card', {
      start: 'top 88%', once: true,
      onEnter: b => gsap.from(b, { y: 80, opacity: 0, rotate: 2, scale: .96, duration: .9, stagger: .12, ease: 'power3.out', clearProps: 'transform,opacity' })
    });
    // Las tarjetas de columnas distintas "viajan" a diferente velocidad al scrollear
    $$('.card').forEach((c, i) => {
      if (i % 3 === 1) gsap.fromTo(c, { y: 40 }, { y: -30, ease: 'none', scrollTrigger: { trigger: '.cards', start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    /* Contadores */
    $$('[data-count]').forEach(el => {
      const end = +el.dataset.count, plain = el.dataset.plain;
      el.dataset.suffix = el.dataset.suffix || '';
      el.firstChild.nodeValue = 0;
      const o = { v: 0 };
      gsap.to(o, { v: end, duration: 1.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => { el.firstChild ? el.firstChild.nodeValue = Math.round(o.v) : (el.textContent = Math.round(o.v)); } });
    });
    gsap.from('.stats__grid > div', { y: 40, opacity: 0, stagger: .12, duration: .8, scrollTrigger: { trigger: '.stats', start: 'top 85%', once: true } });

    /* Pasos: la línea se dibuja con el scroll y cada paso entra desde la derecha */
    gsap.to('.steps__line i', { scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: '.steps__list', start: 'top 65%', end: 'bottom 70%', scrub: true } });
    $$('.step').forEach(s => gsap.from(s, { x: 70, opacity: 0, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: s, start: 'top 85%', once: true } }));

    /* Formulario y paneles */
    gsap.from('.form', { y: 80, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.form', start: 'top 85%', once: true } });
    gsap.from('.quote', { scale: .94, borderRadius: 80, ease: 'none', scrollTrigger: { trigger: '.quote', start: 'top 100%', end: 'top 40%', scrub: true } });
    gsap.from('.panel', { y: 60, opacity: 0, stagger: .15, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.duo', start: 'top 85%', once: true } });

    /* Botón WhatsApp: aparece tras salir del hero */
    gsap.from('.wa-float', { scale: 0, duration: .6, ease: 'back.out(2)', delay: 1.6 });

    /* Efectos solo con mouse */
    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      // Inclinación 3D + brillo que sigue al cursor
      $$('.tilt').forEach(card => {
        const rx = gsap.quickTo(card, 'rotationX', { duration: .5, ease: 'power3' });
        const ry = gsap.quickTo(card, 'rotationY', { duration: .5, ease: 'power3' });
        card.addEventListener('pointermove', e => {
          const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
          ry((x - .5) * 10); rx((.5 - y) * 10);
          card.style.setProperty('--mx', x * 100 + '%'); card.style.setProperty('--my', y * 100 + '%');
        });
        card.addEventListener('pointerleave', () => { rx(0); ry(0); });
        gsap.set(card, { transformPerspective: 900 });
      });
      // Botón magnético
      $$('.magnetic').forEach(b => {
        const x = gsap.quickTo(b, 'x', { duration: .4, ease: 'power3' }), y = gsap.quickTo(b, 'y', { duration: .4, ease: 'power3' });
        b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * .25); y((e.clientY - r.top - r.height / 2) * .35); });
        b.addEventListener('pointerleave', () => { x(0); y(0); });
      });
    }
  });
})();
