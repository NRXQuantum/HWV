(function () {
  "use strict";

  var data = window.HK_DATA;
  var HK = window.HK;
  if (!data || !HK) return;

  var grid = document.getElementById("food-grid");
  var search = document.getElementById("food-search");
  var category = document.getElementById("food-category");
  var results = document.getElementById("food-results");
  var empty = document.getElementById("food-empty");
  var emptyText = document.getElementById("food-empty-text");
  var reset = document.getElementById("food-reset");
  var emptyReset = document.getElementById("food-empty-reset");
  var statusButtons = Array.prototype.slice.call(document.querySelectorAll("[data-status]"));
  var modal = document.getElementById("food-modal");
  var modalTitle = document.getElementById("food-modal-title");
  var modalEn = document.getElementById("food-modal-en");
  var modalStatus = document.getElementById("food-modal-status");
  var modalCategory = document.getElementById("food-modal-category");
  var modalDesc = document.getElementById("food-modal-desc");
  var modalReason = document.getElementById("food-modal-reason");
  var modalAdvice = document.getElementById("food-modal-advice");
  var modalFav = document.getElementById("food-modal-fav");
  var modalCopy = document.getElementById("food-modal-copy");

  if (!grid) return;

  var state = { q: "", status: "all", cat: "all" };
  var currentFood = null;
  var favorites = HK.storage.get("favorites", []);
  if (!Array.isArray(favorites)) favorites = [];

  var categoryMap = {};
  data.categories.forEach(function (cat) {
    categoryMap[cat.id] = cat;
  });

  function isFavorite(id) {
    return favorites.indexOf(id) !== -1;
  }

  function saveFavorites() {
    HK.storage.set("favorites", favorites);
    updateStatusCounts();
    updateModalFavorite();
  }

  function toggleFavorite(id) {
    var index = favorites.indexOf(id);
    if (index === -1) {
      favorites.push(id);
      HK.toast("প্রিয় তালিকায় যোগ হয়েছে");
    } else {
      favorites.splice(index, 1);
      HK.toast("প্রিয় তালিকা থেকে সরানো হয়েছে");
    }
    saveFavorites();
    render();
  }

  function normalize(value) {
    return String(value).toLowerCase().replace(/\s+/g, " ").trim();
  }

  function matchesQuery(food) {
    if (!state.q) return true;
    var haystack = normalize(
      [food.name, food.en, food.desc, food.reason, food.advice, categoryMap[food.category].label].join(" ")
    );
    return haystack.indexOf(state.q) !== -1;
  }

  function matchesCategory(food) {
    return state.cat === "all" || food.category === state.cat;
  }

  function matchesStatus(food) {
    if (state.status === "all") return true;
    if (state.status === "favorites") return isFavorite(food.id);
    return food.status === state.status;
  }

  function baseMatches(food) {
    return matchesQuery(food) && matchesCategory(food);
  }

  function getVisibleFoods() {
    return data.foods.filter(function (food) {
      return baseMatches(food) && matchesStatus(food);
    });
  }

  function statusPill(status) {
    return (
      '<span class="status-pill status-' +
      status +
      '">' +
      HK.statusLabel[status] +
      "</span>"
    );
  }

  function cardTemplate(food) {
    var cat = categoryMap[food.category];
    var fav = isFavorite(food.id);
    return (
      '<article class="food-card">' +
      '<div class="food-card-top">' +
      '<span class="food-icon">' +
      HK.icon(cat.icon) +
      "</span>" +
      '<button class="fav-btn' +
      (fav ? " is-fav" : "") +
      '" type="button" data-fav="' +
      food.id +
      '" aria-pressed="' +
      fav +
      '" aria-label="' +
      HK.escapeHtml(food.name) +
      (fav ? " — প্রিয় তালিকা থেকে সরান" : " — প্রিয় তালিকায় যোগ করুন") +
      '" title="প্রিয় তালিকা">' +
      HK.icon("heart") +
      "</button>" +
      "</div>" +
      '<div class="food-meta">' +
      statusPill(food.status) +
      '<span class="food-cat">' +
      cat.label +
      "</span>" +
      "</div>" +
      "<h3>" +
      HK.escapeHtml(food.name) +
      "</h3>" +
      '<p class="food-desc">' +
      HK.escapeHtml(food.desc) +
      "</p>" +
      '<div class="food-card-foot">' +
      '<button class="detail-btn" type="button" data-open="' +
      food.id +
      '" aria-label="' +
      HK.escapeHtml(food.name) +
      ' — বিস্তারিত দেখুন">বিস্তারিত দেখুন ' +
      HK.icon("arrowRight") +
      "</button>" +
      "</div>" +
      "</article>"
    );
  }

  function updateStatusCounts() {
    var counts = { all: 0, halal: 0, haram: 0, mashbooh: 0, favorites: 0 };
    data.foods.forEach(function (food) {
      if (!baseMatches(food)) return;
      counts.all += 1;
      counts[food.status] += 1;
      if (isFavorite(food.id)) counts.favorites += 1;
    });
    Object.keys(counts).forEach(function (key) {
      var node = document.querySelector('[data-status-count="' + key + '"]');
      if (node) node.textContent = HK.toBn(counts[key]);
    });
  }

  function updateStatusButtons() {
    statusButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-status") === state.status ? "true" : "false");
    });
  }

  function syncUrl() {
    if (!window.history || !window.history.replaceState) return;
    try {
      var url = new URL(window.location.href);
      if (state.q) url.searchParams.set("q", state.q);
      else url.searchParams.delete("q");
      if (state.status !== "all") url.searchParams.set("status", state.status);
      else url.searchParams.delete("status");
      if (state.cat !== "all") url.searchParams.set("cat", state.cat);
      else url.searchParams.delete("cat");
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    } catch (error) {}
  }

  function updateResults(count) {
    if (!results) return;
    var label = HK.toBn(count) + "টি খাদ্য";
    if (state.q) {
      results.innerHTML =
        "‘<strong>" + HK.escapeHtml(state.q) + "</strong>’ এর জন্য <strong>" + label + "</strong> পাওয়া গেছে";
    } else {
      results.innerHTML = "মোট <strong>" + label + "</strong> দেখানো হচ্ছে";
    }
  }

  function render() {
    var list = getVisibleFoods();
    grid.innerHTML = list.map(cardTemplate).join("");
    grid.hidden = list.length === 0;
    empty.classList.toggle("show", list.length === 0);
    if (emptyText) {
      emptyText.textContent = state.q
        ? "‘" + state.q + "’ এর সঙ্গে মিলে এমন কোনো খাদ্য পাওয়া যায়নি। বানান বদলে বা ফিল্টার রিসেট করে আবার চেষ্টা করুন।"
        : "এই ফিল্টারে কোনো খাদ্য নেই। অন্য বিভাগ বা অবস্থা বেছে দেখুন।";
    }
    updateResults(list.length);
    updateStatusCounts();
    updateStatusButtons();
  }

  function setCategoryOptions() {
    if (!category) return;
    data.categories.forEach(function (cat) {
      var option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.label;
      category.appendChild(option);
    });
  }

  function updateModalFavorite() {
    if (!modalFav) return;
    if (!currentFood) {
      modalFav.setAttribute("aria-pressed", "false");
      return;
    }
    var fav = isFavorite(currentFood.id);
    modalFav.classList.toggle("is-fav", fav);
    modalFav.setAttribute("aria-pressed", fav ? "true" : "false");
    modalFav.innerHTML =
      HK.icon("heart") + "<span>" + (fav ? "প্রিয় থেকে সরান" : "প্রিয় তালিকায় যোগ করুন") + "</span>";
  }

  function setModalContent(food) {
    var cat = categoryMap[food.category];
    currentFood = food;
    modalStatus.className = "status-pill status-" + food.status;
    modalStatus.textContent = HK.statusLabel[food.status];
    modalCategory.textContent = cat.label;
    modalTitle.textContent = food.name;
    modalEn.textContent = food.en;
    modalDesc.textContent = food.desc;
    modalReason.textContent = food.reason;
    modalAdvice.textContent = food.advice;
    modal.setAttribute("data-food-id", food.id);
    updateModalFavorite();
  }

  function setHash(id) {
    if (!window.history || !window.history.replaceState) return;
    try {
      var url = new URL(window.location.href);
      url.hash = id;
      window.history.replaceState(null, "", url);
    } catch (error) {}
  }

  function clearHash() {
    if (!window.history || !window.history.replaceState) return;
    try {
      var url = new URL(window.location.href);
      if (!url.hash) return;
      url.hash = "";
      window.history.replaceState(null, "", url.pathname + url.search);
    } catch (error) {}
  }

  function openFood(id, opener) {
    var food = data.foods.find(function (item) {
      return item.id === id;
    });
    if (!food) return;
    setModalContent(food);
    setHash(food.id);
    HK.openModal(modal, opener);
  }

  function resetFilters() {
    state.q = "";
    state.status = "all";
    state.cat = "all";
    if (search) search.value = "";
    if (category) category.value = "all";
    syncUrl();
    render();
    if (search) search.focus();
  }

  function initFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");
    var status = params.get("status");
    var cat = params.get("cat");
    if (q) {
      state.q = normalize(q);
      if (search) search.value = q;
    }
    if (status && ["halal", "haram", "mashbooh", "favorites"].indexOf(status) !== -1) {
      state.status = status;
    }
    if (cat && categoryMap[cat]) {
      state.cat = cat;
      if (category) category.value = cat;
    }
  }

  if (search) {
    search.addEventListener("input", function () {
      state.q = normalize(search.value);
      syncUrl();
      render();
    });
  }

  if (category) {
    category.addEventListener("change", function () {
      state.cat = category.value;
      syncUrl();
      render();
    });
  }

  statusButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      state.status = button.getAttribute("data-status");
      syncUrl();
      render();
    });
  });

  grid.addEventListener("click", function (event) {
    var favButton = event.target.closest("[data-fav]");
    if (favButton) {
      toggleFavorite(favButton.getAttribute("data-fav"));
      return;
    }
    var openButton = event.target.closest("[data-open]");
    if (openButton) openFood(openButton.getAttribute("data-open"), openButton);
  });

  if (reset) reset.addEventListener("click", resetFilters);
  if (emptyReset) emptyReset.addEventListener("click", resetFilters);

  if (modalFav) {
    modalFav.addEventListener("click", function () {
      if (currentFood) toggleFavorite(currentFood.id);
    });
  }

  if (modalCopy) {
    modalCopy.addEventListener("click", function () {
      if (!currentFood) return;
      var url = new URL(window.location.href);
      url.hash = currentFood.id;
      HK.copyText(url.href)
        .then(function () {
          HK.toast("খাদ্যটির লিংক কপি হয়েছে");
        })
        .catch(function () {
          HK.toast("লিংক কপি করা যায়নি");
        });
    });
  }

  if (modal) {
    modal.addEventListener("hk:modalclosed", function () {
      clearHash();
      currentFood = null;
    });
  }

  setCategoryOptions();
  initFromUrl();
  render();

  var hashId = "";
  try {
    hashId = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  } catch (error) {
    hashId = "";
  }
  if (hashId) {
    var initialFood = data.foods.find(function (food) {
      return food.id === hashId;
    });
    if (initialFood) {
      window.setTimeout(function () {
        openFood(initialFood.id, null);
      }, 120);
    }
  }
})();
