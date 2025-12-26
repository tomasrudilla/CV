// ===================== script.js (versión optimizada y fluida) =====================

// -------- PERF TUNING: detectar hardware/modo y activar "Lite" ---------------------
const PERF_MODE =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || // CPUs básicas
  (window.innerWidth <= 768); // móviles / tablets

function enableLiteMode() {
  document.documentElement.classList.add('lite');

  // Flags para apagar features costosas
  window.__DISABLE_PARALLAX__ = true;
  window.__DISABLE_CURSOR__   = true;
  window.__DISABLE_TYPING__   = true;
  window.__DISABLE_BOUNCE__   = true;

  // Remover shapes/particles (animaciones + parallax)
  document.querySelectorAll('.floating-shapes, .shape').forEach(n => n.remove());

  // Quitar sombras grandes en runtime (menos repaints)
  document
    .querySelectorAll('.project-card, .timeline-content, .tech-icon, .certificate-card, .contact-item, .contact-form')
    .forEach(el => (el.style.boxShadow = 'none'));
}

// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
  if (PERF_MODE) enableLiteMode();
  initializePortfolio();
});

// ============================== Núcleo de inicialización ===========================
function initializePortfolio() {
  initNavigation();
  initCursor();           // respeta flag de apagado
  initScrollAnimations(); // AOS-lite
  initProjectFilters();
  initSkillBars();
  initContactForm();
  initCounters();
  initTypingEffect();     // respeta flag de apagado
  initParallax();         // respeta flag de apagado
  initLazyLoading();
  optimizePerformance();
}

// ============================== Navegación (scroll + spy) ==========================
function initNavigation() {
  const navbar   = document.getElementById("navbar");
  const navToggle= document.getElementById("nav-toggle");
  const navMenu  = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Toggle menú móvil
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    }, { passive: true });
  }

  // Cerrar menú al click en un link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    });
  });

  // Scroll spy + estilo navbar con rAF (throttle)
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;

        // Navbar scrolled
        if (scrollY > 50) navbar.classList.add("scrolled");
        else navbar.classList.remove("scrolled");

        // Link activo según sección
        const sections = document.querySelectorAll("section[id]");
        sections.forEach((section) => {
          const sectionHeight = section.offsetHeight;
          const sectionTop    = section.offsetTop - 100;
          const sectionId     = section.getAttribute("id");
          const navLink       = document.querySelector(`.nav-link[data-section="${sectionId}"]`);

          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach((l) => l.classList.remove("active"));
            if (navLink) navLink.classList.add("active");
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Smooth scroll para los links de navegación
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    });
  });
}

// ============================== Cursor personalizado ===============================
function initCursor() {
  if (window.__DISABLE_CURSOR__) return;

  const cursor        = document.querySelector(".cursor");
  const cursorFollower= document.querySelector(".cursor-follower");
  if (!cursor || !cursorFollower) return;

  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // cursor inmediato
    cursor.style.left = mouseX + "px";
    cursor.style.top  = mouseY + "px";
  });

  // seguidor suave
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;

    cursorFollower.style.left = followerX + "px";
    cursorFollower.style.top  = followerY + "px";
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Efectos hover
  const hoverElements = document.querySelectorAll("a, button, .project-card, .skill-item");
  hoverElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.transform = "scale(1.4)";
      cursorFollower.style.transform = "scale(1.4)";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.transform = "scale(1)";
      cursorFollower.style.transform = "scale(1)";
    });
  });
}

// ============================== Animaciones de scroll (AOS-lite) ===================
function initScrollAnimations() {
  const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("aos-animate");
        // Una vez animado, no observar más (menos trabajo)
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll("[data-aos]").forEach((el) => observer.observe(el));
}

// ============================== Filtros de proyectos ===============================
function initProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards  = document.querySelectorAll(".project-card");
  if (!filterButtons.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");

      // Botón activo
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Filtrado
      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.style.display = "block";
          card.style.animation = "fadeIn 0.4s ease";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// ============================== Barras de skills animadas ==========================
function initSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress");
  if (!skillBars.length) return;

  const skillObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar   = entry.target;
        const width = bar.getAttribute("data-width");
        // Arranque leve
        setTimeout(() => { bar.style.width = width + "%"; }, 150);
        obs.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  skillBars.forEach((bar) => skillObserver.observe(bar));
}

// ============================== Formulario de contacto =============================
function initContactForm() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;

    // Estado de carga
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitButton.disabled = true;

    try {
      // Aquí integrar con backend real (fetch/XHR). Simulación:
      await new Promise((r) => setTimeout(r, 900));

      // Éxito
      submitButton.innerHTML = '<i class="fas fa-check"></i> ¡Enviado!';
      submitButton.style.background = "var(--success-color)";
      form.reset();
      showNotification("¡Mensaje enviado correctamente!", "success");
    } catch (error) {
      submitButton.innerHTML = '<i class="fas fa-times"></i> Error';
      submitButton.style.background = "var(--error-color)";
      showNotification("Error al enviar el mensaje", "error");
    }

    setTimeout(() => {
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
      submitButton.style.background = "";
    }, 2200);
  });
}

