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
  // Animated Counter
  // ============================================
  function animateCounter(element, target, duration) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    function updateCounter() {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    }

    updateCounter();
  }

  // Intersection Observer for counters
  const statsSection = document.querySelector('.stats-bar');
  let countersAnimated = false;

  if (statsSection) {
    const observerOptions = {
      threshold: 0.5
    };

    const statsObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;

          document.querySelectorAll('.stat-number[data-count]').forEach(function(counter) {
            const target = parseInt(counter.getAttribute('data-count'), 10);
            animateCounter(counter, target, 2000);
          });
        }
      });
    }, observerOptions);

    statsObserver.observe(statsSection);
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
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Add fadeInUp animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);

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
  // Intersection Observer for Animations
  // ============================================
  const animatedElements = document.querySelectorAll('.product-card, .step-card, .testimonio-card, .faq-item');

  const animationObserver = new IntersectionObserver(function(entries) {
    // Batch all DOM writes in a single requestAnimationFrame
    requestAnimationFrame(function() {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated-visible');
          animationObserver.unobserve(entry.target);
        }
      });
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Use CSS classes instead of inline styles to avoid reflows
  if (animatedElements.length > 0) {
    // Add animation styles via CSS class
    const animStyle = document.createElement('style');
    animStyle.textContent = `
      .animated-element {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      .animated-visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(animStyle);

    // Apply classes in a batch
    requestAnimationFrame(function() {
      animatedElements.forEach(function(el, index) {
        el.classList.add('animated-element');
        el.style.transitionDelay = (index % 4) * 0.1 + 's';
        animationObserver.observe(el);
      });
    });
  }

  // ============================================
  // Confetti Effect on CTA Hover
  // ============================================
  const confettiContainer = document.querySelector('.confetti-container');
  const ctaButtons = document.querySelectorAll('.btn-primary.pulse-animation');

  function createConfetti() {
    const colors = ['#ff12cc', '#8B5CF6', '#06D6A0', '#FF69B4', '#FFD93D', '#00D9FF'];

    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: absolute;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        top: -20px;
        opacity: 1;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        animation: confettiFall ${Math.random() * 3 + 2}s ease-out forwards;
        transform: rotate(${Math.random() * 360}deg);
      `;

      confettiContainer.appendChild(confetti);

      // Remove confetti after animation
      setTimeout(function() {
        confetti.remove();
      }, 5000);
    }
  }

  // Add confetti animation
  const confettiStyle = document.createElement('style');
  confettiStyle.textContent = `
    @keyframes confettiFall {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(confettiStyle);

  // Trigger confetti on first hero CTA click
  let confettiTriggered = false;
  ctaButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (!confettiTriggered && confettiContainer) {
        confettiTriggered = true;
        createConfetti();
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
  // WhatsApp Button Visibility
  // ============================================
  const whatsappFloat = document.querySelector('.whatsapp-float');

  if (whatsappFloat) {
    let whatsappVisible = false;

    // Add CSS classes for states to avoid inline style reflows
    const waStyle = document.createElement('style');
    waStyle.textContent = `
      .whatsapp-float.wa-hidden {
        transform: scale(0);
        opacity: 0;
      }
      .whatsapp-float.wa-visible {
        transform: scale(1);
        opacity: 1;
      }
    `;
    document.head.appendChild(waStyle);

    // Use classList instead of inline styles
    whatsappFloat.classList.add('wa-hidden');

    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300 && !whatsappVisible) {
        whatsappVisible = true;
        requestAnimationFrame(function() {
          whatsappFloat.classList.remove('wa-hidden');
          whatsappFloat.classList.add('wa-visible');
        });
      }
    }, { passive: true });

    // Show after a delay regardless of scroll
    setTimeout(function() {
      if (!whatsappVisible) {
        whatsappVisible = true;
        requestAnimationFrame(function() {
          whatsappFloat.classList.remove('wa-hidden');
          whatsappFloat.classList.add('wa-visible');
        });
      }
    }, 3000);
  }


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
    validatePhone: validatePhone,
    createConfetti: createConfetti
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
