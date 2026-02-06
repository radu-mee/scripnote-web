// Crisp chat bubble loader (shared across all pages).
(() => {
  if (!window.$crisp) {
    window.$crisp = [];
  }

  if (!window.CRISP_WEBSITE_ID) {
    window.CRISP_WEBSITE_ID = "288af447-c057-41a3-9d4e-a56c53645733";
  }

  const existingLoader =
    document.querySelector('script[src="https://client.crisp.chat/l.js"]') ||
    document.querySelector("script[data-crisp-loader]");

  if (existingLoader) return;

  const d = document;
  const s = d.createElement("script");
  s.src = "https://client.crisp.chat/l.js";
  s.async = true;
  s.setAttribute("data-crisp-loader", "true");
  d.getElementsByTagName("head")[0].appendChild(s);
})();

// Loops email capture form handler.
(() => {
  const forms = document.querySelectorAll("[data-loops-endpoint]");

  forms.forEach((form) => {
    const status =
      form.querySelector("[data-loops-status]") ||
      form.parentElement?.querySelector("[data-loops-status]");
    const submitBtn = form.querySelector("button[type=\"submit\"]");
    const idleLabel = submitBtn ? submitBtn.textContent : "";

    const setStatus = (message, isError = false) => {
      if (!status) return;
      status.textContent = message;
      status.classList.toggle("is-error", isError);
    };

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const endpoint = form.getAttribute("data-loops-endpoint");
      if (!endpoint || endpoint.includes("REPLACE_WITH_FORM_ID")) {
        setStatus("Add your Loops form endpoint to enable signups.", true);
        return;
      }

      setStatus("");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";
      }

      const formData = new FormData(form);
      const body = new URLSearchParams(formData);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        });
        const data = await response.json().catch(() => ({}));

        if (response.ok && data.success !== false) {
          form.reset();
          const successUrl = form.getAttribute("data-loops-success");
          if (successUrl) {
            window.location.href = successUrl;
            return;
          }
          setStatus("Thanks! You are on the waitlist.");
        } else {
          setStatus(data.message || "Something went wrong. Please try again.", true);
        }
      } catch (error) {
        setStatus("Something went wrong. Please try again.", true);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = idleLabel;
        }
      }
    });
  });
})();

const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (navMenu) {
  navMenu.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement) {
      body.classList.remove("nav-open");
      navToggle?.setAttribute("aria-expanded", "false");
    }
  });
}

const toggleButtons = document.querySelectorAll(".toggle-btn");
const heroPicture = document.querySelector("#hero-picture");
const pressDownloadBtn = document.querySelector(".press-download-btn");

const updateHeroMedia = (variant) => {
  if (!heroPicture) return;
  const desktop = heroPicture.dataset[`${variant}Desktop`];
  const tablet = heroPicture.dataset[`${variant}Tablet`];
  const mobile = heroPicture.dataset[`${variant}Mobile`];

  const sources = heroPicture.querySelectorAll("source");
  sources.forEach((source) => {
    const size = source.getAttribute("data-size");
    if (size === "mobile" && mobile) {
      source.srcset = mobile;
    } else if (size === "tablet" && tablet) {
      source.srcset = tablet;
    }
  });

  const img = heroPicture.querySelector("img");
  if (img && desktop) {
    img.src = desktop;
  }
};

const updatePressDownload = (variant) => {
  if (!pressDownloadBtn) return;
  const url = pressDownloadBtn.dataset[`${variant}Url`];
  if (url) {
    pressDownloadBtn.setAttribute("href", url);
  }
};

if (toggleButtons.length) {
  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      toggleButtons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      const variant = button.getAttribute("data-variant");
      if (variant) {
        document.documentElement.setAttribute("data-variant", variant);
        updateHeroMedia(variant);
        updatePressDownload(variant);
      }
    });
  });
}

const initialVariant = document.documentElement.getAttribute("data-variant");
if (initialVariant) {
  updateHeroMedia(initialVariant);
  updatePressDownload(initialVariant);
}

