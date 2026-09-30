(function () {
  "use strict";

  const body = document.body;
  const header = document.querySelector(".nav-main-header");
  const mobileBurger = document.getElementById("mobileBurgerBtn");
  const overlay = document.getElementById("mobileOverlay");
  const closeBtn = document.getElementById("closeOverlayBtn");

  /* ============================================= */
  /* FIXED HEADER OFFSET                           */
  /* ============================================= */

  function setNavOffset() {
    if (!header) return;
    document.documentElement.style.setProperty(
      "--nav-offset",
      header.offsetHeight + "px"
    );
  }

  setNavOffset();
  if ("ResizeObserver" in window && header) {
    new ResizeObserver(setNavOffset).observe(header);
  } else {
    window.addEventListener("resize", setNavOffset);
  }
  window.addEventListener("load", setNavOffset); // logo image may change height

  /* ============================================= */
  /* MOBILE MENU                                   */
  /* ============================================= */

  function isOpen() {
    return !!overlay && overlay.classList.contains("open");
  }

  function openOverlay() {
    if (!overlay || isOpen()) return;

    overlay.inert = false;
    overlay.classList.add("open");
    body.classList.add("menu-open");

    mobileBurger?.setAttribute("aria-expanded", "true");
    overlay.setAttribute("aria-hidden", "false");

    closeBtn?.focus();
  }

  function closeOverlay(returnFocus = true) {
    if (!overlay || !isOpen()) return;

    overlay.classList.remove("open");
    body.classList.remove("menu-open");

    mobileBurger?.setAttribute("aria-expanded", "false");
    overlay.setAttribute("aria-hidden", "true");
    overlay.inert = true;

    if (returnFocus) mobileBurger?.focus();
  }

  mobileBurger?.addEventListener("click", openOverlay);
  closeBtn?.addEventListener("click", () => closeOverlay());

  /* Close when clicking outside the menu content */
  overlay?.addEventListener("click", function (event) {
    if (event.target === overlay) closeOverlay();
  });

  document.addEventListener("keydown", function (event) {
    if (!isOpen()) return;

    /* Escape closes */
    if (event.key === "Escape") {
      closeOverlay();
      return;
    }

    /* Trap Tab inside the overlay */
    if (event.key === "Tab") {
      const focusable = overlay.querySelectorAll(
        "a[href], button:not([disabled])"
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  /* Close when the viewport grows to desktop */
  window
    .matchMedia("(min-width: 1024px)")
    .addEventListener("change", function (e) {
      if (e.matches) closeOverlay(false);
    });

  /* Close after navigating (same-page / hash links) */
  document.querySelectorAll(".mobile-nav-link").forEach(function (link) {
    link.addEventListener("click", () => closeOverlay(false));
  });

  /* ============================================= */
  /* ACTIVE NAVIGATION ITEM                        */
  /* ============================================= */

  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  function markActive(selector) {
    document.querySelectorAll(selector).forEach(function (link) {
      const href = link.getAttribute("href");
      if (!href) return;

      /* Skip external links entirely (e.g. About OSB -> aub.edu.lb) */
      if (/^(https?:)?\/\//i.test(href)) return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;

      const linkPage = url.pathname.split("/").pop() || "index.html";

      if (linkPage === currentPage) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* Match both desktop and mobile variants of the nav */
  markActive(".nav-osb-links .osb-nav-item > a");
  markActive(".mobile-nav-link");
})();