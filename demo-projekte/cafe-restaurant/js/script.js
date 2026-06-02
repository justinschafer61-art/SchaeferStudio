const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const slides = Array.from(document.querySelectorAll(".hero-slide"));
const slideButtons = Array.from(document.querySelectorAll("[data-slide-button]"));
const reveals = document.querySelectorAll(".reveal");
const testimonials = Array.from(document.querySelectorAll("[data-testimonial]"));
const lightbox = document.querySelector("[data-lightbox-modal]");
const lightboxImage = lightbox?.querySelector("img");
const lightboxClose = document.querySelector("[data-lightbox-close]");

let activeSlide = 0;
let activeTestimonial = 0;

// Keep the sticky header legible once the hero is behind it.
function setScrolledHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 20);
}

function closeNavigation() {
  document.body.classList.remove("nav-open");
  nav?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Menü öffnen");
}

function showSlide(index) {
  activeSlide = index % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeSlide);
  });
  slideButtons.forEach((button, buttonIndex) => {
    button.classList.toggle("is-active", buttonIndex === activeSlide);
  });
}

function showNextSlide() {
  showSlide(activeSlide + 1);
}

function showNextTestimonial() {
  activeTestimonial = (activeTestimonial + 1) % testimonials.length;
  testimonials.forEach((item, index) => {
    item.classList.toggle("is-active", index === activeTestimonial);
  });
}

// Reuse one lightweight modal for all gallery images.
function openLightbox(imageSource, altText) {
  if (!lightbox || !lightboxImage) return;
  lightboxImage.src = imageSource;
  lightboxImage.alt = altText || "Galeriebild";
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";
}

setScrolledHeader();
window.addEventListener("scroll", () => {
  setScrolledHeader();
  document.documentElement.style.setProperty("--parallax", String(window.scrollY * 0.14));
});

navToggle?.addEventListener("click", () => {
  const isOpen = !nav?.classList.contains("is-open");
  nav?.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

slideButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showSlide(Number(button.dataset.slideButton || 0));
  });
});

if (slides.length > 1) {
  window.setInterval(showNextSlide, 5400);
}

if (testimonials.length > 1) {
  window.setInterval(showNextTestimonial, 4300);
}

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
    { threshold: 0.16, rootMargin: "0px 0px -70px 0px" }
  );

  reveals.forEach((item) => revealObserver.observe(item));
} else {
  reveals.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll("[data-lightbox]").forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    openLightbox(button.dataset.lightbox || "", image?.alt || "");
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNavigation();
    closeLightbox();
  }
});