const updateBillingPrices = (billing) => {
  document.querySelectorAll("[data-price-monthly]").forEach((el) => {
    const monthly = el.dataset.priceMonthly;
    const yearly = el.dataset.priceYearly;
    if (billing === "yearly" && yearly) {
      el.textContent = yearly;
    } else if (monthly) {
      el.textContent = monthly;
    }
  });

  document.querySelectorAll("[data-period-monthly]").forEach((el) => {
    const monthly = el.dataset.periodMonthly;
    const yearly = el.dataset.periodYearly;
    if (billing === "yearly" && yearly) {
      el.textContent = yearly;
    } else if (monthly) {
      el.textContent = monthly;
    }
  });
};

const billingToggles = document.querySelectorAll(".billing-toggle");
billingToggles.forEach((toggle) => {
  const buttons = toggle.querySelectorAll(".billing-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      const billing = button.getAttribute("data-billing") || "monthly";
      updateBillingPrices(billing);
    });
  });
});

const faqItems = document.querySelectorAll(".faq-list details");

faqItems.forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (detail.open) {
      faqItems.forEach((item) => {
        if (item !== detail) {
          item.open = false;
        }
      });
    }
  });
});

const calculatorRoot = document.querySelector("[data-calculator]");

if (calculatorRoot) {
  const calculatorType = calculatorRoot.dataset.calculator;
  const inputs = {};
  const outputs = {};

  calculatorRoot
    .querySelectorAll("input[data-field]")
    .forEach((input) => {
      inputs[input.dataset.field] = input;
    });

  calculatorRoot
    .querySelectorAll("[data-output]")
    .forEach((output) => {
      outputs[output.dataset.output] = output;
    });

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const numberFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formatCurrency = (value) =>
    currencyFormatter.format(Number.isFinite(value) ? value : 0);

  const formatNumber = (value) =>
    numberFormatter.format(Number.isFinite(value) ? value : 0);

  const parseNumber = (value) => {
    if (typeof value !== "string") return 0;
    const cleaned = value.replace(/,/g, "").replace(/[^0-9.-]/g, "");
    const parsed = parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const setOutput = (key, value) => {
    if (!outputs[key]) return;
    outputs[key].textContent = value;
  };

  const futureValue = (principal, monthly, monthlyRate, months) => {
    if (!months) return principal;
    if (!monthlyRate) return principal + monthly * months;
    const growth = Math.pow(1 + monthlyRate, months);
    return principal * growth + monthly * ((growth - 1) / monthlyRate);
  };

  const updateSavings = () => {
    const amount = Math.max(0, parseNumber(inputs.amount?.value));
    const monthly = Math.max(0, parseNumber(inputs.monthly?.value));
    const rate = Math.max(0, parseNumber(inputs.rate?.value)) / 100;
    const years = Math.max(0, parseNumber(inputs.years?.value));
    const months = years * 12;
    const monthlyRate = rate / 12;

    const total = futureValue(amount, monthly, monthlyRate, months);
    const contributions = amount + monthly * months;
    const interest = Math.max(0, total - contributions);

    const delayedMonths = Math.max(0, months - 0.25);
    const delayedTotal = futureValue(amount, monthly, monthlyRate, delayedMonths);
    const delayLoss = Math.max(0, total - delayedTotal);

    setOutput("principal", formatCurrency(contributions));
    setOutput("interest", formatCurrency(interest));
    setOutput("total", formatCurrency(total));
    setOutput("note", formatCurrency(delayLoss));
  };

  const updateInvestments = () => {
    const amount = Math.max(0, parseNumber(inputs.amount?.value));
    const monthly = Math.max(0, parseNumber(inputs.monthly?.value));
    const rate = Math.max(0, parseNumber(inputs.rate?.value)) / 100;
    const years = Math.max(0, parseNumber(inputs.years?.value));
    const months = years * 12;
    const monthlyRate = rate / 12;

    const total = futureValue(amount, monthly, monthlyRate, months);
    const contributions = amount + monthly * months;
    const interest = Math.max(0, total - contributions);

    const prevTotal = futureValue(amount, monthly, monthlyRate, Math.max(0, months - 1));
    const monthlyLoss = Math.max(0, total - prevTotal);

    setOutput("principal", formatCurrency(contributions));
    setOutput("interest", formatCurrency(interest));
    setOutput("total", formatCurrency(total));
    setOutput("note", formatCurrency(monthlyLoss));
  };

  const updateDebt = () => {
    const principal = Math.max(0, parseNumber(inputs.amount?.value));
    const rate = Math.max(0, parseNumber(inputs.rate?.value)) / 100;
    const years = Math.max(0, parseNumber(inputs.years?.value));

    const interestAdded = principal * rate * years;
    const total = principal + interestAdded;
    const months = years * 12;
    const monthlyLoss = months ? interestAdded / months : 0;

    setOutput("principal", formatCurrency(principal));
    setOutput("interest", formatCurrency(interestAdded));
    setOutput("total", formatCurrency(total));
    setOutput("note", formatCurrency(monthlyLoss));
  };

  const updatePurchasing = () => {
    const amount = Math.max(0, parseNumber(inputs.amount?.value));
    const inflation = Math.max(0, parseNumber(inputs.inflation?.value)) / 100;
    const startYear = parseNumber(inputs.startYear?.value);
    const targetYear = parseNumber(inputs.targetYear?.value);

    if (!Number.isFinite(startYear) || !Number.isFinite(targetYear)) {
      setOutput("time", formatNumber(0));
      setOutput("loss", formatCurrency(0));
      setOutput("total", formatCurrency(0));
      setOutput("note", formatCurrency(0));
      return;
    }

    const years = targetYear - startYear;
    const absYears = Math.abs(years);
    const clampedInflation = Math.min(Math.max(inflation, 0), 0.99);
    const yearlyFactor = 1 - clampedInflation;
    const total =
      absYears === 0
        ? amount
        : years >= 0
          ? amount * Math.pow(yearlyFactor, absYears)
          : amount / Math.pow(yearlyFactor, absYears);
    const loss = Math.max(0, amount - total);
    const months = absYears * 12;
    let monthlyLoss = 0;

    if (months > 0 && years >= 0) {
      const monthlyFactor = Math.pow(yearlyFactor, 1 / 12);
      const valueNow = amount * Math.pow(monthlyFactor, months);
      const valuePrev = amount * Math.pow(monthlyFactor, months - 1);
      monthlyLoss = Math.max(0, valuePrev - valueNow);
    }

    setOutput("time", formatNumber(absYears));
    setOutput("loss", formatCurrency(loss));
    setOutput("total", formatCurrency(total));
    setOutput("note", formatCurrency(monthlyLoss));
  };

  const updateCalculator = () => {
    if (calculatorType === "savings") {
      updateSavings();
    } else if (calculatorType === "investments") {
      updateInvestments();
    } else if (calculatorType === "debt") {
      updateDebt();
    } else if (calculatorType === "purchasing") {
      updatePurchasing();
    }
  };

  const calcButton = calculatorRoot.querySelector(".calc-submit");

  const updateButtonState = () => {
    if (!calcButton) return;
    const isComplete = Object.values(inputs).every(
      (input) => input && input.value.trim() !== ""
    );
    calcButton.disabled = !isComplete;
    calcButton.setAttribute("aria-disabled", String(!isComplete));
    calcButton.classList.toggle("is-active", isComplete);
  };

  Object.values(inputs).forEach((input) => {
    input.addEventListener("input", updateButtonState);
    input.addEventListener("change", updateButtonState);
  });

  if (calcButton) {
    calcButton.addEventListener("click", () => {
      if (calcButton.disabled) return;
      updateCalculator();
    });
  }

  updateButtonState();
}

const yearEl = document.querySelector("#current-year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}
