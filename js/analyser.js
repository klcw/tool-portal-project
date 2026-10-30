// Essay Question Analyser. It matches words and phrases in the question; it does not understand it.
(function () {
  // What each command word or phrase asks the student to do.
  var COMMANDS = [
    { pattern: /\bto what extent\b|\bhow far\b|\bhow true\b|\bhow valid\b|\bis it true\b|\bdo you agree\b|\bagree\b/i,
      label: "To what extent / how far / do you agree",
      meaning: "Give a judgement with a degree. Argue both for and against, then state how far you agree and why." },
    { pattern: /\bdiscuss\b/i,
      label: "Discuss",
      meaning: "Weigh different views or sides of the issue, then reach a reasoned conclusion." },
    { pattern: /\bassess\b|\bevaluate\b/i,
      label: "Assess / evaluate",
      meaning: "Judge how important, effective or worthwhile something is, using evidence." },
    { pattern: /\bexamine\b|\bconsider\b/i,
      label: "Examine / consider",
      meaning: "Look closely at the issue from several angles before deciding what you think." },
    { pattern: /\bexplain\b|\baccount for\b|\bwhy\b/i,
      label: "Explain / account for / why",
      meaning: "Give reasons and causes, and show how each one leads to the result." },
    { pattern: /\bcompare\b/i,
      label: "Compare",
      meaning: "Show similarities and differences, and say which matters more." },
    { pattern: /\bshould\b/i,
      label: "Should",
      meaning: "Argue whether something ought to happen. Consider the alternatives and the consequences." },
    { pattern: /\bhow (can|could|should|might|best|do|does)\b/i,
      label: "How can / how should",
      meaning: "Describe ways or solutions, and judge how well each would work." },
    { pattern: /\bcomment on\b/i,
      label: "Comment on",
      meaning: "Give your own view and support it with reasons and examples." },
    { pattern: /\bjustify\b/i,
      label: "Justify",
      meaning: "Give reasons to show something is right or reasonable." }
  ];

  // Words that set limits on the question.
  var LIMITS = [
    { label: "Place",
      note: "Answer for this place, not everywhere. Use examples from it.",
      pattern: /\b(in singapore|singapore|your society|your country|your own society|in the world|globally|worldwide|asia)\b/gi },
    { label: "Time",
      note: "Limits the era you write about. Words like \"still\" and \"no longer\" mean compare past and present.",
      pattern: /\b(today|nowadays|modern|these days|in recent years|in the 21st century|in this age|in the age of|digital age|still|no longer|future)\b/gi },
    { label: "People",
      note: "Who the question is about. Stay on this group.",
      pattern: /\b(young people|the young|youths?|the elderly|older people|teenagers|students|parents|governments?|individuals?|the media|companies|society|citizens|women|men|children)\b/gi },
    { label: "Absolute words",
      note: "The question says something is always or entirely true. Test it with exceptions and conditions.",
      pattern: /\b(all|every|always|never|only|no one|nobody|everyone|must|cannot|impossible|inevitable|completely|entirely|merely|simply|solely)\b/gi },
    { label: "Degree or comparison",
      note: "You must show it is bigger or better than the alternatives, not just good.",
      pattern: /\b(most|more|less|too|enough|mainly|largely|primarily|main|major|key|best|worst|greatest)\b/gi }
  ];

  var STOPWORDS = ("the a an and or but of to in on at by for with from as is are was were be been being it its this that these those " +
    "do does did can could should would will may might must not no than then so such too very more most less much many any some " +
    "what which who whom whose when where why how there their they them we us you your our he she his her i my me about into over " +
    "out up down off again also just only own same other each both few all every having have has had").split(" ");

  var ANGLES = [
    ["Social", "How does it affect relationships, communities or particular groups?"],
    ["Economic", "Who gains or loses money, jobs or opportunities?"],
    ["Political", "What role do governments, laws or policies play?"],
    ["Environmental", "What happens to the environment, now and in future?"],
    ["Technological", "What can technology change, help or harm here?"],
    ["Cultural", "How do values, traditions or identity come into it?"],
    ["Moral", "What is right or fair, and who decides?"],
    ["Individual", "What does it mean for one person's choices and wellbeing?"]
  ];

  var form = document.getElementById("analyser-form");
  var input = document.getElementById("question");
  var results = document.getElementById("results");

  function el(tag, text, className) {
    var node = document.createElement(tag);
    if (text) { node.textContent = text; }
    if (className) { node.className = className; }
    return node;
  }

  function section(title) {
    var box = el("section", null, "result-section");
    box.appendChild(el("h2", title));
    results.appendChild(box);
    return box;
  }

  function item(list, boldText, rest) {
    var li = el("li");
    li.appendChild(el("strong", boldText));
    li.appendChild(document.createTextNode(rest ? ": " + rest : ""));
    list.appendChild(li);
  }

  function unique(words) {
    var seen = {};
    return words.filter(function (w) {
      var key = w.toLowerCase();
      if (seen[key]) { return false; }
      seen[key] = true;
      return true;
    });
  }

  function analyse(question) {
    results.textContent = "";

    // 1. Command words
    var box = section("What the question asks you to do");
    var found = COMMANDS.filter(function (c) { return c.pattern.test(question); });
    if (found.length === 0) {
      box.appendChild(el("p", "No standard command word found. Read the question again and decide whether it asks what, why, how or whether."));
    } else {
      var list = el("ul");
      found.forEach(function (c) { item(list, c.label, c.meaning); });
      box.appendChild(list);
    }

    // 2. Limits
    box = section("Limits to stay within");
    var limitList = el("ul");
    LIMITS.forEach(function (limit) {
      var matches = question.match(limit.pattern);
      if (matches) {
        item(limitList, limit.label + " (" + unique(matches).join(", ") + ")", limit.note);
      }
    });
    if (limitList.children.length === 0) {
      box.appendChild(el("p", "No obvious limiting words found. Check the question for who, where and when."));
    } else {
      box.appendChild(limitList);
    }

    // 3. Words to define: drop command phrases and common words, keep the rest
    var rest = question;
    COMMANDS.forEach(function (c) { rest = rest.replace(new RegExp(c.pattern.source, "gi"), " "); });
    var words = (rest.match(/[a-z][a-z'-]*/gi) || []).filter(function (w) {
      return w.length >= 4 && STOPWORDS.indexOf(w.toLowerCase()) === -1;
    });
    box = section("Words to define or unpack");
    words = unique(words).slice(0, 12);
    if (words.length === 0) {
      box.appendChild(el("p", "No key words picked out. Choose the main ideas yourself."));
    } else {
      box.appendChild(el("p", words.join(", ")));
      box.appendChild(el("p", "Decide what each one means in this question and say so in your introduction. Some of these may just be filler words, so ignore any that do not matter.", "note"));
    }

    // 4. Angles
    box = section("Angles to test your points against");
    var angleList = el("ul");
    ANGLES.forEach(function (a) { item(angleList, a[0], a[1]); });
    box.appendChild(angleList);

    results.appendChild(el("p", "This tool matches words and patterns. It does not understand your question, so check the result against the question yourself.", "note"));
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var question = input.value.trim();
    if (!question) {
      results.textContent = "";
      results.appendChild(el("p", "Type or paste a question first."));
      input.focus();
      return;
    }
    analyse(question);
  });

  document.getElementById("clear").addEventListener("click", function () {
    input.value = "";
    results.textContent = "";
    input.focus();
  });
})();
