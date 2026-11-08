(function () {
  "use strict";

  var HK = window.HK;
  var card = document.getElementById("halal-quiz");
  if (!HK || !card) return;

  var questions = [
    {
      question: "শূকরের মাংসের ইসলামি বিধান কী?",
      options: ["হালাল", "হারাম", "শুধু রান্না করে খাওয়া যাবে"],
      answer: 1,
      explanation: "শূকরের মাংস কুরআনে স্পষ্টভাবে হারাম। সূরা আল-বাকারা ২:১৭৩ এবং সূরা আল-মায়িদা ৫:৩-তে এ বিষয়ে স্পষ্ট নির্দেশনা আছে।"
    },
    {
      question: "পশু জবাইয়ের সময় কোনটি আবশ্যক?",
      options: ["বিসমিল্লাহ বলা", "শুধু পশুর পা বাঁধা", "পশুকে ঘুম পাড়িয়ে জবাই করা"],
      answer: 0,
      explanation: "জবাইয়ের সময় আল্লাহর নামে বিসমিল্লাহ বলা আবশ্যক। সঙ্গে ধারালো ছুরি, জীবিত পশু এবং রক্ত সম্পূর্ণ নিষ্কাশনের শর্তও পূরণ হতে হবে।"
    },
    {
      question: "মাছ খাওয়ার জন্য জবাই করতে হয় কি?",
      options: ["হ্যাঁ, অবশ্যই", "না, জবাই ছাড়াই খাওয়া যায়", "শুধু বড় মাছের ক্ষেত্রে"],
      answer: 1,
      explanation: "সামুদ্রিক খাদ্য ও মাছ জবাই ছাড়াই হালাল। সূরা আল-মায়িদা ৫:৯৬-তে সমুদ্রের শিকারকে হালাল করা হয়েছে।"
    },
    {
      question: "অজানা উৎসের জেলাটিনের অবস্থান কী?",
      options: ["নিশ্চিত হালাল", "নিশ্চিত হারাম", "সন্দেহজনক"],
      answer: 2,
      explanation: "জেলাটিন শূকরের উপাদান বা জবাই নিয়ম ছাড়া প্রাণীর হাড়-চামড়া থেকে তৈরি হতে পারে। উৎস স্পষ্ট না হলে তা সন্দেহজনক; হালাল সনদযুক্ত জেলাটিন নিরাপদ।"
    },
    {
      question: "জবাই ছাড়া মারা যাওয়া পশুর মাংসের বিধান কী?",
      options: ["হারাম", "হালাল", "সন্দেহজনক"],
      answer: 0,
      explanation: "মৃত পশু (মুরদার) হারাম। ইসলামি নিয়মে জবাই না হলে রক্ত নিষ্কাশিত হয় না এবং তা অপবিত্র।"
    },
    {
      question: "নেশাজাতীয় পানীয়ের বিধান কী?",
      options: ["মাঝে মাঝে হালাল", "হারাম", "শুধু বেশি পরিমাণে হারাম"],
      answer: 1,
      explanation: "নেশা সৃষ্টি করে এমন সব পানীয় ও দ্রব্য হারাম। অল্প পরিমাণেও নেশাজাতীয় বস্তু গ্রহণ করা বৈধ নয়।"
    }
  ];

  var current = 0;
  var score = 0;
  var answered = false;
  var body = document.getElementById("quiz-body");
  var result = document.getElementById("quiz-result");
  var progress = document.getElementById("quiz-progress");
  var count = document.getElementById("quiz-count");
  var questionNode = document.getElementById("quiz-question");
  var optionsNode = document.getElementById("quiz-options");
  var feedback = document.getElementById("quiz-feedback");
  var next = document.getElementById("quiz-next");
  var hint = document.getElementById("quiz-hint");
  var resultScore = document.getElementById("quiz-result-score");
  var resultTitle = document.getElementById("quiz-result-title");
  var resultText = document.getElementById("quiz-result-text");
  var restart = document.getElementById("quiz-restart");

  function renderQuestion() {
    var item = questions[current];
    answered = false;
    count.textContent = "প্রশ্ন " + HK.toBn(current + 1) + " / " + HK.toBn(questions.length);
    progress.style.width = ((current + 1) / questions.length) * 100 + "%";
    questionNode.textContent = item.question;
    questionNode.setAttribute("tabindex", "-1");
    optionsNode.innerHTML = item.options
      .map(function (option, index) {
        return (
          '<li class="quiz-option" data-answer="' +
          index +
          '"><button type="button">' +
          "<span>" +
          HK.escapeHtml(option) +
          "</span><span class=\"opt-mark\">" +
          HK.toBn(index + 1) +
          "</span></button></li>"
        );
      })
      .join("");
    feedback.className = "quiz-feedback";
    feedback.innerHTML = "";
    next.disabled = true;
    next.textContent = current === questions.length - 1 ? "ফলাফল দেখুন" : "পরের প্রশ্ন";
    hint.textContent = "সঠিক উত্তর বেছে নিন";
    questionNode.focus({ preventScroll: true });
  }

  optionsNode.addEventListener("click", function (event) {
    var button = event.target.closest("button");
    if (!button || answered) return;
    var option = button.closest(".quiz-option");
    var chosen = Number(option.getAttribute("data-answer"));
    var item = questions[current];
    answered = true;

    var allOptions = optionsNode.querySelectorAll(".quiz-option");
    for (var i = 0; i < allOptions.length; i += 1) {
      var optionButton = allOptions[i].querySelector("button");
      optionButton.disabled = true;
      var index = Number(allOptions[i].getAttribute("data-answer"));
      if (index === item.answer) allOptions[i].classList.add("correct");
    }

    if (chosen === item.answer) {
      score += 1;
      feedback.innerHTML = "<strong>সঠিক উত্তর!</strong> " + HK.escapeHtml(item.explanation);
      hint.textContent = "চমৎকার! পরের প্রশ্নে যান";
    } else {
      option.classList.add("wrong");
      feedback.innerHTML = "<strong>ভুল হয়েছে।</strong> সঠিক উত্তর: " + HK.escapeHtml(item.options[item.answer]) + " — " + HK.escapeHtml(item.explanation);
      hint.textContent = "ব্যাখ্যা পড়ে নিন, তারপর এগিয়ে যান";
    }
    feedback.classList.add("show");
    next.disabled = false;
    next.focus({ preventScroll: true });
  });

  next.addEventListener("click", function () {
    if (!answered) return;
    if (current < questions.length - 1) {
      current += 1;
      renderQuestion();
    } else {
      showResult();
    }
  });

  function showResult() {
    var percent = Math.round((score / questions.length) * 100);
    body.hidden = true;
    result.hidden = false;
    resultScore.style.setProperty("--score", percent);
    resultScore.querySelector("span").textContent = HK.toBn(score) + "/" + HK.toBn(questions.length);
    if (score === questions.length) {
      resultTitle.textContent = "চমৎকার! আপনি হালাল বিষয়ে সচেতন";
      resultText.textContent = "সব প্রশ্নের সঠিক উত্তর দিয়েছেন। এই জ্ঞান দৈনন্দিন কেনাকাটা ও রান্নার সিদ্ধান্তে কাজে লাগান।";
    } else if (score >= questions.length - 2) {
      resultTitle.textContent = "খুব ভালো! আরেকটু জানলে পূর্ণ নম্বর";
      resultText.textContent = "আপনি প্রায় সব বিষয় জানেন। ভুল হওয়া প্রশ্নগুলোর ব্যাখ্যা আবার পড়ে নিন এবং গাইডটি দেখুন।";
    } else if (score >= Math.ceil(questions.length / 2)) {
      resultTitle.textContent = "ভালো শুরু, আরও শিখুন";
      resultText.textContent = "মৌলিক বিষয়গুলো জানেন, তবে সন্দেহজনক উপাদান ও জবাইয়ের শর্ত নিয়ে আরও পড়া প্রয়োজন।";
    } else {
      resultTitle.textContent = "গাইডটি পড়া শুরু করুন";
      resultText.textContent = "হালাল-হারামের মৌলিক বিষয়গুলো একবার ভালোভাবে জেনে নেওয়া জরুরি। গাইডের শর্ত ও উপাদানের অংশগুলো পড়ুন।";
    }
    result.querySelector("[data-result-focus]").focus({ preventScroll: true });
  }

  restart.addEventListener("click", function () {
    current = 0;
    score = 0;
    result.hidden = true;
    body.hidden = false;
    renderQuestion();
  });

  renderQuestion();
})();
