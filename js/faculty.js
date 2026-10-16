/* =========================================================================
   FACULTY — render cards from the faculty data array and filter by track.
   Desktop: pill buttons. Mobile: dropdown. Both stay in sync.

   Data file (js/faculty-data.js) must start with:
       window.FACULTY_DATA = [
   and end with:
       ];
   ========================================================================= */
(function () {
  "use strict";

  // ----- DOM refs -----
  var grid    = document.getElementById("facultyGrid");
  var empty   = document.getElementById("facultyEmpty");
  var loading = document.getElementById("facultyLoading");
  var select  = document.getElementById("facultyFilter");
  var buttons = document.querySelectorAll(".filter-btn");

  var DEFAULT_EMPTY_MSG = "No faculty match the selected track.";

  // Human-readable track labels
  var TRACK_LABELS = {
    analytics:  "Business Analytics",
    finance:    "Finance",
    management: "Management"
  };

  // ----- Helpers -----
  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g,  "&amp;")
      .replace(/</g,  "&lt;")
      .replace(/>/g,  "&gt;")
      .replace(/"/g,  "&quot;")
      .replace(/'/g,  "&#39;");
  }

  // Accepts "Finance", "business analytics", "Business-Analytics", etc.
  function normalizeTrack(value) {
    var t = String(value || "").toLowerCase().trim();
    if (t.indexOf("analytic") !== -1) return "analytics";
    if (t.indexOf("financ") !== -1)   return "finance";
    if (t.indexOf("manag") !== -1)    return "management";
    return t || "analytics";
  }

  // Only allow http(s) links so bad data can't inject javascript: URLs
  function safeUrl(url) {
    var u = String(url || "").trim();
    return /^https?:\/\//i.test(u) ? u : "";
  }

  function getData() {
    if (Array.isArray(window.FACULTY_DATA)) return window.FACULTY_DATA;
    // Fallback: data file declared with top-level const/let/var
    try {
      if (typeof FACULTY_DATA !== "undefined" && Array.isArray(FACULTY_DATA)) return FACULTY_DATA;
    } catch (e) {}
    try {
      if (typeof facultyData !== "undefined" && Array.isArray(facultyData)) return facultyData;
    } catch (e) {}
    return [];
  }

  var AVATAR_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />' +
    '<circle cx="12" cy="7" r="4" />' +
    '</svg>';

  var ARROW_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M7 17 17 7M7 7h10v10" />' +
    '</svg>';

  // ----- Card template -----
  function buildCard(f) {
    var track      = normalizeTrack(f.track);
    var trackLabel = TRACK_LABELS[track] || track;
    var name       = escapeHtml(f.name || "Faculty Name");
    var role       = escapeHtml(f.role || "");
    var bio        = escapeHtml(f.bio  || "");

    var profile = safeUrl(f.profile);
    var scholar = safeUrl(f.scholar);
    var email   = String(f.email || "").trim();

    var links = [];
    if (profile) {
      links.push(
        '<a class="text-link" href="' + escapeHtml(profile) + '" target="_blank" rel="noopener">' +
        'AUB Profile' + ARROW_SVG + '</a>'
      );
    }
    if (scholar) {
      links.push(
        '<a class="text-link" href="' + escapeHtml(scholar) + '" target="_blank" rel="noopener">' +
        'Scholar' + ARROW_SVG + '</a>'
      );
    }
    if (email) {
      links.push(
        '<a class="text-link" href="mailto:' + escapeHtml(email) + '">' +
        'Email' + ARROW_SVG + '</a>'
      );
    }

    return (
      '<article class="card card--accent faculty-card" data-track="' + escapeHtml(track) + '">' +
        '<div class="faculty-photo">' + AVATAR_SVG + '</div>' +
        '<div class="faculty-body">' +
          '<span class="faculty-track">' + escapeHtml(trackLabel) + '</span>' +
          '<h4>' + name + '</h4>' +
          (role ? '<div class="faculty-role">' + role + '</div>' : '') +
          (bio  ? '<p class="faculty-bio">'   + bio  + '</p>'   : '') +
          (links.length ? '<div class="faculty-links">' + links.join("") + '</div>' : '') +
        '</div>' +
      '</article>'
    );
  }

  // ----- Filtering -----
  function applyFilter(filter) {
    buttons.forEach(function (btn) {
      var isActive = btn.getAttribute("data-filter") === filter;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    if (select && select.value !== filter) select.value = filter;

    var cards = grid ? grid.querySelectorAll(".faculty-card") : [];
    var visible = 0;
    cards.forEach(function (card) {
      var show = filter === "all" || card.getAttribute("data-track") === filter;
      card.hidden = !show;
      if (show) visible++;
    });

    if (empty) {
      empty.textContent = DEFAULT_EMPTY_MSG;
      empty.hidden = visible !== 0;
    }
  }

  // ----- Init -----
  function init() {
    var list = getData();

    if (!list.length) {
      if (loading) loading.hidden = true;
      if (empty) {
        empty.textContent = "No faculty data available.";
        empty.hidden = false;
      }
      return;
    }

    // Render all cards
    if (grid) {
      grid.innerHTML = list.map(buildCard).join("");
      grid.hidden = false;
    }

    if (loading) loading.hidden = true;

    // Wire up filter controls
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyFilter(btn.getAttribute("data-filter"));
      });
    });

    if (select) {
      select.addEventListener("change", function () {
        applyFilter(select.value);
      });
    }

    // Apply initial filter
    var active = document.querySelector(".filter-btn.active");
    applyFilter(active ? active.getAttribute("data-filter") : "all");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
