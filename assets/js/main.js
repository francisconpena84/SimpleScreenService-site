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
  });

  // Close menu when clicking a link
  mobileNav.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', function(){
      mobileNav.classList.remove('open');
    });
  });

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