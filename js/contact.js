(() => {
  const form = document.querySelector("#contact-form");
  if (!form) return;
  const status = document.querySelector("#contact-status");
  const button = form.querySelector('button[type="submit"]');
  const name = form.elements.namedItem("name");
  const message = form.elements.namedItem("message");
  let sending = false;
  [name, message].forEach(field => field.addEventListener("input", () => field.setCustomValidity("")));
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (sending) return;
    name.setCustomValidity(name.value.trim() ? "" : "Please enter your name.");
    message.setCustomValidity(message.value.trim().length >= 10 ? "" : "Please write at least 10 characters.");
    if (!form.reportValidity()) return;
    sending = true;
    button.disabled = true;
    button.textContent = "Sending...";
    form.setAttribute("aria-busy", "true");
    status.textContent = "Sending your message...";
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch("https://formsubmit.co/ajax/sina0amiri1@gmail.com", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || !(result.success === true || result.success === "true")) throw new Error("Submission failed");
      status.textContent = "Your message was accepted by the contact service. Thank you for getting in touch!";
      form.reset();
    } catch {
      status.textContent = "Your message could not be confirmed. Your text is still here; try again or email sina0amiri1@gmail.com directly.";
    } finally {
      clearTimeout(timer);
      sending = false;
      button.disabled = false;
      button.textContent = "Send message";
      form.removeAttribute("aria-busy");
    }
  });
})();