import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initGSAPAnimations() {
  if (typeof window === 'undefined') return;

  // Refresh ScrollTrigger to accommodate dynamically toggled layouts
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);

  // 1. Scroll reveals con staggers fluidos en las tarjetas de variedades (.card), ciudades (.city-card) y precios (.price-card)
  const selectorsToReveal = ['.card', '.city-card', '.price-card', '.stat-card'];
  
  selectorsToReveal.forEach((sel) => {
    const cards = document.querySelectorAll(sel);
    if (!cards || cards.length === 0) return;

    // Agrupar elementos por su contenedor padre para animar el stagger por bloque de grid
    const parents = new Set();
    cards.forEach((c) => {
      if (c.parentElement) parents.add(c.parentElement);
    });

    parents.forEach((parent) => {
      const parentCards = Array.from(parent.children).filter((child) => 
        child.matches(sel) || child.querySelector(sel)
      );

      const targets = parentCards.length > 0 ? parentCards : parent.querySelectorAll(sel);

      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y: 35,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: parent,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  });

  // 2. Parallax sutil en las fotos de los cachorros
  const puppyImgs = document.querySelectorAll(
    '.hero-puppy-photo, .card img, .photo-showcase-frame img, .hero-centered-puppy-img, .review-image img'
  );
  puppyImgs.forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: {
          trigger: img.parentElement || img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      }
    );
  });

  // 3. Micro-animación magnética en los botones primarios (.btn-dock-primary, .btn-whatsapp, .btn-dock-whatsapp)
  const magneticBtns = document.querySelectorAll(
    '.btn-dock-primary, .btn-whatsapp, .btn-dock-whatsapp, .nav-cta, .btn-all-cities'
  );
  magneticBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.25,
        y: y * 0.25,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)',
      });
    });
  });
}

// Inicialización automática
if (typeof window !== 'undefined') {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initGSAPAnimations, 50);
  } else {
    document.addEventListener('DOMContentLoaded', initGSAPAnimations);
  }
}
