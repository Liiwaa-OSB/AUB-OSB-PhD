document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("facultyGrid");
  const loading = document.getElementById("facultyLoading");
  const empty = document.getElementById("facultyEmpty");
  const buttons = document.querySelectorAll(".filter-btn");
  const select = document.getElementById("facultyFilter");

  const hideLoading = () => { if (loading) loading.hidden = true; };

  if (!grid || typeof FACULTY_DATA === "undefined") {
    // Data failed to load: replace the spinner with a message instead of spinning forever
    if (loading) loading.textContent = "Faculty could not be loaded. Please try again later.";
    return;
  }

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));

  // A member's track(s) may be a string ("bids") or an array (["bids","fame"])
  const tracksOf = (m) =>
    [].concat(m.tracks ?? m.track ?? []).map((t) => String(t).toLowerCase());

  const cards = FACULTY_DATA.map((m) => {
    const card = document.createElement("a");
    card.className = "faculty-card";
    card.href = m.profile;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.dataset.tracks = tracksOf(m).join(" ");

    card.innerHTML = `
      <img class="faculty-photo" src="${esc(m.photo || './images/faculty/placeholder.webp')}" width="140" height="140" loading="lazy" />
      <div class="faculty-info">
        <h3 class="faculty-name">${esc(m.name)}</h3>
        <p class="faculty-role">${esc(m.role)}</p>
        <p class="faculty-email">${esc(m.email)}</p>
        ${m.interests ? `<p class="faculty-interests">${esc(m.interests)}</p>` : ""}
      </div>
    `;
    grid.appendChild(card);
    return card;
  });

  function applyFilter(value) {
    let visible = 0;
    cards.forEach((card) => {
      const show = value === "all" || card.dataset.tracks.split(" ").includes(value);
      card.hidden = !show;
      if (show) visible++;
    });
    if (empty) empty.hidden = visible > 0;

    buttons.forEach((b) => {
      const on = b.dataset.filter === value;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    if (select) select.value = value;
  }

  buttons.forEach((b) => b.addEventListener("click", () => applyFilter(b.dataset.filter)));
  if (select) select.addEventListener("change", () => applyFilter(select.value));

  hideLoading();
  applyFilter("all");
});