// ============================== Contadores animados =================================
function initCounters() {
  const counters = document.querySelectorAll(".stat-number");
  if (!counters.length) return;

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter  = entry.target;
        const target   = Number.parseInt(counter.getAttribute("data-target") || "0", 10);
        const duration = 1600;
        const step     = Math.max(1, Math.floor(target / (duration / 16)));
        let current = 0;

        const updateCounter = () => {
          current += step;
          if (current < target) {
            counter.textContent = current;
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };

        updateCounter();
        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((c) => counterObserver.observe(c));
}

// ============================== Efecto de escritura =================================
function initTypingEffect() {
  if (window.__DISABLE_TYPING__) return;

  const titleRole = document.querySelector(".title-role");
  if (!titleRole) return;

  const roles = ["Desarrollador Full Stack"];
  let currentRole = 0, currentChar = 0, isDeleting = false;

  function typeEffect() {
    const current = roles[currentRole];

    if (isDeleting) {
      titleRole.textContent = current.substring(0, currentChar - 1);
      currentChar--;
    } else {
      titleRole.textContent = current.substring(0, currentChar + 1);
      currentChar++;
    }

    let typeSpeed = isDeleting ? 40 : 85;

    if (!isDeleting && currentChar === current.length) {
      typeSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && currentChar === 0) {
      isDeleting = false;
      currentRole = (currentRole + 1) % roles.length;
      typeSpeed = 450;
    }

    setTimeout(typeEffect, typeSpeed);
  }

  setTimeout(typeEffect, 900);
}

// ============================== Parallax shapes =====================================
function initParallax() {
  if (window.__DISABLE_PARALLAX__) return;

  const shapes = document.querySelectorAll(".shape");
  if (!shapes.length) return;

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.3; // menor desplazamiento (más liviano)

    shapes.forEach((shape, index) => {
      const speed = (index + 1) * 0.08;
      shape.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.05}deg)`;
    });
  }, { passive: true });
}

// ============================== Toggle de tema (opcional) ===========================
function initThemeToggle() {
  const themeToggle = document.createElement("button");
  themeToggle.className = "theme-toggle";
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  themeToggle.style.cssText = `
    position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px;
    border-radius: 50%; border: none; background: var(--gradient-primary);
    color: white; cursor: pointer; z-index: 1000; transition: all .3s ease;
    box-shadow: var(--shadow-glow);
  `;

  document.body.appendChild(themeToggle);

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    const icon = themeToggle.querySelector("i");
    icon.className = document.body.classList.contains("light-theme") ? "fas fa-sun" : "fas fa-moon";
  });
}

// ============================== Sistema de notificaciones ===========================
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === "success" ? "check" : type === "error" ? "times" : "info"}"></i>
    <span>${message}</span>
  `;
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; background: var(--bg-glass);
    border: 1px solid rgba(255, 255, 255, 0.1); border-radius: var(--border-radius-lg);
    padding: var(--spacing-md) var(--spacing-lg); color: var(--text-primary);
    backdrop-filter: blur(20px); z-index: 10000; transform: translateX(100%);
    transition: transform .3s ease; display: flex; align-items: center; gap: var(--spacing-sm);
  `;

  document.body.appendChild(notification);

  // Entrada
  requestAnimationFrame(() => {
    notification.style.transform = "translateX(0)";
  });

  // Salida y cleanup
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (notification.parentNode) document.body.removeChild(notification);
    }, 300);
  }, 4200);
}

// ============================== Lazy loading de imágenes ============================
function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");
  if (!images.length) return;

  const imageObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute("data-src");
        img.removeAttribute("data-src");
        obs.unobserve(img);
      }
    });
  }, { rootMargin: "200px" });

  images.forEach((img) => imageObserver.observe(img));
}

// ============================== Optimizaciones varias ===============================
function optimizePerformance() {
  // Debounce pobre en scroll global solo si alguien setea window.onscroll
  let scrollTimeout;
  const originalScrollHandler = window.onscroll;
  window.onscroll = () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (originalScrollHandler) originalScrollHandler();
    }, 16);
  };

  // Preload de imágenes críticas (ajustá rutas reales si querés)
  const criticalImages = ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=500&width=400"];
  criticalImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

// ============================== Manejo de errores global ============================
window.addEventListener("error", (e) => {
  console.error("Error en el portfolio:", e.error || e.message || e);
  // Aquí podrías enviar el error a un servicio de monitoreo
});

// ============================== Service Worker (PWA opcional) ======================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => console.log("SW registrado:", registration))
      .catch((err) => console.log("SW falló:", err));
  });
}
