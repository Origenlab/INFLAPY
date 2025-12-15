// ============================================
// GENERADOR DE HTML ARTICULO - INFLAPY v4.0
// Layout 2 columnas + Sidebar + FAQ Accordion
// USA SOLO 1 IMAGEN (hero) - resiliente
// ============================================

const data = $input.first().json;
const t = data.tema;
const c = data.contenido;
const categoriaSlug = t.categoria;
const articleUrl = `https://inflablesparafiestas.com.mx/blog/${data.filename}`;

// Imagen - USA HERO, si no existe usa cualquier otra disponible
const filenames = data.imagenesFilenames || {};
const imgHero = `/img/blog/${filenames.hero || filenames.detalle1 || filenames.detalle2 || 'default.jpg'}`;
const imgSEO = c.imagenes || data.imagenesSEO || {};
const heroAlt = imgSEO?.hero?.altText || `Renta de inflables para fiestas infantiles en ${t.zona} - INFLAPY`;

// WhatsApp
const whatsappMsg = encodeURIComponent(c.cta?.mensajeWhatsApp || `Hola! Me interesa rentar un inflable para una fiesta en ${t.zona}`);
const breadcrumbName = c.breadcrumbName || `Renta Inflables ${t.zona}`;

// Geo region
const geoRegion = t.categoria === 'cdmx' ? 'MX-CMX' : 'MX-MEX';
const geoState = t.categoria === 'cdmx' ? 'Ciudad de Mexico' : 'Estado de Mexico';

// ============================================
// GENERAR SECCIONES CON IDs PARA TOC
// ============================================
let seccionesHTML = '';
let tocItems = [];

if (c.secciones && c.secciones.length > 0) {
  c.secciones.forEach((sec, idx) => {
    const secId = sec.h2.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30);

    tocItems.push({ id: secId, titulo: sec.h2.replace(/<[^>]*>/g, '').substring(0, 40) });

    seccionesHTML += `
        <h2 id="${secId}">${sec.h2}</h2>`;

    if (sec.introParrafo) {
      seccionesHTML += `
        <p>${sec.introParrafo}</p>`;
    }

    if (sec.subsecciones && sec.subsecciones.length > 0) {
      sec.subsecciones.forEach((sub) => {
        seccionesHTML += `
        <h3>${sub.h3}</h3>
        ${sub.contenido}`;
      });
    }

    if (sec.highlightBox) {
      seccionesHTML += `
        <div class="highlight-box">
          <p><strong>${sec.highlightBox.titulo}:</strong> ${sec.highlightBox.contenido}</p>
        </div>`;
    }
  });
}

tocItems.push({ id: 'faq', titulo: 'Preguntas Frecuentes' });

// ============================================
// GENERAR TOC HTML
// ============================================
const tocHTML = tocItems.map(item =>
  `          <li><a href="#${item.id}">${item.titulo}</a></li>`
).join('\n');

// ============================================
// GENERAR FAQ HTML CON ACORDEON
// ============================================
let faqHTML = '';
let faqSchemaItems = [];

