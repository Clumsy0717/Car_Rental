// ===== DATA =====
const cars = [
  { id: 1, name: "Toyota Vios",      type: "Sedan", price: 1500, color: "#c9ced9" },
  { id: 2, name: "Honda Civic",      type: "Sedan", price: 2200, color: "#1e3a8a" },
  { id: 3, name: "Toyota Fortuner",  type: "SUV",   price: 3200, color: "#111827" },
  { id: 4, name: "Mitsubishi Montero", type: "SUV", price: 3000, color: "#7c2d12" },
  { id: 5, name: "Ford Mustang",     type: "Sport", price: 6500, color: "#dc2626" },
  { id: 6, name: "Nissan GT-R",      type: "Sport", price: 8000, color: "#f5f5f5" },
];
const peso = n => "₱" + n.toLocaleString("en-PH");

// Small reusable car illustration (swap for <img src="..."> when you have photos)
const carSVG = color => `
<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="160" cy="128" rx="130" ry="7" fill="rgba(0,0,0,.35)"/>
  <path d="M20 92 Q24 72 52 68 L96 64 Q118 38 152 36 L200 36 Q232 40 250 64 L282 70 Q302 74 303 92 L303 108 L20 108 Z" fill="${color}"/>
  <path d="M108 62 Q124 44 152 43 L172 43 L172 62 Z" fill="#9fb4ff" opacity=".85"/>
  <path d="M180 43 L200 43 Q220 46 234 62 L180 62 Z" fill="#9fb4ff" opacity=".85"/>
  <circle cx="82" cy="108" r="21" fill="#0b0c10"/><circle cx="82" cy="108" r="11" fill="#c9ced9"/>
  <circle cx="240" cy="108" r="21" fill="#0b0c10"/><circle cx="240" cy="108" r="11" fill="#c9ced9"/>
</svg>`;

// ===== NAV =====
const nav = document.getElementById("nav");
const menu = document.getElementById("menu");
document.getElementById("burger").addEventListener("click", () => menu.classList.toggle("open"));
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => menu.classList.remove("open")));
window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 40));

// Active link on scroll
const sections = [...document.querySelectorAll("section[id]")];
const links = [...menu.querySelectorAll("a")];
window.addEventListener("scroll", () => {
  const y = window.scrollY + 120;
  let current = sections[0].id;
  sections.forEach(s => { if (s.offsetTop <= y) current = s.id; });
  links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
});

// ===== CARDS =====
const cardsEl = document.getElementById("cards");
const select = document.getElementById("carSelect");
const liked = new Set();

function renderCars(filter = "all") {
  const list = filter === "all" ? cars : cars.filter(c => c.type === filter);
  cardsEl.innerHTML = list.map(c => `
    <article class="card">
      <button class="heart ${liked.has(c.id) ? "on" : ""}" data-id="${c.id}" aria-label="Favorite">${liked.has(c.id) ? "♥" : "♡"}</button>
      <div class="thumb">${carSVG(c.color)}</div>
      <h4>${c.name}</h4>
      <p class="type">${c.type}</p>
      <div class="row">
        <span class="price">${peso(c.price)} / day</span>
        <button class="btn-white" data-book="${c.id}">Details</button>
      </div>
    </article>`).join("");
}
renderCars();

select.innerHTML = cars.map(c => `<option value="${c.id}">${c.name} – ${peso(c.price)}/day</option>`).join("");

cardsEl.addEventListener("click", e => {
  const heart = e.target.closest(".heart");
  if (heart) {
    const id = +heart.dataset.id;
    liked.has(id) ? liked.delete(id) : liked.add(id);
    heart.classList.toggle("on");
    heart.textContent = liked.has(id) ? "♥" : "♡";
    return;
  }
  const book = e.target.closest("[data-book]");
  if (book) {
    select.value = book.dataset.book;
    updateTotal();
    document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
  }
});

document.getElementById("filters").addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  renderCars(chip.dataset.type);
});

document.getElementById("prev").addEventListener("click", () => cardsEl.scrollBy({ left: -250, behavior: "smooth" }));
document.getElementById("next").addEventListener("click", () => cardsEl.scrollBy({ left: 250, behavior: "smooth" }));

// ===== BOOKING FORM =====
const pickup = document.getElementById("pickup");
const dropoff = document.getElementById("dropoff");
const totalEl = document.getElementById("total");
const msg = document.getElementById("msg");
const today = new Date().toISOString().split("T")[0];
pickup.min = dropoff.min = today;

function days() {
  if (!pickup.value || !dropoff.value) return 0;
  const d = (new Date(dropoff.value) - new Date(pickup.value)) / 86400000;
  return d > 0 ? d : 0;
}
function updateTotal() {
  const car = cars.find(c => c.id === +select.value);
  const d = days();
  totalEl.textContent = d && car
    ? `${d} day${d > 1 ? "s" : ""} × ${peso(car.price)} = ${peso(d * car.price)}`
    : "Select dates to see the total.";
}
[pickup, dropoff, select].forEach(el => el.addEventListener("change", updateTotal));

document.getElementById("bookingForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  msg.className = "msg";
  if (!name || !pickup.value || !dropoff.value) {
    msg.textContent = "Please fill in all fields."; msg.classList.add("err"); return;
  }
  if (!days()) {
    msg.textContent = "Return date must be after pick-up date."; msg.classList.add("err"); return;
  }
  const car = cars.find(c => c.id === +select.value);
  msg.textContent = `Thanks, ${name}! ${car.name} booked. ${totalEl.textContent}`;
  msg.classList.add("ok");
  e.target.reset(); updateTotal();
});

// ===== SCROLL REVEAL =====
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("show"); io.unobserve(en.target); } });
}, { threshold: .2 });
document.querySelectorAll(".reveal").forEach((el, i) => { el.style.transitionDelay = i * 120 + "ms"; io.observe(el); });

document.getElementById("year").textContent = new Date().getFullYear();