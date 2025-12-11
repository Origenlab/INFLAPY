/**
 * INFLAPY - Component Loader System
 * Version: 1.0.0
 *
 * A lightweight, professional component loading system for static HTML sites.
 * Allows reusable header, footer, and other components across multiple pages.
 *
 * Features:
 * - Async component loading with fetch API
 * - Error handling with fallback content
 * - Event dispatching for component lifecycle
 * - Caching for improved performance
 * - SEO-friendly with proper error handling
 *
 * Usage:
 * 1. Add data-component="componentName" to container elements
 * 2. Place component HTML files in /components/ folder
 * 3. Include this script before closing </body> tag
 *
 * Example:
 * <div data-component="header"></div>
 * <div data-component="footer"></div>
 */

(function() {
  'use strict';

  // ============================================
  // Configuration
  // ============================================
  const CONFIG = {
    componentsPath: '/components/',
    componentExtension: '.html',
    enableCache: true,
    cachePrefix: 'inflapy_component_',
    cacheDuration: 3600000, // 1 hour in milliseconds
    debug: false
  };

  // Component cache storage
  const componentCache = new Map();

  // ============================================
  // Utility Functions
  // ============================================

  /**
   * Logs debug messages if debug mode is enabled
   * @param {string} message - Message to log
   * @param {*} data - Optional data to log
   */
  function debugLog(message, data = null) {
    if (CONFIG.debug) {
      console.log(`[INFLAPY Components] ${message}`, data || '');
    }
  }

  /**
   * Dispatches a custom event on an element
   * @param {HTMLElement} element - Target element
   * @param {string} eventName - Event name
   * @param {Object} detail - Event detail data
   */
  function dispatchComponentEvent(element, eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      cancelable: true,
      detail: detail
    });
    element.dispatchEvent(event);
  }

  /**
   * Gets cached component if valid
   * @param {string} componentName - Component name
   * @returns {string|null} - Cached HTML or null
   */
  function getCachedComponent(componentName) {
    if (!CONFIG.enableCache) return null;

    // Check memory cache first
    if (componentCache.has(componentName)) {
      debugLog(`Cache hit (memory): ${componentName}`);
      return componentCache.get(componentName);
    }

    // Check localStorage cache
    try {
      const cacheKey = CONFIG.cachePrefix + componentName;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        const { html, timestamp } = JSON.parse(cached);
        const isValid = (Date.now() - timestamp) < CONFIG.cacheDuration;

        if (isValid) {
          debugLog(`Cache hit (localStorage): ${componentName}`);
          componentCache.set(componentName, html);
          return html;
        } else {
          localStorage.removeItem(cacheKey);
          debugLog(`Cache expired: ${componentName}`);
        }
      }
    } catch (e) {
      debugLog('Cache read error:', e);
    }

    return null;
  }

  /**
   * Saves component to cache
   * @param {string} componentName - Component name
   * @param {string} html - Component HTML
   */
  function setCachedComponent(componentName, html) {
    if (!CONFIG.enableCache) return;

    // Save to memory cache
    componentCache.set(componentName, html);

    // Save to localStorage
    try {
      const cacheKey = CONFIG.cachePrefix + componentName;
      localStorage.setItem(cacheKey, JSON.stringify({
        html: html,
        timestamp: Date.now()
      }));
      debugLog(`Cached: ${componentName}`);
    } catch (e) {
      debugLog('Cache write error:', e);
    }
  }

  // ============================================
  // Component Loading
  // ============================================

  /**
   * Fetches a component HTML file
   * @param {string} componentName - Name of the component
   * @returns {Promise<string>} - Component HTML content
   */
  async function fetchComponent(componentName) {
    // Check cache first
    const cached = getCachedComponent(componentName);
    if (cached) return cached;

    const componentPath = CONFIG.componentsPath + componentName + CONFIG.componentExtension;

    try {
      const response = await fetch(componentPath);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      setCachedComponent(componentName, html);

      debugLog(`Loaded: ${componentName}`);
      return html;

    } catch (error) {
      console.error(`[INFLAPY] Failed to load component "${componentName}":`, error);
      throw error;
    }
  }

  /**
   * Loads a component into a container element
   * @param {HTMLElement} container - Container element with data-component attribute
   * @returns {Promise<void>}
   */
  async function loadComponent(container) {
    const componentName = container.dataset.component;

    if (!componentName) {
      console.warn('[INFLAPY] Container missing data-component attribute');
      return;
    }

    // Dispatch loading event
    dispatchComponentEvent(container, 'component:loading', { name: componentName });
    container.setAttribute('aria-busy', 'true');

    try {
      const html = await fetchComponent(componentName);

      // Insert component HTML
      container.innerHTML = html;
      container.removeAttribute('aria-busy');

      // Process dynamic content
      processComponentContent(container, componentName);

      // Dispatch loaded event
      dispatchComponentEvent(container, 'component:loaded', {
        name: componentName,
        element: container
      });

    } catch (error) {
      container.removeAttribute('aria-busy');
      container.innerHTML = `
        <div class="component-error" role="alert">
          <p>Error loading component. Please refresh the page.</p>
        </div>
      `;

      // Dispatch error event
      dispatchComponentEvent(container, 'component:error', {
        name: componentName,
        error: error
      });
    }
  }

  /**
   * Processes dynamic content within a loaded component
   * @param {HTMLElement} container - Component container
   * @param {string} componentName - Component name
   */
  function processComponentContent(container, componentName) {
    // Update current year in footer
    const yearElements = container.querySelectorAll('[data-current-year]');
    yearElements.forEach(function(el) {
      el.textContent = new Date().getFullYear();
    });

    // Re-initialize any interactive elements
    initializeComponentInteractions(container, componentName);
  }

  /**
   * Initializes interactive elements within a component
   * @param {HTMLElement} container - Component container
   * @param {string} componentName - Component name
   */
  function initializeComponentInteractions(container, componentName) {
    // Header-specific initialization
    if (componentName === 'header') {
      initializeHeaderNavigation(container);
    }

    // Initialize smooth scroll for anchor links
    const anchorLinks = container.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function(link) {
      link.addEventListener('click', handleSmoothScroll);
    });
  }

  /**
   * Initializes mobile navigation for header component
   * @param {HTMLElement} header - Header container
   */
  function initializeHeaderNavigation(header) {
    const navToggle = header.querySelector('.nav-toggle');
    const navMenu = header.querySelector('.nav-menu');

    if (!navToggle || !navMenu) return;

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(function(link) {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      const headerEl = header.querySelector('.header');

      if (headerEl) {
        if (currentScroll > 50) {
          headerEl.classList.add('scrolled');
        } else {
          headerEl.classList.remove('scrolled');
        }
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  /**
   * Handles smooth scrolling for anchor links
   * @param {Event} e - Click event
   */
  // Cache header height to avoid repeated reflows
  let cachedHeaderHeight = null;

  function handleSmoothScroll(e) {
    const targetId = this.getAttribute('href');

    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      e.preventDefault();

      // Use cached header height or calculate once
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
  }

  // ============================================
  // Initialization
  // ============================================

  /**
   * Initializes all components on the page
   */
  async function initializeComponents() {
    const containers = document.querySelectorAll('[data-component]');

    if (containers.length === 0) {
      debugLog('No components found on page');
      return;
    }

    debugLog(`Found ${containers.length} component(s) to load`);

    // Load all components concurrently
    const loadPromises = Array.from(containers).map(loadComponent);

    try {
      await Promise.all(loadPromises);

      // Dispatch global event when all components are loaded
      document.dispatchEvent(new CustomEvent('components:ready', {
        detail: { count: containers.length }
      }));

      debugLog('All components loaded successfully');

    } catch (error) {
      console.error('[INFLAPY] Some components failed to load:', error);
    }
  }

  /**
   * Clears the component cache
   */
  function clearComponentCache() {
    componentCache.clear();

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(function(key) {
        if (key.startsWith(CONFIG.cachePrefix)) {
          localStorage.removeItem(key);
        }
      });
      debugLog('Cache cleared');
    } catch (e) {
      debugLog('Cache clear error:', e);
    }
  }

  // ============================================
  // Public API
  // ============================================

  window.INFLAPYComponents = {
    load: loadComponent,
    loadAll: initializeComponents,
    clearCache: clearComponentCache,
    config: CONFIG
  };

  // ============================================
  // Auto-initialize on DOM ready
  // ============================================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeComponents);
  } else {
    initializeComponents();
  }

})();
