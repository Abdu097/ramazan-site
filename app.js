// ===== CONFIG (осыны ғана өзгертсеңіз болады) =====
const CONTACTS = {
  ustazPhone: "87022739290", // Дәурен ұстаз
  imamPhone: "87074108282",  // Бас имам
};

const START_DATE = "2026-02-19";
const DAYS_COUNT = 30;

const QARI = {
  name: "Жұмағұл Ырысалды",
  note: "Тарауих намазын оқитын қари",
};

// Қай күн алынған / бос емес: осында қоясыз
const TAKEN = {};

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

// extra iOS protection
document.addEventListener("gesturestart", (e) => e.preventDefault());
document.addEventListener("dblclick", (e) => e.preventDefault());
document.addEventListener("touchstart", () => {}, { passive: true });

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
        <td><strong>${d.day}-күн</strong><div class="cellMuted">${esc(d.weekday)}</div></td>
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
  <div class="dayCell__num">${d.day}</div>
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
