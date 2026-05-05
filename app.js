const $ = id => document.getElementById(id);

const report = $("report");
const anesthSelect = null;
const specialiteSelect = $("specialite");

const state = {
  monitorage: [],
  induction: [],
  curare: [],
  va: "",
  ventilation: "",
  entretien: "",
  analgesie: [],
  antibio: "",
  alr: [],
  neuraxial: [],
  reveil: [],
  transfusionActive: false,
  transfusion: [],
  peropForced: false,
  peropHidden: false
};

function initDate(){
  const d = new Date();

  $("date").value = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
}

function formatDateFR(v){
  if(!v) return "";

  const parts = v.split("-");
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}
function updateAnesthesistes(){
  document.querySelectorAll(".anesthesiste").forEach(sel=>{
    const current = sel.value;
    fillSelect(sel, DATA.anesthesistes, "Choisir...");
    if(DATA.anesthesistes.includes(current)) sel.value = current;
  });
}

function addAnesth(removable=true){
  const row = document.createElement("div");
  row.className = "field row-inline";

  row.innerHTML = removable
    ? `<select class="anesthesiste"></select><button class="remove-btn" type="button">–</button>`
    : `<select class="anesthesiste"></select>`;

  if(removable){
    row.querySelector(".remove-btn").onclick = ()=>{
      row.remove();
      renderReport();
    };
  }

  $("anesthContainer").appendChild(row);
  updateAnesthesistes();
}

function updateChirurgiens(){
  const list = DATA.specialites[specialiteSelect.value]?.chirurgiens || [];

  document.querySelectorAll(".chirurgien").forEach(sel=>{
    const current = sel.value;
    fillSelect(sel, list, "Chirurgien...");
    if(list.includes(current)) sel.value = current;
  });
}

function addChir(removable=true){
  const row = document.createElement("div");
  row.className = "field row-inline";

  row.innerHTML = removable
    ? `<select class="chirurgien"></select><button class="remove-btn" type="button">–</button>`
    : `<select class="chirurgien"></select>`;

  if(removable){
    row.querySelector(".remove-btn").onclick = ()=>{
      row.remove();
      renderReport();
    };
  }

  $("chirContainer").appendChild(row);
  updateChirurgiens();
}

function addGeste(removable=true){
  const list = DATA.specialites[specialiteSelect.value]?.interventions || [];

  const wrapper = document.createElement("div");
  wrapper.className = "field";

  wrapper.innerHTML = `
    <div class="row-inline">
      <select class="geste-select"></select>
      ${removable ? `<button class="remove-btn" type="button">–</button>` : ``}
    </div>
    <div class="geste-extra" style="margin-top:6px"></div>
  `;

  if(removable){
    wrapper.querySelector(".remove-btn").onclick = ()=>{
      wrapper.remove();
      state.peropForced = false;
      state.peropHidden = false;
      renderALR();
      renderAntibio();
      renderPeropVisibility();
      renderReport();
    };
  }

  $("gesteContainer").appendChild(wrapper);

  const sel = wrapper.querySelector(".geste-select");
  fillSelect(sel, list, "Intervention...");

  sel.addEventListener("change", ()=>{
    state.peropForced = false;
    state.peropHidden = false;
    renderGesteExtra(wrapper, sel.value);
    renderALR();
    renderAntibio();
    renderPeropVisibility();
    renderReport();
  });
}

function renderGesteExtra(wrapper, geste){
  const extra = wrapper.querySelector(".geste-extra");
  extra.innerHTML = "";

    if(DATA.lateralizedGestes.includes(geste)){
    const s = document.createElement("select");
    s.className = "laterality-select";

    let options = DATA.laterality;

    if(geste === "Colectomie"){
      options = ["Droite", "Gauche", "Totale"];
    }

    fillSelect(s, options, "Latéralité...");
    extra.appendChild(s);
  }

  if(DATA.textGestes.includes(geste)){
    const i = document.createElement("input");
    i.className = "precision-input";
    i.placeholder = "Précision...";
    extra.appendChild(i);
  }

  if(geste === "Autre..."){
    const i = document.createElement("input");
    i.className = "custom-geste";
    i.placeholder = "Préciser l'intervention";
    extra.appendChild(i);
  }
}

