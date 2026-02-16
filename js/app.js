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
    initLoader();
    try {
      initFooterYear();
      initHeader();
      initMobileMenu();
      initSmoothScroll();
      initScrollReveal();
      initProjects();
      initContactForm();
      initResumeModal();
      initHeroParallax();
      initHeroBackgroundEffects();
      initAdvancedAnimations();
      initHeroTitleHover();
    } catch (e) {
      console.warn("Initialization error:", e);
    }
  });

  // ========================================
  // LOADER ANIMATION
  // ========================================
  function initLoader() {
    const loader = document.getElementById("loader");
    const content = document.getElementById("loader-content");
    const app = document.querySelector(".app");

    if (!loader || !content) return;

    // Default clean-up function if animation fails
    const hideLoader = () => {
      if (loader.style.display !== "none") {
        loader.style.display = "none";
        document.body.classList.remove("overflow-hidden");
        if (app) app.style.opacity = "1";
        if (app) app.style.transform = "translateY(0)";

        // Try to trigger hero animations if possible
        try {
          if (typeof initHeroAnimations === "function") initHeroAnimations();
        } catch (e) {
          console.warn("Hero animations failed:", e);
        }
      }
    };

    // Safety fallback: guaranteed removal after 3.5s
    setTimeout(hideLoader, 3500);

    // Check if GSAP is loaded
    if (typeof gsap === "undefined") {
      console.error("GSAP not loaded");
      // If no GSAP, just hide after 1s
      setTimeout(hideLoader, 1000);
      return;
    }

    try {
      // Ensure smooth start
      gsap.set(content, { opacity: 1, scale: 1 });
      gsap.set(loader, { opacity: 1 });
      gsap.set(app, { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
          loader.style.display = "none";
          document.body.classList.remove("overflow-hidden");
          ScrollTrigger.refresh();
        },
      });

      tl.to(content, {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        delay: 2, // Wait 1.5 seconds
        ease: "back.in(1.7)",
      })
        .to(
          loader,
          {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
          },
          "-=0.2",
        )
        .to(
          app,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.6",
        )
        .call(
          () => {
            try {
              if (typeof initHeroAnimations === "function")
                initHeroAnimations();
            } catch (e) {
              console.warn("Hero animations failed in timeline:", e);
            }
          },
          null,
          "-=0.8",
        );
    } catch (error) {
      console.error("Loader animation error:", error);
      hideLoader();
    }
  }

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
  // HERO HOVER EFFECTS - Interactive Text
  // ========================================
  function initHeroTitleHover() {
    const title1 = document.getElementById("hero-title-1");
    const title2 = document.getElementById("hero-title-2");

    // Helper for hover effect
    const addHover = (el, color, xDir) => {
      if (!el) return;

      // Add cursor pointer style
      el.style.cursor = "pointer";

      el.addEventListener("mouseenter", () => {
        gsap.to(el, {
          color: color,
          skewX: -10, // Italic speed effect
          x: xDir, // Slight shift
          scale: 1.05,
          duration: 0.4,
          ease: "power2.out",
          overflow: "hidden", // Ensure no scrollbar
        });
        // Blur siblings slightly for focus? Maybe too much.
      });

      el.addEventListener("mouseleave", () => {
        gsap.to(el, {
          color: "rgba(255, 255, 255, 0.9)", // Back to default
          skewX: 0,
          x: 0,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        });
      });
    };

    // Apply effects
    // Creative -> Teal, shift Right
    addHover(title1, "#14b8a6", 30);

    // Minimalist -> Orange, shift Left
    addHover(title2, "#f97316", -30);
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
  // HERO BACKGROUND ANIMATION
  // ========================================
  // ========================================
  // HERO BACKGROUND ANIMATION (GSAP Grid Stagger)
  // ========================================
  function initHeroBackgroundEffects() {
    const container = document.getElementById("grid-container");
    if (!container) return;

    // Clear any existing content
    container.innerHTML = "";

    // Grid Configuration
    const isMobile = window.innerWidth < 768;
    const rows = isMobile ? 6 : 10;
    const cols = isMobile ? 6 : 12;
    const gutter = 2;

    // Full width configuration
    container.style.display = "grid";
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    container.style.gap = `${gutter}px`;
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.maxWidth = "none";

    // Ensure container is subtle
    container.style.opacity = "1";
    container.style.zIndex = "0"; // Behind content

    // Create boxes
    const totalBoxes = rows * cols;
    // Base dark theme colors
    const baseColor = "#050505"; // Deepest black
    const highlightColors = [
      "#1a1a1a", // Neutral gray
      "#1e293b", // Slate blue
      "#0f2e29", // Visible Dark Teal
      "#2e1a0f", // Visible Dark Orange
    ];

    for (let i = 0; i < totalBoxes; i++) {
      const box = document.createElement("div");
      box.classList.add("grid-box");
      // Start with base color
      box.style.backgroundColor = baseColor;
      box.style.width = "100%";
      box.style.height = "100%";
      container.appendChild(box);
    }

    // Smooth Breathing Animation
    // repeatRefresh: true ensures new random colors are picked each cycle
    gsap.to(".grid-box", {
      backgroundColor: () => gsap.utils.random(highlightColors),
      duration: 4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      repeatRefresh: true, // Key for dynamic color changing
      stagger: {
        amount: 8,
        grid: [rows, cols],
        from: "random",
      },
      force3D: true, // GPU optimization
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
  // ADVANCED PAGE ANIMATIONS (Work, About, Contact)
  // ========================================
  function initAdvancedAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // --- WORK SECTION ---
    const workSection = document.getElementById("work");
    if (workSection) {
      const titleTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: "#work",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      titleTimeline
        .from("#work .h-[2px]", { width: 0, duration: 0.8, ease: "power2.out" })
        .from(
          "#work span.uppercase",
          { opacity: 0, x: -20, duration: 0.5 },
          "-=0.4",
        )
        .from(
          "#work h2",
          { y: 50, opacity: 0, duration: 0.8, ease: "back.out(1.7)" },
          "-=0.2",
        )
        .from(
          "#work p.max-w-2xl",
          { y: 20, opacity: 0, duration: 0.6 },
          "-=0.4",
        );

      // Filter Stagger
      gsap.from(".filter-btn", {
        scrollTrigger: {
          trigger: "#category-filters",
          start: "top 85%",
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out",
      });

      // Breathing Gradient
      const bgGradient = workSection.querySelector(
        ".absolute.bg-gradient-to-b",
      );
      if (bgGradient) {
        gsap.to(bgGradient, {
          scale: 1.2,
          opacity: 0.8,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }

    // --- ABOUT SECTION (Stats) ---
    // Target the stats grid items
    const statsGrid = document.querySelector("#about .grid.border-t");
    if (statsGrid) {
      gsap.from(statsGrid.children, {
        scrollTrigger: {
          trigger: statsGrid,
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
      });
    }

    // --- CONTACT SECTION (Form) ---
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      gsap.from(contactForm.children, {
        scrollTrigger: {
          trigger: contactForm,
          start: "top 80%",
        },
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
      });
    }
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
      const card = document.createElement("div");

      // Explicit Bento Layout based on 'size' property
      let spanClass = "md:col-span-1"; // Default standard size
      let heightClass = "min-h-[400px]"; // Default height

      if (project.size === "large") {
        spanClass = "md:col-span-2 md:row-span-2";
        heightClass = "min-h-[600px] md:min-h-full";
      } else if (project.size === "wide") {
        spanClass = "md:col-span-2";
        heightClass = "min-h-[400px]";
      } else if (project.size === "tall") {
        spanClass = "md:row-span-2";
        heightClass = "min-h-[600px] md:min-h-full";
      }

      card.className = `project-card group ${spanClass}`;
      card.dataset.category = project.category;
      card.dataset.id = project.id;

      // Use project color for gradient overlay
      const gradientColor = project.color || "#3b82f6";

      // Dynamic text sizing based on card size
      const titleSize =
        project.size === "large"
          ? "text-3xl md:text-4xl lg:text-5xl"
          : "text-2xl md:text-3xl";

      card.innerHTML = `
        <div class="relative w-full h-full overflow-hidden bg-neutral-900 rounded-2xl border border-neutral-800/50 hover:border-neutral-700 transition-all duration-500 ${heightClass}">
          <!-- Image with gradient overlay -->
          <div class="absolute inset-0">
            <img
              src="${project.thumbnail}"
              alt="${project.title}"
              class="project-image w-full h-full object-cover transition-all duration-700"
              loading="lazy"
            />
            <!-- Gradient overlay (darker at bottom for text) -->
            <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500"></div>
            <!-- Accent gradient -->
            <div class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[${gradientColor}]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          <!-- Content -->
          <div class="relative h-full flex flex-col justify-end p-6 md:p-8">
            <!-- Top Bar: Category & Year -->
            <div class="absolute top-6 left-6 right-6 flex justify-between items-start">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-lg">
                ${project.category}
              </span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono text-white/80 bg-black/40 backdrop-blur-md border border-white/10">
                ${project.year}
              </span>
            </div>

            <!-- Bottom Content -->
            <div class="space-y-4">
              <h3 class="project-title ${titleSize} font-bold text-white leading-[1.1] tracking-tight group-hover:text-neutral-200 transition-colors duration-300">
                ${project.title}
              </h3>
              <p class="text-neutral-300 text-sm md:text-base leading-relaxed line-clamp-2 max-w-xl">
                ${project.description}
              </p>
              
              <!-- Footer: Tags and Arrow -->
              <div class="flex items-center justify-between pt-4 border-t border-white/10">
                <div class="flex flex-wrap gap-2">
                  ${project.tags
                    .slice(0, 3)
                    .map(
                      (tag) => `
                    <span class="text-xs text-neutral-400 font-medium tracking-wide uppercase">${tag}</span>
                  `,
                    )
                    .join('<span class="text-neutral-700 mx-1">•</span>')}
                </div>
                
                <!-- Arrow icon -->
                <div class="project-arrow flex items-center justify-center w-10 h-10 rounded-full bg-white text-neutral-950 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out shadow-lg shadow-white/10">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 6v2h8.59L5 17.59 6.41 19 16 9.41V18h2V6z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        if (project.behanceUrl) {
          window.open(project.behanceUrl, "_blank");
        }
      });

      grid.appendChild(card);

      // Animate card in with stagger
      gsap.fromTo(
        card,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
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

        // Update active styles for pill buttons
        filterBtns.forEach((b) => {
          // Remove active state
          b.classList.remove(
            "bg-white",
            "text-neutral-950",
            "shadow-lg",
            "shadow-white/20",
          );
          // Add inactive state
          b.classList.add(
            "bg-neutral-900",
            "text-neutral-400",
            "border",
            "border-neutral-800",
          );
        });

        // Add active state to clicked button
        btn.classList.remove(
          "bg-neutral-900",
          "text-neutral-400",
          "border",
          "border-neutral-800",
          "hover:text-neutral-100",
          "hover:bg-neutral-800",
          "hover:border-neutral-700",
        );
        btn.classList.add(
          "bg-white",
          "text-neutral-950",
          "shadow-lg",
          "shadow-white/20",
        );

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
