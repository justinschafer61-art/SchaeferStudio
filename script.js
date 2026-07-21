const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const contactForm = document.querySelector("[data-contact-form]");
const formMessage = document.querySelector("[data-form-message]");
const submitButton = document.querySelector("[data-submit-button]");
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

// Sendet Anfragen direkt an Netlify Forms, ohne die Seite zu verlassen.
contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  formMessage.classList.remove("is-success", "is-error");
  formMessage.textContent = "Anfrage wird gesendet …";

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.setAttribute("aria-busy", "true");
    submitButton.textContent = "Wird gesendet …";
  }

  try {
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString()
    });

    if (!response.ok) {
      throw new Error(`Formular konnte nicht gesendet werden (${response.status}).`);
    }

    contactForm.reset();
    formMessage.classList.add("is-success");
    formMessage.textContent = "Vielen Dank! Deine Anfrage wurde erfolgreich gesendet. Ich melde mich bei dir.";
  } catch (error) {
    formMessage.classList.add("is-error");
    formMessage.innerHTML = 'Das hat leider nicht funktioniert. Schreib mir bitte direkt an <a href="mailto:info@schaeferstudio.de">info@schaeferstudio.de</a>.';
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.removeAttribute("aria-busy");
      submitButton.innerHTML = 'Anfrage senden <span aria-hidden="true">↗</span>';
    }
  }
});
