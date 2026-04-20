const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const desktopNav = document.getElementById("siteNav");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("hidden");
    mobileMenu.classList.toggle("hidden", isOpen);
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
  });

  mobileMenu.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (desktopNav) {
  const navAnchors = [...desktopNav.querySelectorAll("a[href^='#']")];
  const sections = navAnchors
    .map((anchor) => document.querySelector(anchor.getAttribute("href")))
    .filter(Boolean);

  const setActiveNav = () => {
    let currentId = "";
    const scrollY = window.scrollY + 180;

    sections.forEach((section) => {
      if (section.offsetTop <= scrollY) {
        currentId = `#${section.id}`;
      }
    });

    navAnchors.forEach((anchor) => {
      const target = anchor.getAttribute("href");
      const isCta = target === "#booking";
      if (!isCta) {
        anchor.style.color = target === currentId ? "#ffffff" : "";
      }
    });
  };

  window.addEventListener("scroll", setActiveNav);
  setActiveNav();
}

const eventsTimeline = document.getElementById("eventsTimeline");
const rawEventsData =
  (typeof window !== "undefined" && Array.isArray(window.EVENTS_DATA) && window.EVENTS_DATA) ||
  (typeof EVENTS_DATA !== "undefined" && Array.isArray(EVENTS_DATA) && EVENTS_DATA) ||
  [];

if (eventsTimeline && rawEventsData.length) {
  const data = rawEventsData.map((event) => ({
    ...event,
    year: event.year || ((event.title || "").match(/(20\d{2}|19\d{2})/) || [])[0] || "Archive"
  }));

  const timelineWrapper = document.createElement("div");
  timelineWrapper.className = "relative";
  timelineWrapper.innerHTML = `
    <div class="pointer-events-none absolute bottom-0 left-4 top-0 hidden w-px bg-white/15 md:block"></div>
    <div class="space-y-12" id="eventsTimelineCards"></div>
  `;
  eventsTimeline.appendChild(timelineWrapper);

  const cardsHost = timelineWrapper.querySelector("#eventsTimelineCards");

  data.forEach((event, index) => {
    const card = document.createElement("article");
    card.className =
      "relative overflow-hidden border border-white/10 bg-base-950/80 p-5 backdrop-blur-sm md:ml-10 md:p-7";

    const marker = document.createElement("div");
    marker.className =
      "absolute -left-[2.85rem] top-9 hidden h-4 w-4 rounded-full border-2 border-gold bg-base-900 shadow-[0_0_0_6px_rgba(197,160,89,0.1)] md:block";
    card.appendChild(marker);

    const allImages = Array.isArray(event.images) ? event.images : [];
    const heroImage = allImages[0] || "";
    const galleryImages = allImages.slice(1);

    const yearPill = `
      <span class="inline-flex items-center border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
        ${event.year}
      </span>
    `;

    const titleBlock = `
      <div class="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h3 class="font-serif text-2xl leading-tight text-white md:text-3xl">${event.title}</h3>
        ${yearPill}
      </div>
    `;

    const cta = `
      <a
        href="${event.url}"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold transition-colors hover:text-white"
      >
        View Original Event
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </a>
    `;

    const hero = heroImage
      ? `
        <div class="mb-4 overflow-hidden border border-white/10 bg-base-900">
          <img src="${heroImage}" alt="${event.title}" class="h-[18rem] w-full object-cover md:h-[24rem]" loading="${index < 2 ? "eager" : "lazy"}" />
        </div>
      `
      : "";

    const gallery = galleryImages.length
      ? `
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          ${galleryImages
            .map(
              (imgUrl, imgIndex) => `
              <a href="${imgUrl}" target="_blank" rel="noopener noreferrer" class="group block overflow-hidden border border-white/10 bg-base-900">
                <img
                  src="${imgUrl}"
                  alt="${event.title} image ${imgIndex + 2}"
                  class="h-28 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </a>
            `
            )
            .join("")}
        </div>
      `
      : "";

    card.innerHTML += `${titleBlock}${hero}${gallery}${cta}`;
    cardsHost.appendChild(card);
  });
}
