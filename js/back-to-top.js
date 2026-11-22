(() => {
  const link = document.querySelector(".back-to-top");
  const home = document.querySelector("#home");
  if (!link || !home) return;
  function updateVisibility() {
    link.hidden = window.scrollY <= 40;
  }
  window.addEventListener("scroll", updateVisibility, { passive: true });
  window.addEventListener("pageshow", updateVisibility);
  link.addEventListener("click", () => {
    home.setAttribute("tabindex", "-1");
    home.focus({ preventScroll: true });
    home.addEventListener("blur", () => home.removeAttribute("tabindex"), { once: true });
  });
  updateVisibility();
})();