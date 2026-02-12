// ===== CONFIG (осыны ғана өзгертсеңіз болады) =====
const CONTACTS = {
  ustazPhone: "87022739290", // Дәурен ұстаз
  imamPhone: "87074108282",  // Бас имам
};

const DAY_NAMES = [
  "бірінші",
  "екінші",
  "үшінші",
  "төртінші",
  "бесінші",
  "алтыншы",
  "жетінші",
  "сегізінші",
  "тоғызыншы",
  "оныншы",
  "он бірінші",
  "он екінші",
  "он үшінші",
  "он төртінші",
  "он бесінші",
  "он алтыншы",
  "он жетінші",
  "он сегізінші",
  "он тоғызыншы",
  "жиырмасыншы",
  "жиырма бірінші",
  "жиырма екінші",
  "жиырма үшінші",
  "жиырма төртінші",
  "жиырма бесінші",
  "жиырма алтыншы",
  "жиырма жетінші",
  "жиырма сегізінші",
  "жиырма тоғызыншы",
  "отызыншы"
];

const START_DATE = "2026-02-19";
const DAYS_COUNT = 30;

const QARI = {
  name: "Жұмағұл Ырысалды",
  note: "Тарауих намазын оқитын қари",
};

// Қай күн алынған / бос емес: осында қоясыз
const TAKEN = {
  1: 100,   // 19.02.2026
  2: 100,   // 20.02.2026
  3: 100,   // 21.02.2026
  4: 100,   // 22.02.2026
  7: 100,   // 25.02.2026
  15: 100,  // 05.03.2026
  21: 100,  // 11.03.2026
  26: 100   // 16.03.2026
};

// ===== helpers =====
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

function normalizeToWa(phone) {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) return "7" + digits.slice(1);
  if (digits.length === 11 && digits.startsWith("7")) return digits;
  return digits;
}
function makeWaLink(phone, text) {
  const p = normalizeToWa(phone);
  return `https://wa.me/${p}?text=${encodeURIComponent(text)}`;
}

const kzMonths = ["қаңтар","ақпан","наурыз","сәуір","мамыр","маусым","шілде","тамыз","қыркүйек","қазан","қараша","желтоқсан"];
const kzWeekdays = ["Жексенбі","Дүйсенбі","Сейсенбі","Сәрсенбі","Бейсенбі","Жұма","Сенбі"];
function formatKzDate(d){ return `${d.getDate()} ${kzMonths[d.getMonth()]}`; }

function esc(s) {
  return (s ?? "").toString().replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}

// ===== protection (күшейтілген) =====
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("copy", (e) => e.preventDefault());
document.addEventListener("cut", (e) => e.preventDefault());
document.addEventListener("paste", (e) => e.preventDefault());
document.addEventListener("dragstart", (e) => e.preventDefault());
document.addEventListener("selectstart", (e) => e.preventDefault());
document.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  const ctrl = e.ctrlKey || e.metaKey;
  if (ctrl && ["c","x","v","s","p","a","u"].includes(k)) e.preventDefault();
  if (e.key === "F12") e.preventDefault();
  if (ctrl && e.shiftKey && ["i","j","c"].includes(k)) e.preventDefault();
});

// iOS gestures: блокируем на сайте, но РАЗРЕШАЕМ внутри lightbox
document.addEventListener("gesturestart", (e) => {
  const lb = document.getElementById("lightbox");
  const opened = lb && lb.classList.contains("is-open");
  if (!opened) e.preventDefault();
}, { passive: false });

// ===== burger (бар болса) =====
const burger = $("#burger");
const nav = $("#nav");
burger?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", String(open));
});
document.addEventListener("click", (e) => {
  const isMobile = window.matchMedia("(max-width: 980px)").matches;
  if (!isMobile) return;
  if (nav?.classList.contains("is-open") && !nav.contains(e.target) && e.target !== burger) {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }
});

// smooth scroll
$$('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (!id || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    nav?.classList.remove("is-open");
    burger?.setAttribute("aria-expanded", "false");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) en.target.classList.add("is-visible"); });
}, { threshold: 0.14 });
$$(".reveal").forEach(el => io.observe(el));

// scroll progress
const fill = $("#scrollFill");
function onScroll(){
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const max = (doc.scrollHeight - doc.clientHeight) || 1;
  const pct = Math.min(100, Math.max(0, (scrollTop / max) * 100));
  if (fill) fill.style.width = pct + "%";
}
window.addEventListener("scroll", onScroll, { passive:true });
onScroll();

// ripple
function addRipple(e){
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX ?? (r.left + r.width/2)) - r.left;
  const y = (e.clientY ?? (r.top + r.height/2)) - r.top;
  const span = document.createElement("span");
  span.className = "ripple";
  span.style.left = `${x}px`;
  span.style.top = `${y}px`;
  el.appendChild(span);
  setTimeout(()=>span.remove(), 750);
}
document.querySelectorAll(".btn, .actionBtn, .waBtn, .dayCell__btn").forEach((b) => b.addEventListener("click", addRipple));

