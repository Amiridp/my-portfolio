(() => {
  const header = document.querySelector(".site-header");
  const nav = header.querySelector(".main-nav");
  const toggle = header.querySelector(".menu-toggle");
  const mobile = window.matchMedia("(max-width: 900px)");
  let open = false;

  function setOpen(value, returnFocus = false) {
    open = mobile.matches && value;
    nav.hidden = mobile.matches && !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    if (returnFocus) toggle.focus();
  }

  header.classList.add("nav-ready");
  setOpen(false);
  toggle.addEventListener("click", () => {
    setOpen(!open);
    if (open) nav.querySelector("a").focus();
  });
  nav.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link || !mobile.matches) return;
    setOpen(false);
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && open) setOpen(false, true);
  });
  document.addEventListener("click", (event) => {
    if (open && !header.contains(event.target)) setOpen(false);
  });
  document.addEventListener("focusin", (event) => {
    if (open && !header.contains(event.target)) setOpen(false);
  });
  mobile.addEventListener("change", () => {
    const focusInNav = nav.contains(document.activeElement);
    const focusOnToggle = document.activeElement === toggle;
    setOpen(false);
    if (mobile.matches && focusInNav) toggle.focus();
    if (!mobile.matches && focusOnToggle) nav.querySelector("a").focus();
  });
})();