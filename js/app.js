/**
 * INFLAPY - Renta de Inflables para Fiestas
 * JavaScript Interactivo
 *
 * Note: Header navigation is handled by components.js
 * This file handles page-specific interactions
 */

(function() {
  'use strict';

  // ============================================
  // Wait for components to load before initializing
  // ============================================
  function initializeApp() {
    // Header scroll effect (works after component loads)
    initHeaderScrollEffect();
  }

  // Listen for components ready event
  document.addEventListener('components:ready', initializeApp);

  // Fallback if components already loaded or not using component system
  if (document.querySelector('.header')) {
    initHeaderScrollEffect();
  }

  function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    if (!header) return;

    function handleHeaderScroll() {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    // Run once on load
    handleHeaderScroll();
  }

  // ============================================
  // Catalog Filter
  // ============================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(function(btn) {
        btn.classList.remove('active');
      });

      // Add active class to clicked button
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');

      productCards.forEach(function(card) {
        const category = card.getAttribute('data-category');

        if (filter === 'todos' || category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  // Cache header height to avoid repeated reflows
  let cachedHeaderHeight = null;

  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');

      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();

        // Calculate header height once and cache it
        if (cachedHeaderHeight === null) {
          const header = document.querySelector('.header');
          cachedHeaderHeight = header ? header.offsetHeight : 0;
        }

        // Use requestAnimationFrame to batch DOM reads
        requestAnimationFrame(function() {
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - cachedHeaderHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        });
      }
    });
  });


  // ============================================
  // FAQ Accordion Enhancement
  // ============================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function(item) {
    const summary = item.querySelector('summary');

    summary.addEventListener('click', function() {
      // Close other open items
      faqItems.forEach(function(otherItem) {
        if (otherItem !== item && otherItem.hasAttribute('open')) {
          otherItem.removeAttribute('open');
        }
      });
    });
  });

  // ============================================
  // Lazy Load Images (placeholder for future)
  // ============================================
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(function(img) {
      imageObserver.observe(img);
    });
  }

  // ============================================
  // WhatsApp Button - Always Visible (no animation)
  // ============================================


  // ============================================
  // Form Validation (for future contact form)
  // ============================================
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]{10,}$/;
    return re.test(phone);
  }

  // Export for potential future use
  window.INFLAPY = {
    validateEmail: validateEmail,
    validatePhone: validatePhone
  };

  // ============================================
  // Console Welcome Message
  // ============================================
  console.log(
    '%c INFLAPY %c La Fiesta Mas Epica! ',
    'background: linear-gradient(135deg, #ff12cc, #FFD93D); color: white; padding: 10px 20px; border-radius: 5px 0 0 5px; font-weight: bold; font-size: 16px;',
    'background: #111827; color: #ff12cc; padding: 10px 20px; border-radius: 0 5px 5px 0; font-size: 14px;'
  );

})();
