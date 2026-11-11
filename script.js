/* =========================================
   MAKI - JAVASCRIPT COMPLETO
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================
     1. MENÚ PARA CELULARES
  ===================================== */

  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");

  if (menuToggle && menu) {

    menuToggle.addEventListener("click", () => {
      const abierto = menu.classList.toggle("menu-abierto");

      menuToggle.setAttribute(
        "aria-expanded",
        String(abierto)
      );

      menuToggle.setAttribute(
        "aria-label",
        abierto ? "Cerrar menú" : "Abrir menú"
      );
    });

    const enlacesMenu = menu.querySelectorAll("a");

    enlacesMenu.forEach(enlace => {
      enlace.addEventListener("click", () => {
        menu.classList.remove("menu-abierto");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");
      });
    });

  }

  /* =====================================
     2. ANIMACIONES AL DESLIZAR
  ===================================== */

  const elementosAnimados = document.querySelectorAll(
    ".tarjeta-componente, " +
    ".tarjeta-regla, " +
    ".integrante, " +
    ".tarjeta-nosotros, " +
    ".objetivo-juego, " +
    ".reglas-resumen, " +
    ".seccion-titulo"
  );

  const movimientoReducido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!movimientoReducido && "IntersectionObserver" in window) {

    elementosAnimados.forEach(elemento => {
      elemento.classList.add("animar-entrada");
    });

    const observador = new IntersectionObserver(
      (entradas, observer) => {
        entradas.forEach(entrada => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visible");
            observer.unobserve(entrada.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px 40px 0px"
      }
    );

    elementosAnimados.forEach(elemento => {
      observador.observe(elemento);
    });
  }

  /* =====================================
     3. NAVEGACIÓN ACTIVA
  ===================================== */

  const enlaces = document.querySelectorAll(
    '.menu a[href^="#"]'
  );

  const secciones = document.querySelectorAll(
    "main section[id]"
  );

  function activarEnlace(id) {
    enlaces.forEach(enlace => {
      const esActivo =
        enlace.getAttribute("href") === "#" + id;

      enlace.classList.toggle("activo", esActivo);

      if (esActivo) {
        enlace.setAttribute("aria-current", "location");
      } else {
        enlace.removeAttribute("aria-current");
      }
    });
  }

  enlaces.forEach(enlace => {
    enlace.addEventListener("click", () => {
      activarEnlace(
        enlace.getAttribute("href").substring(1)
      );
    });
  });

  if ("IntersectionObserver" in window) {
    const observadorSecciones = new IntersectionObserver(
      entradas => {
        const visibles = entradas
          .filter(entrada => entrada.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (visibles.length > 0) {
          activarEnlace(visibles[0].target.id);
        }
      },
      {
        rootMargin: "-15% 0px -55% 0px",
        threshold: 0
      }
    );

    secciones.forEach(seccion => {
      observadorSecciones.observe(seccion);
    });
  }

  /* =====================================
     4. VENTANA EMERGENTE DE CONTACTO
  ===================================== */

  const modal = document.getElementById("contacto-modal");
  const abrirNav = document.getElementById("abrir-contacto");
  const abrirSeccion = document.getElementById("abrir-contacto-seccion");
  const abrirFooter = document.getElementById("abrir-contacto-footer");
  const cerrarBtn = document.getElementById("cerrar-contacto");
  const ventana = document.querySelector(".contacto-ventana");

  let elementoAnterior = null;

  function abrirContacto(evento) {
    if (evento) evento.preventDefault();

    elementoAnterior = document.activeElement;

    modal.classList.add("abierto");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-abierto");

    cerrarBtn.focus();

    if (menu) {
      menu.classList.remove("menu-abierto");
    }

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
    }
  }

  function cerrarContacto() {
    modal.classList.remove("abierto");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-abierto");

    if (elementoAnterior) {
      elementoAnterior.focus();
    }
  }

  if (abrirNav) {
    abrirNav.addEventListener("click", abrirContacto);
  }

  if (abrirSeccion) {
    abrirSeccion.addEventListener("click", abrirContacto);
  }

  if (abrirFooter) {
    abrirFooter.addEventListener("click", abrirContacto);
  }

  if (cerrarBtn) {
    cerrarBtn.addEventListener("click", cerrarContacto);
  }

  if (modal) {
    modal.addEventListener("click", evento => {
      if (evento.target === modal) {
        cerrarContacto();
      }
    });
  }

  document.addEventListener("keydown", evento => {
    if (!modal || !modal.classList.contains("abierto")) {
      return;
    }

    if (evento.key === "Escape") {
      cerrarContacto();
      return;
    }

    if (evento.key === "Tab") {
      const controles = Array.from(
        ventana.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled])'
        )
      ).filter(elemento => elemento.getClientRects().length > 0);

      if (controles.length === 0) {
        evento.preventDefault();
        ventana.focus();
        return;
      }

      const primero = controles[0];
      const ultimo = controles[controles.length - 1];

      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    }
  });

  /* =====================================
     5. EMAILJS ORIGINAL DE TU AMIGO
     CLAVES Y ENVÍO SIN CAMBIOS
  ===================================== */

  // Inicializar EmailJS
  emailjs.init({
    publicKey: "C2Ixyp7PeTtW6EW9v"
  });

  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formStatus = document.getElementById("formStatus");

  contactForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";
    formStatus.textContent = "";

    try {

      await emailjs.sendForm(
        "service_zc3k1yw",
        "template_pxk7znl",
        contactForm
      );

      formStatus.textContent = "¡Mensaje enviado correctamente!";
      formStatus.style.color = "#28a745";

      contactForm.reset();

    } catch (error) {

      console.error("Error al enviar:", error);

      formStatus.textContent =
        "No se pudo enviar el mensaje. Intenta nuevamente.";

      formStatus.style.color = "#dc3545";

    } finally {

      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar Mensaje";

    }

  });

});