// =============================
// FOOTER YEAR
// =============================
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// =============================
// PHONE AUTO-FORMAT (###)###-####
// =============================
const phoneInput = document.getElementById('phone');
if (phoneInput) {
  phoneInput.addEventListener('input', function (e) {
    let digits = e.target.value.replace(/\D/g, '').substring(0, 10);
    let formatted = digits;

    if (digits.length > 6) {
      formatted = `(${digits.substring(0, 3)})${digits.substring(3, 6)}-${digits.substring(6, 10)}`;
    } else if (digits.length > 3) {
      formatted = `(${digits.substring(0, 3)})${digits.substring(3, 6)}`;
    } else if (digits.length > 0) {
      formatted = `(${digits}`;
    }

    e.target.value = formatted;
  });
}

// =============================
// FORM SUBMISSION (FORMSPREE)
// =============================
const form = document.getElementById('estimate-form');
const formMessage = document.getElementById('form-message');

if (form && formMessage) {
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(form);

    // Show sending state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }
    formMessage.style.display = 'block';
    formMessage.style.color = '#555';
    formMessage.style.fontWeight = 'normal';
    formMessage.textContent = 'Sending your request...';

    fetch(form.action, {
      method: form.method,
      headers: { 'Accept': 'application/json' },
      body: formData
    })
      .then(response => {
        if (response.ok) {
          formMessage.style.color = 'green';
          formMessage.style.fontWeight = 'bold';
          formMessage.textContent = 'Thank you! Your request has been sent. We will contact you shortly.';
          form.reset();

          // Scroll message into view (helpful on mobile)
          formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          return response.json().then(data => {
            throw new Error(data.error || 'Something went wrong. Please try again.');
          });
        }
      })
      .catch(err => {
        formMessage.style.color = 'red';
        formMessage.style.fontWeight = 'bold';
        formMessage.textContent = err.message || 'Oops! Something went wrong. Try again later.';
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Request Free Estimate';
        }
      });
  });
}
// =============================
// MOBILE NAV TOGGLE
// =============================

const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (navToggle && mobileNav) {

  navToggle.addEventListener('click', function () {
    mobileNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', mobileNav.classList.contains('open') ? 'true' : 'false');
  });

  // Close menu when clicking a link
  mobileNav.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', function(){
      mobileNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

}

// =============================
// PREMIUM HEADER SCROLL STATE
// =============================
const siteHeader = document.getElementById('site-header');
if (siteHeader) {
  const updateHeader = () => siteHeader.classList.toggle('is-scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}


// =============================
// BEFORE / AFTER SLIDER
// =============================

document.addEventListener("DOMContentLoaded", function () {

  const slider = document.getElementById("beforeAfterSlider");
  if (!slider) return;

  const afterImg = slider.querySelector(".after-img");
  const divider = slider.querySelector(".divider");
  const handle = slider.querySelector(".handle");

  function updateSlider(x) {
    const rect = slider.getBoundingClientRect();
    let pos = x - rect.left;

    if (pos < 0) pos = 0;
    if (pos > rect.width) pos = rect.width;

    const percent = (pos / rect.width) * 100;

    afterImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    divider.style.left = percent + "%";
    handle.style.left = percent + "%";
  }

  // Desktop mouse
  slider.addEventListener("mousemove", (e) => updateSlider(e.clientX));
  slider.addEventListener("mousedown", (e) => updateSlider(e.clientX));

  // Mobile touch
  slider.addEventListener("touchstart", (e) => updateSlider(e.touches[0].clientX));
  slider.addEventListener("touchmove", (e) => updateSlider(e.touches[0].clientX));

});

// ========================================
// HOMEPAGE SMOOTH SCROLL REVEAL
// ========================================

document.addEventListener("DOMContentLoaded", function () {
  const homePage = document.querySelector(".home-page");

  // Run only on the homepage
  if (!homePage) return;

  // Main sections and content groups
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

  // Service cards with staggered timing
  const serviceCards = document.querySelectorAll(
    ".service-card-v2, .premium-service-card"
  );

  serviceCards.forEach(function (card, index) {
    card.classList.add("reveal-on-scroll");

    card.style.setProperty(
      "--reveal-delay",
      `${(index % 4) * 100}ms`
    );
  });

  // Gallery images with staggered timing
  const galleryItems = document.querySelectorAll(
    ".gallery-grid figure"
  );

  galleryItems.forEach(function (item, index) {
    item.classList.add("reveal-on-scroll", "reveal-scale");

    item.style.setProperty(
      "--reveal-delay",
      `${index * 110}ms`
    );
  });

  // Process steps
  const processSteps = document.querySelectorAll(
    ".process-list li"
  );

  processSteps.forEach(function (step, index) {
    step.classList.add("reveal-on-scroll");

    step.style.setProperty(
      "--reveal-delay",
      `${index * 90}ms`
    );
  });

  // Trust ribbon items
  const trustItems = document.querySelectorAll(
    ".trust-ribbon__item"
  );

  trustItems.forEach(function (item, index) {
    item.classList.add("reveal-on-scroll");

    item.style.setProperty(
      "--reveal-delay",
      `${index * 80}ms`
    );
  });

  // Browser accessibility preference
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion) {
    document.querySelectorAll(".reveal-on-scroll").forEach(function (element) {
      element.classList.add("is-visible");
    });

    return;
  }

  // Reveal elements when they enter the screen
  const revealObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");

          // Animate only once
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -60px 0px"
    }
  );

  document.querySelectorAll(".reveal-on-scroll").forEach(function (element) {
    revealObserver.observe(element);
  });
});
