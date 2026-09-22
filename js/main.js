  /* -----------------------------------------------------------------
     FAQ accordion — robust across desktop, Android, iOS Safari
     Uses scrollHeight measurement + inline max-height for the animation.
  ----------------------------------------------------------------- */
  var accordionItems = document.querySelectorAll(".accordion-item");

  if (accordionItems.length) {
    accordionItems.forEach(function (item) {
      var trigger = item.querySelector(".accordion-trigger");
      var panel = item.querySelector(".accordion-panel");
      if (!trigger || !panel) return;

      // Ensure initial closed state on the panel
      panel.style.maxHeight = "0px";

      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        var isOpen = item.classList.contains("open");

        // Close all other items (single-open accordion)
        accordionItems.forEach(function (other) {
          if (other === item) return;
          other.classList.remove("open");
          var otherTrigger = other.querySelector(".accordion-trigger");
          var otherPanel = other.querySelector(".accordion-panel");
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
          if (otherPanel) otherPanel.style.maxHeight = "0px";
        });

        // Toggle current
        if (isOpen) {
          item.classList.remove("open");
          trigger.setAttribute("aria-expanded", "false");
          panel.style.maxHeight = "0px";
        } else {
          item.classList.add("open");
          trigger.setAttribute("aria-expanded", "true");
          // Measure the natural height of the panel content
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });

    // If a panel is resized (e.g. orientation change), keep open ones correct
    window.addEventListener("resize", function () {
      accordionItems.forEach(function (item) {
        if (item.classList.contains("open")) {
          var panel = item.querySelector(".accordion-panel");
          if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  }