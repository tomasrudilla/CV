// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
  initializePortfolio()
})

function initializePortfolio() {
  // Inicializar todos los componentes
  initNavigation()
  initCursor()
  initScrollAnimations()
  initProjectFilters()
  initSkillBars()
  initContactForm()
  initCounters()
  initTypingEffect()
  initParallax()
}

// Navegación
function initNavigation() {
  const navbar = document.getElementById("navbar")
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")

  // Toggle menu móvil
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active")
    navToggle.classList.toggle("active")
  })

  // Cerrar menu al hacer click en un link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
      navToggle.classList.remove("active")
    })
  })

  // Scroll spy para navegación activa
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset

    // Cambiar estilo del navbar al hacer scroll
    if (scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }

    // Actualizar link activo
    const sections = document.querySelectorAll("section[id]")
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight
      const sectionTop = section.offsetTop - 100
      const sectionId = section.getAttribute("id")
      const navLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`)

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => link.classList.remove("active"))
        if (navLink) navLink.classList.add("active")
      }
    })
  })

  // Smooth scroll para los links de navegación
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href").substring(1)
      const targetSection = document.getElementById(targetId)

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })
}

// Cursor personalizado
function initCursor() {
  const cursor = document.querySelector(".cursor")
  const cursorFollower = document.querySelector(".cursor-follower")

  if (!cursor || !cursorFollower) return

  let mouseX = 0
  let mouseY = 0
  let followerX = 0
  let followerY = 0

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX
    mouseY = e.clientY

    cursor.style.left = mouseX + "px"
    cursor.style.top = mouseY + "px"
  })

  // Animación suave para el follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1
    followerY += (mouseY - followerY) * 0.1

    cursorFollower.style.left = followerX + "px"
    cursorFollower.style.top = followerY + "px"

    requestAnimationFrame(animateFollower)
  }
  animateFollower()

  // Efectos hover
  const hoverElements = document.querySelectorAll("a, button, .project-card, .skill-item")
  hoverElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursor.style.transform = "scale(1.5)"
      cursorFollower.style.transform = "scale(1.5)"
    })

    element.addEventListener("mouseleave", () => {
      cursor.style.transform = "scale(1)"
      cursorFollower.style.transform = "scale(1)"
    })
  })
}

// Animaciones de scroll
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("aos-animate")
      }
    })
  }, observerOptions)

  // Observar elementos con atributo data-aos
  const animatedElements = document.querySelectorAll("[data-aos]")
  animatedElements.forEach((element) => {
    observer.observe(element)
  })
}

// Filtros de proyectos
function initProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn")
  const projectCards = document.querySelectorAll(".project-card")

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter")

      // Actualizar botón activo
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Filtrar proyectos
      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category")

        if (filter === "all" || category === filter) {
          card.style.display = "block"
          card.style.animation = "fadeIn 0.5s ease"
        } else {
          card.style.display = "none"
        }
      })
    })
  })
}

// Barras de habilidades animadas
function initSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress")

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const skillBar = entry.target
          const width = skillBar.getAttribute("data-width")

          setTimeout(() => {
            skillBar.style.width = width + "%"
          }, 200)

          skillObserver.unobserve(skillBar)
        }
      })
    },
    { threshold: 0.5 },
  )

  skillBars.forEach((bar) => {
    skillObserver.observe(bar)
  })
}

// Formulario de contacto
function initContactForm() {
  const form = document.querySelector(".contact-form")

  if (!form) return

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(form)
    const submitButton = form.querySelector('button[type="submit"]')
    const originalText = submitButton.innerHTML

    // Mostrar estado de carga
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...'
    submitButton.disabled = true

    try {
      // Simular envío (aquí integrarías con tu backend)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mostrar éxito
      submitButton.innerHTML = '<i class="fas fa-check"></i> ¡Enviado!'
      submitButton.style.background = "var(--success-color)"

      // Limpiar formulario
      form.reset()

      // Mostrar notificación
      showNotification("¡Mensaje enviado correctamente!", "success")
    } catch (error) {
      // Mostrar error
      submitButton.innerHTML = '<i class="fas fa-times"></i> Error'
      submitButton.style.background = "var(--error-color)"
      showNotification("Error al enviar el mensaje", "error")
    }

    // Restaurar botón después de 3 segundos
    setTimeout(() => {
      submitButton.innerHTML = originalText
      submitButton.disabled = false
      submitButton.style.background = ""
    }, 3000)
  })
}

// Contadores animados
function initCounters() {
  const counters = document.querySelectorAll(".stat-number")

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target
          const target = Number.parseInt(counter.getAttribute("data-target"))
          const duration = 2000
          const step = target / (duration / 16)
          let current = 0

          const updateCounter = () => {
            current += step
            if (current < target) {
              counter.textContent = Math.floor(current)
              requestAnimationFrame(updateCounter)
            } else {
              counter.textContent = target
            }
          }

          updateCounter()
          counterObserver.unobserve(counter)
        }
      })
    },
    { threshold: 0.5 },
  )

  counters.forEach((counter) => {
    counterObserver.observe(counter)
  })
}

// Efecto de escritura
function initTypingEffect() {
  const titleRole = document.querySelector(".title-role")
  if (!titleRole) return

  const roles = [
    "Desarrollador Full Stack"
  ]

  let currentRole = 0
  let currentChar = 0
  let isDeleting = false

  function typeEffect() {
    const current = roles[currentRole]

    if (isDeleting) {
      titleRole.textContent = current.substring(0, currentChar - 1)
      currentChar--
    } else {
      titleRole.textContent = current.substring(0, currentChar + 1)
      currentChar++
    }

    let typeSpeed = isDeleting ? 50 : 100

    if (!isDeleting && currentChar === current.length) {
      typeSpeed = 2000
      isDeleting = true
    } else if (isDeleting && currentChar === 0) {
      isDeleting = false
      currentRole = (currentRole + 1) % roles.length
      typeSpeed = 500
    }

    setTimeout(typeEffect, typeSpeed)
  }

  // Iniciar después de 2 segundos
  setTimeout(typeEffect, 2000)
}

// Efecto parallax
function initParallax() {
  const shapes = document.querySelectorAll(".shape")

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const rate = scrolled * -0.5

    shapes.forEach((shape, index) => {
      const speed = (index + 1) * 0.1
      shape.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`
    })
  })
}

