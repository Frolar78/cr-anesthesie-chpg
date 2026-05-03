const $ = (id) => document.getElementById(id);

const anesthSelect = $("anesthesiste");
const specialiteSelect = $("specialite");
const chirurgienSelect = $("chirurgien");
const interventionSelect = $("intervention");
const autreInterventionBox = $("autreInterventionBox");
const autreIntervention = $("autreIntervention");
const report = $("report");
const contextFields = $("contextFields");

const monitorageBox = $("monitorage");
const inductionBox = $("induction");
const curareBox = $("curare");
const vaOptions = $("vaOptions");
const vaDetails = $("vaDetails");
const entretienOptions = $("entretienOptions");
const antibioOptions = $("antibioOptions");
const alrCard = $("alrCard");
const alrOptions = $("alrOptions");

const ALR_MAP = {
  "PTH": ["Bloc fémoral"],
  "PTG": ["Bloc fémoral", "Bloc saphène au canal des adducteurs"],
  "Hallux valgus": ["Bloc sciatique au creux poplité"],
  "Clou gamma": ["Bloc cutané latéral de cuisse"],
  "Lobectomie pulmonaire": ["Bloc paravertébral", "Bloc érecteur du rachis"],
  "Appendicectomie": ["TAP-bloc"],
  "Hernie inguinale": ["Bloc ilio-inguinal"],
  "Hémorroïdectomie": ["Bloc pudendal"],
  "Colectomie": ["Bloc des grands droits", "TAP-bloc"],
  "Césarienne": ["TAP-bloc"]
};

function fillSelect(select, list) {
  select.innerHTML = "";
  list.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

function makeChecks(container, list, name, type="checkbox") {
  container.innerHTML = "";
  list.forEach(item => {
    const label = document.createElement("label");
    label.className = type === "checkbox" ? "check-item" : "";
    label.innerHTML = `
      <input type="${type}" name="${name}" value="${item}">
      ${item}
    `;
    container.appendChild(label);
  });
}

function init() {
  fillSelect(anesthSelect, DATA.anesthesistes);
  fillSelect(specialiteSelect, Object.keys(DATA.specialites));

  makeChecks(monitorageBox, DATA.monitorage, "monitorage");
  makeChecks(inductionBox, DATA.induction, "induction");
  makeChecks(curareBox, DATA.curare, "curare");

  makeChecks(vaOptions, [
    "Ventilation spontanée",
    "Masque laryngé",
    "Intubation oro-trachéale"
  ], "va", "radio");
  vaOptions.className = "radio-list";

  makeChecks(entretienOptions, [
    "Sevoflurane",
    "Propofol AIVOC"
  ], "entretien", "radio");
  entretienOptions.className = "radio-list";

  makeChecks(antibioOptions, [
    "Céfazoline",
    "Non"
  ], "antibio", "radio");
  antibioOptions.className = "radio-list";

  updateSpecialite();

  document.addEventListener("change", handleChange);
  $("copyBtn").addEventListener("click", copyReport);
}

function updateSpecialite() {
  const spec = specialiteSelect.value;
  const data = DATA.specialites[spec];

  fillSelect(chirurgienSelect, data.chirurgiens);
  fillSelect(interventionSelect, data.interventions);

  updateIntervention();
}

function updateIntervention() {
  const intervention = interventionSelect.value;

  autreInterventionBox.classList.toggle(
    "hidden",
    intervention !== "Autre..."
  );

  renderContextFields(intervention);
  renderALR(intervention);
}

function renderContextFields(intervention) {
  contextFields.innerHTML = "";

  if (intervention === "Vertébroplastie") {
    contextFields.innerHTML = `
      <div class="field">
        <label>Niveau(x)</label>
        <input id="niveauField" placeholder="Ex : T12-L1">
      </div>
    `;
  }

  if (intervention === "Embolisation") {
    contextFields.innerHTML = `
      <div class="field">
        <label>Embolisation de</label>
        <input id="embolisationField" placeholder="Ex : fibrome">
      </div>
    `;
  }
}

function renderALR(intervention) {
  const alrs = ALR_MAP[intervention];

  if (!alrs) {
    alrCard.classList.add("hidden");
    return;
  }

  alrCard.classList.remove("hidden");
  makeChecks(alrOptions, [...alrs, "Aucune"], "alr", "radio");
  alrOptions.className = "radio-list";
}

function handleChange(e) {
  if (e.target.id === "specialite") updateSpecialite();
  if (e.target.id === "intervention") updateIntervention();

  renderVADetails();
  renderReport();
}

function renderVADetails() {
  vaDetails.innerHTML = "";

  const selected = document.querySelector('input[name="va"]:checked');
  if (!selected) return;

  if (selected.value === "Masque laryngé") {
    vaDetails.innerHTML = `
      <div class="field">
        <label>Taille du masque</label>
        <input id="mlSize" placeholder="Ex : 4">
      </div>
    `;
  }

  if (selected.value === "Intubation oro-trachéale") {
    vaDetails.innerHTML = `
      <div class="field">
        <label>Taille de sonde</label>
        <input id="tubeSize" placeholder="Ex : 7.5">
      </div>
    `;
  }
}

function valuesOf(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)]
    .map(el => el.value);
}

function valueOf(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : "";
}

function renderReport() {
  const monitorage = valuesOf("monitorage");
  const induction = valuesOf("induction");
  const curare = valuesOf("curare");
  const va = valueOf("va");
  const entretien = valueOf("entretien");
  const antibio = valueOf("antibio");
  const alr = valueOf("alr");

  let txt = "";

  txt += "INSTALLATION\n";
  if (monitorage.length) {
    txt += "Installation en salle d'intervention avec monitorage comprenant " +
      monitorage.join(", ") + ".\n\n";
  }

  txt += "INDUCTION\n";
  if (induction.length) {
    txt += "Induction intraveineuse par " +
      induction.join(", ") + ".\n\n";
  }

  txt += "CURARISATION\n";
  if (curare.length) {
    txt += "Curarisation par " + curare.join(", ") + ".\n\n";
  }

  txt += "VOIES AÉRIENNES\n";
  if (va === "Masque laryngé") {
    const size = $("mlSize")?.value || "";
    txt += "Mise en place d'un masque laryngé taille " + size + ".\n\n";
  } else if (va === "Intubation oro-trachéale") {
    const size = $("tubeSize")?.value || "";
    txt += "Intubation oro-trachéale avec une sonde " + size + ".\n\n";
  } else if (va) {
    txt += "Ventilation spontanée conservée.\n\n";
  }

  txt += "ENTRETIEN\n";
  if (entretien) {
    txt += "Entretien anesthésique par " + entretien + ".\n\n";
  }

  if (alr && alr !== "Aucune") {
    txt += "ALR\n";
    txt += `ALR de type ${alr} réalisée de manière échoguidée avec ${
      $("localVolume").value
    } mL de ${$("localAgent").value}.\n\n`;
  }

  txt += "ANTIBIOPROPHYLAXIE\n";
  if (antibio && antibio !== "Non") {
    txt += "Antibioprophylaxie par céfazoline.\n";
  } else {
    txt += "Pas d'antibioprophylaxie.\n";
  }

  report.value = txt;
}

function copyReport() {
  navigator.clipboard.writeText(report.value);
  $("copyBtn").textContent = "Copié ✓";
  setTimeout(() => {
    $("copyBtn").textContent = "Copier le CR";
  }, 1500);
}

init();
renderReport();
