const $ = id => document.getElementById(id);

const report = $("report");
const anesthSelect = $("anesthesiste");
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
  peropForced: false
};

function fillSelect(select, list, placeholder=""){
  select.innerHTML = "";

  if(placeholder){
    const o = document.createElement("option");
    o.value = "";
    o.textContent = placeholder;
    select.appendChild(o);
  }

  list.forEach(v=>{
    const o = document.createElement("option");
    o.value = v;
    o.textContent = v;
    select.appendChild(o);
  });
}

function createChips(id, list, key, single=false){
  const box = $(id);
  box.innerHTML = "";

  list.forEach(item=>{
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = item;

    if(single && state[key] === item) chip.classList.add("active");
    if(!single && Array.isArray(state[key]) && state[key].includes(item)) chip.classList.add("active");

    chip.onclick = ()=>{
      if(single){
        state[key] = state[key] === item ? "" : item;
      }else{
        const arr = state[key];
        const idx = arr.indexOf(item);
        idx > -1 ? arr.splice(idx, 1) : arr.push(item);
      }

      createChips(id, list, key, single);

      if(key === "monitorage") renderMonitorageDetails();
      if(key === "va") renderVADetails();
      if(key === "ventilation") renderVentilationDetails();
      if(key === "neuraxial") renderNeuraxialDetails();
      if(key === "antibio") renderAntibioDetails();

      renderALR();
      renderPeropVisibility();
      renderReport();
    };

    box.appendChild(chip);
  });
}

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
    fillSelect(s, DATA.laterality, "Latéralité...");
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
    const map = {
      "Droite":"droite",
      "Gauche":"gauche",
      "Bilatéral":"bilatéral"
    };

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

function renderMonitorageDetails(){
  const box = $("monitorageDetails");

  const previousScope = $("scopeDerivations")?.value || "3 dérivations";
  const previousKta = $("ktaSite")?.value || "";
  const previousKtc = $("ktcSite")?.value || "";

  box.innerHTML = "";

  if(state.monitorage.includes("Scope")){
    const s = document.createElement("select");
    s.id = "scopeDerivations";

    const list = ["3 dérivations", "5 dérivations"];
    fillSelect(s, list, "");

    if(list.includes(previousScope)) s.value = previousScope;

    box.appendChild(s);
  }

  if(state.monitorage.includes("KTA")){
    const s = document.createElement("select");
    s.id = "ktaSite";

    const list = ["Radial droit","Radial gauche","Fémoral droit","Fémoral gauche"];
    fillSelect(s, list, "Localisation KTA...");

    if(list.includes(previousKta)) s.value = previousKta;

    box.appendChild(s);
  }

  if(state.monitorage.includes("KTC")){
    const s = document.createElement("select");
    s.id = "ktcSite";

    const list = [
      "Jugulaire interne droite",
      "Jugulaire interne gauche",
      "Sous-clavier droit",
      "Sous-clavier gauche",
      "Fémoral droit",
      "Fémoral gauche"
    ];

    fillSelect(s, list, "Localisation KTC...");

    if(list.includes(previousKtc)) s.value = previousKtc;

    box.appendChild(s);
  }
}

function updateCurare(){
  const sr = $("sequenceRapide").checked;

  const list = sr
    ? ["Aucun","Atracurium","Rocuronium","Célocurine"]
    : ["Aucun","Atracurium","Rocuronium"];

  state.curare = state.curare.filter(x=>list.includes(x));
  createChips("curare", list, "curare");
}

function renderVADetails(){
  const box = $("vaDetails");
  box.innerHTML = "";

  $("srBlock").classList.add("hidden");
  $("ventilationBlock").classList.add("hidden");

  $("sequenceRapide").checked = false;
  state.ventilation = "";
  $("ventilationPrecision").classList.add("hidden");
  $("ventilationPrecision").value = "";

  if(state.va === "Masque laryngé"){
    box.innerHTML += `<input id="mlSize" placeholder="Taille masque laryngé">`;
  }

  if(state.va === "Intubation oro-trachéale"){
    box.innerHTML += `<input id="tubeSize" placeholder="Taille sonde (7.5)">`;
    $("srBlock").classList.remove("hidden");
    $("ventilationBlock").classList.remove("hidden");

    createChips(
      "ventilationOptions",
      ["Facile", "Difficile", "Impossible", "Autre"],
      "ventilation",
      true
    );
  }

  updateCurare();
}

function renderVentilationDetails(){
  const isOther = state.ventilation === "Autre";

  $("ventilationPrecision").classList.toggle("hidden", !isOther);

  if(!isOther){
    $("ventilationPrecision").value = "";
  }
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

function renderNeuraxialDetails(){
  const hasPeridurale =
    state.neuraxial.includes("Péridurale") ||
    state.neuraxial.includes("Péridurale thoracique");

  $("periduraleDetails").classList.toggle("hidden", !hasPeridurale);

  if(!hasPeridurale){
    $("periduraleNiveau").value = "";
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

function renderAntibioDetails(){
  const isOther = state.antibio === "Autre";

  $("antibioOtherBlock").classList.toggle("hidden", !isOther);

  if(!isOther){
    $("antibioOtherText").value = "";
  }
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

  if(hideByDefault && !state.peropForced){
    $("peropCard").classList.add("hidden");
    $("showPeropBtn").classList.remove("hidden");
  }else{
    $("peropCard").classList.remove("hidden");
    $("showPeropBtn").classList.add("hidden");
  }
}

async function copyReport(){
  try{
    await navigator.clipboard.writeText(report.value);
  }catch{
    report.select();
    document.execCommand("copy");
  }

  $("copyBtn").textContent = "Copié ✓";

  setTimeout(()=>{
    $("copyBtn").textContent = "Copier le CR";
  }, 1500);
}

function init(){
  initDate();

  if(!DATA.monitorage.includes("PICC Line")) DATA.monitorage.push("PICC Line");
  if(!DATA.monitorage.includes("Mid Line")) DATA.monitorage.push("Mid Line");

  fillSelect(anesthSelect, DATA.anesthesistes, "Choisir...");
  fillSelect(specialiteSelect, Object.keys(DATA.specialites));

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

  renderAntibio();

  $("addChirBtn").onclick = ()=>addChir(true);
  $("addGesteBtn").onclick = ()=>addGeste(true);
  $("copyBtn").onclick = copyReport;

  $("showPeropBtn").onclick = ()=>{
    state.peropForced = true;
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
