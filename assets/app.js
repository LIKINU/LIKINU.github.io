/* ===== 李鍵宇个人主页 · 交互逻辑（完整内容版 · 支持手动改字） ===== */
(function () {
  "use strict";

  /* ---------- 文字覆盖层（手动编辑存储） ---------- */
  const LS_KEY = "rainli-edits";
  let OVERRIDES = loadEdits();
  function loadEdits() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveEdits() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(OVERRIDES)); } catch (e) {}
  }
  let saveTimer;
  function saveEditsDebounced() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveEdits, 250);
  }
  // 显示文字：优先用用户改过的覆盖值
  function tx(key, text) { return OVERRIDES[key] != null ? OVERRIDES[key] : text; }

  const ICONS = {
    hub: '<circle cx="12" cy="12" r="3"/><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 7l3 4M17 7l-3 4M7 17l3-4M17 17l-3-4"/>',
    marketing: '<path d="M3 11v2a1 1 0 0 0 1 1h3l8 5V5L7 10H4a1 1 0 0 0-1 1Z"/><path d="M15 8a4 4 0 0 1 0 8"/>',
    campus: '<path d="M4 9l8-4 8 4-8 4-8-4Z"/><path d="M6 11v5M10 11v5M14 11v5M18 11v5"/><path d="M4 20h16"/>',
    six: '<path d="M12 3l7 4v8l-7 4-7-4V7l7-4Z"/><circle cx="12" cy="12" r="2.2"/>',
    twin: '<circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/>',
    scene: '<path d="M12 3l9 5-9 5-9-5 9-5Z"/><path d="M3 13l9 5 9-5"/>',
    engine: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    report: '<path d="M6 3h9l3 3v15H6V3Z"/><path d="M9 9h6M9 13h6M9 17h4"/>',
    course: '<path d="M4 5a2 2 0 0 1 2-2h6v16H6a2 2 0 0 0-2 2V5Z"/><path d="M20 5a2 2 0 0 0-2-2h-6v16h6a2 2 0 0 1 2 2V5Z"/>',
    ai: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/><circle cx="12" cy="12" r="2"/>',
    private: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    fresh: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/>',
    community: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 20c0-2.2 1.3-4 3.5-4S22 17.8 22 20"/>',
    local: '<path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="12" cy="9" r="2.4"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>',
    moon: '<path d="M21 12.8A8 8 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z"/>',
    bizcard: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M14 9h4M14 13h3"/>',
    /* ===== 专用图标（与能力/项目卡零重复，详情图标不占用） ===== */
    org: '<circle cx="12" cy="4" r="2"/><circle cx="5" cy="13" r="2"/><circle cx="19" cy="13" r="2"/><circle cx="12" cy="20" r="2"/><path d="M12 6v3M12 9H5v4M12 9h7v4M5 15v3M19 15v3M12 18v-4"/>',
    broadcast: '<circle cx="12" cy="12" r="2.5"/><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.5 5.5a9 9 0 0 0 0 13M18.5 5.5a9 9 0 0 1 0 13"/>',
    speech: '<path d="M4 5h16v10H9l-4 4v-4H4Z"/><path d="M8 9h8M8 12h5"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 2-2 0-1.2-1-1.5-1-2.5 0-1 .8-1.5 1.8-1.5H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8Z"/><circle cx="8" cy="11" r="1.2"/><circle cx="12" cy="8" r="1.2"/><circle cx="16" cy="11" r="1.2"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/>',
    circuit: '<rect x="6" y="6" width="12" height="12" rx="3"/><path d="M9 6v12M15 6v12M6 9h12M6 15h12"/><circle cx="12" cy="12" r="1.6"/>',
    global: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    cap: '<path d="M2 9l10-4 10 4-10 4L2 9Z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/><path d="M22 9v5"/>',
    strategy: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',
    funnel: '<path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z"/>',
  };
  function svg(name) {
    return '<svg viewBox="0 0 24 24">' + (ICONS[name] || "") + "</svg>";
  }

  /* ---------- Obsidian 风格生态网络图 ---------- */
  const GRAPH = {
    nodes: [
      { id: "me", label: "李鍵宇", x: 500, y: 200, r: 22, c: "#1d2129", href: "#about" },
      { id: "external", label: "校外任职", x: 220, y: 90, r: 14, c: "#3370ff", href: "#ecosystem" },
      { id: "internal", label: "校内任职", x: 190, y: 200, r: 14, c: "#7c5cff", href: "#ecosystem" },
      { id: "endorse", label: "生态背书", x: 220, y: 310, r: 14, c: "#0ea5a4", href: "#ecosystem" },
      { id: "ecosystem", label: "零予生态", x: 780, y: 90, r: 16, c: "#3370ff", href: "#/p/ecosystem" },
      { id: "ktsa", label: "KTSA", x: 890, y: 200, r: 15, c: "#7c5cff", href: "#/p/ktsa" },
      { id: "business", label: "零予商学", x: 780, y: 310, r: 15, c: "#0ea5a4", href: "#/p/business" },
      { id: "traffic", label: "流量池", x: 620, y: 335, r: 14, c: "#f97316", href: "#/p/traffic" },
    ],
    edges: [
      ["me", "ecosystem"],["me", "ktsa"],["me", "business"],["me", "traffic"],
      ["me", "external"],["me", "internal"],["me", "endorse"],
      ["business", "traffic"],["traffic", "endorse"],
    ],
  };

  function networkSVG() {
    const W = 1000, H = 560;
    const nodes = GRAPH.nodes;
    const byId = {};
    nodes.forEach(function (n) { byId[n.id] = n; });

    let s = '<svg class="obsidian-graph" viewBox="0 0 ' + W + " " + H + '" data-graph>';
    s += '<g class="edges">';
    GRAPH.edges.forEach(function (e) {
      const a = byId[e[0]], b = byId[e[1]];
      s += '<line class="edge" data-a="' + e[0] + '" data-b="' + e[1] + '" x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '"/>';
    });
    s += "</g>";
    nodes.forEach(function (n, i) {
      s += '<g class="g-node" data-id="' + n.id + '" data-href="' + (n.href || "") + '" style="--delay:' + (i * 0.45) + 's">' +
           '<circle class="g-circle" cx="' + n.x + '" cy="' + n.y + '" r="' + n.r + '" style="--c:' + n.c + ';--raw-r:' + n.r + 'px"/>' +
           '<text class="g-label" data-edit="graph.' + n.id + '" x="' + n.x + '" y="' + (n.y + n.r + 22) + '" text-anchor="middle">' + tx("graph." + n.id, n.label) + "</text>" +
           "</g>";
    });
    s += "</svg>";
    return s;
  }

  function bindGraphClicks() {
    const graph = document.querySelector("[data-graph]");
    if (!graph) return;
    const byId = {};
    GRAPH.nodes.forEach(function (n) { byId[n.id] = n; });
    const offsets = {};
    let moved = false;
    let drag = null;

    graph.addEventListener("click", function (e) {
      if (document.body.classList.contains("editing")) return;
      if (moved) { moved = false; return; }
      const g = e.target.closest(".g-node");
      if (!g) return;
      const href = g.getAttribute("data-href");
      if (!href) return;
      if (href.startsWith("#/p/")) { location.hash = href; }
      else if (href.startsWith("#")) {
        const id = href.slice(1);
        location.hash = "#/";
        setTimeout(function () {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
      }
    });
    graph.addEventListener("mouseover", function (e) {
      const g = e.target.closest(".g-node");
      if (!g) return;
      const id = g.getAttribute("data-id");
      graph.querySelectorAll(".g-node").forEach(function (n) {
        n.classList.toggle("dim", n.getAttribute("data-id") !== id && !isNeighbor(id, n.getAttribute("data-id")));
      });
      graph.querySelectorAll(".edge").forEach(function (l) {
        l.classList.toggle("dim", l.getAttribute("data-a") !== id && l.getAttribute("data-b") !== id);
      });
    });
    graph.addEventListener("mouseout", function () {
      graph.querySelectorAll(".dim").forEach(function (n) { n.classList.remove("dim"); });
    });

    /* ---------- 节点拖拽（mouse 事件，兼容性更好） ---------- */
    graph.addEventListener("mousedown", function (e) {
      if (document.body.classList.contains("editing")) return;
      if (e.button !== 0) return;
      const g = e.target.closest(".g-node");
      if (!g) return;
      e.preventDefault();
      drag = { id: g.getAttribute("data-id"), g: g, sx: e.clientX, sy: e.clientY };
    });
    graph.addEventListener("mousemove", function (e) {
      if (!drag) return;
      if (Math.abs(e.clientX - drag.sx) + Math.abs(e.clientY - drag.sy) > 4) moved = true;
      const off = offsets[drag.id] || (offsets[drag.id] = { x: 0, y: 0 });
      off.x = (e.clientX - drag.sx) / graph.clientWidth * 1000;
      off.y = (e.clientY - drag.sy) / graph.clientHeight * 560;
      const n = byId[drag.id];
      const nx = n.x + off.x, ny = n.y + off.y;
      drag.g.querySelector(".g-circle").setAttribute("cx", nx);
      drag.g.querySelector(".g-circle").setAttribute("cy", ny);
      drag.g.querySelector(".g-label").setAttribute("x", nx);
      drag.g.querySelector(".g-label").setAttribute("y", ny + n.r + 22);
      graph.querySelectorAll(".edge").forEach(function (l) {
        const a = l.getAttribute("data-a"), b = l.getAttribute("data-b");
        if (a !== drag.id && b !== drag.id) return;
        const pa = byId[a], pb = byId[b];
        const oa = offsets[a] || { x: 0, y: 0 }, ob = offsets[b] || { x: 0, y: 0 };
        l.setAttribute("x1", pa.x + oa.x);
        l.setAttribute("y1", pa.y + oa.y);
        l.setAttribute("x2", pb.x + ob.x);
        l.setAttribute("y2", pb.y + ob.y);
      });
    });
    document.addEventListener("mouseup", function () { drag = null; });
    graph.addEventListener("mouseleave", function () { drag = null; });
  }

  function isNeighbor(a, b) {
    return GRAPH.edges.some(function (e) { return (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a); });
  }

  /* ---------- 区块标题 ---------- */
  function secHead(num, key, label) {
    return (
      '<div class="section-head reveal">' +
        '<div class="sec-num">' + num + "</div>" +
        '<div class="sec-bar"></div>' +
        '<div class="sec-label-t" data-edit="' + key + '">' + tx(key, label) + "</div>" +
      "</div>"
    );
  }

  /* ---------- 首页 ---------- */
  function renderHome() {
    const P = window.PROFILE;
    const projects = window.PROJECTS;

    /* 跑马灯：直接写进首页模板，随 renderHome 一起重生，不再依赖 JS 注入/观察者（避免切换页面后失效停跑） */
    const mqBlock = '<div class="mq-block"><span>LinkYou</span><span class="sep"></span><img class="mq-logo" src="assets/linkyou-logo.png?v=20260830" alt="LinkYou"/><span class="sep"></span><span>Marketing</span><span class="sep"></span><span>零予控股</span><span class="sep"></span></div>';
    let mqBlocks = "";
    for (let i = 0; i < 6; i++) mqBlocks += mqBlock;
    const marqueeBar = '<div class="marquee-bar"><div class="mq-track">' + mqBlocks + '</div></div>';

    const heroCard = P.heroCard.map(function (r, i) {
      return '<div class="hc-row"><div class="hc-k" data-edit="heroCard.' + i + '.k">' + tx("heroCard." + i + ".k", r.k) + '</div><div class="hc-v" data-edit="heroCard.' + i + '.v">' + tx("heroCard." + i + ".v", r.v) + "</div></div>";
    }).join("");

    const bonjour = P.bonjour;
    const bonjourBlock = bonjour
      ? '<a class="bonjour-link" data-bonjour href="' + bonjour.url + '">'
        + '<span class="bj-ic">' + svg("bizcard") + '</span>'
        + '<span class="bj-tx"><span class="bj-t">' + tx("profile.bonjour", bonjour.label) + '</span><span class="bj-s">微信小程序 · 点击查看</span></span>'
        + '<span class="bj-go">' + svg("arrow") + '</span>'
        + '</a>'
      : "";

    const aboutP = P.aboutP.map(function (t, i) { return '<p class="prose reveal" data-edit="aboutP.' + i + '">' + tx("aboutP." + i, t) + "</p>"; }).join("");
    const habits = (P.habits || []).map(function (h, i) {
      return '<div class="habit reveal" data-edit="habit.' + i + '">' + tx("habit." + i, h) + '</div>';
    }).join("");
    const kpis = P.kpis.map(function (f, i) {
      return '<div class="kpi reveal"><div class="k" data-edit="kpi.' + i + '.k">' + tx("kpi." + i + ".k", f.k) + '</div><div class="v" data-edit="kpi.' + i + '.v">' + tx("kpi." + i + ".v", f.v) + "</div></div>";
    }).join("");

    const timeline = window.JOURNEY.map(function (j, i) {
      return (
        '<div class="tl-item reveal">' +
          '<div class="tl-dot"></div>' +
          '<div class="tl-body"><div class="tl-year" data-edit="journey.' + i + '.year">' + tx("journey." + i + ".year", j.year) + '</div>' +
          '<h4 data-edit="journey.' + i + '.title">' + tx("journey." + i + ".title", j.title) + '</h4>' +
          '<p data-edit="journey.' + i + '.desc">' + tx("journey." + i + ".desc", j.desc) + '</p></div>' +
        "</div>"
      );
    }).join("");

    const skills = window.SKILLS.map(function (s, i) {
      return (
        '<div class="ability reveal">' +
          '<div class="ab-top"><div class="ab-icon">' + svg(s.icon) + '</div>' +
          '<div class="ab-num">' + String(i + 1).padStart(2, "0") + '</div></div>' +
          '<h4 data-edit="skill.' + i + '.title">' + tx("skill." + i + ".title", s.title) + '</h4>' +
          '<p data-edit="skill.' + i + '.desc">' + tx("skill." + i + ".desc", s.desc) + '</p>' +
        '</div>'
      );
    }).join("");

    const cards = projects.filter(function (p) { return !p.hidden; }).map(function (p) {
      const icon = p.slug === "ecosystem" ? "global" : p.slug === "ktsa" ? "strategy" : p.slug === "business" ? "cap" : "funnel";
      const disabled = !!p.disabled;
      const badge = disabled ? '<span class="card-badge">筹备中</span>' : "";
      const goText = disabled ? "板块筹备中，敬请期待" : "查看完整介绍";
      return (
        '<article class="card reveal' + (disabled ? " card--disabled" : "") + '" data-slug="' + p.slug + '"' + (disabled ? ' data-disabled="1"' : "") + '>' +
          '<div class="card-top">' +
            '<div class="card-icon" style="--c:' + p.accent + '">' + svg(icon) + '</div>' +
            '<div><div class="card-tag" style="color:' + p.accent + '" data-edit="project.' + p.slug + '.tag">' + tx("project." + p.slug + ".tag", p.en) + '</div>' +
            '<h3 data-edit="project.' + p.slug + '.name">' + tx("project." + p.slug + ".name", p.name) + badge + '</h3></div>' +
          '</div>' +
          '<p class="card-line" data-edit="project.' + p.slug + '.oneLine">' + tx("project." + p.slug + ".oneLine", p.oneLine) + '</p>' +
          '<span class="card-go" style="color:' + p.accent + '">' + goText + svg("arrow") + '</span>' +
        '</article>'
      );
    }).join("");

    const roles = window.ROLES.map(function (g, gi) {
      const items = g.items.map(function (it, ii) {
        const sub = it.b ? '<div class="role-b" data-edit="role.' + gi + '.item.' + ii + '.b">' + tx("role." + gi + ".item." + ii + ".b", it.b) + '</div>' : "";
        const more = it.d ? '<p class="role-d" data-edit="role.' + gi + '.item.' + ii + '.d">' + tx("role." + gi + ".item." + ii + ".d", it.d) + '</p>' : "";
        return '<div class="role-item"><div class="role-t" data-edit="role.' + gi + '.item.' + ii + '.t">' + tx("role." + gi + ".item." + ii + ".t", it.t) + '</div>' + sub + more + '</div>';
      }).join("");
      return (
        '<div class="role-card role-card--' + gi + ' reveal"><div class="role-title" data-edit="role.' + gi + '.title">' + tx("role." + gi + ".title", g.title) + '</div><div class="role-items' + (gi === 2 ? ' role-items--single' : '') + '">' + items + '</div></div>'
      );
    }).join("");

    const honorGroups = (window.HONORS || []).map(function (g, gi) {
      const lis = g.items.map(function (it, ii) {
        return '<li data-edit="honor.' + gi + '.' + ii + '">' + tx("honor." + gi + "." + ii, it) + '</li>';
      }).join("");
      return '<div class="honor-group reveal"><div class="honor-g-t" data-edit="honor.' + gi + '.g">' + tx("honor." + gi + ".g", g.group) + '</div><ul>' + lis + '</ul></div>';
    }).join("");
    const certChips = (window.CERTS || []).map(function (c, i) {
      return '<span class="cert-chip reveal" data-edit="cert.' + i + '">' + tx("cert." + i, c) + '</span>';
    }).join("");

    const foot = P.contacts.map(function (c, i) {
      return '<a class="foot-chip"><span class="d"></span><span data-edit="contact.' + i + '">' + tx("contact." + i, c.label) + '</span></a>';
    }).join("");

    return (
      '<section class="hero">' +
        '<div class="wrap hero-inner">' +
          '<div class="hero-main">' +
            '<div class="badge reveal" data-edit="profile.badge">' + tx("profile.badge", P.badge) + '</div>' +
            '<h1 class="reveal" data-edit="profile.name">' + tx("profile.name", P.name) + '<span class="en" data-edit="profile.en">' + tx("profile.en", P.en) + "  ·  " + '<span data-edit="profile.role">' + tx("profile.role", P.role) + '</span></span></h1>' +
            '<div class="accent-rule reveal"></div>' +
            '<div class="tagline reveal" data-edit="profile.tagline">' + tx("profile.tagline", P.tagline) + '</div>' +
            '<div class="cta-row reveal">' +
              '<a class="btn btn-primary" href="#projects">查看核心项目 ' + svg("arrow") + '</a>' +
              '<a class="btn btn-ghost" href="#contact">联系我</a>' +
            '</div>' +
          '</div>' +
          '<div class="hero-side reveal"><div class="hero-card"><div class="hc-head">关键信息</div>' + heroCard + '</div>' + bonjourBlock + '</div>' +
        '</div>' +
      '</section>' +

      marqueeBar +

      '<section class="section alt" id="about">' +
        '<div class="wrap">' +
          secHead("01", "sec.about.label", "关于我 / ABOUT ME") +
          '<h2 class="sec-h reveal" data-edit="sec.about.h">我是谁，我在做什么</h2>' +
          '<div class="about-cols">' +
            '<div class="about-text">' + aboutP + '</div>' +
            '<div class="kpis">' + kpis + '</div>' +
          '</div>' +
          '<div class="habit-grid">' + habits + '</div>' +
        '</div>' +
      '</section>' +

      '<section class="section" id="journey">' +
        '<div class="wrap">' +
          secHead("02", "sec.journey.label", "成长轨迹 / JOURNEY") +
          '<h2 class="sec-h reveal" data-edit="sec.journey.h">关键节点</h2>' +
          '<p class="sec-sub reveal" data-edit="sec.journey.sub">从中学到创业，按时间线记录关键节点。</p>' +
          '<div class="timeline">' + timeline + '</div>' +
        '</div>' +
      '</section>' +

      '<section class="section" id="projects">' +
        '<div class="wrap">' +
          secHead("03", "sec.projects.label", "核心项目 / PROJECTS") +
          '<h2 class="sec-h reveal" data-edit="sec.projects.h">四个核心项目</h2>' +
          '<p class="sec-sub reveal" data-edit="sec.projects.sub">零予生态、KTSA、零予AI商学体系、新生流量池——点击任意卡片查看完整介绍。</p>' +
          '<div class="cards">' + cards + '</div>' +
        '</div>' +
      '</section>' +

      '<section class="section alt" id="skills">' +
        '<div class="wrap">' +
          secHead("04", "sec.skills.label", "核心能力 / SKILLS") +
          '<h2 class="sec-h reveal" data-edit="sec.skills.h">六项核心能力</h2>' +
          '<p class="sec-sub reveal" data-edit="sec.skills.sub">团队组织、品牌宣传、公开表达、文艺素养、商业运营、AI 产品——六项能力都来自真实做过的事。</p>' +
          '<div class="ability-grid">' + skills + '</div>' +
        '</div>' +
      '</section>' +

      '<section class="section" id="ecosystem">' +
        '<div class="wrap">' +
          secHead("05", "sec.ecosystem.label", "生态与任职 / ECOSYSTEM") +
          '<h2 class="sec-h reveal" data-edit="sec.ecosystem.h">任职与关系网络</h2>' +
          '<p class="sec-sub reveal" data-edit="sec.ecosystem.sub">校外任职、校内任职、生态背书与创业项目之间的关系网络。</p>' +
          '<div class="eco-wrap">' +
            '<div class="role-grid">' + roles + '</div>' +
            '<div class="eco-viz reveal">' + networkSVG() + '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="section alt" id="honors">' +
        '<div class="wrap">' +
          secHead("06", "sec.honors.label", "荣誉与证书 / HONORS") +
          '<h2 class="sec-h reveal" data-edit="sec.honors.h">中学时期的奖项与证书</h2>' +
          '<p class="sec-sub reveal" data-edit="sec.honors.sub">辩论、管乐、体育、学科四条线的获奖记录与培训证书。</p>' +
          '<div class="honor-grid">' + honorGroups + '</div>' +
          '<div class="cert-card reveal"><div class="cert-title" data-edit="sec.honors.cert">资格证书 / CERTIFICATES</div><div class="cert-list">' + certChips + '</div></div>' +
        '</div>' +
      '</section>' +

      '<footer class="footer" id="contact">' +
        '<div class="wrap">' +
          '<div class="footer-brand reveal" data-edit="footer.brand">李鍵宇 / Rain Li</div>' +
          '<h2 class="reveal" data-edit="footer.h2">晚安，祝好梦</h2>' +
          '<p class="reveal" data-edit="footer.p">合作 · 实习 · 项目共建</p>' +
          '<div class="foot-chips reveal">' + foot + '</div>' +
          '<div class="foot-note" data-edit="footer.note">© 2026 基于 Obsidian 自生长知识库构建 · Crafted with WorkBuddy <span class="ver-tag">v20261220</span></div>' +
        '</div>' +
      '</footer>'
    );
  }

  /* ---------- 详情页 ---------- */
  function renderDetail(slug) {
    const p = window.PROJECTS.find(function (x) { return x.slug === slug; });
    if (!p) return renderHome();
    const feats = p.highlights.map(function (h, i) {
      return (
        '<div class="feat reveal">' +
          '<div class="feat-top"><div class="feat-icon" style="--c:' + p.accent + '">' + svg(h.icon) + '</div>' +
          "<h4 data-edit=\"project." + p.slug + ".hl." + i + ".title\">" + tx("project." + p.slug + ".hl." + i + ".title", h.title) + "</h4></div>" +
          '<p data-edit="project.' + p.slug + ".hl." + i + '.desc">' + tx("project." + p.slug + ".hl." + i + ".desc", h.desc) + '</p>' +
        '</div>'
      );
    }).join("");
    const initial = p.name.charAt(0);
    return (
      '<div class="wrap detail" style="--c1:' + p.accent + ";--c2:" + p.accent2 + '">' +
        '<a class="detail-back" href="#/">' + svg("back") + " 返回首页</a>" +
        '<div class="detail-hero reveal">' +
          '<div class="detail-mark">' + initial + '</div>' +
          "<div><h1 data-edit=\"project." + p.slug + ".name\">" + tx("project." + p.slug + ".name", p.name) + '</h1>' +
          '<div class="en" data-edit="project.' + p.slug + '.en">' + tx("project." + p.slug + ".en", p.en) + '</div></div>' +
        '</div>' +
        '<p class="lead reveal" data-edit="project.' + p.slug + '.summary">' + tx("project." + p.slug + ".summary", p.summary) + '</p>' +
        '<div class="sec-label reveal">完整介绍</div>' +
        '<div class="detail-grid">' + feats + '</div>' +
      '</div>'
    );
  }

  /* ---------- 路由 ---------- */
  let savedScrollY = 0;
  function route() {
    const h = location.hash || "#/";
    const m = h.match(/^#\/p\/([\w-]+)/);
    const app = document.getElementById("app");
    if (m) {
      const p = window.PROJECTS.find(function (x) { return x.slug === m[1]; });
      if (!p || p.disabled) { location.hash = "#/"; return; }
      savedScrollY = window.scrollY;
      app.innerHTML = renderDetail(m[1]);
      window.scrollTo(0, 0);
    } else {
      app.innerHTML = renderHome();
      bindGraphClicks();
      if (savedScrollY > 0) {
        const target = savedScrollY;
        savedScrollY = 0;
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { window.scrollTo(0, target); });
        });
      } else {
        window.scrollTo(0, 0);
      }
    }
    observeReveal();
    if (document.body.classList.contains("editing")) applyEditable();
  }

  /* ---------- 滚动渐显 ---------- */
  let io;
  function observeReveal() {
    if (io) io.disconnect();
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  }

  /* ---------- 主题（亮色=蓝原版 / 暗色=星空版） ---------- */
  function applyTheme(theme) {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    if (theme === "dark") {
      root.setAttribute("data-tpl", "white");   // 星空皮肤：黑底白字 + 粉色点缀
      if (window.__startStars) window.__startStars();
    } else {
      root.removeAttribute("data-tpl");          // 回到蓝原版
      if (window.__stopStars) window.__stopStars();
    }
    localStorage.setItem("rainli-theme", theme);
    const btn = document.getElementById("themeBtn");
    if (btn) btn.innerHTML = svg(theme === "dark" ? "sun" : "moon");
  }
  function initTheme() {
    const saved = localStorage.getItem("rainli-theme");
    const theme = saved || "light";               // 默认亮色（蓝原版）
    applyTheme(theme);
    const btn = document.getElementById("themeBtn");
    btn.addEventListener("click", function () {
      const cur = document.documentElement.getAttribute("data-theme");
      applyTheme(cur === "dark" ? "light" : "dark");
    });
  }

  /* ---------- 卡片点击（编辑模式下不跳转） ---------- */
  function toast(msg) {
    let t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("show"); }, 2400);
  }

  function openBonjourModal(url) {
    let mask = document.getElementById("bj-mask");
    if (mask) { mask.classList.add("show"); return; }
    mask = document.createElement("div");
    mask.id = "bj-mask";
    mask.className = "bj-mask";
    mask.innerHTML =
      '<div class="bj-modal">' +
        '<button class="bj-close" aria-label="关闭">&times;</button>' +
        '<h3 class="bj-title">Bonjour 小程序名片</h3>' +
        '<div class="bj-qr-wrap"><img class="bj-qr" src="assets/bonjour-qr.png" alt="Bonjour 小程序码" ' +
          'onerror="this.parentNode.classList.add(\'no-qr\');this.style.display=\'none\';"></div>' +
        '<p class="bj-tip">微信内长按上方小程序码即可识别打开；若未显示，请点下方复制链接，再到微信搜索「Bonjour」小程序。</p>' +
        '<button class="bj-copy">复制名片链接</button>' +
      '</div>';
    document.body.appendChild(mask);
    mask.addEventListener("click", function (e) {
      if (e.target === mask || e.target.classList.contains("bj-close")) mask.classList.remove("show");
    });
    mask.querySelector(".bj-copy").addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(
          function () { toast("已复制，请在微信中粘贴或搜索 Bonjour"); },
          function () { toast("复制失败，链接：" + url); }
        );
      } else { toast("链接：" + url); }
    });
    requestAnimationFrame(function () { mask.classList.add("show"); });
  }

  function initClicks() {
    document.getElementById("app").addEventListener("click", function (e) {
      if (document.body.classList.contains("editing")) return;
      const bj = e.target.closest(".bonjour-link");
      if (bj) {
        e.preventDefault();
        openBonjourModal(bj.getAttribute("href"));
        return;
      }
      const card = e.target.closest(".card");
      if (card) {
        if (card.hasAttribute("data-disabled")) {
          toast("该板块正在筹备中，敬请期待");
          return;
        }
        location.hash = "#/p/" + card.getAttribute("data-slug");
      }
    });
  }

  /* ---------- 文字编辑模式 ---------- */
  function applyEditable() {
    document.querySelectorAll("[data-edit]").forEach(function (el) { el.setAttribute("contenteditable", "true"); });
  }
  function clearEditable() {
    document.querySelectorAll("[data-edit]").forEach(function (el) { el.removeAttribute("contenteditable"); });
  }
  function toggleEdit() {
    const on = document.body.classList.toggle("editing");
    const btn = document.getElementById("editBtn");
    const tools = document.getElementById("editTools");
    if (on) { applyEditable(); btn.textContent = "完成编辑"; }
    else { clearEditable(); btn.textContent = "编辑文字"; }
    tools.hidden = !on;
    if (on) document.getElementById("app").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function exportEdits() {
    const blob = new Blob([JSON.stringify(OVERRIDES, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "李鍵宇主页-文字修改.json"; a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function resetEdits() {
    if (!confirm("确定恢复全部默认文字？这会清除你所有的手动修改。")) return;
    OVERRIDES = {};
    try { localStorage.removeItem(LS_KEY); } catch (e) {}
    route();
  }

  function initEdit() {
    document.getElementById("editBtn").addEventListener("click", toggleEdit);
    document.getElementById("etExport").addEventListener("click", exportEdits);
    document.getElementById("etReset").addEventListener("click", resetEdits);
    const fileInput = document.getElementById("etFile");
    document.getElementById("etImport").addEventListener("click", function () { fileInput.click(); });
    fileInput.addEventListener("change", function () {
      const f = this.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = function () {
        try {
          const obj = JSON.parse(r.result);
          OVERRIDES = Object.assign({}, OVERRIDES, obj);
          saveEdits();
          route();
        } catch (e) { alert("文件格式错误，请导入导出的 JSON 文件"); }
      };
      r.readAsText(f);
      this.value = "";
    });
    // 实时保存任何被编辑的文字
    document.addEventListener("input", function (e) {
      const t = e.target;
      if (t.hasAttribute && t.hasAttribute("data-edit")) {
        OVERRIDES[t.getAttribute("data-edit")] = t.textContent;
        saveEditsDebounced();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme(); initClicks(); initEdit();
    window.addEventListener("hashchange", route);
    route();
  });

})();
