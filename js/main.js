const header = document.querySelector(".site-header");
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".menu-toggle");
const slides = document.querySelectorAll(".hero-slide");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 40);
});

toggle?.addEventListener("click", () => {
  nav.classList.toggle("open");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

let current = 0;
if (slides.length > 1) {
  setInterval(() => {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }, 5200);
}

const lightbox = document.querySelector(".lightbox");
const lightboxImg = document.querySelector(".lightbox img");
document.querySelectorAll("[data-full]").forEach((el) => {
  el.addEventListener("click", (event) => {
    event.preventDefault();
    lightboxImg.src = el.getAttribute("data-full");
    lightbox.classList.add("open");
  });
});
lightbox?.querySelector("button")?.addEventListener("click", () => {
  lightbox.classList.remove("open");
});
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.classList.remove("open");
});

const allReviews = window.PRIVATE_REVIEWS || [];
const reviewGrid = document.querySelector("#review-grid");
const reviewFilters = document.querySelector("#review-filters");
const reviewMore = document.querySelector(".review-more");
const PAGE = 12;
let reviewYear = "all";
let reviewShown = PAGE;

const reviewYears = [...new Set(allReviews.map((item) => item.year))].sort((a, b) => b - a);

function reviewList() {
  if (reviewYear === "all") return allReviews;
  return allReviews.filter((item) => String(item.year) === reviewYear);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function reviewCite(item) {
  const parts = [item.name];
  if (item.city) parts.push(item.city);
  parts.push(`${item.year}.${item.month}`);
  return parts.join(" · ");
}

function renderReviewFilters() {
  if (!reviewFilters) return;
  const buttons = [
    `<button type="button" data-year="all" class="${reviewYear === "all" ? "is-on" : ""}">전체 <em>${allReviews.length}</em></button>`,
    ...reviewYears.map((year) => {
      const count = allReviews.filter((item) => item.year === year).length;
      const on = String(year) === reviewYear ? "is-on" : "";
      return `<button type="button" data-year="${year}" class="${on}">${year} <em>${count}</em></button>`;
    }),
  ];
  reviewFilters.innerHTML = buttons.join("");
}

function renderReviews() {
  if (!reviewGrid) return;
  const items = reviewList();
  const slice = items.slice(0, reviewShown);
  reviewGrid.innerHTML = slice.map((item, index) => {
    const long = item.text.length > 180;
    return `
      <article class="review-card${long ? " has-more" : ""}" data-index="${index}">
        <p>${escapeHtml(item.text)}</p>
        ${long ? `<button class="review-toggle" type="button">더 읽기</button>` : ""}
        <cite>${escapeHtml(reviewCite(item))}</cite>
      </article>
    `;
  }).join("");
  if (reviewMore) {
    const remain = items.length - slice.length;
    reviewMore.hidden = remain <= 0;
    reviewMore.textContent = remain > 0
      ? `후기 더 보기 (${slice.length}/${items.length})`
      : "후기 더 보기";
  }
}

reviewFilters?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-year]");
  if (!button) return;
  reviewYear = button.dataset.year;
  reviewShown = PAGE;
  renderReviewFilters();
  renderReviews();
});

reviewGrid?.addEventListener("click", (event) => {
  const card = event.target.closest(".review-card.has-more");
  if (!card) return;
  const opened = card.classList.toggle("is-open");
  const toggle = card.querySelector(".review-toggle");
  if (toggle) toggle.textContent = opened ? "접기" : "더 읽기";
});

reviewMore?.addEventListener("click", () => {
  reviewShown += PAGE;
  renderReviews();
});

renderReviewFilters();
renderReviews();

const form = document.querySelector(".form");
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get("name");
  const phone = data.get("phone");
  const checkin = data.get("checkin");
  const checkout = data.get("checkout");
  const guests = data.get("guests");
  const memo = data.get("memo") || "";
  const body = [
    `예약 문의입니다.`,
    `이름: ${name}`,
    `연락처: ${phone}`,
    `체크인: ${checkin}`,
    `체크아웃: ${checkout}`,
    `인원: ${guests}`,
    memo ? `요청사항: ${memo}` : "",
  ].filter(Boolean).join("\n");

  window.location.href = `tel:050713794004`;
  const note = form.querySelector(".form-ok");
  note.style.display = "block";
  note.textContent = "문의 내용이 정리되었습니다. 전화 연결 후 아래 내용을 말씀해 주세요.";
  form.querySelector(".form-note").textContent = body.replaceAll("\n", " / ");
});
