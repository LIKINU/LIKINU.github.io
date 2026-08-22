/* ===== 浮夸素材引擎 v2（原站排版 · 素材库动效合集） ===== */
(function () {
  "use strict";
  var TPL = "white"; // 星空配色方案；是否显示由 <html data-tpl="white"> 控制（仅暗色模式）

  /* ---------- 装饰层 ---------- */
  var decor = document.createElement("div");
  decor.id = "tplDecor";
  decor.innerHTML = '<canvas id="fxCanvas"></canvas><div class="meteors" id="meteors"></div>';
  document.body.appendChild(decor);
  var spot = document.createElement("div");
  spot.id = "spotFx";
  document.body.appendChild(spot);

  /* ---------- 交互粒子场（React Bits 粒子场 · 鼠标推开） ---------- */
  var cvs = decor.querySelector("#fxCanvas"), ctx = cvs.getContext("2d");
  var parts = [], mx = innerWidth / 2, my = innerHeight / 2;
  function pickColor(r) {
    if (TPL === "rose") return r > .82 ? "#ffffff" : (r > .5 ? "#FFD3EC" : (r > .25 ? "#FFB0E0" : "#FF8FD0"));
    if (TPL === "white") return r > .94 ? "#2A6CFF" : (r > .5 ? "#ffffff" : "#ff8fd0");
    return r > .82 ? "#ffffff" : "rgba(190,205,255,1)";
  }
  function makeParts() {
    parts = [];
    for (var i = 0; i < 150; i++) {
      var r = Math.random();
      parts.push({ x: Math.random() * cvs.width, y: Math.random() * cvs.height, r: Math.random() * 1.8 + .4, s: Math.random() * .28 + .06, tw: Math.random() * Math.PI * 2, big: r > .82, color: pickColor(r) });
    }
  }
  var starsOn = document.documentElement.getAttribute("data-theme") === "dark";
  function sizeCanvas() { cvs.width = innerWidth; cvs.height = innerHeight; makeParts(); }
  window.addEventListener("resize", function () { if (starsOn) sizeCanvas(); });
  if (starsOn) sizeCanvas();
  document.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; });
  function loop() {
    if (!starsOn) return;
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    var now = performance.now() / 1000;
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.y -= p.s; if (p.y < -6) { p.y = cvs.height + 6; p.x = Math.random() * cvs.width; }
      var a = .32 + .6 * Math.abs(Math.sin(now * 1.1 + p.tw));
      ctx.beginPath();
      if (p.big) { ctx.shadowColor = p.color; ctx.shadowBlur = 14; }
      ctx.arc(p.x, p.y, p.big ? p.r * 2.1 : p.r, 0, 7);
      ctx.fillStyle = p.color; ctx.globalAlpha = a; ctx.fill();
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }
  }
  window.__startStars = function () { if (starsOn) return; starsOn = true; if (!decor.parentNode) document.body.appendChild(decor); sizeCanvas(); loop(); };
  window.__stopStars = function () { starsOn = false; };
  if (starsOn) loop();

  /* ---------- 流星（Aceternity Meteors） ---------- */
  var metWrap = document.getElementById("meteors");
  for (var mi = 0; mi < 8; mi++) {
    var m = document.createElement("span");
    m.className = "meteor";
    m.style.setProperty("--mx0", (12 + Math.random() * 80) + "vw");
    m.style.setProperty("--my0", (4 + Math.random() * 30) + "%");
    m.style.setProperty("--d", (Math.random() * 3).toFixed(2) + "s");
    m.style.setProperty("--t", (2.2 + Math.random() * 1.6).toFixed(2) + "s");
    metWrap.appendChild(m);
  }

  /* ---------- 聚光灯（Aceternity Spotlight） ---------- */
  document.addEventListener("mousemove", function (e) {
    spot.style.setProperty("--mx", e.clientX + "px");
    spot.style.setProperty("--my", e.clientY + "px");
  });

  /* ---------- 标题特效 ---------- */
  function splitTitle() {
    var h1 = document.querySelector(".hero h1");
    if (!h1 || !h1.childNodes[0]) return null;
    var txt = h1.childNodes[0].textContent;
    if (!txt) return null;
    h1.childNodes[0].textContent = "";
    var frag = document.createDocumentFragment();
    txt.split("").forEach(function (c) {
      var s = document.createElement("span");
      s.className = "lt"; s.textContent = c;
      frag.appendChild(s);
    });
    h1.insertBefore(frag, h1.childNodes[0]);
    return h1.querySelectorAll(".lt");
  }
  function titleScramble() {
    var h1 = document.querySelector(".hero h1");
    if (!h1 || !h1.childNodes[0]) return;
    var txt = h1.childNodes[0].textContent || "";
    h1.childNodes[0].textContent = "";
    var chars = "!<>-_\\/[]{}=+*^?#";
    var frame = 0;
    var queue = txt.split("").map(function (c, i) { return { c: c, start: i * 9, end: i * 9 + 20 }; });
    (function step() {
      var out = "", done = 0;
      queue.forEach(function (q) {
        if (frame >= q.end) { out += q.c; done++; }
        else if (frame >= q.start) out += '<span style="color:#ffd27c">' + chars[Math.floor(Math.random() * chars.length)] + "</span>";
        else out += "&nbsp;&nbsp;";
      });
      h1.childNodes[0].textContent = "";
      var tmp = document.createElement("span");
      tmp.innerHTML = out;
      h1.insertBefore(tmp, h1.childNodes[0]);
      frame++;
      if (done < queue.length) setTimeout(step, 34);
    })();
  }
  function titleFlip() {
    /* 3D 翻转落地（玫红版） */
    var ls = splitTitle();
    if (!ls) return;
    ls.forEach(function (l, i) {
      l.style.cssText = "opacity:0;transform:translateY(46px) rotateX(85deg);transform-origin:bottom;transform-style:preserve-3d";
      setTimeout(function () {
        l.style.cssText = "opacity:1;transform:none;transform-origin:bottom;transition:all .7s cubic-bezier(.22,1.4,.36,1)";
      }, 220 + i * 130);
    });
  }
  function titleCurtain() {
    /* 幕布式展开（黑白版） */
    var ls = splitTitle();
    if (!ls) return;
    ls.forEach(function (l, i) {
      l.style.cssText = "clip-path:inset(0 0 100% 0);opacity:0;transform:translateY(18px)";
      setTimeout(function () {
        l.style.cssText = "clip-path:inset(0 0 0% 0);opacity:1;transform:none;transition:all .55s cubic-bezier(.7,0,.2,1)";
      }, 180 + i * 110);
    });
  }
  document.addEventListener("DOMContentLoaded", function () {
    titleCurtain();
  });

  /* ---------- 磁吸按钮（OriginKit） ---------- */
  function bindMagnetic() {
    document.querySelectorAll(".btn").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * .3 + "px," + (e.clientY - r.top - r.height / 2) * .3 + "px)";
      });
      b.addEventListener("mouseleave", function () { b.style.transform = ""; });
    });
  }

  /* ---------- 3D 倾斜卡片（Aceternity 3D Card） ---------- */
  function bindTilt() {
    document.querySelectorAll(".card, .ability").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = "perspective(700px) rotateY(" + (x * 11) + "deg) rotateX(" + (-y * 11) + "deg) translateZ(10px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- 点击涟漪（Aceternity 交互） ---------- */
  document.addEventListener("click", function (e) {
    if (e.target.closest(".nav")) return;
    var r = document.createElement("span");
    r.className = "ripple";
    r.style.left = e.clientX + "px";
    r.style.top = e.clientY + "px";
    document.body.appendChild(r);
    setTimeout(function () { r.remove(); }, 700);
  });

  /* ---------- Hero 滚动视差（Motion scroll-linked） ---------- */
  /* 无视差 */


  /* ---------- 静态装饰条（Aceternity Infinite Moving 元素 · 无滚动） ---------- */
  function bindMarquee() {
    var hero = document.querySelector(".hero");
    if (!hero || document.querySelector(".marquee-bar")) return;
    var blockHtml = '<div class="mq-block"><span>LinkYou</span><span class="sep"></span><img class="mq-logo" src="assets/linkyou-logo.png?v=20260830" alt="LinkYou"/><span class="sep"></span><span>Marketing</span><span class="sep"></span><span>零予控股</span><span class="sep"></span></div>';
    var blocks = "";
    for (var i = 0; i < 6; i++) { blocks += blockHtml; }
    var bar = document.createElement("div");
    bar.className = "marquee-bar";
    bar.innerHTML = '<div class="mq-track">' + blocks + "</div>";
    hero.after(bar);
  }


  /* ---------- LinkYou logo 注入 ---------- */
  function injectLogo() {
    var dot = document.querySelector(".brand .dot");
    if (!dot || document.querySelector(".brand .dot img")) return;
    var img = document.createElement("img");
    img.src = "assets/linkyou-logo.png?v=20260830";
    img.alt = "LinkYou";
    img.style.cssText = "height:28px;width:auto;display:block;border-radius:8px;padding:3px 4px";
    dot.innerHTML = "";
    dot.style.cssText = "width:auto;height:32px;background:transparent;padding:0;display:flex;align-items:center";
    dot.appendChild(img);
  }



  /* ---------- 初始化（app.js 渲染完成后） ---------- */
  function init() {
    bindMagnetic(); bindTilt(); bindMarquee(); injectLogo();
    document.querySelectorAll(".reveal").forEach(function (el) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.disconnect(); } });
      }, { threshold: .08 });
      io.observe(el);
    });
  }
  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(init, 50);
    var app = document.getElementById("app");
    new MutationObserver(function () { bindMagnetic(); bindTilt(); bindMarquee(); injectLogo(); }).observe(app, { childList: true });
  });
})();