function buildGesteLabel(block){
  let geste = block.querySelector(".geste-select")?.value;

  if(!geste) return null;

  if(geste === "Autre..."){
    geste = block.querySelector(".custom-geste")?.value || "Autre";
  }

    const lat = block.querySelector(".laterality-select")?.value;

  if(lat){
    const feminin = [
      "PTH",
      "PTG",
      "Ostéosynthèse cheville",
      "Ostéosynthèse poignet",
      "Hernie inguinale",
      "Colectomie",
      "Annexectomie",
      "Kystectomie ovarienne",
      "Cataracte",
      "Prothèse d'épaule",
      "Arthroscopie de genou",
      "Arthroscopie d'épaule",
      "Mastectomie partielle",
      "Mastectomie totale"
    ];

    const pluriel = ["Varices"];

    let map = {
  "Droite":"droit",
  "Gauche":"gauche",
  "Bilatéral":"bilatéral",
  "Totale":"total"
};

    if(feminin.includes(geste)){
     map = {
  "Droite":"droite",
  "Gauche":"gauche",
  "Bilatéral":"bilatérale",
  "Totale":"totale"
};
    }

    if(pluriel.includes(geste)){
      map = {
        "Droite":"droites",
        "Gauche":"gauches",
        "Bilatéral":"bilatérales"
      };
    }

    if(geste === "Varices"){
      geste = "Stripping de varices";
    }

    geste += " " + map[lat];
  }

  const p = block.querySelector(".precision-input")?.value;
  if(p) geste += ` (${p})`;

  return geste;
}

function getSelectedGestesRaw(){
  return [...document.querySelectorAll(".geste-select")]
    .map(x=>x.value)
    .filter(Boolean);
}


function updateCurare(){
  const sr = $("sequenceRapide").checked;

  const list = sr
    ? ["Aucun","Atracurium","Rocuronium","Célocurine"]
    : ["Aucun","Atracurium","Rocuronium"];

  state.curare = state.curare.filter(x=>list.includes(x));
  createChips("curare", list, "curare");
}

function handleSequenceRapideChange(){
  if($("sequenceRapide").checked){
    $("ventilationBlock").classList.add("hidden");
    state.ventilation = "";
    $("ventilationPrecision").value = "";
    $("ventilationPrecision").classList.add("hidden");
    $("ventilationOptions").innerHTML = "";
  }else if(state.va === "Intubation oro-trachéale"){
    $("ventilationBlock").classList.remove("hidden");

    createChips(
      "ventilationOptions",
      ["Facile", "Difficile", "Impossible", "Autre"],
      "ventilation",
      true
    );
  }

  updateCurare();
  renderReport();
}

function renderALR(){
  const gestes = getSelectedGestesRaw();

  const alrs = new Set();
  const neuraxials = new Set();

  gestes.forEach(g=>{
    (ALR_PERIPHERIQUE_MAP[g] || []).forEach(a=>alrs.add(a));
    (ALR_NEURAXIAL_MAP[g] || []).forEach(a=>neuraxials.add(a));
  });

  const alrList = [...alrs];
  const neuraxialList = [...neuraxials];

  state.alr = state.alr.filter(x=>alrList.includes(x));
  state.neuraxial = state.neuraxial.filter(x=>neuraxialList.includes(x));

  if(alrList.length === 0){
    $("alrCard").classList.add("hidden");
    state.alr = [];
  }else{
    $("alrCard").classList.remove("hidden");
    createChips("alrOptions", alrList, "alr");
  }

  if(neuraxialList.length === 0){
    $("neuraxialCard").classList.add("hidden");
    state.neuraxial = [];
    $("periduraleDetails").classList.add("hidden");
    $("periduraleNiveau").value = "";
  }else{
    $("neuraxialCard").classList.remove("hidden");
    createChips("neuraxialOptions", neuraxialList, "neuraxial");
    renderNeuraxialDetails();
  }
}

function renderAntibio(){
  const gestes = getSelectedGestesRaw();
  const antibios = new Set();

  gestes.forEach(g=>{
    antibios.add(ANTIBIO_MAP[g] || "Aucune");
  });

  let list = [...antibios];

  if(list.length === 0){
    list = ["Aucune"];
  }

  if(!list.includes("Autre")){
    list.push("Autre");
  }

  if(!list.includes(state.antibio)){
    state.antibio = list[0];
  }

  createChips("antibioOptions", list, "antibio", true);
  renderAntibioDetails();
}

