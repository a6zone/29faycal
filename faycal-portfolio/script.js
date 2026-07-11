/* FAYÇAL — interactions
   The page behaves like a timeline: the playhead (top bar + timecode)
   scrubs as you scroll, and the statement reveals word by word.
   Trilingual: EN / AR (RTL) / FR. */

(() => {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const RUNTIME = 180; // the page's "runtime" in seconds
  const FPS = 24;
  const arabic = /[؀-ۿ]/;

  /* ---------- translations ---------- */
  // keys whose values contain markup and are set via innerHTML
  const HTML_KEYS = new Set(["aboutTag", "tagsCreative", "tagsAdmin", "tagsTransfer"]);

  const I18N = {
    en: {
      navAbout: "About", navSkills: "Skills", navWork: "Work", navContact: "Contact", navCta: "My Drive",
      heroL1: "VIDEO", heroL2: "EDITOR",
      flipRole: "VIDEO EDITOR 🎥",
      eyeAbout: "ABOUT", eyeSkills: "SKILLS", eyeReel: "SHOWREEL", eyeContact: "CONTACT",
      hello: "Hello!",
      aboutTag: "I'm Fayçal,<br>Video Editor 🎥",
      aboutP1: "I'm a video editor born in November 1998, offering creative and administrative support, from brainstorming ideas and content creation to keeping every project organized and on schedule.",
      aboutP2: "I cut everything in DaVinci Resolve, and all of my work lives in one open folder for you to browse.",
      btnDrive: "My Google Drive", btnShorts: "Watch my shorts",
      statement: "From brainstorming ideas to the final cut, I turn creative thinking into content that looks good, reads well, and stays organized.",
      skillsTitle: "Skills",
      skillCreative: "Creative", skillAdmin: "Production", skillTransfer: "Workflow", skillTools: "What I use",
      tagsCreative: "Brainstorming ideas <i>•</i> Content creation (writing, editing) <i>•</i> Maintaining a visually appealing space",
      tagsAdmin: "Organization (scheduling, filing) <i>•</i> Communication (written &amp; verbal) <i>•</i> Office software (email, project management)",
      tagsTransfer: "Problem-solving <i>•</i> Time management <i>•</i> Interpersonal skills",
      reelL1: "The", reelL2: "showreel.", reelHint: "DRAG · SCROLL · ARROWS", viewProject: "View project", featKind: "FILM · 16:9",
      featDesc: "A full-length film shot and edited by Fayçal, best watched full-screen.",
      viewChannel: "View channel",
      kind1: "ART FILM · 9:16", kind2: "COMMERCIAL · 9:16", kind3: "REVIEW · 9:16",
      title2: "Starbucks Promo", title3: "Match Perfume",
      desc1: "A short-form video documenting the full making process of an original art piece called The Orange Helén.",
      desc2: "A full promotional video for a Starbucks branch, featuring a limited-time discount offer on their signature coffee cup.",
      desc3: "Filmed the experience and presented everything on camera in a casual style, sharing an honest recommendation.",
      footL1: "Let's", footL2: "talk.",
      footSub: "Have a project in mind? Send a message, or browse everything in one place.",
      footBottom: "© 2026 by FAYCAL · CUT ON DAVINCI RESOLVE"
    },
    ar: {
      navAbout: "نبذة", navSkills: "المهارات", navWork: "الأعمال", navContact: "تواصل", navCta: "ملفاتي",
      heroL1: "صانع", heroL2: "أفلام إعلانية",
      flipRole: "صانع أفلام 🎥",
      eyeAbout: "نبذة", eyeSkills: "المهارات", eyeReel: "شريط الأعمال", eyeContact: "تواصل",
      hello: "مرحباً!",
      aboutTag: "أنا فيصل،<br>صانع أفلام 🎥",
      aboutP1: "أنا محرر فيديو من مواليد نوفمبر 1998، أقدم دعماً إبداعياً وإدارياً، من العصف الذهني وصناعة المحتوى إلى إبقاء كل مشروع منظماً وفي موعده.",
      aboutP2: "أعمل المونتاج بالكامل على DaVinci Resolve، وكل أعمالي في مجلد واحد مفتوح لتصفّحه.",
      btnDrive: "ملفاتي على Google Drive", btnShorts: "شاهد مقاطعي",
      statement: "من العصف الذهني إلى المونتاج النهائي، أحوّل التفكير الإبداعي إلى محتوى جميل الشكل، واضح الرسالة، ومنظم دائماً.",
      skillsTitle: "المهارات",
      skillCreative: "الإبداعية", skillAdmin: "الإنتاج", skillTransfer: "سير العمل", skillTools: "أدواتي",
      tagsCreative: "العصف الذهني <i>•</i> صناعة المحتوى (كتابة وتحرير) <i>•</i> الحفاظ على مساحة جذابة بصرياً",
      tagsAdmin: "التنظيم (جدولة وأرشفة) <i>•</i> التواصل (كتابي وشفهي) <i>•</i> برامج المكتب (البريد، إدارة المشاريع)",
      tagsTransfer: "حل المشكلات <i>•</i> إدارة الوقت <i>•</i> مهارات التواصل",
      reelL1: "شريط", reelL2: "الأعمال", reelHint: "اسحب أو مرّر", viewProject: "شاهد المشروع", featKind: "فيلم · 16:9",
      featDesc: "فيلم كامل تصويرُ ومونتاجُ فيصل، يُشاهَد بملء الشاشة.",
      viewChannel: "قناتي",
      kind1: "فيلم فني · 9:16", kind2: "إعلان · 9:16", kind3: "مراجعة · 9:16",
      title2: "إعلان ستاربكس", title3: "عطر ماتش",
      desc1: "فيديو قصير يوثّق مراحل صناعة قطعة فنية أصلية بعنوان The Orange Helén.",
      desc2: "فيديو ترويجي كامل لفرع ستاربكس، يعرض خصماً لفترة محدودة على كوب قهوتهم المميز.",
      desc3: "صوّرت التجربة وقدّمت كل شيء أمام الكاميرا بأسلوب عفوي، مع توصية صادقة.",
      footL1: "لنتحدث", footL2: "معاً.",
      footSub: "عندك مشروع في بالك؟ أرسل رسالة، أو تصفّح كل شيء في مكان واحد.",
      footBottom: "© 2026 فيصل · مونتاج على DAVINCI RESOLVE"
    },
    fr: {
      navAbout: "À propos", navSkills: "Compétences", navWork: "Projets", navContact: "Contact", navCta: "Mon Drive",
      heroL1: "MONTEUR", heroL2: "VIDÉO",
      flipRole: "MONTEUR VIDÉO 🎥",
      eyeAbout: "À PROPOS", eyeSkills: "COMPÉTENCES", eyeReel: "BANDE DÉMO", eyeContact: "CONTACT",
      hello: "Bonjour !",
      aboutTag: "Je suis Fayçal,<br>monteur vidéo 🎥",
      aboutP1: "Je suis monteur vidéo, né en novembre 1998. J'offre un soutien créatif et administratif, du brainstorming et de la création de contenu à l'organisation de chaque projet, toujours dans les délais.",
      aboutP2: "Je monte tout sur DaVinci Resolve, et l'ensemble de mon travail est réuni dans un dossier ouvert que vous pouvez parcourir.",
      btnDrive: "Mon Google Drive", btnShorts: "Voir mes vidéos",
      statement: "Du brainstorming au montage final, je transforme les idées créatives en contenu soigné, clair et bien organisé.",
      skillsTitle: "Compétences",
      skillCreative: "Créatif", skillAdmin: "Production", skillTransfer: "Flux de travail", skillTools: "Mes outils",
      tagsCreative: "Brainstorming <i>•</i> Création de contenu (rédaction, édition) <i>•</i> Maintien d'un espace visuellement soigné",
      tagsAdmin: "Organisation (planning, classement) <i>•</i> Communication (écrite et orale) <i>•</i> Logiciels bureautiques (email, gestion de projet)",
      tagsTransfer: "Résolution de problèmes <i>•</i> Gestion du temps <i>•</i> Relationnel",
      reelL1: "Bande", reelL2: "démo.", reelHint: "GLISSEZ · DÉFILEZ", viewProject: "Voir le projet", featKind: "FILM · 16:9",
      featDesc: "Un film complet tourné et monté par Fayçal, à regarder en plein écran.",
      viewChannel: "Voir la chaîne",
      kind1: "FILM D'ART · 9:16", kind2: "PUBLICITÉ · 9:16", kind3: "AVIS · 9:16",
      title2: "Promo Starbucks", title3: "Parfum Match",
      desc1: "Une vidéo courte documentant tout le processus de création d'une œuvre originale, The Orange Helén.",
      desc2: "Une vidéo promotionnelle complète pour une succursale Starbucks, avec une offre de réduction à durée limitée sur leur gobelet signature.",
      desc3: "J'ai filmé l'expérience et tout présenté face caméra, dans un style décontracté, avec un avis honnête.",
      footL1: "Discutons", footL2: "ensemble.",
      footSub: "Un projet en tête ? Envoyez un message, ou parcourez tout au même endroit.",
      footBottom: "© 2026 FAYCAL · MONTÉ SUR DAVINCI RESOLVE"
    }
  };

  /* ---------- rolling letter links ---------- */
  // Arabic script is cursive: splitting letters breaks their joined forms,
  // so Arabic strings are set as plain text with no roll effect.
  const splitRoll = (el, text) => {
    el.textContent = "";
    el.setAttribute("aria-label", text);
    // split Latin letters are inline-blocks: they'd lay out reversed in an
    // RTL page, so split rolls always run LTR
    el.classList.toggle("roll--ltr", !arabic.test(text));
    if (arabic.test(text)) { el.textContent = text; return; }
    [...text].forEach((ch, i) => {
      const s = document.createElement("span");
      s.className = "ch";
      s.setAttribute("data-ch", ch);
      s.setAttribute("aria-hidden", "true");
      s.style.setProperty("--d", `${i * 0.022}s`);
      s.textContent = ch === " " ? " " : ch;
      el.appendChild(s);
    });
  };

  /* ---------- statement word split ---------- */
  const statement = document.getElementById("statementText");
  let words = [];
  const splitStatement = (text) => {
    if (!statement) return;
    statement.textContent = "";
    text.trim().split(/\s+/).forEach((w, i, arr) => {
      const s = document.createElement("span");
      s.className = "w";
      s.textContent = w;
      statement.appendChild(s);
      if (i < arr.length - 1) statement.appendChild(document.createTextNode(" "));
    });
    words = [...statement.querySelectorAll(".w")];
  };

  /* ---------- scroll reveals ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
  );
  document.querySelectorAll(".reveal, .section-title .mask, .footer__title .mask").forEach((el) => io.observe(el));

  /* ---------- timecodes ---------- */
  const fmt = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const f = Math.floor((sec % 1) * FPS);
    const p = (n) => String(n).padStart(2, "0");
    return `${p(m)}:${p(s)}:${p(f)}`;
  };

  // each section eyebrow shows the timecode where the playhead will read it
  const stampSectionTimecodes = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    document.querySelectorAll("[data-tc]").forEach((el) => {
      const label = el.getAttribute("data-label") || el.textContent.replace(/^[\d:]+\s*\/\s*/, "");
      el.setAttribute("data-label", label);
      const y = Math.min(el.getBoundingClientRect().top + scrollY - innerHeight * 0.35, max);
      const tc = fmt(Math.max(0, (y / max) * RUNTIME));
      el.textContent = `${tc.slice(0, 5)} / ${label}`;
    });
  };

  /* ---------- playhead + parallax + word scrub ---------- */
  const bar = document.getElementById("playheadBar");
  const tcOut = document.getElementById("playheadTc");
  const heroTc = document.getElementById("heroTc");
  const portrait = document.getElementById("heroPortrait");
  const flipEl = portrait?.querySelector(".flip");
  const statementSection = document.getElementById("statement");

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(scrollY / max, 1) : 0;

      bar.style.width = `${p * 100}%`;
      const tc = fmt(p * RUNTIME);
      tcOut.textContent = tc;
      if (heroTc) heroTc.textContent = tc;

      if (portrait && !reduceMotion) {
        portrait.style.transform = `translateY(${Math.min(scrollY, innerHeight) * 0.08}px)`;
      }

      // the portrait turns over as you scroll through the hero
      if (flipEl && !reduceMotion) {
        const fp = Math.min(Math.max(scrollY / (innerHeight * 0.6), 0), 1);
        flipEl.style.transform = `rotateY(${fp * 180}deg)`;
      }

      if (words.length && statementSection) {
        const r = statementSection.getBoundingClientRect();
        // 0 when the section enters, 1 when its middle passes the upper third
        const prog = Math.min(Math.max((innerHeight * 0.85 - r.top) / (innerHeight * 0.75), 0), 1);
        const lit = prog * words.length;
        words.forEach((w, i) => {
          w.style.opacity = i < Math.floor(lit) ? 1 : i === Math.floor(lit) ? 0.13 + 0.87 * (lit - i) : 0.13;
        });
      }
    });
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", () => { stampSectionTimecodes(); onScroll(); });
  addEventListener("load", () => { stampSectionTimecodes(); onScroll(); });

  /* ---------- language switching ---------- */
  const langSwitch = document.getElementById("langSwitch");
  const applyLang = (lang, persist = true) => {
    const t = I18N[lang] || I18N.en;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const val = t[el.dataset.i18n];
      if (val == null) return;
      if (el.hasAttribute("data-split")) splitRoll(el, val);
      else if (HTML_KEYS.has(el.dataset.i18n)) el.innerHTML = val;
      else el.textContent = val;
      if (el.hasAttribute("data-tc")) el.setAttribute("data-label", val);
    });

    splitStatement(t.statement);
    stampSectionTimecodes();
    onScroll();

    langSwitch?.querySelectorAll("button").forEach((b) =>
      b.classList.toggle("is-active", b.dataset.lang === lang)
    );
    if (persist) { try { localStorage.setItem("faycal-lang", lang); } catch (e) {} }
  };

  langSwitch?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-lang]");
    if (btn) applyLang(btn.dataset.lang);
  });

  /* ---------- language gate (first visit) ---------- */
  const gate = document.getElementById("langGate");
  gate?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-lang]");
    if (!btn) return;
    applyLang(btn.dataset.lang);
    gate.classList.add("is-done");
    setTimeout(() => gate.remove(), 800);
  });

  /* ---------- Dynamic Island nav ---------- */
  const nav = document.getElementById("nav");
  const islandToggle = document.getElementById("islandToggle");
  let islandTimer;
  const setIsland = (open) => {
    if (!nav || open === nav.classList.contains("is-open")) return;
    // the entrance drop must never replay on toggle
    nav.classList.remove("nav--intro");
    nav.classList.toggle("is-open", open);
    if (!open) {
      // closing gets its own settle animation instead of re-entering
      nav.classList.add("is-closing");
      setTimeout(() => nav.classList.remove("is-closing"), 550);
    }
    islandToggle.setAttribute("aria-expanded", String(open));
    clearTimeout(islandTimer);
    // left open untouched: snap back to the pill after 7s
    if (open) islandTimer = setTimeout(() => setIsland(false), 7000);
  };
  islandToggle?.addEventListener("click", () => setIsland(!nav.classList.contains("is-open")));
  // a chosen destination collapses the island again
  nav?.querySelectorAll(".nav__links a").forEach((a) =>
    a.addEventListener("click", () => setIsland(false))
  );
  // tapping anywhere outside closes it
  addEventListener("click", (e) => {
    if (nav && !nav.contains(e.target) && nav.classList.contains("is-open")) setIsland(false);
  });
  addEventListener("keydown", (e) => { if (e.key === "Escape") setIsland(false); });
  // any scroll collapses it
  addEventListener("scroll", () => {
    if (nav?.classList.contains("is-open")) setIsland(false);
  }, { passive: true });

  /* ---------- theme toggle ---------- */
  const themeBtn = document.getElementById("themeToggle");
  themeBtn?.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("faycal-theme", next); } catch (e) {}
  });

  /* ---------- static rolls (email, brand links — same in all languages) ---------- */
  document.querySelectorAll("[data-split]:not([data-i18n])").forEach((el) => splitRoll(el, el.textContent));

  let saved = null;
  try { saved = localStorage.getItem("faycal-lang"); } catch (e) {}
  // no saved language → the gate is up; render EN underneath without persisting
  applyLang(saved && I18N[saved] ? saved : "en", Boolean(saved && I18N[saved]));

  /* ---------- hero stickers: gentle mouse parallax ---------- */
  if (!reduceMotion) {
    const stickers = document.querySelectorAll(".hero__sticker");
    addEventListener("mousemove", (e) => {
      const dx = (e.clientX / innerWidth - 0.5) * 2;
      const dy = (e.clientY / innerHeight - 0.5) * 2;
      stickers.forEach((s, i) => {
        const depth = i ? -10 : 14;
        s.style.translate = `${dx * depth}px ${dy * depth}px`;
      });
    }, { passive: true });
  }

  /* ---------- flying cards: cover-flow project gallery ----------
     A continuous position `pos` (in card units) places every card on a
     3D arc: translate3d + rotateY + scale, all GPU-composited. The four
     projects are doubled into a ring of eight so both sides always look
     endless. Dragging lerps toward the pointer for weight; releasing
     coasts on momentum with friction, then settles softly on a card.
     Clicking any visible card opens it. */
  const stage = document.getElementById("flyStage");
  const flyCam = document.getElementById("flyCam");
  const flyDescs = [...document.querySelectorAll(".fly__desc")];
  const flyIdx = document.getElementById("flyIdx");
  const flyModal = document.getElementById("flyModal");
  const flyBox = document.getElementById("flyBox");
  const flyPoster = document.getElementById("flyPoster");
  const flyPlayerHost = document.getElementById("flyPlayer");

  if (stage && flyCam) {
    const originals = [...flyCam.querySelectorAll(".fly__card")];
    const COUNT = originals.length;
    // double the deck: the ring never shows an empty side
    originals.forEach((c, i) => {
      const d = c.cloneNode(true);
      d.setAttribute("aria-hidden", "true");
      d.style.setProperty("--i", String(i + COUNT));
      d.querySelectorAll("button").forEach((b) => { b.tabIndex = -1; });
      flyCam.appendChild(d);
    });
    const flyCards = [...flyCam.querySelectorAll(".fly__card")];
    const N = flyCards.length;
    const rtl = () => document.documentElement.dir === "rtl";
    let pos = 0, vel = 0, dragPos = 0, snapT = 0;
    let raf = null, dragging = false, moved = false;
    let shownIdx = -1;

    const spacing = () => flyCards[0].offsetWidth * 0.78;

    const render = () => {
      const sp = spacing();
      const dir = rtl() ? -1 : 1;
      flyCards.forEach((card, i) => {
        let o = i - pos;
        o = ((o % N) + N) % N;
        if (o > N / 2) o -= N;                      // nearest wrap: -N/2..N/2
        const x = dir * o * sp;
        // the centered card floats toward the lens; neighbours recede
        const z = (1 - Math.min(Math.abs(o), 1)) * 60 - Math.abs(o) * 170;
        const ry = dir * Math.max(-1, Math.min(1, o)) * -26;
        const sc = Math.max(0.62, 1 - Math.abs(o) * 0.11);
        card.style.transform =
          `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${ry}deg) scale(${sc})`;
        card.style.opacity = String(Math.max(0, 1 - Math.max(0, Math.abs(o) - 1.6) * 0.42));
        card.style.zIndex = String(100 - Math.round(Math.abs(o) * 10));
        card.classList.toggle("is-center", Math.abs(o) < 0.5);
      });
      const idx = ((Math.round(pos) % N) + N) % N % COUNT;
      if (idx !== shownIdx) {
        shownIdx = idx;
        if (flyIdx) flyIdx.textContent = String(idx + 1).padStart(2, "0");
        flyDescs.forEach((d, i) => d.classList.toggle("is-on", i === idx));
      }
    };

    const tick = () => {
      if (dragging) {
        // weighty follow: the deck eases after the pointer
        const prev = pos;
        pos += (dragPos - pos) * 0.3;
        vel = pos - prev;
        render();
        raf = requestAnimationFrame(tick);
        return;
      }
      if (snapT === null) {
        // free coasting with friction — no hard snap
        pos += vel;
        vel *= 0.94;
        if (Math.abs(vel) < 0.006) snapT = Math.round(pos);
      } else {
        // soft magnetic settle onto the nearest card
        const dist = snapT - pos;
        vel += dist * 0.05;
        vel *= 0.84;
        pos += vel;
        if (Math.abs(dist) < 0.002 && Math.abs(vel) < 0.002) {
          pos = snapT; vel = 0; render(); raf = null; return;
        }
      }
      render();
      raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (reduceMotion) { pos = snapT ?? Math.round(pos); vel = 0; render(); return; }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const goTo = (t) => { snapT = t; kick(); };

    /* drag: pointer events cover mouse, touch, and pen. The pointer is
       only captured once a real drag starts — capturing on pointerdown
       would retarget the click to the stage and kill card clicks. */
    let startX = 0, startPos = 0, pointerId = null;
    stage.addEventListener("pointerdown", (e) => {
      if (e.button) return;
      dragging = true; moved = false;
      pointerId = e.pointerId;
      startX = e.clientX; startPos = dragPos = pos;
      snapT = null; vel = 0;
      kick();
    });
    stage.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 7) {
        moved = true;
        stage.classList.add("is-drag");
        try { stage.setPointerCapture(pointerId); } catch (err) {}
      }
      if (moved) dragPos = startPos + (rtl() ? 1 : -1) * -dx / spacing();
    });
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove("is-drag");
      // momentum carries — capped so a flick coasts about two cards
      vel = Math.max(-0.14, Math.min(0.14, vel));
      snapT = Math.abs(vel) < 0.006 ? Math.round(pos) : null;
      kick();
      // this gesture's click fires before the timeout, so it still sees
      // moved=true; later clicks are not eaten
      setTimeout(() => { moved = false; }, 0);
    };
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);

    /* wheel / trackpad: both axes scrub; settle after the gesture rests */
    let wheelTimer;
    stage.addEventListener("wheel", (e) => {
      e.preventDefault();
      if (flyModal && !flyModal.hidden) return;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      pos += (rtl() ? -1 : 1) * d * 0.0028;
      snapT = null; vel = 0;
      render();
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => goTo(Math.round(pos)), 150);
    }, { passive: false });

    /* keyboard */
    addEventListener("keydown", (e) => {
      if (flyModal && !flyModal.hidden) return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const step = (e.key === "ArrowRight" ? 1 : -1) * (rtl() ? -1 : 1);
      goTo(Math.round(snapT ?? pos) + step);
    });

    /* ---------- full-screen player with a shared-element FLIP ---------- */
    let ytApi = null, player = null, openCard = null;
    const loadYT = () =>
      ytApi ||= new Promise((res, rej) => {
        if (window.YT?.Player) return res(window.YT);
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        window.onYouTubeIframeAPIReady = () => res(window.YT);
        tag.onerror = () => { ytApi = null; rej(new Error("yt api blocked")); };
        setTimeout(() => { ytApi = null; rej(new Error("yt api timeout")); }, 3500);
        document.head.appendChild(tag);
      });

    const modalRect = (aspect) => {
      const vw = innerWidth, vh = innerHeight;
      const ar = aspect === "wide" ? 16 / 9 : 9 / 16;
      const w = Math.min(vw * 0.92, vh * 0.88 * ar);
      const h = w / ar;
      return { left: (vw - w) / 2, top: (vh - h) / 2, width: w, height: h };
    };

    const openModal = (card) => {
      if (!flyModal || openCard) return;
      openCard = card;
      const from = card.getBoundingClientRect();
      const to = modalRect(card.dataset.aspect);
      flyPoster.src = card.querySelector("img").src;
      Object.assign(flyBox.style, {
        left: `${to.left}px`, top: `${to.top}px`,
        width: `${to.width}px`, height: `${to.height}px`,
        transform: reduceMotion ? "none" : `translate(${from.left - to.left}px, ${from.top - to.top}px) ` +
          `scale(${from.width / to.width}, ${from.height / to.height})`,
      });
      flyModal.hidden = false;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => requestAnimationFrame(() => {
        flyModal.classList.add("is-in");
        flyBox.style.transform = "none";
      }));
      // the click that opened the modal is the user gesture: sound allowed
      loadYT().then((YT) => {
        if (!openCard) return;
        const host = document.createElement("div");
        flyPlayerHost.replaceChildren(host);
        player = new YT.Player(host, {
          videoId: card.dataset.video,
          playerVars: { autoplay: 1, playsinline: 1, rel: 0 },
          events: {
            // 0 = ended: close and let the gallery loop onward
            onStateChange: (ev) => { if (ev.data === 0) closeModal(); },
          },
        });
      }).catch(() => {
        // API unreachable: plain embed still plays, without auto-close
        if (!openCard) return;
        const f = document.createElement("iframe");
        f.src = `https://www.youtube.com/embed/${card.dataset.video}?autoplay=1&playsinline=1&rel=0`;
        f.allow = "autoplay; encrypted-media; picture-in-picture";
        f.allowFullscreen = true;
        flyPlayerHost.replaceChildren(f);
      });
    };

    const closeModal = () => {
      if (!flyModal || !openCard) return;
      const card = openCard;
      openCard = null;
      try { player?.destroy(); } catch (e) {}
      player = null;
      flyPlayerHost.replaceChildren();
      flyModal.classList.remove("is-in");
      const from = card.getBoundingClientRect();
      const to = flyBox.getBoundingClientRect();
      flyBox.style.transform = reduceMotion ? "none" :
        `translate(${from.left - to.left}px, ${from.top - to.top}px) ` +
        `scale(${from.width / to.width}, ${from.height / to.height})`;
      document.body.style.overflow = "";
      setTimeout(() => { flyModal.hidden = true; flyPoster.src = ""; }, reduceMotion ? 0 : 560);
    };

    /* any visible card opens directly — no need to center it first */
    stage.addEventListener("click", (e) => {
      if (moved) return;                         // a drag, not a click
      const card = e.target.closest(".fly__card");
      if (!card) return;
      // ease the deck toward the chosen card behind the player
      let o = flyCards.indexOf(card) - pos;
      o = ((o % N) + N) % N;
      if (o > N / 2) o -= N;
      if (Math.abs(o) >= 0.5) goTo(Math.round(pos + o));
      openModal(card);
    });
    document.getElementById("flyClose")?.addEventListener("click", closeModal);
    document.getElementById("flyBackdrop")?.addEventListener("click", closeModal);
    addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

    addEventListener("resize", render);
    render();
  }

})();
