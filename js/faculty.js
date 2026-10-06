/* =========================================================================
   FACULTY — filter cards by doctoral track (faculty.html)
   Desktop uses the pill buttons, mobile uses the dropdown; both stay in sync.
   ========================================================================= */
(function () {
  "use strict";

  var buttons = document.querySelectorAll(".filter-btn");
  var select = document.getElementById("facultyFilter");
  var cards = document.querySelectorAll(".faculty-card");
  var empty = document.getElementById("facultyEmpty");

  function applyFilter(filter) {
    // buttons
    buttons.forEach(function (btn) {
      var isActive = btn.getAttribute("data-filter") === filter;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    // dropdown
    if (select && select.value !== filter) select.value = filter;

    // cards
    var visible = 0;
    cards.forEach(function (card) {
      var show = filter === "all" || card.getAttribute("data-track") === filter;
      card.hidden = !show;
      if (show) visible++;
    });

    if (empty) empty.hidden = visible !== 0;
  }

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
})();
