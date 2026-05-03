const $ = id => document.getElementById(id);

const report = $("report");
const anesthSelect = $("anesthesiste");
const specialiteSelect = $("specialite");

const state = {
  monitorage: [],
  induction: [],
  curare: [],
  va: [],
  entretien: "",
  antibio: "",
  alr: ""
};

function fillSelect(select, list, placeholder = "") {
  select.innerHTML = "";
  if (placeholder) {
    const o = document.createElement("option");
    o.value = "";
    o.textContent = placeholder;
    select.appendChild(o);
  }
  list.forEach(v => {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = v;
    select.appendChild(o);
  });
}

function createChips(id, list, key, single = false) {
  const box = $(id);
  if (!box) return;
  box.innerHTML = "";

  list.forEach(item => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = item;

    chip.onclick = () => {
      if (single) {
        if (state[key] === item) {
          state[key] = "";
          chip.classList.remove("active");
        } else {
          state[key] = item;
          [...box.children].forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
        }
      } else {
        const arr = state[key];
        const idx = arr.indexOf(item);
        if (idx > -1) {
          arr.splice(idx, 1);
          chip.classList.remove("active");
        } else {
          arr.push(item);
          chip.classList.add("active");
        }
      }

      renderReport();
    };

    box.appendChild(chip);
  });
}

function initDate() {
  const d = new Date();
  $("date").value = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
}

function formatDateFR(v) {
  if (!v) return "";
  const d = new Date(v);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function updateChirurgiens() {
  const list = DATA.specialites[specialiteSelect.value]?.chirurgiens || [];
  document.querySelectorAll(".chirurgien").forEach(sel => {
    const current = sel.value;
    fillSelect(sel, list, "Chirurgien...");
    if (list.includes(current)) sel.value = current;
  });
}

function addChir() {
  const row = document.createElement("div");
  row.className = "field row-inline";
  row.innerHTML = `
    <select class="chirurgien"></select>
    <button class="remove-btn" type="button">–</button>
  `;
  row.querySelector(".remove-btn").onclick = () => {
    row.remove();
    renderReport();
  };
  $("chirContainer").appendChild(row);
  updateChirurgiens();
}

function addGeste() {
  const list = DATA.specialites[specialiteSelect.value]?.interventions || [];
  const row = document.createElement("div");
  row.className = "field row-inline";
  row.innerHTML = `
    <select class="geste-select"></select>
    <button class="remove-btn" type="button">–</button>
  `;
  row.querySelector(".remove-btn").onclick = () => {
    row.remove();
    renderReport();
  };
  $("gesteContainer").appendChild(row);
  fillSelect(row.querySelector(".geste-select"), list, "Intervention...");
}

function renderReport() {
  const date = formatDateFR($("date").value);
  const anesth = anesthSelect.value;

  const chirs = [...document.querySelectorAll(".chirurgien")]
    .map(x => x.value)
    .filter(Boolean);

  const gestes = [...document.querySelectorAll(".geste-select")]
    .map(x => x.value)
    .filter(Boolean);

  let txt = "INTERVENTION\n";
  txt += `Date : ${date}\n`;
  txt += `Anesthésiste : ${anesth}\n`;
  txt += `Chirurgien : ${chirs.join(", ")}\n`;
  txt += `Intervention : ${gestes.join(" associée à ")}\n\n`;

  // INSTALLATION
  const mon = [];
  if (state.monitorage.includes("Scope")) mon.push("Scope cardiotensionnel 3 dérivations");
  if (state.monitorage.includes("SpO2")) mon.push("SpO2");
  if (state.monitorage.includes("VVP")) mon.push("voie veineuse périphérique");
  if (state.monitorage.includes("KTA")) mon.push("KTA");
  if (state.monitorage.includes("KTC")) mon.push("KTC");
  if (state.monitorage.includes("BIS")) mon.push("BIS");
  if (state.monitorage.includes("TOF")) mon.push("TOF");

  if (mon.length) {
    txt += "INSTALLATION\n";
    txt += mon.join(", ") + ".\n\n";
  }

  // INDUCTION
  const ordre = ["Sufentanil", "Rémifentanil", "Kétamine", "Propofol"];
  const meds = ordre.filter(x => state.induction.includes(x));
  const curares = state.curare.filter(x => x !== "Aucun");

  if (meds.length) {
    txt += "INDUCTION\n";
    txt += "Induction par " + meds.join(", ");

    if (curares.length) {
      txt += " puis curarisation par " + curares.join(", ");
    }

    txt += ".\n\n";
  }

  // VOIES AÉRIENNES
  if (state.va.length) {
    txt += "VOIES AÉRIENNES\n";

    if (state.va.includes("Ventilation spontanée")) {
      txt += "Geste effectué en ventilation spontanée.\n";
    }

    if (state.va.includes("Masque laryngé")) {
      txt += "Mise en place d'un masque laryngé.\n";
    }

    if (state.va.includes("Intubation oro-trachéale")) {
      txt += "Intubation oro-trachéale, auscultation symétrique, pression du ballonnet vérifiée au manomètre.\n";
    }

    txt += "\n";
  }

  // ENTRETIEN
  if (state.entretien) {
    txt += "ENTRETIEN\n";
    txt += state.entretien === "Sevoflurane"
      ? "Entretien anesthésique par sévoflurane.\n\n"
      : "Entretien anesthésique par propofol en AIVOC.\n\n";
  }

  // ANTIBIO
  txt += "ANTIBIOPROPHYLAXIE\n";
  txt += state.antibio === "Céfazoline"
    ? "Antibioprophylaxie par céfazoline.\n"
    : "Pas d'antibioprophylaxie.\n";

  report.value = txt;
}

function init() {
  initDate();

  fillSelect(anesthSelect, DATA.anesthesistes, "Choisir...");
  fillSelect(specialiteSelect, Object.keys(DATA.specialites));

  $("chirContainer").innerHTML = "";
  $("gesteContainer").innerHTML = "";

  addChir();
  addGeste();

  createChips("monitorage", DATA.monitorage, "monitorage");
  createChips("induction", DATA.induction, "induction");
  createChips("curare", ["Aucun", "Atracurium", "Rocuronium", "Célocurine"], "curare");
  createChips("vaOptions", ["Séquence rapide", "Ventilation spontanée", "Masque laryngé", "Intubation oro-trachéale"], "va");
  createChips("entretienOptions", DATA.entretien, "entretien", true);
  createChips("antibioOptions", DATA.antibio, "antibio", true);

  $("addChirBtn").onclick = addChir;
  $("addGesteBtn").onclick = addGeste;

  specialiteSelect.onchange = () => {
    updateChirurgiens();
    [...document.querySelectorAll(".geste-select")].forEach(sel => {
      fillSelect(sel, DATA.specialites[specialiteSelect.value]?.interventions || [], "Intervention...");
    });
    renderReport();
  };

  document.addEventListener("change", renderReport);
  document.addEventListener("input", renderReport);

  renderReport();
}

init();
