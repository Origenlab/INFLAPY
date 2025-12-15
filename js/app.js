/**
 * INFLAPY - Renta de Inflables para Fiestas
 * JavaScript Interactivo (Optimizado para rendimiento)
 */

(function() {
  'use strict';

  // ============================================
  // Header Scroll Effect (optimizado)
  // ============================================
  let ticking = false;
  let lastScrollY = 0;
  let header = null;
  let isScrolled = false;

  function updateHeader() {
    if (!header) return;

    const shouldBeScrolled = lastScrollY > 50;

    // Solo modificar DOM si el estado cambio
    if (shouldBeScrolled !== isScrolled) {
      isScrolled = shouldBeScrolled;
      if (isScrolled) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    ticking = false;
  }

  function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  function initHeaderScrollEffect() {
    header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', onScroll, { passive: true });
    // Estado inicial sin forzar reflow
    lastScrollY = window.scrollY;
    updateHeader();
  }

  // ============================================
  // Inicializacion diferida
  // ============================================
  function initializeApp() {
    initHeaderScrollEffect();
    initCatalogFilter();
    initSmoothScroll();
    initFaqAccordion();
    initLazyImages();
  }

  // Esperar a que el DOM este listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    // DOM ya esta listo, usar requestIdleCallback si esta disponible
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initializeApp);
    } else {
      setTimeout(initializeApp, 1);
    }
  }

  // ============================================
  // Catalog Filter
  // ============================================
  function initCatalogFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (!filterButtons.length) return;

    filterButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        filterButtons.forEach(function(btn) {
          btn.classList.remove('active');
        });
        button.classList.add('active');

        const filter = button.dataset.filter;

        // Batch DOM changes
        requestAnimationFrame(function() {
          productCards.forEach(function(card) {
            const category = card.dataset.category;
            card.style.display = (filter === 'todos' || category === filter) ? 'block' : 'none';
          });
        });
      });
    });
  }

  // ============================================
  // Smooth Scroll (optimizado)
  // ============================================
  let cachedHeaderHeight = null;

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();

        // Calcular header height una sola vez
        if (cachedHeaderHeight === null) {
          const headerEl = document.querySelector('.header');
          cachedHeaderHeight = headerEl ? headerEl.offsetHeight : 0;
        }

        // Usar requestAnimationFrame para evitar reflow
        requestAnimationFrame(function() {
          const rect = targetElement.getBoundingClientRect();
          const targetPosition = rect.top + window.scrollY - cachedHeaderHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        });
      });
    });
  }

  // ============================================
  // FAQ Accordion
  // ============================================
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
      const summary = item.querySelector('summary');
      if (!summary) return;

      summary.addEventListener('click', function() {
        faqItems.forEach(function(otherItem) {
          if (otherItem !== item && otherItem.hasAttribute('open')) {
            otherItem.removeAttribute('open');
          }
        });
      });
    });
  }

  // ============================================
  // Lazy Load Images
  // ============================================
  function initLazyImages() {
    if (!('IntersectionObserver' in window)) return;

    const lazyImages = document.querySelectorAll('img[data-src]');
    if (!lazyImages.length) return;

    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });

    lazyImages.forEach(function(img) {
      imageObserver.observe(img);
    });
  }

  // ============================================
  // Utilidades exportadas
  // ============================================
  window.INFLAPY = {
    validateEmail: function(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    validatePhone: function(phone) {
      return /^[\d\s\-\+\(\)]{10,}$/.test(phone);
    }
  };

})();