// particles
const particles = $("#particles");
function spawnParticles(count = 26) {
  if (!particles) return;
  particles.innerHTML = "";
  for (let i=0;i<count;i++){
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = `${Math.random()*100}%`;
    p.style.top = `${60 + Math.random()*50}%`;
    p.style.setProperty("--dx", `${(Math.random()-0.5)*80}px`);
    p.style.setProperty("--dur", `${6 + Math.random()*8}s`);
    p.style.animationDelay = `${Math.random()*6}s`;
    particles.appendChild(p);
  }
}
spawnParticles(window.matchMedia("(max-width: 720px)").matches ? 18 : 28);
window.addEventListener("resize", () => {
  spawnParticles(window.matchMedia("(max-width: 720px)").matches ? 18 : 28);
});

// qari text
if ($("#qariName")) $("#qariName").textContent = QARI.name;
if ($("#qariNote")) $("#qariNote").textContent = QARI.note;

// WhatsApp header buttons
if ($("#waImam")) {
  $("#waImam").href = makeWaLink(
    CONTACTS.imamPhone,
    "Ассалаумағалейкүм! Парасат мешітіндегі ауызашарға жазылғым келеді. Күні: ___-күн. Адам саны: ___ адам. Аты-жөнім: ___."
  );
}
if ($("#waUstaz")) {
  $("#waUstaz").href = makeWaLink(
    CONTACTS.ustazPhone,
    "Ассалаумағалейкүм! Парасат мешітіндегі ауызашарға жазылғым келеді. Күні: ___-күн. Адам саны: ___ адам. Аты-жөнім: ___."
  );
}

// build days
function buildDays(){
  const start = new Date(START_DATE + "T00:00:00");
  const arr = [];
  for (let i=0;i<DAYS_COUNT;i++){
    const dt = new Date(start);
    dt.setDate(start.getDate()+i);
    const dayNo = i+1;
    const takenPeople = TAKEN[dayNo];

    arr.push({
      day: dayNo,
      dateText: formatKzDate(dt),
      weekday: kzWeekdays[dt.getDay()],
      status: takenPeople ? "taken" : "free",
      people: takenPeople ? String(takenPeople) : "",
    });
  }
  return arr;
}
const DAYS = buildDays();

function statusBadge(status){
  if (status === "taken") return `<span class="status"><span class="dot dot--taken"></span>Алынған</span>`;
  return `<span class="status"><span class="dot dot--free"></span>Бос</span>`;
}

function waTextForDay(d){
  const dayText = `${d.day}-күн (${d.dateText})`;
  const people = d.people ? `Адам саны: ${d.people} адам. ` : "Адам саны: ___ адам. ";
  return `Ассалаумағалейкүм! Парасат мешітіндегі ауызашарға жазылғым келеді. Күні: ${dayText}. ${people}Аты-жөнім: ___.`;
}

const rows = $("#rows");
const calendar = $("#calendar");

