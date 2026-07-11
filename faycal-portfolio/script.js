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
      reelL1: "The", reelL2: "showreel.", reelHint: "SCROLL TO SCRUB", featKind: "FILM · 16:9",
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
      reelL1: "شريط", reelL2: "الأعمال", reelHint: "مرّر للتقديم", featKind: "فيلم · 16:9",
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
      reelL1: "Bande", reelL2: "démo.", reelHint: "FAITES DÉFILER", featKind: "FILM · 16:9",
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

  /* ---------- showreel: scroll scrubs the clip strip sideways ---------- */
  const reelEl = document.querySelector(".reel");
  const reelTrack = document.getElementById("reelTrack");
  const reelBar = document.getElementById("reelBar");
  const reelIndex = document.getElementById("reelIndex");
  const reelCards = reelTrack ? [...reelTrack.querySelectorAll(".reel__card")] : [];
  let reelTop = 0, reelSpan = 1, reelMax = 0;
  const measureReel = () => {
    if (!reelEl || !reelTrack || reduceMotion) return;
    reelTop = reelEl.getBoundingClientRect().top + scrollY;
    reelSpan = Math.max(reelEl.offsetHeight - innerHeight, 1);
    reelMax = Math.max(reelTrack.scrollWidth - reelTrack.parentElement.clientWidth, 0);
  };
  if (reelEl && reduceMotion) reelEl.classList.add("reel--static");

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

      // showreel scrub: section progress -> horizontal strip position
      if (reelTrack && reelCards.length && !reduceMotion) {
        const rp = Math.min(Math.max((scrollY - reelTop) / reelSpan, 0), 1);
        const rtl = document.documentElement.dir === "rtl";
        reelTrack.style.transform = `translateX(${(rtl ? 1 : -1) * rp * reelMax}px)`;
        if (reelBar) reelBar.style.width = `${rp * 100}%`;
        const live = Math.min(reelCards.length - 1, Math.round(rp * (reelCards.length - 1)));
        reelCards.forEach((c, i) => c.classList.toggle("is-live", i === live));
        if (reelIndex) reelIndex.textContent = String(live + 1).padStart(2, "0");
      }
    });
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", () => { stampSectionTimecodes(); measureReel(); onScroll(); });
  addEventListener("load", () => { stampSectionTimecodes(); measureReel(); onScroll(); });

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
    measureReel();
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

  /* ---------- click-to-play videos ---------- */
  document.querySelectorAll(".card__media").forEach((media) => {
    const play = () => {
      if (media.querySelector("iframe")) return;
      const id = media.dataset.video;
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;
      iframe.allow = "autoplay; encrypted-media; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.title = media.querySelector("img")?.alt || "Video";
      media.appendChild(iframe);
      media.querySelector(".card__play")?.remove();
    };
    media.addEventListener("click", play);
    media.querySelector(".card__play")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); }
    });
  });
})();
