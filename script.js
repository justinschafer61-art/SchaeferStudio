const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const contactForm = document.querySelector("[data-contact-form]");
const formMessage = document.querySelector("[data-form-message]");
const revealElements = document.querySelectorAll(".reveal");

// Schliesst die mobile Navigation nach Link-Klicks oder Escape.
function closeNavigation() {
  document.body.classList.remove("nav-open");
  nav?.classList.remove("is-open");
  navToggle?.classList.remove("is-active");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Menü öffnen");
}

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", Boolean(isOpen));
  navToggle.classList.toggle("is-active", Boolean(isOpen));
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  navToggle.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
});

// Interne Navigationslinks sollen das mobile Menue direkt wieder schliessen.
nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNavigation();
  }
});

// Dezente Scroll-Effekte ohne externe Bibliothek.
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

// Das Formular bleibt ohne Backend und oeffnet die Mail-App mit vorausgefuelltem Inhalt.
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const subject = `Projektanfrage von ${name || "Schäfer Studio Website"}`;
  const body = [
    "Hallo Schäfer Studio,",
    "",
    "ich interessiere mich für eine neue Webseite.",
    "",
    `Name: ${name}`,
    `E-Mail: ${email}`,
    `Unternehmen: ${company || "-"}`,
    "",
    "Nachricht:",
    message,
    "",
    "Viele Grüße",
    name
  ].join("\n");

  window.location.href = `mailto:info@schaeferstudio.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  formMessage.textContent = "Deine E-Mail-App wurde geöffnet. Bitte sende die Nachricht dort ab.";
});
