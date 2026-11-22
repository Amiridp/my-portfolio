(() => {
  const section = document.querySelector("#projects");
  const cards = [...section.querySelectorAll(".project-card")];
  const dialog = section.querySelector(".project-dialog");
  const details = {
    portfolio: ["Personal Portfolio", "The website you are exploring now: built with HTML, CSS, and JavaScript, with light and dark themes, orbiting skills, and a contact form with direct email submission."],
    next: ["Something New", "This is a placeholder for a future project. A description and live project link will be added when it is ready."],
    lab: ["Room to Experiment", "This card is reserved for future work. There is no published project or demo for this card yet."],
  };
  function select(card) {
    cards.forEach((item) => item.classList.toggle("is-active", item === card));
  }
  cards.forEach((card) => {
    card.addEventListener("click", () => select(card));
    card.addEventListener("focusin", () => select(card));
    card.addEventListener("pointerenter", () => select(card));
  });
  section.querySelector(".project-deck").addEventListener("pointerleave", () => {
    if (!cards.some((card) => card.contains(document.activeElement))) select(null);
  });
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