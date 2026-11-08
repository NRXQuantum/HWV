(function () {
  "use strict";

  var HK = window.HK;
  var form = document.getElementById("contact-form");
  if (!HK || !form) return;

  var success = document.getElementById("contact-success");
  var successTitle = document.getElementById("contact-success-title");
  var copyButton = document.getElementById("contact-copy");
  var downloadButton = document.getElementById("contact-download");
  var newButton = document.getElementById("contact-new");
  var nameField = document.getElementById("contact-name");
  var emailField = document.getElementById("contact-email");
  var subjectField = document.getElementById("contact-subject");
  var messageField = document.getElementById("contact-message");
  var consentField = document.getElementById("contact-consent");
  var messageCount = document.getElementById("contact-message-count");
  var lastMessageText = "";

  var subjectLabels = {
    general: "সাধারণ প্রশ্ন",
    halal: "হালাল যাচাই",
    certification: "সার্টিফিকেশন",
    feedback: "ওয়েবসাইট মতামত",
    other: "অন্যান্য"
  };

  function setError(field, message) {
    if (!field) return;
    var error = document.getElementById(field.id + "-error");
    field.setAttribute("aria-invalid", "true");
    if (error) {
      error.textContent = message;
      error.classList.add("show");
    }
  }

  function clearError(field) {
    if (!field) return;
    var error = document.getElementById(field.id + "-error");
    field.removeAttribute("aria-invalid");
    if (error) {
      error.textContent = "";
      error.classList.remove("show");
    }
  }

  function validate() {
    var valid = true;
    var firstInvalid = null;

    if (!nameField.value.trim() || nameField.value.trim().length < 2) {
      setError(nameField, "অন্তত ২ অক্ষরের নাম লিখুন।");
      valid = false;
      firstInvalid = firstInvalid || nameField;
    } else {
      clearError(nameField);
    }

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailField.value.trim())) {
      setError(emailField, "সঠিক ইমেইল ঠিকানা লিখুন। যেমন: name@example.com");
      valid = false;
      firstInvalid = firstInvalid || emailField;
    } else {
      clearError(emailField);
    }

    if (!subjectField.value) {
      setError(subjectField, "একটি বিষয় নির্বাচন করুন।");
      valid = false;
      firstInvalid = firstInvalid || subjectField;
    } else {
      clearError(subjectField);
    }

    if (messageField.value.trim().length < 10) {
      setError(messageField, "বার্তাটি অন্তত ১০ অক্ষরের হতে হবে।");
      valid = false;
      firstInvalid = firstInvalid || messageField;
    } else {
      clearError(messageField);
    }

    if (!consentField.checked) {
      setError(consentField, "বার্তা সংরক্ষণের সম্মতি দিন।");
      valid = false;
      firstInvalid = firstInvalid || consentField;
    } else {
      clearError(consentField);
    }

    if (firstInvalid) firstInvalid.focus();
    return valid;
  }

  function updateCount() {
    if (!messageCount) return;
    messageCount.textContent = HK.toBn(messageField.value.length) + " / " + HK.toBn(1000);
  }

  function prefillSubject() {
    var params = new URLSearchParams(window.location.search);
    var subject = params.get("subject");
    if (subject && subjectLabels[subject]) subjectField.value = subject;
  }

  [nameField, emailField, subjectField, messageField].forEach(function (field) {
    if (!field) return;
    field.addEventListener("input", function () {
      if (field.getAttribute("aria-invalid") === "true") clearError(field);
      if (field === messageField) updateCount();
    });
    field.addEventListener("change", function () {
      if (field.getAttribute("aria-invalid") === "true") clearError(field);
    });
  });

  if (consentField) {
    consentField.addEventListener("change", function () {
      if (consentField.checked) clearError(consentField);
    });
  }

  if (messageField) {
    messageField.addEventListener("input", updateCount);
    updateCount();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validate()) return;

    var now = new Date();
    var record = {
      id: now.getTime(),
      date: now.toISOString(),
      name: nameField.value.trim(),
      email: emailField.value.trim(),
      subject: subjectLabels[subjectField.value] || subjectField.value,
      message: messageField.value.trim()
    };

    var stored = HK.storage.get("messages", []);
    if (!Array.isArray(stored)) stored = [];
    stored.unshift(record);
    if (stored.length > 20) stored = stored.slice(0, 20);
    HK.storage.set("messages", stored);

    lastMessageText =
      "হালাল খাদ্য — যোগাযোগ বার্তা\n" +
      "নাম: " +
      record.name +
      "\nইমেইল: " +
      record.email +
      "\nবিষয়: " +
      record.subject +
      "\nবার্তা: " +
      record.message +
      "\nতারিখ: " +
      now.toLocaleString("bn-BD");

    if (successTitle) successTitle.textContent = "ধন্যবাদ, " + record.name + "!";
    form.hidden = true;
    if (success) {
      success.classList.add("show");
      var focusTarget = success.querySelector("button");
      if (focusTarget) focusTarget.focus();
    }
    HK.toast("বার্তা এই ব্রাউজারে সংরক্ষিত হয়েছে");
  });

  if (copyButton) {
    copyButton.addEventListener("click", function () {
      HK.copyText(lastMessageText)
        .then(function () {
          HK.toast("বার্তা কপি হয়েছে");
        })
        .catch(function () {
          HK.toast("বার্তা কপি করা যায়নি");
        });
    });
  }

  if (downloadButton) {
    downloadButton.addEventListener("click", function () {
      var blob = new Blob([lastMessageText], { type: "text/plain;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = "halal-khadyo-message.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      HK.toast("বার্তা ডাউনলোড হয়েছে");
    });
  }

  if (newButton) {
    newButton.addEventListener("click", function () {
      form.reset();
      updateCount();
      [nameField, emailField, subjectField, messageField, consentField].forEach(clearError);
      if (success) success.classList.remove("show");
      form.hidden = false;
      if (nameField) nameField.focus();
    });
  }

  prefillSubject();
})();