function shouldHidePeropByDefault(){
  const spec = specialiteSelect.value;
  const gestes = getSelectedGestesRaw();

  if(!gestes.length){
    return false;
  }

  if(SIMPLE_PEROP_SPECIALITES.includes(spec)){
    return true;
  }

  return gestes.every(g=>SIMPLE_PEROP_GESTES.includes(g));
}

function renderPeropVisibility(){
  const hideByDefault = shouldHidePeropByDefault();

  if(state.peropHidden || (hideByDefault && !state.peropForced)){
    $("peropCard").classList.add("hidden");
    $("showPeropBtn").classList.remove("hidden");
  }else{
    $("peropCard").classList.remove("hidden");
    $("showPeropBtn").classList.add("hidden");
  }
}

async function copyReport(){
  const txt = buildDPIReport();

  try{
    await navigator.clipboard.writeText(txt);
  }catch{
    const old = report.value;
    report.value = txt;
    report.select();
    document.execCommand("copy");
    report.value = old;
  }

  $("copyBtn").textContent = "Copié ✓";

  setTimeout(()=>{
    $("copyBtn").textContent = "Copier le CR";
  }, 1500);
}
function resetForm(){
  location.reload();
}
function init(){
  initDate();

  if(!DATA.monitorage.includes("PICC Line")) DATA.monitorage.push("PICC Line");
  if(!DATA.monitorage.includes("Mid Line")) DATA.monitorage.push("Mid Line");

$("anesthContainer").innerHTML = "";
addAnesth(false);
fillSelect(specialiteSelect, Object.keys(DATA.specialites), "Choisir...");
  
  $("chirContainer").innerHTML = "";
  $("gesteContainer").innerHTML = "";

  addChir(false);
  addGeste(false);

  createChips("monitorage", DATA.monitorage, "monitorage");
  createChips("induction", DATA.induction, "induction");
  createChips("curare", ["Aucun","Atracurium","Rocuronium"], "curare");

  createChips(
    "vaOptions",
    ["Ventilation spontanée","Masque laryngé","Intubation oro-trachéale"],
    "va",
    true
  );

  createChips("entretienOptions", DATA.entretien, "entretien", true);

  createChips(
    "analgesieOptions",
    ["Paracétamol", "Kétoprofène", "Néfopam", "Tramadol", "Morphine"],
    "analgesie"
  );
    createChips(
    "reveilOptions",
    ["Réveil calme", "Extubation sur table", "Patient laissé intubé", "Ventilation spontanée"],
    "reveil"
  );
  createChips(
  "transfusionOptions",
  ["CGR", "PFC", "Plaquettes", "Fibrinogène", "PCC", "Calcium"],
  "transfusion"
);

  renderAntibio();

$("addAnesthBtn").onclick = ()=>addAnesth(true);
$("addChirBtn").onclick = ()=>addChir(true);
$("addGesteBtn").onclick = ()=>addGeste(true);
$("resetBtn").onclick = resetForm;
$("copyBtn").onclick = copyReport;

$("showPeropBtn").onclick = ()=>{
  state.peropForced = true;
  state.peropHidden = false;
  renderPeropVisibility();
  renderReport();
};

$("removePeropBtn").onclick = ()=>{
  state.peropHidden = true;
  state.peropForced = false;
  renderPeropVisibility();
  renderReport();
};

  $("sequenceRapide").addEventListener("change", handleSequenceRapideChange);

  $("noradCheck").addEventListener("change", ()=>{
    $("noradBlock").classList.toggle("hidden", !$("noradCheck").checked);
    renderReport();
  });

  $("incidentCheck").addEventListener("change", ()=>{
    $("incidentBlock").classList.toggle("hidden", !$("incidentCheck").checked);
    renderReport();
  });

  specialiteSelect.onchange = ()=>{
    state.peropForced = false;
    state.peropHidden = false;
    updateChirurgiens();

    document.querySelectorAll(".field").forEach(block=>{
      const sel = block.querySelector(".geste-select");

      if(sel){
        fillSelect(
          sel,
          DATA.specialites[specialiteSelect.value]?.interventions || [],
          "Intervention..."
        );

        renderGesteExtra(block, sel.value);
      }
    });

    renderALR();
    renderAntibio();
    renderPeropVisibility();
    renderReport();
  };

  document.addEventListener("change", renderReport);
  document.addEventListener("input", renderReport);

  renderALR();
  renderAntibio();
  renderPeropVisibility();
  renderReport();
}

init();
