(function () {
  "use strict";

  var data = window.HK_DATA;
  var HK = window.HK;
  if (!data || !HK) return;

  var grid = document.getElementById("recipe-grid");
  var search = document.getElementById("recipe-search");
  var results = document.getElementById("recipe-results");
  var empty = document.getElementById("recipe-empty");
  var emptyText = document.getElementById("recipe-empty-text");
  var reset = document.getElementById("recipe-reset");
  var emptyReset = document.getElementById("recipe-empty-reset");
  var catButtons = Array.prototype.slice.call(document.querySelectorAll("[data-recipe-cat]"));
  var modal = document.getElementById("recipe-modal");
  var modalMedia = document.getElementById("recipe-modal-media");
  var modalCategory = document.getElementById("recipe-modal-category");
  var modalTitle = document.getElementById("recipe-modal-title");
  var modalDesc = document.getElementById("recipe-modal-desc");
  var modalTime = document.getElementById("recipe-modal-time");
  var modalServings = document.getElementById("recipe-modal-servings");
  var modalDifficulty = document.getElementById("recipe-modal-difficulty");
  var modalIngredientCount = document.getElementById("recipe-modal-ingredient-count");
  var modalIngredients = document.getElementById("recipe-modal-ingredients");
  var modalIngredientProgress = document.getElementById("recipe-modal-ingredient-progress");
  var modalSteps = document.getElementById("recipe-modal-steps");
  var modalTip = document.getElementById("recipe-modal-tip");
  var modalPrint = document.getElementById("recipe-modal-print");
  var modalCopy = document.getElementById("recipe-modal-copy");

  if (!grid) return;

  var labels = {
    meat: "মাংস",
    fish: "মাছ",
    veg: "নিরামিষ",
    sweet: "মিষ্টি",
    drink: "পানীয়"
  };

  var state = { q: "", cat: "all" };
  var currentRecipe = null;
  var checks = HK.storage.get("recipe-checks", {});
  if (!checks || typeof checks !== "object" || Array.isArray(checks)) checks = {};

  function normalize(value) {
    return String(value).toLowerCase().replace(/\s+/g, " ").trim();
  }

  function getChecked(id) {
    return Array.isArray(checks[id]) ? checks[id] : [];
  }

  function saveChecks() {
    HK.storage.set("recipe-checks", checks);
  }

  function matchesQuery(recipe) {
    if (!state.q) return true;
    var haystack = normalize(
      [recipe.name, recipe.en, recipe.desc, labels[recipe.category], recipe.ingredients.join(" ")].join(" ")
    );
    return haystack.indexOf(state.q) !== -1;
  }

  function baseMatches(recipe) {
    return matchesQuery(recipe);
  }

  function matchesCat(recipe) {
    return state.cat === "all" || recipe.category === state.cat;
  }

  function getVisibleRecipes() {
    return data.recipes.filter(function (recipe) {
      return baseMatches(recipe) && matchesCat(recipe);
    });
  }

  function cardTemplate(recipe) {
    var checked = getChecked(recipe.id).length;
    return (
      '<article class="recipe-card" id="' + recipe.id + '">' +
      '<div class="recipe-media ' +
      recipe.mediaClass +
      '">' +
      '<span class="recipe-badge">' +
      labels[recipe.category] +
      "</span>" +
      '<span class="recipe-glyph">' +
      HK.icon(recipe.icon) +
      "</span>" +
      "</div>" +
      '<div class="recipe-body">' +
      "<h3>" +
      HK.escapeHtml(recipe.name) +
      "</h3>" +
      "<p>" +
      HK.escapeHtml(recipe.desc) +
      "</p>" +
      '<div class="recipe-meta">' +
      "<span>" +
      HK.icon("clock") +
      " " +
      recipe.time +
      "</span>" +
      "<span>" +
      HK.icon("users") +
      " " +
      recipe.servings +
      "</span>" +
      "<span>" +
      HK.icon("flame") +
      " " +
      recipe.difficulty +
      "</span>" +
      "</div>" +
      '<button class="recipe-open" type="button" data-recipe-open="' +
      recipe.id +
      '" aria-label="' +
      HK.escapeHtml(recipe.name) +
      ' — রেসিপি দেখুন">রেসিপি দেখুন ' +
      HK.icon("arrowRight") +
      "</button>" +
      (checked ? '<span class="small muted">' + HK.toBn(checked) + "টি উপাদান প্রস্তুত</span>" : "") +
      "</div>" +
      "</article>"
    );
  }

  function updateCounts() {
    var counts = { all: 0, meat: 0, fish: 0, veg: 0, sweet: 0, drink: 0 };
    data.recipes.forEach(function (recipe) {
      if (!baseMatches(recipe)) return;
      counts.all += 1;
      counts[recipe.category] += 1;
    });
    Object.keys(counts).forEach(function (key) {
      var node = document.querySelector('[data-recipe-count="' + key + '"]');
      if (node) node.textContent = HK.toBn(counts[key]);
    });
  }

  function updateButtons() {
    catButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-recipe-cat") === state.cat ? "true" : "false");
    });
  }

  function updateResults(count) {
    if (!results) return;
    if (state.q) {
      results.innerHTML =
        "‘<strong>" + HK.escapeHtml(state.q) + "</strong>’ এর জন্য <strong>" + HK.toBn(count) + "টি রেসিপি</strong> পাওয়া গেছে";
    } else {
      results.innerHTML = "মোট <strong>" + HK.toBn(count) + "টি রেসিপি</strong> দেখানো হচ্ছে";
    }
  }

  function render() {
    var list = getVisibleRecipes();
    grid.innerHTML = list.map(cardTemplate).join("");
    grid.hidden = list.length === 0;
    empty.classList.toggle("show", list.length === 0);
    if (emptyText) {
      emptyText.textContent = state.q
        ? "‘" + state.q + "’ এর সঙ্গে মিলে এমন কোনো রেসিপি পাওয়া যায়নি। অন্য নাম বা বিভাগ দিয়ে চেষ্টা করুন।"
        : "এই বিভাগে এখনো কোনো রেসিপি নেই। অন্য বিভাগ বেছে দেখুন।";
    }
    updateResults(list.length);
    updateCounts();
    updateButtons();
  }

  function syncUrl() {
    if (!window.history || !window.history.replaceState) return;
    try {
      var url = new URL(window.location.href);
      if (state.q) url.searchParams.set("q", state.q);
      else url.searchParams.delete("q");
      if (state.cat !== "all") url.searchParams.set("cat", state.cat);
      else url.searchParams.delete("cat");
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    } catch (error) {}
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

  function updateIngredientProgress(recipe) {
    if (!modalIngredientProgress) return;
    var checked = getChecked(recipe.id);
    modalIngredientProgress.textContent =
      HK.toBn(checked.length) + " / " + HK.toBn(recipe.ingredients.length) + "টি উপাদান প্রস্তুত";
  }

  function setModalContent(recipe) {
    var checked = getChecked(recipe.id);
    currentRecipe = recipe;
    modalMedia.className = "recipe-detail-media " + recipe.mediaClass;
    modalMedia.innerHTML = HK.icon(recipe.icon);
    modalCategory.textContent = labels[recipe.category];
    modalTitle.textContent = recipe.name;
    modalDesc.textContent = recipe.desc;
    modalTime.textContent = recipe.time;
    modalServings.textContent = recipe.servings;
    modalDifficulty.textContent = recipe.difficulty;
    modalIngredientCount.textContent = HK.toBn(recipe.ingredients.length) + "টি";
    modalIngredients.innerHTML = recipe.ingredients
      .map(function (ingredient, index) {
        return (
          "<li><label><input type=\"checkbox\" data-ingredient=\"" +
          index +
          "\" " +
          (checked.indexOf(index) !== -1 ? "checked" : "") +
          "><span>" +
          HK.escapeHtml(ingredient) +
          "</span></label></li>"
        );
      })
      .join("");
    modalSteps.innerHTML = recipe.steps
      .map(function (step) {
        return "<li>" + HK.escapeHtml(step) + "</li>";
      })
      .join("");
    modalTip.innerHTML = "<strong>টিপস:</strong> " + HK.escapeHtml(recipe.tip);
    updateIngredientProgress(recipe);
  }

  function openRecipe(id, opener) {
    var recipe = data.recipes.find(function (item) {
      return item.id === id;
    });
    if (!recipe) return;
    setModalContent(recipe);
    setHash(recipe.id);
    HK.openModal(modal, opener);
  }

  function resetFilters() {
    state.q = "";
    state.cat = "all";
    if (search) search.value = "";
    syncUrl();
    render();
    if (search) search.focus();
  }

  function initFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");
    var cat = params.get("cat");
    if (q) {
      state.q = normalize(q);
      if (search) search.value = q;
    }
    if (cat && labels[cat]) state.cat = cat;
  }

  if (search) {
    search.addEventListener("input", function () {
      state.q = normalize(search.value);
      syncUrl();
      render();
    });
  }

  catButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      state.cat = button.getAttribute("data-recipe-cat");
      syncUrl();
      render();
    });
  });

  grid.addEventListener("click", function (event) {
    var openButton = event.target.closest("[data-recipe-open]");
    if (openButton) openRecipe(openButton.getAttribute("data-recipe-open"), openButton);
  });

  if (reset) reset.addEventListener("click", resetFilters);
  if (emptyReset) emptyReset.addEventListener("click", resetFilters);

  if (modalIngredients) {
    modalIngredients.addEventListener("change", function (event) {
      var input = event.target.closest("[data-ingredient]");
      if (!input || !currentRecipe) return;
      var index = Number(input.getAttribute("data-ingredient"));
      var list = getChecked(currentRecipe.id);
      var position = list.indexOf(index);
      if (input.checked && position === -1) list.push(index);
      if (!input.checked && position !== -1) list.splice(position, 1);
      checks[currentRecipe.id] = list;
      saveChecks();
      updateIngredientProgress(currentRecipe);
    });
  }

  if (modalPrint) {
    modalPrint.addEventListener("click", function () {
      window.print();
    });
  }

  if (modalCopy) {
    modalCopy.addEventListener("click", function () {
      if (!currentRecipe) return;
      var url = new URL(window.location.href);
      url.hash = currentRecipe.id;
      HK.copyText(url.href)
        .then(function () {
          HK.toast("রেসিপিটির লিংক কপি হয়েছে");
        })
        .catch(function () {
          HK.toast("লিংক কপি করা যায়নি");
        });
    });
  }

  if (modal) {
    modal.addEventListener("hk:modalclosed", function () {
      clearHash();
      currentRecipe = null;
      render();
    });
  }

  initFromUrl();
  render();

  var hashId = "";
  try {
    hashId = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  } catch (error) {
    hashId = "";
  }
  if (hashId) {
    var initialRecipe = data.recipes.find(function (recipe) {
      return recipe.id === hashId;
    });
    if (initialRecipe) {
      window.setTimeout(function () {
        openRecipe(initialRecipe.id, null);
      }, 120);
    }
  }
})();
