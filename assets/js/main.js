document.addEventListener("DOMContentLoaded", function () {
  // =============================
  // FOOTER YEAR
  // =============================
  const yearSpan = document.getElementById("year");

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // =============================
  // PHONE AUTO-FORMAT (###)###-####
  // =============================
  const phoneInput = document.getElementById("phone");

  if (phoneInput) {
    phoneInput.addEventListener("input", function (event) {
      const digits = event.target.value.replace(/\D/g, "").substring(0, 10);
      let formatted = digits;

      if (digits.length > 6) {
        formatted = `(${digits.substring(0, 3)})${digits.substring(3, 6)}-${digits.substring(6, 10)}`;
      } else if (digits.length > 3) {
        formatted = `(${digits.substring(0, 3)})${digits.substring(3, 6)}`;
      } else if (digits.length > 0) {
        formatted = `(${digits}`;
      }

      event.target.value = formatted;
    });
  }

  // =============================
  // FORM SUBMISSION (FORMSPREE)
  // =============================
  const form = document.getElementById("estimate-form");
  const formMessage = document.getElementById("form-message");

  if (form && formMessage) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : "Request My Free Estimate";

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(form);

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      formMessage.style.display = "block";
      formMessage.style.color = "#555";
      formMessage.style.fontWeight = "normal";
      formMessage.textContent = "Sending your request...";

      fetch(form.action, {
        method: form.method,
        headers: {
          Accept: "application/json"
        },
        body: formData
      })
        .then(function (response) {
          if (response.ok) {
            formMessage.style.color = "green";
            formMessage.style.fontWeight = "bold";
            formMessage.textContent = "Thank you! Your request has been sent. We will contact you shortly.";
            form.reset();
            formMessage.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
          }

          return response.json().then(function (data) {
            throw new Error(data.error || "Something went wrong. Please try again.");
          });
        })
        .catch(function (error) {
          formMessage.style.color = "red";
          formMessage.style.fontWeight = "bold";
          formMessage.textContent = error.message || "Oops! Something went wrong. Try again later.";
          formMessage.scrollIntoView({ behavior: "smooth", block: "center" });
        })
        .finally(function () {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
          }
        });
    });
  }

  // =============================
  // MOBILE NAVIGATION
  // =============================
  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  if (navToggle && mobileNav) {
    function closeMobileNav() {
      mobileNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
    }

    navToggle.addEventListener("click", function () {
      const isOpen = mobileNav.classList.toggle("open");

      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMobileNav();
      }
    });
  }

  // =============================
  // PREMIUM HEADER SCROLL STATE
  // =============================
  const siteHeader = document.getElementById("site-header");

  if (siteHeader) {
    function updateHeader() {
      siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  // =============================
  // BEFORE / AFTER SLIDER
  // =============================
  const slider = document.getElementById("beforeAfterSlider");

  if (slider) {
    const afterImage = slider.querySelector(".after-img");
    const divider = slider.querySelector(".divider");
    const handle = slider.querySelector(".handle");

    if (afterImage && divider && handle) {
      function updateSlider(clientX) {
        const rect = slider.getBoundingClientRect();
        const position = Math.min(Math.max(clientX - rect.left, 0), rect.width);
        const percent = (position / rect.width) * 100;

        afterImage.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
        divider.style.left = `${percent}%`;
        handle.style.left = `${percent}%`;
      }

      slider.addEventListener("mousemove", function (event) {
        updateSlider(event.clientX);
      });

      slider.addEventListener("mousedown", function (event) {
        updateSlider(event.clientX);
      });

      slider.addEventListener(
        "touchstart",
        function (event) {
          updateSlider(event.touches[0].clientX);
        },
        { passive: true }
      );

      slider.addEventListener(
        "touchmove",
        function (event) {
          updateSlider(event.touches[0].clientX);
        },
        { passive: true }
      );
    }
  }

  // ========================================
  // HOMEPAGE SMOOTH SCROLL REVEAL
  // ========================================
  const homePage = document.querySelector(".home-page");

  if (homePage) {
    const standardRevealSelectors = [
      ".trust-ribbon",
      ".premium-intro__grid",
      ".section-heading",
      ".result-grid",
      ".process-intro",
      ".premium-about",
      ".service-area-grid",
      ".contact-grid",
      ".premium-footer__areas"
    ];

    standardRevealSelectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (element) {
        element.classList.add("reveal-on-scroll");
      });
    });

    document.querySelectorAll(".service-card-v2, .premium-service-card").forEach(function (card, index) {
      card.classList.add("reveal-on-scroll");
      card.style.setProperty("--reveal-delay", `${(index % 4) * 100}ms`);
    });

    document.querySelectorAll(".gallery-grid figure").forEach(function (item, index) {
      item.classList.add("reveal-on-scroll", "reveal-scale");
      item.style.setProperty("--reveal-delay", `${index * 110}ms`);
    });

    document.querySelectorAll(".process-list li").forEach(function (step, index) {
      step.classList.add("reveal-on-scroll");
      step.style.setProperty("--reveal-delay", `${index * 90}ms`);
    });

    document.querySelectorAll(".trust-ribbon__item").forEach(function (item, index) {
      item.classList.add("reveal-on-scroll");
      item.style.setProperty("--reveal-delay", `${index * 80}ms`);
    });

    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach(function (element) {
        element.classList.add("is-visible");
      });
    } else {
      const revealObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -60px 0px"
        }
      );

      revealElements.forEach(function (element) {
        revealObserver.observe(element);
      });
    }
  }

  // =============================
  // FLOATING WHATSAPP BUTTON
  // =============================
  if (!document.querySelector(".whatsapp-float")) {
    const whatsappButton = document.createElement("a");

    whatsappButton.className = "whatsapp-float";
    whatsappButton.href = "https://wa.me/14074055790?text=Hello%20Simple%20Screen%20Service%2C%20I%20would%20like%20to%20request%20a%20free%20estimate.";
    whatsappButton.target = "_blank";
    whatsappButton.rel = "noopener noreferrer";
    whatsappButton.setAttribute("aria-label", "Contact Simple Screen Service on WhatsApp");
    whatsappButton.innerHTML = `
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M16.04 3C8.85 3 3 8.75 3 15.82c0 2.27.61 4.48 1.77 6.42L3 29l6.98-1.81a13.16 13.16 0 0 0 6.05 1.47h.01C23.23 28.66 29 22.91 29 15.83 29 8.75 23.23 3 16.04 3Zm0 23.49h-.01a10.9 10.9 0 0 1-5.55-1.5l-.4-.23-4.14 1.07 1.11-4.01-.26-.41a10.55 10.55 0 0 1-1.66-5.59c0-5.89 4.89-10.68 10.91-10.68 6.01 0 10.9 4.79 10.9 10.69 0 5.89-4.89 10.66-10.9 10.66Zm5.98-7.99c-.33-.16-1.94-.94-2.24-1.05-.3-.11-.52-.16-.74.16-.22.33-.85 1.05-1.04 1.27-.19.22-.38.25-.71.08-.33-.16-1.38-.5-2.63-1.58a9.76 9.76 0 0 1-1.82-2.22c-.19-.33-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.16-.74-1.75-1.01-2.4-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.41-.3.33-1.14 1.1-1.14 2.68s1.17 3.12 1.33 3.34c.16.22 2.3 3.45 5.57 4.84.78.33 1.39.53 1.86.68.78.24 1.49.21 2.05.13.63-.09 1.94-.78 2.21-1.53.27-.76.27-1.4.19-1.53-.08-.14-.3-.22-.63-.38Z" />
      </svg>
      <span class="whatsapp-float__label">Chat with us</span>
    `;

    document.body.appendChild(whatsappButton);

    if (!document.getElementById("whatsapp-float-styles")) {
      const whatsappStyles = document.createElement("style");

      whatsappStyles.id = "whatsapp-float-styles";
      whatsappStyles.textContent = `
        .whatsapp-float {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 58px;
          padding: 0 20px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 999px;
          color: #fff;
          background: #25d366;
          box-shadow: 0 14px 35px rgba(0, 0, 0, 0.25);
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.01em;
          text-decoration: none;
          transition: transform 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease;
        }

        .whatsapp-float:hover {
          color: #fff;
          background: #1fbd5b;
          transform: translateY(-3px);
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.3);
        }

        .whatsapp-float:focus-visible {
          outline: 3px solid #dbc28e;
          outline-offset: 4px;
        }

        .whatsapp-float svg {
          width: 27px;
          height: 27px;
          flex: 0 0 auto;
        }

        @media (max-width: 700px) {
          .whatsapp-float {
            right: 16px;
            bottom: 82px;
            width: 56px;
            min-height: 56px;
            padding: 0;
          }

          .whatsapp-float__label {
            position: absolute;
            width: 1px;
            height: 1px;
            overflow: hidden;
            clip: rect(0 0 0 0);
            white-space: nowrap;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .whatsapp-float {
            transition: none;
          }
        }
      `;

      document.head.appendChild(whatsappStyles);
    }
  }
});