if (c.faq && c.faq.length > 0) {
  faqHTML = c.faq.map(faq => {
    const respuestaLimpia = faq.respuesta.replace(/<[^>]*>/g, '');
    return `
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
                <div class="faq-answer-inner">${respuestaLimpia}</div>
              </div>
            </div>
          </div>`;
  }).join('');

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
// PRODUCTOS RECOMENDADOS PARA SIDEBAR
// ============================================
const productosMap = {
  'Castillo Blanco': { url: '/inflables-medianos/inflable-para-fiestas-infantiles-castillo-blanco.html', desc: 'Elegante y versatil' },
  'Castillo de Princesas': { url: '/inflables-medianos/inflable-para-fiestas-infantiles-castillo-princesas.html', desc: 'Fiestas tematicas' },
  'Barco Pirata': { url: '/inflables-grandes/inflable-para-fiestas-infantiles-barco-pirata.html', desc: 'Jardines amplios' },
  'Mini Castillo': { url: '/inflables-chicos/inflable-para-fiestas-infantiles-mini-castillo.html', desc: 'Ideal para bebes' },
  'Dragones Rojos': { url: '/inflables-medianos/inflable-para-fiestas-infantiles-dragones-rojos.html', desc: 'El mas popular' },
  'Mini Jungla': { url: '/inflables-chicos/inflable-para-fiestas-infantiles-mini-jungla.html', desc: 'Aventura tropical' },
  'Gusanitos': { url: '/inflables-chicos/inflable-para-fiestas-infantiles-gusanitos.html', desc: 'Para los mas pequenos' },
  'Extremo': { url: '/inflables-grandes/inflable-para-fiestas-infantiles-extremo.html', desc: 'Accion y adrenalina' }
};

const productosHTML = (t.inflablesRecomendados || ['Mini Castillo', 'Dragones Rojos', 'Barco Pirata'])
  .slice(0, 3)
  .map(nombre => {
    const prod = productosMap[nombre] || { url: '/catalogo.html', desc: 'Ver detalles' };
    return `          <a href="${prod.url}" class="sidebar-product">
            <div class="sidebar-product-info">
              <div class="sidebar-product-name">${nombre}</div>
              <div class="sidebar-product-desc">${prod.desc}</div>
            </div>
          </a>`;
  }).join('\n');

// ============================================
// ZONAS CERCANAS PARA SIDEBAR
// ============================================
const zonasMap = {
  'Polanco': 'Lomas de Chapultepec, Anzures, Bosques de las Lomas',
  'Coyoacan': 'Del Valle, San Angel, Tlalpan',
  'Del Valle': 'Narvarte, Napoles, Mixcoac',
  'Santa Fe': 'Cuajimalpa, Interlomas, Bosques de las Lomas',
  'Condesa-Roma': 'Juarez, Cuauhtemoc, Napoles',
  'Pedregal de San Angel': 'San Angel, Tlalpan, Coyoacan',
  'Ciudad Satelite': 'Lomas Verdes, Tecamachalco, Echegaray',
  'Interlomas': 'Santa Fe, Bosques de las Lomas, Tecamachalco',
  'Tecamachalco': 'Satelite, Lomas de Tecamachalco, Interlomas',
  'Lomas Verdes': 'Satelite, Echegaray, Naucalpan Centro'
};
const zonasCercanas = zonasMap[t.zona] || 'toda la zona metropolitana';

// ============================================
// HTML COMPLETO
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
  <meta name="geo.region" content="${geoRegion}">
  <meta name="geo.placename" content="${t.zona}, ${t.alcaldia}, ${geoState}">
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
      "addressLocality": "${t.zona}",
      "addressRegion": "${t.alcaldia}, ${geoState}",
      "addressCountry": "MX"
    },
    "areaServed": ["${t.zona}", "${t.alcaldia}", "${geoState}"],
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
    "mainEntity": ${JSON.stringify(faqSchemaItems, null, 2)}
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
        <img src="${imgHero}"
             alt="${heroAlt}"
             width="900" height="500" loading="eager">
      </figure>

      <!-- Article Content -->
      <article class="article-content" itemscope itemtype="https://schema.org/Article">

        <p>${c.introduccion.parrafo1}</p>

        <p>${c.introduccion.parrafo2}</p>

        <div class="highlight-box">
          <p>
            <strong>Por que confiar en INFLAPY?</strong> Somos la empresa con mayor experiencia en renta de
            inflables en la zona de ${t.zona} y ${t.alcaldia}. Entrega e instalacion <strong>GRATIS</strong>,
            inflables premium siempre limpios y desinfectados, y servicio puntual garantizado.
          </p>
        </div>
${seccionesHTML}

        <h2 id="faq">Preguntas Frecuentes sobre Inflables en ${t.zona}</h2>

        <div class="faq-section">${faqHTML}
        </div>

        <!-- CTA Final -->
        <div class="cta-block">
          <div class="cta-block-content">
            <span class="cta-block-badge">Cotizacion Gratis</span>
            <h3>Listo para tu Fiesta en ${t.zona}?</h3>
            <p>Cotiza gratis y recibe asesoria personalizada. Entrega GRATIS en toda la zona.</p>
          </div>
          <div class="cta-block-action">
            <a href="https://wa.me/525531281706?text=${whatsappMsg}"
               class="btn btn-whatsapp" target="_blank" rel="noopener">
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
          +30 anos de experiencia. Entrega GRATIS en ${t.zona} y ${t.alcaldia}.
        </p>
        <a href="https://wa.me/525531281706?text=${whatsappMsg}"
           class="btn btn-whatsapp" target="_blank" rel="noopener">
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
        <h4 class="sidebar-title">Inflables para ${t.zona}</h4>
        <div class="sidebar-products">
${productosHTML}
        </div>
      </div>

      <!-- Zones -->
      <div class="sidebar-section">
        <h4 class="sidebar-title">Zonas de Entrega</h4>
        <p class="sidebar-zones">
          Entrega gratis en ${t.zona}, ${zonasCercanas},
          y toda la alcaldia ${t.alcaldia}.
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

// ============================================
// CARD PARA BLOG.HTML (con indentacion correcta)
// ============================================
const cardBlogIndex = `
        <!-- ${t.zona} - ${t.categoriaDisplay} -->
        <article class="article-card" data-category="${categoriaSlug}" itemscope itemtype="https://schema.org/BlogPosting">
          <a href="/blog/${data.filename}" class="article-card-image">
            <img src="${imgHero}"
                 alt="${heroAlt}"
                 width="400"
                 height="250"
                 loading="lazy"
                 itemprop="image">
            <span class="article-card-category">${t.categoriaDisplay}</span>
          </a>
          <div class="article-card-content">
            <h2 class="article-card-title" itemprop="headline">
              <a href="/blog/${data.filename}">${c.hero.h1}</a>
            </h2>
            <p class="article-card-excerpt" itemprop="description">
              ${c.seo.metaDescription}
            </p>
            <div class="article-card-meta">
              <span>${c.hero.tiempoLectura || '8'} min lectura</span>
              <span>${t.categoriaDisplay}</span>
            </div>
          </div>
        </article>`;

return [{json: {...data, htmlArticulo: html, cardHTML: cardBlogIndex, categoriaSlug: categoriaSlug}}];
