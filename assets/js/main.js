(function () {
  "use strict";

  var HK = (window.HK = window.HK || {});

  var ICONS = {
    crescent:
      '<path d="M20.4 14.5A8.4 8.4 0 1 1 9.5 3.6a7 7 0 0 0 10.9 10.9Z"/><path d="M16.5 4.5l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6.6-1.7Z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    heart:
      '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    arrowUp: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    shield:
      '<path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1 1 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    pot: '<path d="M2 12h20"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"/><path d="M6 12V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/><path d="M9 6V4M15 6V4"/><path d="M4 12H2M22 12h-2"/>',
    award:
      '<circle cx="12" cy="8" r="6"/><path d="m15.5 12.9 1.5 9.1-5-3-5 3 1.5-9.1"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    users:
      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    flame:
      '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    printer:
      '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    share:
      '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v13"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    alert:
      '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/>',
    refresh:
      '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    chevron:
      '<path d="m6 9 6 6 6-6"/>',
    utensils:
      '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    fish: '<path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="m18 12 2-2m-2 2 2 2"/><circle cx="15.5" cy="11" r=".5"/>',
    wheat:
      '<path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M20 13h2v2h-2z"/>',
    apple:
      '<path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/>',
    milk:
      '<path d="M8 2h8M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2"/><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/>',
    cup: '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M6 2v2M10 2v2M14 2v2"/>',
    candy:
      '<path d="M9 10a5 5 0 0 0 0 4h6a5 5 0 0 0 0-4H9Z"/><path d="m8 12-4-4v8l4-4Z"/><path d="m16 12 4-4v8l-4-4Z"/>',
    flask:
      '<path d="M10 2v7.31M14 9.3V1.99M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/>',
    leaf:
      '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    cake:
      '<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v3M12 8v3M17 8v3"/><path d="M7 4h.01M12 4h.01M17 4h.01"/>',
    glass:
      '<path d="M8 22h8"/><path d="M12 11v11"/><path d="M19 3l-7 8-7-8Z"/>',
    sparkles:
      '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/><path d="M5 3v4M3 5h4M19 17v4M17 19h4"/>',
    listCheck:
      '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8M13 12h8M13 18h8"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    phone:
      '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mapPin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>'
  };

  HK.icon = function (name, className) {
    var body = ICONS[name] || "";
    return (
      '<svg class="icon' +
      (className ? " " + className : "") +
      '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      body +
      "</svg>"
    );
  };

  var bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  HK.toBn = function (value) {
    return String(value).replace(/[0-9]/g, function (d) {
      return bnDigits[Number(d)];
    });
  };

  HK.storage = {
    get: function (key, fallback) {
      try {
        var raw = localStorage.getItem("hk-" + key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (error) {
        return fallback;
      }
    },
    set: function (key, value) {
      try {
        localStorage.setItem("hk-" + key, JSON.stringify(value));
        return true;
      } catch (error) {
        return false;
      }
    }
  };

  HK.escapeHtml = function (value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  HK.statusLabel = {
    halal: "হালাল",
    haram: "হারাম",
    mashbooh: "সন্দেহজনক"
  };

  var toastTimer = null;
  HK.toast = function (message) {
    var node = document.querySelector(".toast");
    if (!node) {
      node = document.createElement("div");
      node.className = "toast";
      node.setAttribute("role", "status");
      node.setAttribute("aria-live", "polite");
      document.body.appendChild(node);
    }
    node.innerHTML = HK.icon("check") + "<span></span>";
    node.lastElementChild.textContent = message;
    window.clearTimeout(toastTimer);
    requestAnimationFrame(function () {
      node.classList.add("show");
    });
    toastTimer = window.setTimeout(function () {
      node.classList.remove("show");
    }, 3200);
  };

  function hydrateIcons() {
    var nodes = document.querySelectorAll("[data-icon]");
    for (var i = 0; i < nodes.length; i += 1) {
      var node = nodes[i];
      if (node.querySelector("svg")) continue;
      node.innerHTML = HK.icon(node.getAttribute("data-icon"));
    }
  }

  function initTheme() {
    var root = document.documentElement;
    var toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) return;

    function updateLabel() {
      var dark = root.getAttribute("data-theme") === "dark";
      toggle.setAttribute("aria-label", dark ? "লাইট মোড চালু করুন" : "ডার্ক মোড চালু করুন");
      toggle.setAttribute("title", dark ? "লাইট মোড" : "ডার্ক মোড");
    }

    updateLabel();
    toggle.addEventListener("click", function () {
      var dark = root.getAttribute("data-theme") === "dark";
      if (dark) {
        root.removeAttribute("data-theme");
        try {
          localStorage.setItem("hk-theme", "light");
        } catch (error) {}
      } else {
        root.setAttribute("data-theme", "dark");
        try {
          localStorage.setItem("hk-theme", "dark");
        } catch (error) {}
      }
      updateLabel();
    });
  }

  function initHeader() {
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector("[data-nav-toggle]");
    var panel = document.querySelector("[data-mobile-nav]");

    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 8);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (!toggle || !panel) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      panel.classList.toggle("open", open);
      panel.toggleAttribute("inert", !open);
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    panel.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("click", function (event) {
      if (!panel.classList.contains("open")) return;
      if (panel.contains(event.target) || toggle.contains(event.target)) return;
      setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setOpen(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 920) setOpen(false);
    });
  }

  function initActiveNav() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    var links = document.querySelectorAll("[data-nav-link]");
    for (var i = 0; i < links.length; i += 1) {
      var href = links[i].getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        links[i].setAttribute("aria-current", "page");
      }
    }
  }

  function initReveal() {
    var nodes = document.querySelectorAll(".reveal");
    if (!nodes.length) return;

    if (!("IntersectionObserver" in window)) {
      for (var i = 0; i < nodes.length; i += 1) nodes[i].classList.add("is-visible");
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    for (var j = 0; j < nodes.length; j += 1) observer.observe(nodes[j]);
  }

  function animateCount(node) {
    var target = Number(node.getAttribute("data-count")) || 0;
    var suffix = node.getAttribute("data-suffix") || "";
    var duration = 1100;
    var start = null;

    function frame(time) {
      if (start === null) start = time;
      var progress = Math.min((time - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = HK.toBn(Math.round(target * eased)) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }

    node.textContent = HK.toBn(0) + suffix;
    requestAnimationFrame(frame);
  }

  function initStats() {
    var data = window.HK_DATA;
    if (data) {
      var foodStat = document.querySelector('[data-stat="foods"]');
      var recipeStat = document.querySelector('[data-stat="recipes"]');
      var categoryStat = document.querySelector('[data-stat="categories"]');
      if (foodStat) foodStat.setAttribute("data-count", data.foods.length);
      if (recipeStat) recipeStat.setAttribute("data-count", data.recipes.length);
      if (categoryStat) categoryStat.setAttribute("data-count", data.categories.length);
    }

    var stats = document.querySelectorAll("[data-count]");
    if (!stats.length) return;

    if (!("IntersectionObserver" in window)) {
      for (var i = 0; i < stats.length; i += 1) {
        stats[i].textContent = HK.toBn(stats[i].getAttribute("data-count")) + (stats[i].getAttribute("data-suffix") || "");
      }
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    for (var j = 0; j < stats.length; j += 1) observer.observe(stats[j]);
  }

  function initAccordions() {
    var groups = document.querySelectorAll("[data-accordion]");
    for (var i = 0; i < groups.length; i += 1) {
      (function (group) {
        var items = group.querySelectorAll("details");
        for (var j = 0; j < items.length; j += 1) {
          items[j].addEventListener("toggle", function () {
            if (!this.open) return;
            for (var k = 0; k < items.length; k += 1) {
              if (items[k] !== this) items[k].open = false;
            }
          });
        }
      })(groups[i]);
    }
  }

  function initBackToTop() {
    var button = document.querySelector("[data-back-to-top]");
    if (!button) return;

    function update() {
      button.classList.toggle("is-visible", window.scrollY > 520);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initYear() {
    var nodes = document.querySelectorAll("[data-year]");
    var year = HK.toBn(new Date().getFullYear());
    for (var i = 0; i < nodes.length; i += 1) nodes[i].textContent = year;
  }

  HK.copyText = function (text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  HK.openModal = function (modal, opener) {
    if (!modal) return;
    modal.classList.add("open");
    modal.removeAttribute("inert");
    document.body.classList.add("no-scroll");
    modal.__opener = opener || document.activeElement;
    var focusable = modal.querySelector("[data-modal-close]") || modal.querySelector("button, a, input");
    if (focusable) window.setTimeout(function () {
      focusable.focus({ preventScroll: true });
    }, 60);
  };

  HK.closeModal = function (modal) {
    if (!modal || !modal.classList.contains("open")) return;
    modal.classList.remove("open");
    modal.setAttribute("inert", "");
    document.body.classList.remove("no-scroll");
    if (modal.__opener && typeof modal.__opener.focus === "function") {
      modal.__opener.focus({ preventScroll: true });
    }
    modal.dispatchEvent(new CustomEvent("hk:modalclosed"));
  };

  function initModals() {
    var backdrop = document.querySelectorAll("[data-modal]");
    for (var i = 0; i < backdrop.length; i += 1) {
      (function (node) {
        node.addEventListener("click", function (event) {
          if (event.target === node) HK.closeModal(node);
        });
        var closers = node.querySelectorAll("[data-modal-close]");
        for (var j = 0; j < closers.length; j += 1) {
          closers[j].addEventListener("click", function () {
            HK.closeModal(node);
          });
        }
      })(backdrop[i]);
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        var open = document.querySelector(".modal-backdrop.open");
        if (open) HK.closeModal(open);
        return;
      }
      if (event.key !== "Tab") return;
      var active = document.querySelector(".modal-backdrop.open");
      if (!active) return;
      var focusable = active.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  hydrateIcons();
  initTheme();
  initHeader();
  initActiveNav();
  initReveal();
  initStats();
  initAccordions();
  initBackToTop();
  initYear();
  initModals();
})();
