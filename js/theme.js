(() => {
  const root = document.documentElement;
  const storageKey = "portfolio-theme";
  let theme = "light";
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === "dark" || saved === "light") theme = saved;
  } catch {
    // The toggle still works when browser storage is unavailable.
  }

  // Apply the saved palette before the page styles render.
  root.dataset.theme = theme;

  document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector(".theme-toggle");
    if (!button) return;

    function updateLabel() {
      const label = root.dataset.theme === "dark"
        ? "Switch to light mode"
        : "Switch to dark mode";
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
    }

    updateLabel();
    button.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      updateLabel();
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        // Keep the selected theme for this page even if it cannot be saved.
      }
    });
  });
})();