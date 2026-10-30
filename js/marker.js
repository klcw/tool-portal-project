// Essay Marker page. Marking itself is done by a separate service that does not exist yet.
// When it does, put its address in MARKING_URL. Until then the page sends nothing anywhere.
(function () {
  var MARKING_URL = "";
  var CONTENT_MAX = 30;
  var LANGUAGE_MAX = 20;

  var form = document.getElementById("marker-form");
  var question = document.getElementById("question");
  var essay = document.getElementById("essay");
  var counter = document.getElementById("word-count");
  var markButton = document.getElementById("mark");
  var results = document.getElementById("results");

  function el(tag, text, className) {
    var node = document.createElement(tag);
    if (text) { node.textContent = text; }
    if (className) { node.className = className; }
    return node;
  }

  function message(text) {
    results.textContent = "";
    results.appendChild(el("p", text, "message"));
  }

  function countWords(text) {
    var found = text.trim().match(/\S+/g);
    return found ? found.length : 0;
  }

  // A part is usable only if it has a score in range and a written reason.
  function isValidPart(part, max) {
    return part && typeof part.score === "number" && isFinite(part.score) &&
      part.score >= 0 && part.score <= max &&
      typeof part.reason === "string" && part.reason.trim() !== "";
  }

  function renderPart(title, part, max) {
    var box = el("section", null, "result-section");
    box.appendChild(el("h2", title + ": " + part.score + " / " + max));
    part.reason.split(/\n\s*\n/).forEach(function (paragraph) {
      if (paragraph.trim()) { box.appendChild(el("p", paragraph.trim())); }
    });
    results.appendChild(box);
  }

  // Expected answer from the marking service:
  // { "content": { "score": 22, "reason": "..." }, "language": { "score": 14, "reason": "..." } }
  function render(data) {
    if (!data || !isValidPart(data.content, CONTENT_MAX) || !isValidPart(data.language, LANGUAGE_MAX)) {
      message("The marking service sent an answer this page could not read, so no score is shown. Please try again.");
      return;
    }
    results.textContent = "";
    var total = data.content.score + data.language.score;
    results.appendChild(el("p", "Total: " + total + " / " + (CONTENT_MAX + LANGUAGE_MAX), "score-total"));
    renderPart("Content", data.content, CONTENT_MAX);
    renderPart("Language", data.language, LANGUAGE_MAX);
    results.appendChild(el("p", "This is an AI estimate to help you practise. It is not an official mark.", "note"));
  }

  essay.addEventListener("input", function () {
    var n = countWords(essay.value);
    counter.textContent = n + (n === 1 ? " word" : " words");
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var q = question.value.trim();
    var e = essay.value.trim();
    if (!q || !e) {
      message("Add both the essay question and your essay first.");
      (q ? essay : question).focus();
      return;
    }
    if (!MARKING_URL) {
      message("The marking service is not connected yet, so nothing has been marked. Your essay was not sent anywhere.");
      return;
    }
    markButton.disabled = true;
    message("Marking your essay. This can take a little while.");
    fetch(MARKING_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q, essay: e })
    })
      .then(function (response) {
        if (!response.ok) { throw new Error("Marking failed with status " + response.status); }
        return response.json();
      })
      .then(render)
      .catch(function () {
        message("Marking did not work. Check your connection and try again.");
      })
      .then(function () {
        markButton.disabled = false;
      });
  });

  document.getElementById("clear").addEventListener("click", function () {
    question.value = "";
    essay.value = "";
    counter.textContent = "0 words";
    results.textContent = "";
    question.focus();
  });
})();
