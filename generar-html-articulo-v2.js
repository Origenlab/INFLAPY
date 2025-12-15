// ============================================
// GENERADOR DE HTML ARTICULO - INFLAPY v2.0
// Layout profesional con sidebar
// Compatible con componentes header/footer
// ============================================

const data = $input.first().json;
const t = data.tema;
const c = data.contenido;
const categoriaSlug = t.categoria;
const articleUrl = `https://inflablesparafiestas.com.mx/blog/${data.filename}`;

const imgSEO = c.imagenes || data.imagenesSEO;
const filenames = data.imagenesFilenames;

const imgHero = `/img/blog/${filenames.hero}`;
const imgDetalle1 = `/img/blog/${filenames.detalle1}`;
const imgDetalle2 = `/img/blog/${filenames.detalle2}`;

const heroAlt = imgSEO?.hero?.altText || c.hero.h1;
const detalle1Alt = imgSEO?.detalle1?.altText || t.nombre + ' - detalle';
const detalle2Alt = imgSEO?.detalle2?.altText || t.nombre + ' - fiesta';

const whatsappMsg = encodeURIComponent(c.cta?.mensajeWhatsApp || `Hola! Me interesa rentar un inflable en ${t.zona}`);
const breadcrumbName = c.breadcrumbName || t.nombre;

// ============================================
// GENERAR SECCIONES CON IDs PARA TOC
// ============================================
let seccionesHTML = '';
let tocItems = [];
let imagenInsertada1 = false;
let imagenInsertada2 = false;

if (c.secciones && c.secciones.length > 0) {
  c.secciones.forEach((sec, idx) => {
    const secId = `seccion-${idx + 1}`;
    tocItems.push({ id: secId, titulo: sec.h2 });

    seccionesHTML += `
        <h2 id="${secId}">${sec.h2}</h2>`;

    if (sec.introParrafo) {
      seccionesHTML += `
        <p>${sec.introParrafo}</p>`;
    }

    // Imagen detalle 1 despues de seccion 2
    if (idx === 1 && !imagenInsertada1) {
      seccionesHTML += `
        <figure class="article-figure">
          <img src="${imgDetalle1}" alt="${detalle1Alt}" loading="lazy" width="800" height="500">
        </figure>`;
      imagenInsertada1 = true;
    }

    if (sec.highlightBox) {
      seccionesHTML += `
        <div class="highlight-box">
          <p><strong>${sec.highlightBox.titulo}:</strong> ${sec.highlightBox.contenido}</p>
        </div>`;
    }

    if (sec.subsecciones) {
      sec.subsecciones.forEach(sub => {
        seccionesHTML += `
        <h3>${sub.h3}</h3>
        ${sub.contenido}`;
      });
    }

    // Imagen detalle 2 despues de seccion 4
    if (idx === 3 && !imagenInsertada2) {
      seccionesHTML += `
        <figure class="article-figure">
          <img src="${imgDetalle2}" alt="${detalle2Alt}" loading="lazy" width="800" height="500">
        </figure>`;
      imagenInsertada2 = true;
    }
  });
}

// Agregar FAQ al TOC
tocItems.push({ id: 'faq', titulo: 'Preguntas Frecuentes' });

// ============================================
// GENERAR TOC HTML
// ============================================
const tocHTML = tocItems.map(item =>
  `<li><a href="#${item.id}">${item.titulo}</a></li>`
).join('\n          ');

// ============================================
// GENERAR FAQ HTML
// ============================================
let faqHTML = '';
let faqSchemaItems = [];

if (c.faq && c.faq.length > 0) {
  faqHTML = c.faq.map(faq => `
          <div class="faq-item">
            <div class="faq-question">
              <span class="faq-question-text">${faq.pregunta}</span>
              <span class="faq-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </span>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-content">
                <div class="faq-answer-inner">${faq.respuesta.replace(/<[^>]*>/g, '')}</div>
              </div>
            </div>
          </div>`).join('');

  faqSchemaItems = c.faq.map(faq => ({
    "@type": "Question",
    "name": faq.pregunta,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.respuesta.replace(/<[^>]*>/g, '')
    }
  }));
}

