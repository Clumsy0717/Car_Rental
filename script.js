// ===== DATA =====
const cars = [
  { id: 1, name: "GT-R",       brand: "Nissan",     type: "Sport", price: 8000, color: "#e8e8e8", year: 2026, featured: true,
    desc: "A legend in everyday clothes. Twin-turbo power, all-wheel grip and supercar pace, ready for you to take out for the weekend or longer.",
    stats: [["565 HP","Power"],["6-Speed","Transmission"],["3.8 L","Capacity"],["AWD","Technology"]] },
  { id: 2, name: "Mustang",    brand: "Ford",       type: "Sport", price: 6500, color: "#d71f2b", year: 2026, featured: true,
    desc: "Classic muscle with a modern edge. A loud V8, a low stance and a drive that makes every road feel like a highway movie.",
    stats: [["480 HP","Power"],["10-Speed","Transmission"],["5.0 L","Capacity"],["V8","Technology"]] },
  { id: 3, name: "Fortuner",   brand: "Toyota",     type: "SUV",   price: 3200, color: "#2a2f3a", year: 2026, featured: true,
    desc: "Built for family trips and rough roads alike. Seven seats, strong torque and the comfort to go the distance without a worry.",
    stats: [["204 HP","Power"],["6-Speed","Transmission"],["7 Seats","Capacity"],["4x4","Technology"]] },
  { id: 4, name: "Civic",      brand: "Honda",      type: "Sedan", price: 2200, color: "#1e40af", year: 2026, featured: true,
    desc: "Sharp, efficient and fun. The smart pick for city driving and long commutes, with a smooth ride and low running costs.",
    stats: [["182 HP","Power"],["CVT","Transmission"],["5 Seats","Capacity"],["Turbo","Technology"]] },
  { id: 5, name: "Vios",       brand: "Toyota",     type: "Sedan", price: 1500, color: "#9ca3af", year: 2026,
    desc: "Reliable and affordable.", stats: [["106 HP","Power"],["CVT","Transmission"],["5 Seats","Capacity"],["Eco","Technology"]] },
  { id: 6, name: "Montero",    brand: "Mitsubishi", type: "SUV",   price: 3000, color: "#7c2d12", year: 2026,
    desc: "Rugged and roomy.", stats: [["181 HP","Power"],["8-Speed","Transmission"],["7 Seats","Capacity"],["4x4","Technology"]] },
];
const peso = n => "₱" + n.toLocaleString("en-PH");
const $ = s => document.querySelector(s);

// ===== CAR ILLUSTRATION (swap for <img src="images/car.png"> any time) =====
let uid = 0;
function carSVG(color, accent = "#19e34a") {
  const id = "g" + uid++;
  return `
<svg viewBox="0 0 640 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Car">
  <defs>
    <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="#000" stop-opacity=".65"/>
    </linearGradient>
    <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8fa2c8"/><stop offset="1" stop-color="#0b1020"/>
    </linearGradient>
  </defs>
  <ellipse cx="320" cy="205" rx="270" ry="10" fill="rgba(0,0,0,.55)"/>
  <path d="M26 160 Q30 136 78 130 L168 120 Q214 74 290 66 L392 66 Q454 72 494 114 L562 124 Q614 132 616 160 L616 178 L26 178 Z" fill="${color}"/>
  <path d="M26 160 Q30 136 78 130 L168 120 Q214 74 290 66 L392 66 Q454 72 494 114 L562 124 Q614 132 616 160 L616 178 L26 178 Z" fill="url(#${id}b)"/>
  <path d="M184 118 Q220 80 290 74 L340 74 L340 118 Z" fill="url(#${id}s)"/>
  <path d="M352 74 L394 74 Q436 80 470 118 L352 118 Z" fill="url(#${id}s)"/>
  <rect x="26" y="150" width="590" height="4" fill="${accent}" opacity=".9"/>
  <rect x="582" y="134" width="34" height="10" rx="5" fill="#fff6c8"/>
  <rect x="26" y="136" width="24" height="9" rx="4" fill="#ff3b4a"/>
  <path d="M120 178 a44 44 0 0 1 88 0 Z" fill="#000" opacity=".55"/>
  <path d="M446 178 a44 44 0 0 1 88 0 Z" fill="#000" opacity=".55"/>
  <g class="wheel"><circle cx="164" cy="178" r="38" fill="#0a0a0a"/><circle cx="164" cy="178" r="24" fill="#cfd3dc"/><circle cx="164" cy="178" r="24" fill="none" stroke="${accent}" stroke-width="3"/><circle cx="164" cy="178" r="7" fill="#222"/><path d="M164 154v48M140 178h48" stroke="#222" stroke-width="3"/></g>
  <g class="wheel"><circle cx="490" cy="178" r="38" fill="#0a0a0a"/><circle cx="490" cy="178" r="24" fill="#cfd3dc"/><circle cx="490" cy="178" r="24" fill="none" stroke="${accent}" stroke-width="3"/><circle cx="490" cy="178" r="7" fill="#222"/><path d="M490 154v48M466 178h48" stroke="#222" stroke-width="3"/></g>
</svg>`;
}

