const $ = id => document.getElementById(id);

const anesthSelect = $("anesthesiste");
const specialiteSelect = $("specialite");
const report = $("report");

function fillSelect(select, list, placeholder = "") {
  select.innerHTML = "";

  if (placeholder) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = placeholder;
    select.appendChild(opt);
  }

  list.forEach(v => {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = v;
    select.appendChild(o);
  });
}

function initDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  $("date").value = `${yyyy}-${mm}-${dd}`;
}

function formatDateFR(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

function init() {
  initDate();

  fillSelect(anesthSelect, DATA.anesthesistes, "Choisir...");
  fillSelect(specialiteSelect, Object.keys(DATA.specialites));

  updateChirurgiens();
  addGeste();

  specialiteSelect.addEventListener("change", () => {
    updateChirurgiens();
    resetGestes();
    addGeste();
    renderReport();
  });

  document.addEventListener("change", renderReport);
  document.addEventListener("input", renderReport);

  renderReport();
}

function updateChirurgiens() {
  const spec = specialiteSelect.value;
  const list = DATA.specialites[spec]?.chirurgiens || [];

  document.querySelectorAll(".chirurgien").forEach(sel => {
    fillSelect(sel, list, "Chirurgien...");
  });
}

function addChir() {
  const container = $("chirContainer");
  const row = document.createElement("div");
  row.className = "field";

  row.innerHTML = `
    <select class="chirurgien">
      <option value="">Chirurgien...</option>
    </select>
  `;

  container.appendChild(row);
  updateChirurgiens();
}

function resetGestes() {
  $("gesteContainer").innerHTML = "";
}

function addGeste() {
  const spec = specialiteSelect.value;
  const list = DATA.specialites[spec]?.interventions || [];

  const wrapper = document.createElement("div");
  wrapper.className = "geste-block";
  wrapper.style.marginBottom = "12px";

  wrapper.innerHTML = `
    <select class="geste-select"></select>
    <div class="geste-extra" style="margin-top:6px;"></div>
  `;

  $("gesteContainer").appendChild(wrapper);

  const select = wrapper.querySelector(".geste-select");
  fillSelect(select, list, "Intervention...");

  select.addEventListener("change", () => {
    renderGesteExtra(wrapper, select.value);
    renderReport();
  });
}

function renderGesteExtra(wrapper, geste) {
  const extra = wrapper.querySelector(".geste-extra");
  extra.innerHTML = "";

  if (!geste) return;

  // Latéralité
  if (DATA.lateralizedGestes.includes(geste)) {
    const select = document.createElement("select");
    select.className = "laterality-select";
    fillSelect(select, DATA.laterality, "Latéralité...");
    extra.appendChild(select);
  }

  // Champ texte contextuel
  if (DATA.textGestes.includes(geste)) {
    const input = document.createElement("input");
    input.className = "precision-input";
    input.placeholder = "Précision...";
    input.style.marginTop = "6px";
    extra.appendChild(input);
  }

  // Autre
  if (geste === "Autre...") {
    const input = document.createElement("input");
    input.className = "custom-geste";
    input.placeholder = "Préciser l'intervention";
    extra.appendChild(input);
  }
}

function buildGesteLabel(block) {
  const geste = block.querySelector(".geste-select")?.value;
  if (!geste) return null;

  let label = geste;

  if (geste === "Autre...") {
    const custom = block.querySelector(".custom-geste")?.value || "Autre";
    label = custom;
  }

  const lat = block.querySelector(".laterality-select")?.value;
  if (lat) {
    const map = {
      "Droite": "droite",
      "Gauche": "gauche",
      "Bilatéral": "bilatéral"
    };
    label += " " + map[lat];
  }

  const precision = block.querySelector(".precision-input")?.value;
  if (precision) {
    label += ` (${precision})`;
  }

  return label;
}

function renderReport() {
  const date = formatDateFR($("date").value);
  const anesth = anesthSelect.value;

  const chirurgiens = [...document.querySelectorAll(".chirurgien")]
    .map(x => x.value)
    .filter(Boolean);

  const gestes = [...document.querySelectorAll(".geste-block")]
    .map(buildGesteLabel)
    .filter(Boolean);

  let txt = "";

  txt += "INTERVENTION\n";
  txt += `Date : ${date}\n`;
  txt += `Anesthésiste : ${anesth}\n`;
  txt += `Chirurgien : ${chirurgiens.join(", ")}\n`;
  txt += `Intervention : ${gestes.join(" associée à ")}\n\n`;

  report.value = txt;
}

init();
