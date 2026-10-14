(function () {
  "use strict";

  var CFG = window.SITE_CONFIG;
  var C = CFG.contacts;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0") + "\u00A0₽"; }
  function waUrl(text) {
    return "https://wa.me/" + C.whatsapp + (text ? "?text=" + encodeURIComponent(text) : "");
  }

  /* ---------- Контакты из config.js ---------- */
  $$("[data-wa]").forEach(function (a) { a.href = waUrl(a.getAttribute("data-wa-text")); });
  $$("[data-tg]").forEach(function (a) { a.href = "https://t.me/" + C.telegram; });
  $$("[data-tel]").forEach(function (a) {
    a.href = "tel:" + C.phoneRaw;
    if (!a.querySelector("svg") && !a.hasAttribute("aria-label")) a.textContent = C.phoneText;
  });
  var year = $("#year"); if (year) year.textContent = new Date().getFullYear();

  /* ---------- Меню ---------- */
  var burger = $(".burger"), nav = $("#nav"), header = $(".site-header");
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  }
  burger.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); burger.focus(); }
  });
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  /* Подсветка текущего раздела */
  if ("IntersectionObserver" in window) {
    var links = {};
    $$(".nav-list a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && links[en.target.id]) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove("is-active"); });
          links[en.target.id].classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- Вкладки услуг ---------- */
  var tabs = $$('[role="tab"]');
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selectTab(t); });
    t.addEventListener("keydown", function (e) {
      var k = e.key, n = null;
      if (k === "ArrowRight") n = tabs[(i + 1) % tabs.length];
      else if (k === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (k === "Home") n = tabs[0];
      else if (k === "End") n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); selectTab(n, true); }
    });
  });

  /* ---------- Отзывы: показываем блок только если есть реальные ---------- */
  var rl = $("#reviews-list"), rs = $("#reviews");
  if (rl && rs) {
    if (rl.children.length) {
      rs.hidden = false;
    } else if (/[?&]reviews=preview/.test(location.search)) {
      for (var r = 0; r < 3; r++) {
        var d = document.createElement("div");
        d.className = "review review--empty";
        d.textContent = "Здесь появятся реальные отзывы клиентов";
        rl.appendChild(d);
      }
      rs.hidden = false;
    }
  }

  /* ---------- Калькулятор ---------- */
  var typesBox = $("#calc-types"), featsBox = $("#calc-feats"), note = $("#calc-note");
  var resMain = $("#res-main"), resText = $("#res-text"), resList = $("#res-list");
  var waBtn = $("#calc-wa"), tgBtn = $("#calc-tg"), copyBtn = $("#calc-copy");
  var errBox = $("#calc-error"), statusBox = $("#calc-status");
  var state = { type: null, feats: {} };

  function typeById(id) { return CFG.projectTypes.filter(function (t) { return t.id === id; })[0] || null; }

  function renderTypes() {
    var html = "";
    [["site", "Сайты"], ["bot", "Telegram-боты"]].forEach(function (g) {
      html += '<p class="type-group-title">' + g[1] + "</p>";
      CFG.projectTypes.filter(function (t) { return t.kind === g[0]; }).forEach(function (t) {
        html += '<div class="opt"><input type="radio" name="ptype" id="pt-' + t.id + '" value="' + t.id + '">' +
          '<label for="pt-' + t.id + '"><b>' + t.label + "</b><span>" + t.hint + "</span></label></div>";
      });
    });
    typesBox.innerHTML = html;
    typesBox.addEventListener("change", function (e) {
      if (e.target.name !== "ptype") return;
      var prevKind = state.type && state.type.kind;
      state.type = typeById(e.target.value);
      if (prevKind !== state.type.kind) state.feats = {};
      errBox.textContent = ""; statusBox.textContent = "";
      renderFeats(); update();
    });
  }

  function renderFeats() {
    if (!state.type) { featsBox.innerHTML = '<p class="feat-empty">Сначала выберите тип проекта.</p>'; return; }
    var list = CFG.features[state.type.kind], html = "";
    list.forEach(function (f) {
      html += '<div class="opt"><input type="checkbox" id="ft-' + f.id + '" value="' + f.id + '"' + (state.feats[f.id] ? " checked" : "") + '>' +
        '<label for="ft-' + f.id + '"><b>' + f.label + "</b></label></div>";
    });
    featsBox.innerHTML = html;
  }
  featsBox.addEventListener("change", function (e) {
    if (e.target.type !== "checkbox") return;
    state.feats[e.target.value] = e.target.checked;
    statusBox.textContent = ""; update();
  });
  note.addEventListener("input", function () { statusBox.textContent = ""; update(); });

  function selectedFeatures() {
    if (!state.type) return [];
    return CFG.features[state.type.kind].filter(function (f) { return state.feats[f.id]; });
  }

  function compute() {
    var t = state.type, sel = selectedFeatures();
    var advanced = sel.filter(function (f) { return f.level !== "basic"; });
    if (t.from === null) {
      return { main: "Индивидуальный расчёт", text: "Стоимость таких решений зависит от задачи. Опишите её, и я назову цену после обсуждения.", summary: "индивидуальный расчёт после обсуждения" };
    }
    if (advanced.length) {
      return {
        main: "от " + fmt(t.from),
        text: "Это ориентир для базовой части. Выбранные дополнительные функции (" +
          advanced.map(function (f) { return f.label.toLowerCase(); }).join(", ") +
          ") оцениваются отдельно после обсуждения.",
        summary: "от " + fmt(t.from) + " за базовую часть, дополнительные функции оцениваются отдельно"
      };
    }
    return { main: "от " + fmt(t.from), text: "Стартовая цена для базового объёма. Точная стоимость зависит от задачи и технического задания.", summary: "от " + fmt(t.from) + " (стартовая цена)" };
  }

  function buildMessage() {
    if (!state.type) return "";
    var res = compute(), sel = selectedFeatures();
    var funcs = sel.filter(function (f) { return f.level !== "integration"; }).map(function (f) { return f.label; });
    var ints = sel.filter(function (f) { return f.level === "integration"; }).map(function (f) { return f.label; });
    var lines = ["Здравствуйте! Хочу обсудить проект.", "Тип проекта: " + state.type.label];
    if (funcs.length) lines.push("Функции: " + funcs.join(", "));
    if (ints.length) lines.push("Интеграции: " + ints.join(", "));
    lines.push("Ориентир из калькулятора: " + res.summary);
    var n = note.value.trim();
    if (n) lines.push("О задаче: " + n);
    return lines.join("\n");
  }

  function update() {
    if (!state.type) {
      resMain.textContent = "Выберите тип проекта";
      resText.textContent = "Мы покажем ориентир по выбранным параметрам.";
      resList.hidden = true; resList.innerHTML = "";
      waBtn.setAttribute("aria-disabled", "true");
      waBtn.href = waUrl("");
      return;
    }
    var res = compute(), sel = selectedFeatures();
    resMain.textContent = res.main;
    resText.textContent = res.text;
    var items = [state.type.label].concat(sel.map(function (f) { return f.label; }));
    resList.innerHTML = items.map(function (i) { return "<li></li>"; }).join("");
    $$("li", resList).forEach(function (li, i) { li.textContent = items[i]; });
    resList.hidden = false;
    waBtn.removeAttribute("aria-disabled");
    waBtn.href = waUrl(buildMessage());
  }

  function requireType(e) {
    if (state.type) return true;
    if (e) e.preventDefault();
    errBox.textContent = "Выберите тип проекта, чтобы отправить заявку.";
    var first = typesBox.querySelector("input"); if (first) first.focus();
    return false;
  }
  waBtn.addEventListener("click", requireType);

  tgBtn.addEventListener("click", function () {
    if (state.type) {
      copyText(buildMessage(), function (ok) {
        statusBox.textContent = ok
          ? "Текст заявки скопирован. Вставьте его в чат Telegram."
          : "Откройте Telegram и опишите задачу своими словами.";
      });
    }
  });

  function copyText(text, cb) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { cb(true); }, function () { cb(fallbackCopy(text)); });
    } else { cb(fallbackCopy(text)); }
  }
  function fallbackCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var ok = document.execCommand("copy"); document.body.removeChild(ta); return ok;
    } catch (err) { return false; }
  }
  copyBtn.addEventListener("click", function () {
    if (!requireType()) return;
    errBox.textContent = "";
    copyText(buildMessage(), function (ok) {
      statusBox.textContent = ok ? "Текст заявки скопирован." : "Не удалось скопировать. Выделите текст в поле «О задаче» вручную или отправьте заявку в WhatsApp.";
    });
  });

  renderTypes(); renderFeats(); update();
})();