// ============================================
// HTML COMPLETO CON LAYOUT PROFESIONAL
// ============================================
const html = `<!DOCTYPE html>
<html lang="es-MX">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- SEO Principal -->
  <title>${c.seo.titulo} | INFLAPY</title>
  <meta name="description" content="${c.seo.metaDescription}">
  <meta name="keywords" content="${c.seo.metaKeywords}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  <meta name="author" content="INFLAPY - Renta de Inflables para Fiestas">
  <link rel="canonical" href="${articleUrl}">

  <!-- Geo Tags - Local SEO -->
  <meta name="geo.region" content="MX-CMX">
  <meta name="geo.placename" content="${t.zona}, ${t.alcaldia}, Mexico">
  <meta name="language" content="Spanish">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${articleUrl}">
  <meta property="og:title" content="${c.seo.titulo}">
  <meta property="og:description" content="${c.seo.metaDescription}">
  <meta property="og:image" content="https://inflablesparafiestas.com.mx${imgHero}">
  <meta property="og:locale" content="es_MX">
  <meta property="og:site_name" content="INFLAPY - Renta de Inflables">

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${c.seo.titulo}">
  <meta name="twitter:description" content="${c.seo.metaDescription}">
  <meta name="twitter:image" content="https://inflablesparafiestas.com.mx${imgHero}">

  <!-- Favicon -->
  <link rel="icon" href="/favicon.ico" sizes="any">
  <meta name="theme-color" content="#ff12cc">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">

  <!-- CSS -->
  <link rel="stylesheet" href="/css/style.css">
  <link rel="stylesheet" href="/css/blog-article.css">

  <!-- Schema.org - Article -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${c.hero.h1}",
    "description": "${c.seo.metaDescription}",
    "image": "https://inflablesparafiestas.com.mx${imgHero}",
    "author": {
      "@type": "Organization",
      "name": "INFLAPY",
      "url": "https://inflablesparafiestas.com.mx"
    },
    "publisher": {
      "@type": "Organization",
      "name": "INFLAPY",
      "logo": {
        "@type": "ImageObject",
        "url": "https://inflablesparafiestas.com.mx/img/logo-inflapy.png"
      }
    },
    "mainEntityOfPage": "${articleUrl}"
  }
  </script>

  <!-- Schema.org - LocalBusiness -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "INFLAPY - Renta de Inflables",
    "image": "https://inflablesparafiestas.com.mx/img/logo-inflapy.png",
    "telephone": "+525531281706",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ciudad de Mexico",
      "addressRegion": "CDMX",
      "addressCountry": "MX"
    },
    "areaServed": ["Ciudad de Mexico", "Estado de Mexico"],
    "priceRange": "$$"
  }
  </script>

  <!-- Schema.org - BreadcrumbList -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://inflablesparafiestas.com.mx/"},
      {"@type": "ListItem", "position": 2, "name": "Blog", "item": "https://inflablesparafiestas.com.mx/blog.html"},
      {"@type": "ListItem", "position": 3, "name": "${breadcrumbName}", "item": "${articleUrl}"}
    ]
  }
  </script>

  <!-- Schema.org - FAQPage -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": ${JSON.stringify(faqSchemaItems)}
  }
  </script>
</head>

<body class="article-page">
  <!-- Header -->
  <div data-component="header"></div>

  <!-- Breadcrumb -->
  <nav class="breadcrumb">
    <div class="container">
      <ol class="breadcrumb-list" itemscope itemtype="https://schema.org/BreadcrumbList">
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <a href="/" itemprop="item"><span itemprop="name">Inicio</span></a>
          <meta itemprop="position" content="1">
        </li>
        <li class="separator">/</li>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <a href="/blog.html" itemprop="item"><span itemprop="name">Blog</span></a>
          <meta itemprop="position" content="2">
        </li>
        <li class="separator">/</li>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <span class="current" itemprop="name">${breadcrumbName}</span>
          <meta itemprop="position" content="3">
        </li>
      </ol>
    </div>
  </nav>

  <!-- Main Layout -->
  <div class="article-layout">

    <!-- Article Main Content -->
    <main class="article-main">

      <!-- Article Header -->
      <header class="article-header">
        <span class="article-category">${t.categoriaDisplay}</span>
        <h1 class="article-title">${c.hero.h1}</h1>
        <div class="article-meta">
          <span>${c.hero.tiempoLectura || '8'} min lectura</span>
          <span class="divider"></span>
          <span>+30 anos de experiencia</span>
        </div>
      </header>

      <!-- Hero Image -->
      <figure class="article-hero-figure">
        <img src="${imgHero}" alt="${heroAlt}" width="900" height="500" loading="eager">
      </figure>

      <!-- Article Content -->
      <article class="article-content" itemscope itemtype="https://schema.org/Article">

        <p>${c.introduccion.parrafo1}</p>
        <p>${c.introduccion.parrafo2}</p>

        <div class="highlight-box">
          <p>
            <strong>Por que confiar en INFLAPY?</strong> Con <strong>mas de 30 anos de experiencia</strong>
            en ${t.zona} y toda la zona metropolitana, conocemos cada detalle que hace la diferencia.
            Entrega e instalacion GRATIS.
          </p>
        </div>
${seccionesHTML}

        <h2 id="faq">Preguntas Frecuentes sobre Inflables en ${t.zona}</h2>
        <div class="faq-section">${faqHTML}
        </div>

        <!-- CTA Final -->
        <div class="cta-block">
          <div class="cta-block-content">
            <span class="cta-block-badge">Reserva Ahora</span>
            <h3>${c.cta.titulo}</h3>
            <p>${c.cta.parrafo1}</p>
          </div>
          <div class="cta-block-action">
            <a href="https://wa.me/525531281706?text=${whatsappMsg}" class="btn btn-whatsapp" target="_blank" rel="noopener">
              Cotizar por WhatsApp
            </a>
            <span class="cta-block-note">Respuesta en menos de 1 hora</span>
          </div>
        </div>

      </article>

      <!-- Related Articles -->
      <section class="related-section">
        <h2 class="related-title">Articulos Relacionados</h2>
        <div class="related-grid">
          <a href="/blog/cuanto-cuesta-rentar-inflable-cdmx.html" class="related-card">
            <h3 class="related-card-title">Guia Completa: Renta de Inflables en CDMX</h3>
            <span class="related-card-link">Leer guia</span>
          </a>
          <a href="/blog/como-elegir-inflable-perfecto.html" class="related-card">
            <h3 class="related-card-title">Como Elegir el Inflable Perfecto</h3>
            <span class="related-card-link">Ver consejos</span>
          </a>
          <a href="/catalogo.html" class="related-card">
            <h3 class="related-card-title">Catalogo Completo de Inflables</h3>
            <span class="related-card-link">Ver catalogo</span>
          </a>
        </div>
      </section>

    </main>

    <!-- Sidebar -->
    <aside class="article-sidebar">

      <!-- CTA Sidebar -->
      <div class="sidebar-cta">
        <div class="sidebar-cta-label">Cotizacion Gratis</div>
        <h3 class="sidebar-cta-title">Renta de Inflables en ${t.zona}</h3>
        <p class="sidebar-cta-text">
          +30 anos de experiencia. Entrega GRATIS en ${t.zona} y toda la zona metropolitana.
        </p>
        <a href="https://wa.me/525531281706?text=${whatsappMsg}" class="btn btn-whatsapp" target="_blank" rel="noopener">
          WHATSAPP
        </a>
      </div>

      <!-- Table of Contents -->
      <div class="sidebar-section">
        <h4 class="sidebar-title">En Este Articulo</h4>
        <ul class="toc-list">
          ${tocHTML}
        </ul>
      </div>

      <!-- Popular Products -->
      <div class="sidebar-section">
        <h4 class="sidebar-title">Inflables Recomendados</h4>
        <div class="sidebar-products">
          <a href="/inflables-chicos/inflable-para-fiestas-infantiles-mini-castillo.html" class="sidebar-product">
            <div class="sidebar-product-info">
              <div class="sidebar-product-name">Mini Castillo</div>
              <div class="sidebar-product-desc">Ideal para bebes</div>
            </div>
          </a>
          <a href="/inflables-medianos/inflable-para-fiestas-infantiles-dragones-rojos.html" class="sidebar-product">
            <div class="sidebar-product-info">
              <div class="sidebar-product-name">Dragones Rojos</div>
              <div class="sidebar-product-desc">El mas popular</div>
            </div>
          </a>
          <a href="/inflables-grandes/inflable-para-fiestas-infantiles-barco-pirata.html" class="sidebar-product">
            <div class="sidebar-product-info">
              <div class="sidebar-product-name">Barco Pirata</div>
              <div class="sidebar-product-desc">Para eventos grandes</div>
            </div>
          </a>
        </div>
      </div>

      <!-- Zones -->
      <div class="sidebar-section">
        <h4 class="sidebar-title">Zonas de Entrega</h4>
        <p class="sidebar-zones">
          Entrega gratis en ${t.zona}, ${t.alcaldia} y toda la zona metropolitana:
          Polanco, Coyoacan, Del Valle, Satelite, Interlomas, y mas.
        </p>
      </div>

    </aside>

  </div>

  <!-- Footer -->
  <div data-component="footer"></div>

  <!-- Scripts -->
  <script src="/js/components.js"></script>
  <script src="/js/app.js"></script>

  <!-- FAQ Accordion -->
  <script>
    document.querySelectorAll('.faq-question').forEach(question => {
      question.addEventListener('click', () => {
        const item = question.parentElement;
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    });
  </script>
</body>
</html>`;

// Card para blog.html
const cardBlogIndex = `<article class="article-card" data-category="${categoriaSlug}" itemscope itemtype="https://schema.org/BlogPosting">
  <a href="/blog/${data.filename}" class="article-card-image">
    <img src="${imgHero}" alt="${heroAlt}" width="400" height="250" loading="lazy" itemprop="image">
    <span class="article-card-category">${t.categoriaDisplay}</span>
  </a>
  <div class="article-card-content">
    <h2 class="article-card-title" itemprop="headline">
      <a href="/blog/${data.filename}">${c.hero.h1}</a>
    </h2>
    <p class="article-card-excerpt" itemprop="description">${c.seo.metaDescription}</p>
    <div class="article-card-meta">
      <span>${c.hero.tiempoLectura || '8'} min lectura</span>
      <span>${t.categoriaDisplay}</span>
    </div>
  </div>
</article>`;

return [{json: {...data, htmlArticulo: html, cardHTML: cardBlogIndex, categoriaSlug: categoriaSlug}}];
