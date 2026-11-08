(function () {
  "use strict";

  var HK = window.HK;
  var list = document.getElementById("cert-checklist");
  if (!HK || !list) return;

  var items = [
    "ব্যবসার নিবন্ধন সনদ বা ট্রেড লাইসেন্স",
    "পণ্যের সম্পূর্ণ উপাদান তালিকা ও প্রতিটি উপাদানের উৎস",
    "সরবরাহকারীদের হালাল সনদ বা উপাদান-প্রমাণ",
    "উৎপাদন প্রক্রিয়ার লিখিত বিবরণ ও ফ্লো চার্ট",
    "কারখানা বা রেস্টুরেন্টের লেআউট ও প্ল্যান",
    "প্যাকেজিং, লেবেল ও ব্র্যান্ডের নমুনা",
    "জবাই বা প্রক্রিয়াকরণ পদ্ধতির লিখিত বর্ণনা",
    "কর্মীদের হালাল প্রশিক্ষণ ও স্বাস্থ্যবিধি রেকর্ড",
    "পণ্যের নমুনা পরীক্ষার রিপোর্ট (প্রযোজ্য হলে)",
    "পানি, স্যানিটেশন ও বর্জ্য ব্যবস্থাপনার বিবরণ",
    "প্রতিষ্ঠানের হালাল নীতি ও দায়িত্বপ্রাপ্ত কর্মকর্তার নাম",
    "অভ্যন্তরীণ অডিট ও নিয়মিত তদারকির পরিকল্পনা"
  ];

  var progressBar = document.getElementById("cert-progress");
  var progressLabel = document.getElementById("cert-progress-label");
  var complete = document.getElementById("cert-complete");
  var reset = document.getElementById("cert-reset");
  var saved = HK.storage.get("cert-checklist", []);
  if (!Array.isArray(saved)) saved = [];

  function render() {
    list.innerHTML = items
      .map(function (item, index) {
        var checked = saved.indexOf(index) !== -1;
        return (
          '<label class="check-item" for="cert-item-' +
          index +
          '"><input type="checkbox" id="cert-item-' +
          index +
          '" data-cert-item="' +
          index +
          '" ' +
          (checked ? "checked" : "") +
          '><span class="check-text">' +
          HK.escapeHtml(item) +
          "</span></label>"
        );
      })
      .join("");

    var count = saved.length;
    var percent = Math.round((count / items.length) * 100);
    if (progressBar) progressBar.style.width = percent + "%";
    if (progressLabel) {
      progressLabel.innerHTML =
        "<span>প্রস্তুতি</span><strong>" + HK.toBn(count) + " / " + HK.toBn(items.length) + " সম্পন্ন</strong>";
    }
    if (complete) complete.classList.toggle("show", count === items.length);
  }

  list.addEventListener("change", function (event) {
    var input = event.target.closest("[data-cert-item]");
    if (!input) return;
    var index = Number(input.getAttribute("data-cert-item"));
    var position = saved.indexOf(index);
    if (input.checked && position === -1) saved.push(index);
    if (!input.checked && position !== -1) saved.splice(position, 1);
    saved.sort(function (a, b) {
      return a - b;
    });
    HK.storage.set("cert-checklist", saved);
    var count = saved.length;
    var percent = Math.round((count / items.length) * 100);
    if (progressBar) progressBar.style.width = percent + "%";
    if (progressLabel) {
      progressLabel.innerHTML =
        "<span>প্রস্তুতি</span><strong>" + HK.toBn(count) + " / " + HK.toBn(items.length) + " সম্পন্ন</strong>";
    }
    if (complete) complete.classList.toggle("show", count === items.length);
    if (count === items.length) HK.toast("সব প্রস্তুতি সম্পন্ন হয়েছে");
  });

  if (reset) {
    reset.addEventListener("click", function () {
      saved = [];
      HK.storage.set("cert-checklist", saved);
      render();
      HK.toast("চেকলিস্ট রিসেট হয়েছে");
    });
  }

  render();
})();