function renderSchedule(){
  if (rows) rows.innerHTML = "";
  if (calendar) calendar.innerHTML = "";

  DAYS.forEach((d) => {
    const peopleHtml = d.people
      ? `<div>${esc(d.people)}</div><div class="cellMuted">адам</div>`
      : "—";

    const desktopBtnText = (d.status === "free") ? "WhatsApp арқылы жазылу" : "Нақтылау (WhatsApp)";
    const linkImam  = makeWaLink(CONTACTS.imamPhone,  waTextForDay(d));
    const linkUstaz = makeWaLink(CONTACTS.ustazPhone, waTextForDay(d));

    // desktop table
    if (rows){
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
  <strong>Рамазанның ${DAY_NAMES[d.day - 1]} күні</strong>
  <div class="cellMuted">${esc(d.weekday)}</div>
</td>
        <td>${esc(d.dateText)}</td>
        <td>${statusBadge(d.status)}</td>
        <td>${peopleHtml}</td>
        <td>
          <a class="actionBtn" href="${linkImam}" target="_blank" rel="noreferrer">${desktopBtnText} (Бас имам)</a>
          <a class="actionBtn" href="${linkUstaz}" target="_blank" rel="noreferrer">${desktopBtnText} (Дәурен ұстаз)</a>
        </td>
      `;
      rows.appendChild(tr);
    }

    // mobile calendar (2 buttons)
    if (calendar){
      const cell = document.createElement("div");
      cell.className = "dayCell " + (d.status === "free" ? "free" : "taken");

      const mobileBtnText = d.status === "free" ? "Жазылу (WhatsApp)" : "Нақтылау (WhatsApp)";

      cell.innerHTML = `
  <div class="dayCell__num">
  Рамазанның ${DAY_NAMES[d.day - 1]} күні
</div>
  <div class="dayCell__date">${esc(d.dateText)}</div>

  <div style="margin-top:6px; font-weight:700;">
    ${d.status === "free" ? 
      '<span style="color:#2de38b">Бос</span>' :
      '<span style="color:#ff5b5b">Бос емес</span>'
    }
  </div>

  <div class="cellMuted">
    ${d.people ? d.people + " адам" : ""}
  </div>

  <div class="dayCell__btns">
    <a class="dayCell__btn" href="${linkImam}">
      ${mobileBtnText} (Имам)
    </a>
    <a class="dayCell__btn" href="${linkUstaz}">
      ${mobileBtnText} (Ұстаз)
    </a>
  </div>
`;

      calendar.appendChild(cell);
    }
  });
}

// year everywhere
if ($("#year")) $("#year").textContent = new Date().getFullYear();

// Only render schedule on schedule page
if (rows || calendar) renderSchedule();

// RAMAZAN poster zoom (no new tab)
(() => {
  const poster = document.getElementById("ramazanPoster");
  const lb = document.getElementById("lightbox");
  const lbClose = document.getElementById("lightboxClose");
  const lbInner = document.getElementById("lightboxInner");

  if (!poster || !lb || !lbClose || !lbInner) return;

  const open = () => {
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
  };

  const close = () => {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
  };

  poster.addEventListener("click", open);
  lbClose.addEventListener("click", close);

  // click outside image closes
  lb.addEventListener("click", (e) => {
    if (e.target === lb) close();
  });

  // Esc closes
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();

// page entrance
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// ===== RAMAZAN IMAGE ZOOM =====

document.addEventListener("DOMContentLoaded", function () {
  const poster = document.getElementById("ramazanPoster");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("lightboxClose");

  if (poster && lightbox) {
    // открыть
    poster.addEventListener("click", function () {
      lightbox.style.display = "flex";
      document.body.style.overflow = "hidden";
    });

    // закрыть по кнопке
    closeBtn.addEventListener("click", function () {
      lightbox.style.display = "none";
      document.body.style.overflow = "auto";
    });

    // закрыть по фону
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) {
        lightbox.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });
  }
});

// ===== LIGHTBOX PINCH-ZOOM (готово) =====
document.addEventListener("DOMContentLoaded", () => {
  const poster = document.getElementById("ramazanPoster");
  const lb = document.getElementById("lightbox");
  const inner = document.getElementById("lightboxInner");
  const img = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("lightboxClose");

  if (!poster || !lb || !inner || !img || !closeBtn) return;

  // iOS: НЕ блокируем жесты, когда открыт lightbox
  document.addEventListener("gesturestart", (e) => {
    const opened = lb.style.display === "flex";
    if (!opened) e.preventDefault();
  }, { passive: false });

  let scale = 1, lastScale = 1;
  let tx = 0, ty = 0;
  let startTx = 0, startTy = 0;

  let isPanning = false;
  let panStartX = 0, panStartY = 0;

  let isPinching = false;
  let startDist = 0;

  let lastTap = 0;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const apply = () => {
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  };

  const reset = () => {
    scale = 1; lastScale = 1;
    tx = 0; ty = 0;
    startTx = 0; startTy = 0;
    apply();
  };

  const open = () => {
    lb.style.display = "flex";
    document.body.style.overflow = "hidden";
    reset();
  };

  const close = () => {
    lb.style.display = "none";
    document.body.style.overflow = "auto";
    reset();
  };

  poster.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });

  const dist = (t1, t2) => {
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.hypot(dx, dy);
  };

  inner.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      // double tap zoom
      const now = Date.now();
      if (now - lastTap < 280) {
        if (scale > 1.05) reset();
        else { scale = 2.2; lastScale = scale; apply(); }
        lastTap = 0;
        e.preventDefault();
        return;
      }
      lastTap = now;

      // pan
      isPanning = true;
      isPinching = false;
      panStartX = e.touches[0].clientX;
      panStartY = e.touches[0].clientY;
      startTx = tx;
      startTy = ty;
    }

    if (e.touches.length === 2) {
      isPinching = true;
      isPanning = false;
      startDist = dist(e.touches[0], e.touches[1]);
    }

    e.preventDefault();
  }, { passive: false });

  inner.addEventListener("touchmove", (e) => {
    if (isPinching && e.touches.length === 2) {
      const d = dist(e.touches[0], e.touches[1]);
      const ratio = d / startDist;
      scale = clamp(lastScale * ratio, 1, 4);
      apply();
      e.preventDefault();
      return;
    }

    if (isPanning && e.touches.length === 1) {
      if (scale <= 1.02) return;
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      tx = startTx + (x - panStartX);
      ty = startTy + (y - panStartY);
      apply();
      e.preventDefault();
    }
  }, { passive: false });

  inner.addEventListener("touchend", () => {
    if (isPinching) { lastScale = scale; isPinching = false; }
    if (isPanning) isPanning = false;
    if (scale <= 1.02) reset();
  });
});
