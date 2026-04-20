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