// ===== NAV =====
const nav = $("#nav"), menu = $("#menu");
$("#burger").addEventListener("click", () => menu.classList.toggle("open"));
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => menu.classList.remove("open")));

const sections = [...document.querySelectorAll("section[id], footer[id]")];
const links = [...menu.querySelectorAll("a")];
function onScroll() {
  nav.classList.toggle("scrolled", window.scrollY > 40);
  const y = window.scrollY + 160;
  let current = sections[0].id;
  sections.forEach(s => { if (s.offsetTop <= y) current = s.id; });
  links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
}
window.addEventListener("scroll", onScroll); onScroll();

// ===== HERO SLIDER =====
const featured = cars.filter(c => c.featured);
let heroIndex = 0, timer;
const heroCar = $("#heroCar");
const dotsEl = $("#dots");
dotsEl.innerHTML = featured.map((_, i) => `<button data-i="${i}" aria-label="Show car ${i + 1}"></button>`).join("");

function showHero(i, animate = true) {
  heroIndex = (i + featured.length) % featured.length;
  const c = featured[heroIndex];
  const apply = () => {
    heroCar.innerHTML = carSVG(c.color);
    $("#ghostName").textContent = c.name.toUpperCase();
    $("#ghostYear").textContent = c.year;
    $("#heroBrand").textContent = c.brand;
    $("#heroName").textContent = c.name;
    $("#heroDesc").textContent = c.desc;
    $("#heroPrice").textContent = peso(c.price);
    $("#stats").innerHTML = c.stats.map(([v, l]) => `<li><strong>${v}</strong><span>${l}</span></li>`).join("");
    dotsEl.querySelectorAll("button").forEach((d, k) => d.classList.toggle("on", k === heroIndex));
    $("#heroBook").dataset.id = c.id;
    heroCar.classList.remove("swap");
  };
  if (animate) { heroCar.classList.add("swap"); setTimeout(apply, 300); } else apply();
}
function autoplay() { clearInterval(timer); timer = setInterval(() => showHero(heroIndex + 1), 7000); }
$("#heroNext").addEventListener("click", () => { showHero(heroIndex + 1); autoplay(); });
$("#heroPrev").addEventListener("click", () => { showHero(heroIndex - 1); autoplay(); });
dotsEl.addEventListener("click", e => { const b = e.target.closest("button"); if (b) { showHero(+b.dataset.i); autoplay(); } });
$("#heroBook").addEventListener("click", e => goBook(+e.currentTarget.dataset.id));
showHero(0, false); autoplay();

// ===== COLLECTION =====
const cardsEl = $("#cards"), select = $("#carSelect"), emptyEl = $("#empty");
const liked = new Set();
let filter = "all", query = "";

