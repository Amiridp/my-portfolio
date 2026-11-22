(() => {
  const section = document.querySelector("#projects");
  const cards = [...section.querySelectorAll(".project-card")];
  const dialog = section.querySelector(".project-dialog");
  const details = {
    portfolio: ["Personal Portfolio", "The website you are exploring now: built with HTML, CSS, and JavaScript, with light and dark themes, orbiting skills, and a contact form with direct email submission."],
    next: ["Something New", "This is a placeholder for a future project. A description and live project link will be added when it is ready."],
    lab: ["Room to Experiment", "This card is reserved for future work. There is no published project or demo for this card yet."],
  };
  const deck = section.querySelector(".project-deck");
  let inputMode = "keyboard";
  let pointer = null;

  function select(card) {
    cards.forEach((item) => item.classList.toggle("is-active", item === card));
  }
  function syncSelection() {
    if (dialog.open) return;
    if (inputMode === "pointer" && pointer) {
      const hovered = document.elementFromPoint(pointer.x, pointer.y)?.closest(".project-card");
      select(cards.includes(hovered) ? hovered : null);
    } else if (inputMode === "keyboard") {
      select(cards.find(card => card.contains(document.activeElement)) || null);
    } else {
      select(null);
    }
  }
  function trackPointer(event) {
    inputMode = event.pointerType === "touch" ? "touch" : "pointer";
    pointer = { x: event.clientX, y: event.clientY };
  }
  document.addEventListener("pointerdown", trackPointer, { passive: true });
  document.addEventListener("pointermove", event => {
    trackPointer(event);
    if (inputMode === "pointer") syncSelection();
  }, { passive: true });
  document.addEventListener("keydown", event => {
    if (["Tab", "Enter", " "].includes(event.key)) inputMode = "keyboard";
  });
  cards.forEach(card => {
    card.addEventListener("click", () => {
      if (!dialog.open) select(card);
    });
    card.addEventListener("focusin", () => {
      if (!dialog.open && inputMode === "keyboard") select(card);
    });
});
  deck.addEventListener("pointerleave", () => {
    if (inputMode === "pointer" && !dialog.open) select(null);
  });
  deck.addEventListener("focusout", () => requestAnimationFrame(syncSelection));
  // Wait until the browser has restored focus and removed the modal backdrop.
  dialog.addEventListener("close", () => requestAnimationFrame(syncSelection));
  section.querySelectorAll(".project-view").forEach((button) => {
    button.addEventListener("click", () => {
      const [title, description] = details[button.dataset.project];
      section.querySelector("#project-dialog-title").textContent = title;
      section.querySelector("#project-dialog-description").textContent = description;
      section.querySelector(".project-demo").hidden = button.dataset.project !== "portfolio";
      dialog.showModal();
    });
  });
  section.querySelector(".project-demo").addEventListener("click", () => dialog.close());
  section.querySelector(".project-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
})();