// Toggle de tema (opcional)
function initThemeToggle() {
  // Crear botón de tema si no existe
  const themeToggle = document.createElement("button")
  themeToggle.className = "theme-toggle"
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
  themeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: var(--gradient-primary);
        color: white;
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: var(--shadow-glow);
    `

  document.body.appendChild(themeToggle)

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme")
    const icon = themeToggle.querySelector("i")

    if (document.body.classList.contains("light-theme")) {
      icon.className = "fas fa-sun"
    } else {
      icon.className = "fas fa-moon"
    }
  })
}

// Sistema de notificaciones
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <i class="fas fa-${type === "success" ? "check" : type === "error" ? "times" : "info"}"></i>
        <span>${message}</span>
    `

  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-glass);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-md) var(--spacing-lg);
        color: var(--text-primary);
        backdrop-filter: blur(20px);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    `

  document.body.appendChild(notification)

  // Animar entrada
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Remover después de 5 segundos
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 5000)
}

// Lazy loading para imágenes
function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.getAttribute("data-src")
        img.removeAttribute("data-src")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => {
    imageObserver.observe(img)
  })
}

// Optimización de performance
function optimizePerformance() {
  // Debounce para eventos de scroll
  let scrollTimeout
  const originalScrollHandler = window.onscroll

  window.onscroll = () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }

    scrollTimeout = setTimeout(() => {
      if (originalScrollHandler) {
        originalScrollHandler()
      }
    }, 16) // ~60fps
  }

  // Preload de imágenes críticas
  const criticalImages = ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=500&width=400"]

  criticalImages.forEach((src) => {
    const img = new Image()
    img.src = src
  })
}

// Inicializar optimizaciones
document.addEventListener("DOMContentLoaded", () => {
  initLazyLoading()
  optimizePerformance()
})

// Manejo de errores global
window.addEventListener("error", (e) => {
  console.error("Error en el portfolio:", e.error)
  // Aquí podrías enviar el error a un servicio de monitoreo
})

// Service Worker para PWA (opcional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registrado:", registration)
      })
      .catch((registrationError) => {
        console.log("SW falló:", registrationError)
      })
  })
}
