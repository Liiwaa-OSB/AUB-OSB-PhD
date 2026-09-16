/* =========================================================================
   OSB — PhD in Business Administration
   Shared site behavior: mobile nav, FAQ accordion, faculty filter, contact form
   ========================================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* -----------------------------------------------------------------
     Mobile nav toggle
  ----------------------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.querySelectorAll(".nav-links a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* -----------------------------------------------------------------
     FAQ accordion
  ----------------------------------------------------------------- */
  var accordionItems = document.querySelectorAll(".accordion-item");

  accordionItems.forEach(function (item) {
    var trigger = item.querySelector(".accordion-trigger");
    var panel = item.querySelector(".accordion-panel");
    if (!trigger || !panel) return;

    trigger.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");

      // Close all other items (single-open accordion)
      accordionItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove("open");
          other.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
          other.querySelector(".accordion-panel").style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
        panel.style.maxHeight = null;
      } else {
        item.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* -----------------------------------------------------------------
     Faculty track filter (faculty.html)
  ----------------------------------------------------------------- */
  var filterButtons = document.querySelectorAll(".filter-btn");
  var facultyCards = document.querySelectorAll("[data-track]");

  if (filterButtons.length && facultyCards.length) {
    var applyFilter = function (track) {
      facultyCards.forEach(function (card) {
        var match = track === "all" || card.getAttribute("data-track") === track;
        card.style.display = match ? "" : "none";
      });
    };

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterButtons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        applyFilter(btn.getAttribute("data-filter"));
      });
    });

    // Preselect a track when arriving via a link like faculty.html?track=finance
    var params = new URLSearchParams(window.location.search);
    var requestedTrack = params.get("track");
    if (requestedTrack) {
      var matchBtn = document.querySelector('.filter-btn[data-filter="' + requestedTrack + '"]');
      if (matchBtn) {
        filterButtons.forEach(function (b) { b.classList.remove("active"); });
        matchBtn.classList.add("active");
        applyFilter(requestedTrack);
      }
    }
  }

  /* -----------------------------------------------------------------
     Contact form (contact.html) — front-end only demo handler
  ----------------------------------------------------------------- */
  var form = document.querySelector("#contact-form");
  var status = document.querySelector("#form-status");

  if (form && status) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.querySelector("#name").value.trim();
      var email = form.querySelector("#email").value.trim();

      if (!name || !email) {
        status.textContent = "Please fill in your name and email before sending.";
        status.classList.remove("success");
        status.classList.add("show");
        return;
      }

      // Placeholder for a real submission (e.g. fetch() to a form endpoint).
      status.textContent = "Thank you, " + name.split(" ")[0] + ". Your message has been received — the PhD program office will reply to " + email + " shortly.";
      status.classList.add("show", "success");
      form.reset();
    });
  }

  /* -----------------------------------------------------------------
     Active nav link — highlight the current page automatically
  ----------------------------------------------------------------- */
  var current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === current) {
      link.classList.add("active");
    }
  });

});
