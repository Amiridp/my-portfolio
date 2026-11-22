(() => {
  const targets = [...document.querySelectorAll("main > section:not(#home) > .container")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) reveal(entry.target);
    });
  }, { threshold: 0, rootMargin: "0px 0px -40px 0px" });

  function reveal(target) {
    target.classList.remove("is-pending");
    observer.unobserve(target);
  }
  targets.forEach(target => {
    // Preserve visible content and restored scroll positions on page load.
    if (target.getBoundingClientRect().top < window.innerHeight) return;
    target.classList.add("scroll-reveal", "is-pending");
    observer.observe(target);
  });

  document.addEventListener("focusin", event => {
    const target = event.target.closest(".scroll-reveal");
    if (target) reveal(target);
  });
  function revealHash() {
    const id = location.hash.slice(1);
    if (!id) return;
    let section;
    try { section = document.getElementById(decodeURIComponent(id)); } catch { return; }
    const target = section?.querySelector(".scroll-reveal");
    if (target) reveal(target);
  }
  window.addEventListener("hashchange", revealHash);
  revealHash();
  reducedMotion.addEventListener("change", event => {
    if (event.matches) {
      targets.forEach(reveal);
      observer.disconnect();
    }
  });
})();