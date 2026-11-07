document.addEventListener("DOMContentLoaded", function () {
  const calculatorForm = document.getElementById("repair-calculator-form");

  if (!calculatorForm) return;

  const rates = {
    minimum: 125,
    lowerPanel: 45,
    upperPanel: 75,
    roofPanel: 85,
    door: 45,
    floridaGlass: 125,
    noSeeUmUpgrade: 55,
    petScreenUpgrade: 75,
    travel: 25,
    highAllowance: 0.2
  };

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });

  const quantityIds = [
    "lower-panels",
    "upper-panels",
    "roof-panels",
    "screen-doors",
    "florida-glass-panels",
    "no-see-um-panels",
    "pet-screen-panels"
  ];

  const resultAmount = document.getElementById("calculator-result-amount");
  const resultList = document.getElementById("calculator-result-list");
  const subtotalField = document.getElementById("calculated-subtotal");
  const rangeField = document.getElementById("calculated-range");
  const message = document.getElementById("calculator-form-message");
  const submitButton = calculatorForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton ? submitButton.textContent : "Send My Estimate Request";

  function quantity(id) {
    const input = document.getElementById(id);
    return input ? Math.max(0, Number.parseInt(input.value, 10) || 0) : 0;
  }

  function calculateEstimate() {
    const items = [
      { label: "Standard/lower panels", quantity: quantity("lower-panels"), rate: rates.lowerPanel },
      { label: "Large/upper panels", quantity: quantity("upper-panels"), rate: rates.upperPanel },
      { label: "Roof/top panels", quantity: quantity("roof-panels"), rate: rates.roofPanel },
      { label: "Screen doors", quantity: quantity("screen-doors"), rate: rates.door },
      { label: "Florida Glass panels", quantity: quantity("florida-glass-panels"), rate: rates.floridaGlass },
      { label: "No-See-Um upgrades", quantity: quantity("no-see-um-panels"), rate: rates.noSeeUmUpgrade },
      { label: "Pet screen upgrades", quantity: quantity("pet-screen-panels"), rate: rates.petScreenUpgrade }
    ];

    const travelSelection = calculatorForm.querySelector('input[name="travel_distance"]:checked');
    const travelApplies = travelSelection && travelSelection.value === "More than 35 miles";
    const selectedItems = items.filter(function (item) {
      return item.quantity > 0;
    });

    let subtotal = selectedItems.reduce(function (sum, item) {
      return sum + item.quantity * item.rate;
    }, 0);

    if (travelApplies) {
      subtotal += rates.travel;
    }

    const hasRepairs = selectedItems.length > 0;
    const lowEstimate = hasRepairs ? Math.max(rates.minimum, subtotal) : rates.minimum;
    const highEstimate = Math.ceil((lowEstimate * (1 + rates.highAllowance)) / 5) * 5;
    const rangeText = `${currency.format(lowEstimate)} – ${currency.format(highEstimate)}`;

    resultAmount.textContent = rangeText;
    subtotalField.value = currency.format(subtotal);
    rangeField.value = rangeText;

    const rows = selectedItems.map(function (item) {
      const total = item.quantity * item.rate;
      return `<li><span>${item.label} × ${item.quantity}</span><strong>${currency.format(total)}</strong></li>`;
    });

    if (travelApplies) {
      rows.push(`<li><span>Travel beyond 35 miles</span><strong>${currency.format(rates.travel)}</strong></li>`);
    }

    if (!rows.length) {
      rows.push(`<li><span>Minimum service charge</span><strong>${currency.format(rates.minimum)}</strong></li>`);
    } else if (subtotal < rates.minimum) {
      rows.push(`<li><span>Minimum service charge applies</span><strong>${currency.format(rates.minimum)}</strong></li>`);
    }

    resultList.innerHTML = rows.join("");
  }

  quantityIds.forEach(function (id) {
    const input = document.getElementById(id);
    if (input) input.addEventListener("input", calculateEstimate);
  });

  calculatorForm.querySelectorAll('input[name="travel_distance"]').forEach(function (input) {
    input.addEventListener("change", calculateEstimate);
  });

  calculatorForm.addEventListener("submit", function (event) {
    event.preventDefault();
    calculateEstimate();

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    message.style.display = "block";
    message.style.color = "#555";
    message.textContent = "Sending your estimate request...";

    fetch(calculatorForm.action, {
      method: calculatorForm.method,
      headers: { Accept: "application/json" },
      body: new FormData(calculatorForm)
    })
      .then(function (response) {
        if (response.ok) {
          message.style.color = "#17663a";
          message.textContent = "Thank you! Your repair details and planning range were sent. We will contact you to confirm the final written estimate.";
          message.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }

        return response.json().then(function (data) {
          throw new Error(data.error || "We could not send your request. Please try again or call us.");
        });
      })
      .catch(function (error) {
        message.style.color = "#a32626";
        message.textContent = error.message || "We could not send your request. Please call (407) 405-5790.";
        message.scrollIntoView({ behavior: "smooth", block: "center" });
      })
      .finally(function () {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      });
  });

  calculateEstimate();
});
