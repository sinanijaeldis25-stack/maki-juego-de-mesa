/* MAKI - Modal de video. Independiente del script.js original. */
document.addEventListener("DOMContentLoaded", () => {
  const abrir = document.getElementById("abrir-video-componentes");
  const modal = document.getElementById("modal-video-componentes");
  const cerrar = document.getElementById("cerrar-video-componentes");
  const video = document.getElementById("video-componentes");
  const error = document.getElementById("video-componentes-error");

  if (!abrir || !modal || !cerrar || !video) return;

  let focoAnterior = null;

  function abrirVideo() {
    focoAnterior = document.activeElement;
    modal.classList.add("abierto");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-abierto");
    if (error) error.hidden = true;
    cerrar.focus();

    // Se intenta reproducir después del clic del usuario.
    const promesa = video.play();
    if (promesa && typeof promesa.catch === "function") {
      promesa.catch(() => {
        // Algunos navegadores requieren pulsar Play manualmente.
      });
    }
  }

  function cerrarVideo() {
    video.pause();
    video.currentTime = 0;
    modal.classList.remove("abierto");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-abierto");
    if (focoAnterior && typeof focoAnterior.focus === "function") {
      focoAnterior.focus();
    }
  }

  abrir.addEventListener("click", abrirVideo);
  cerrar.addEventListener("click", cerrarVideo);

  // Cerrar al pulsar fuera de la ventanita.
  modal.addEventListener("click", (evento) => {
    if (evento.target === modal) cerrarVideo();
  });

  // Cerrar con Escape y mantener el foco dentro del modal.
  document.addEventListener("keydown", (evento) => {
    if (!modal.classList.contains("abierto")) return;
    if (evento.key === "Escape") {
      cerrarVideo();
      return;
    }
    if (evento.key === "Tab") {
      const controles = [cerrar, video];
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

  video.addEventListener("error", () => {
    if (error) error.hidden = false;
  });
});