function renderCars() {
  const list = cars.filter(c =>
    (filter === "all" || c.type === filter) &&
    (c.name + " " + c.brand).toLowerCase().includes(query));
  emptyEl.hidden = list.length > 0;
  cardsEl.innerHTML = list.map(c => `
    <article class="card">
      <button class="heart ${liked.has(c.id) ? "on" : ""}" data-id="${c.id}" aria-label="Favorite">${liked.has(c.id) ? "♥" : "♡"}</button>
      <span class="badge">${c.brand} · ${c.type}</span>
      <div class="thumb">${carSVG(c.color)}</div>
      <h4>${c.name}</h4>
      <div class="specs"><span>${c.stats[0][0]}</span><span>${c.stats[1][0]}</span><span>${c.stats[2][0]}</span></div>
      <div class="row">
        <span class="price">${peso(c.price)} <small>/ day</small></span>
        <button class="btn-green" data-book="${c.id}">Book</button>
      </div>
    </article>`).join("");
}
renderCars();

select.innerHTML = cars.map(c => `<option value="${c.id}">${c.brand} ${c.name} – ${peso(c.price)}/day</option>`).join("");

function goBook(id) {
  select.value = id; updateTotal();
  $("#booking").scrollIntoView({ behavior: "smooth" });
}

cardsEl.addEventListener("click", e => {
  const heart = e.target.closest(".heart");
  if (heart) {
    const id = +heart.dataset.id;
    liked.has(id) ? liked.delete(id) : liked.add(id);
    heart.classList.toggle("on", liked.has(id));
    heart.textContent = liked.has(id) ? "♥" : "♡";
    return;
  }
  const b = e.target.closest("[data-book]");
  if (b) goBook(+b.dataset.book);
});

$("#filters").addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  filter = chip.dataset.type; renderCars();
});
$("#prev").addEventListener("click", () => cardsEl.scrollBy({ left: -300, behavior: "smooth" }));
$("#next").addEventListener("click", () => cardsEl.scrollBy({ left: 300, behavior: "smooth" }));

// ===== SEARCH =====
$("#searchForm").addEventListener("submit", e => {
  e.preventDefault();
  query = $("#search").value.trim().toLowerCase();
  const hit = cars.find(c => (c.name + " " + c.brand).toLowerCase().includes(query));
  if (query && hit && hit.featured) {
    showHero(featured.indexOf(hit)); autoplay();
    $("#home").scrollIntoView({ behavior: "smooth" });
  } else {
    $("#collection").scrollIntoView({ behavior: "smooth" });
  }
  renderCars();
});
$("#search").addEventListener("input", e => { if (!e.target.value) { query = ""; renderCars(); } });

// ===== BOOKING FORM =====
const pickup = $("#pickup"), dropoff = $("#dropoff"), totalEl = $("#total"), msg = $("#msg");
const today = new Date().toISOString().split("T")[0];
pickup.min = dropoff.min = today;
pickup.addEventListener("change", () => { dropoff.min = pickup.value || today; });

function days() {
  if (!pickup.value || !dropoff.value) return 0;
  const d = (new Date(dropoff.value) - new Date(pickup.value)) / 86400000;
  return d > 0 ? d : 0;
}
function updateTotal() {
  const car = cars.find(c => c.id === +select.value), d = days();
  totalEl.textContent = d && car
    ? `${d} day${d > 1 ? "s" : ""} × ${peso(car.price)} = ${peso(d * car.price)}`
    : "Select dates to see the total.";
}
[pickup, dropoff, select].forEach(el => el.addEventListener("change", updateTotal));

$("#bookingForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#name").value.trim();
  msg.className = "msg";
  if (!name || !pickup.value || !dropoff.value) { msg.textContent = "Please fill in all fields."; msg.classList.add("err"); return; }
  if (!days()) { msg.textContent = "Return date must be after pick-up date."; msg.classList.add("err"); return; }
  const car = cars.find(c => c.id === +select.value);
  msg.textContent = `Thanks, ${name}! ${car.brand} ${car.name} booked. ${totalEl.textContent}`;
  msg.classList.add("ok");
  e.target.reset(); updateTotal();
});

// ===== SCROLL REVEAL =====
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("show"); io.unobserve(en.target); } });
}, { threshold: .2 });
document.querySelectorAll(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 3) * 120 + "ms"; io.observe(el); });

$("#year").textContent = new Date().getFullYear();