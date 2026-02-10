/**
 * Portfolio - Main Application Logic
 * Replaces React components, hooks, and Framer Motion with vanilla JS + GSAP.
 */

(function () {
  "use strict";

  // ========================================
  // INITIALIZATION
  // ========================================
  document.addEventListener("DOMContentLoaded", () => {
    initFooterYear();
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initHeroAnimations();
    initScrollReveal();
    initProjects();
    initContactForm();
    initResumeModal();
    initHeroParallax();
  });

  // ========================================
  // FOOTER YEAR
  // ========================================
  function initFooterYear() {
    const yearEl = document.getElementById("current-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // ========================================
  // HEADER - Scroll detection
  // ========================================
  function initHeader() {
    const header = document.getElementById("site-header");
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 50) {
        header.classList.add("header-scrolled");
      } else {
        header.classList.remove("header-scrolled");
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // check initial state
  }

  // ========================================
  // MOBILE MENU
  // ========================================
  function initMobileMenu() {
    const btn = document.getElementById("mobile-menu-btn");
    const menu = document.getElementById("mobile-menu");
    if (!btn || !menu) return;

    let isOpen = false;

    btn.addEventListener("click", () => {
      isOpen = !isOpen;
      if (isOpen) {
        menu.classList.add("open");
        btn.classList.add("hamburger-open");
        document.body.style.overflow = "hidden";
      } else {
        closeMenu();
      }
    });

    // Close menu when clicking a link
    menu.querySelectorAll(".mobile-nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    function closeMenu() {
      isOpen = false;
      menu.classList.remove("open");
      btn.classList.remove("hamburger-open");
      document.body.style.overflow = "";
    }
  }

  // ========================================
  // SMOOTH SCROLLING - replaces React Router hash navigation
  // ========================================
  function initSmoothScroll() {
    document.querySelectorAll(".nav-link, .mobile-nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    });
  }

  // ========================================
  // HERO ANIMATIONS - replaces Framer Motion
  // ========================================
  function initHeroAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Title 1 - CREATIVE
    gsap.fromTo(
      "#hero-title-1",
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1, ease: "expo.out", delay: 0.2 },
    );

    // Gradient bar
    gsap.to("#hero-gradient-bar", {
      scaleX: 1,
      duration: 1.2,
      delay: 0.4,
      ease: "expo.out",
    });

    // Title 2 - MINIMALIST
    gsap.fromTo(
      "#hero-title-2",
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "expo.out" },
    );

    // Philosophy section
    gsap.fromTo(
      "#hero-philosophy",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, delay: 1.0, ease: "power2.out" },
    );
  }

  // ========================================
  // HERO PARALLAX - replaces useScroll/useTransform
  // ========================================
  function initHeroParallax() {
    const parallaxEl = document.getElementById("hero-parallax");
    if (!parallaxEl) return;

    gsap.to(parallaxEl, {
      y: 200,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  // ========================================
  // SCROLL REVEAL - replaces ScrollReveal component
  // Uses Intersection Observer + GSAP for buttery smooth reveals
  // ========================================
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(
      ".reveal-up, .reveal-left",
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = parseFloat(el.dataset.delay || "0");
            const isLeft = el.classList.contains("reveal-left");

            gsap.fromTo(
              el,
              {
                opacity: 0,
                x: isLeft ? 40 : 0,
                y: isLeft ? 0 : 40,
              },
              {
                opacity: 1,
                x: 0,
                y: 0,
                duration: 0.6,
                delay: delay,
                ease: "expo.out",
                onComplete: () => {
                  el.classList.add("revealed");
                },
              },
            );

            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  // ========================================
  // PROJECTS - replaces Work.tsx + ProjectCard + filtering
  // ========================================
  let currentCategory = "All";

  function initProjects() {
    renderProjects(PROJECTS);
    initFilters();
  }

  function renderProjects(projects) {
    const grid = document.getElementById("projects-grid");
    if (!grid) return;

    grid.innerHTML = "";

    projects.forEach((project, index) => {
      const offsetClass = index % 2 === 1 ? "md:mt-24" : "";

      const card = document.createElement("div");
      card.className = `project-card ${offsetClass}`;
      card.dataset.category = project.category;
      card.dataset.id = project.id;

      card.innerHTML = `
        <div class="relative aspect-[4/3] overflow-hidden bg-neutral-900 mb-6">
          <div class="project-overlay absolute inset-0 bg-neutral-800 z-10"></div>
          <img
            src="${project.thumbnail}"
            alt="${project.title}"
            class="project-image w-full h-full object-cover"
            loading="lazy"
          />
          <div class="project-arrow absolute top-4 right-4 p-2 bg-white text-black rounded-full z-20">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6v2h8.59L5 17.59 6.41 19 16 9.41V18h2V6z"/></svg>
          </div>
        </div>
        <div class="flex flex-col gap-1 border-t border-neutral-800 pt-4">
          <div class="flex justify-between items-baseline">
            <h3 class="project-title text-2xl font-bold text-neutral-100">${project.title}</h3>
            <span class="text-sm font-mono text-neutral-500">${project.year}</span>
          </div>
          <p class="text-neutral-500 text-sm">${project.category} — ${project.tags[0]}</p>
        </div>
      `;

      card.addEventListener("click", () => {
        if (project.behanceUrl) {
          window.open(project.behanceUrl, "_blank");
        }
      });

      grid.appendChild(card);

      // Animate card in
      gsap.fromTo(
        card,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: index * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            once: true,
          },
        },
      );
    });
  }

  function initFilters() {
    const filterBtns = document.querySelectorAll(".filter-btn");

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const category = btn.dataset.category;
        if (category === currentCategory) return;

        currentCategory = category;

        // Update active styles
        filterBtns.forEach((b) => {
          b.classList.remove("text-white", "border-b", "border-white");
          b.classList.add("text-neutral-500");
        });
        btn.classList.remove("text-neutral-500");
        btn.classList.add("text-white", "border-b", "border-white");

        // Filter projects
        const filtered =
          category === "All"
            ? PROJECTS
            : PROJECTS.filter((p) => p.category === category);

        // Animate out existing cards
        const existingCards = document.querySelectorAll(".project-card");
        gsap.to(existingCards, {
          opacity: 0,
          y: 20,
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.in",
          onComplete: () => {
            renderProjects(filtered);
          },
        });
      });
    });
  }

  // ========================================
  // CONTACT FORM - replaces React state management
  // ========================================
  function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const messageError = document.getElementById("message-error");
    const submitBtn = document.getElementById("submit-btn");
    const formContainer = document.getElementById("form-container");
    const successMessage = document.getElementById("success-message");

    // Clear errors on input
    [nameInput, emailInput, messageInput].forEach((input) => {
      input.addEventListener("input", () => {
        input.classList.remove("error");
        const errorEl = document.getElementById(input.name + "-error");
        if (errorEl) {
          errorEl.textContent = "";
          errorEl.classList.add("hidden");
        }
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Validate
      let valid = true;
      const errors = {};

      if (!nameInput.value.trim()) {
        errors.name = "Name is required";
        valid = false;
      }

      if (!emailInput.value.trim()) {
        errors.email = "Email is required";
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
        errors.email = "Please enter a valid email";
        valid = false;
      }

      if (!messageInput.value.trim()) {
        errors.message = "Message is required";
        valid = false;
      } else if (messageInput.value.length < 10) {
        errors.message = "Message must be at least 10 characters";
        valid = false;
      }

      // Show errors
      if (errors.name) {
        nameError.textContent = errors.name;
        nameError.classList.remove("hidden");
        nameInput.classList.add("error");
      }
      if (errors.email) {
        emailError.textContent = errors.email;
        emailError.classList.remove("hidden");
        emailInput.classList.add("error");
      }
      if (errors.message) {
        messageError.textContent = errors.message;
        messageError.classList.remove("hidden");
        messageInput.classList.add("error");
      }

      if (!valid) return;

      // Submit via mailto
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      const subject = encodeURIComponent(
        `Portfolio Contact: ${nameInput.value}`,
      );
      const body = encodeURIComponent(
        `Name: ${nameInput.value}\nEmail: ${emailInput.value}\n\nMessage:\n${messageInput.value}`,
      );
      const mailtoLink = `mailto:rishu3826@gmail.com?subject=${subject}&body=${body}`;
      window.location.href = mailtoLink;

      // Show success
      gsap.to(formContainer, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        onComplete: () => {
          formContainer.classList.add("hidden");
          successMessage.classList.remove("hidden");
          gsap.fromTo(
            successMessage,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" },
          );
        },
      });

      // Reset after 5 seconds
      setTimeout(() => {
        gsap.to(successMessage, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            successMessage.classList.add("hidden");
            formContainer.classList.remove("hidden");
            form.reset();
            submitBtn.textContent = "Send Message";
            submitBtn.disabled = false;
            gsap.fromTo(
              formContainer,
              { opacity: 0 },
              { opacity: 1, duration: 0.3 },
            );
          },
        });
      }, 5000);
    });
  }

  // ========================================
  // RESUME MODAL - replaces React state + AnimatePresence
  // ========================================
  function initResumeModal() {
    const modal = document.getElementById("resume-modal");
    const iframe = document.getElementById("resume-iframe");
    const closeBtn = document.getElementById("resume-close-btn");
    const resumeBtn = document.getElementById("resume-btn");
    const resumeBtnMobile = document.getElementById("resume-btn-mobile");
    const resumeUrl = "images/Rishu-kumar-sharma-UI-UX-Designer.pdf";

    function openModal() {
      iframe.src = resumeUrl + "#toolbar=0&navpanes=0&scrollbar=0";
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modal.classList.remove("open");
      document.body.style.overflow = "";
      setTimeout(() => {
        iframe.src = "";
      }, 300);
    }

    if (resumeBtn) resumeBtn.addEventListener("click", openModal);
    if (resumeBtnMobile) resumeBtnMobile.addEventListener("click", openModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    // Close on backdrop click
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });
    }

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) {
        closeModal();
      }
    });
  }
})();
