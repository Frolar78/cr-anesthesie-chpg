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

const ALR_PERIPHERIQUE_MAP = {
  "PTH": ["PENG bloc", "Bloc fémoral"],
  "PTG": ["Bloc saphène", "Bloc obturateur", "Bloc fémoral"],
  "Ostéosynthèse cheville": ["Bloc sciatique au creux poplité", "Bloc saphène"],
  "Ostéosynthèse poignet": ["Bloc axillaire", "Blocs distaux"],
  "Canal carpien": ["Bloc axillaire", "Blocs distaux"],
  "Hallux valgus": ["Bloc sciatique", "Blocs de cheville"],
  "Clou gamma": ["Bloc cutané latéral de cuisse", "Bloc fémoral"],
  "Prothèse d'épaule": ["Bloc inter-scalénique"],
  "Arthroscopie de genou": ["Bloc saphène", "Bloc fémoral"],
  "Arthroscopie d'épaule": ["Bloc inter-scalénique"],

  "Hernie inguinale": ["Bloc ilio-inguinal", "TAP bloc"],
  "Hernie ombilicale": ["TAP bloc", "Bloc des grands droits"],
  "Hémorroïdectomie": ["Bloc pudendal"],
  "Colectomie": ["TAP bloc"],
  "Mastectomie totale": ["Bloc paravertébral", "PECS bloc"],

  "Lobectomie pulmonaire": ["Bloc paravertébral", "Bloc érecteur du rachis"],
  "Segmentectomie": ["Bloc paravertébral", "Bloc érecteur du rachis"],
  "Talcage pleural": ["Bloc paravertébral", "Bloc érecteur du rachis"]
};

const ALR_NEURAXIAL_MAP = {
  "Duodénopancréatectomie céphalique": ["Péridurale thoracique"],
  "Œsophagectomie Lewis-Santy": ["Péridurale thoracique"],
  "CHIP": ["Péridurale thoracique"],
  "Lobectomie pulmonaire": ["Péridurale thoracique"],
  "Césarienne": ["Rachianesthésie", "Péridurale"],
  "Curetage": ["Rachianesthésie"],
  "Cerclage": ["Rachianesthésie"],
  "Cystectomie totale": ["Péridurale thoracique"]
};

const ANTIBIO_MAP = {
  "PTH": "Céfazoline",
  "PTG": "Céfazoline",
  "Ostéosynthèse cheville": "Céfazoline",
  "Ostéosynthèse poignet": "Céfazoline",
  "Recalibrage": "Céfazoline",
  "Canal carpien": "Aucune",
  "Hallux valgus": "Céfazoline",
  "Clou gamma": "Céfazoline",
  "Prothèse d'épaule": "Céfazoline",
  "Arthroscopie de genou": "Aucune",
  "Arthroscopie d'épaule": "Aucune",

  "Duodénopancréatectomie céphalique": "Céfoxitine",
  "Œsophagectomie Lewis-Santy": "Céfazoline",
  "Appendicectomie": "Céfoxitine",
  "Hernie inguinale": "Céfazoline",
  "Hernie ombilicale": "Céfazoline",
  "Hémorroïdectomie": "Métronidazole",
  "Colectomie": "Céfoxitine",
  "Coelioscopie exploratrice": "Aucune",
  "Cholécystectomie": "Aucune",
  "Promontofixation": "Céfazoline",
  "Mastectomie partielle": "Céfazoline",
  "Mastectomie totale": "Céfazoline",
  "Injection Bulkamide": "Aucune",
  "Annexectomie": "Céfazoline",
  "Hystérectomie": "Céfazoline",
  "CHIP": "Céfoxitine",
  "Kystectomie ovarienne": "Céfazoline",
  "Segmentectomie hépatique": "Céfoxitine",

  "Lobectomie pulmonaire": "Céfazoline",
  "Segmentectomie": "Céfazoline",
  "Talcage pleural": "Aucune",
  "Médiastinoscopie": "Aucune",

  "Gastroscopie": "Aucune",
  "Coloscopie": "Aucune",
  "Echo-endoscopie haute": "Aucune",
  "RSF": "Aucune",
  "ERCP": "Céfoxitine",
  "Pose de prothèse biliaire": "Céfoxitine",
  "Dissection sous-muqueuse": "Aucune",
  "Mucosectomie": "Aucune",
  "POEM": "Amoxicilline / Acide clavulanique",

  "Ablation de FA": "Aucune",
  "Ablation de flutter": "Aucune",

  "Vertébroplastie": "Céfazoline",
  "Embolisation": "Aucune",

  "Césarienne": "Céfazoline",
  "Conisation": "Aucune",
  "Nymphoplastie de réduction": "Aucune",
  "Curetage": "Aucune",
  "Cerclage": "Aucune",

  "Prostatectomie totale": "Aucune",
  "Biopsies de prostate": "Céfazoline",
  "REP": "Céfazoline",
  "REV": "Céfazoline",
  "URS + Laser": "Céfazoline",
  "Montée de JJ": "Céfazoline",
  "Cystectomie totale": "Céfoxitine",

  "Septoplastie": "Aucune",
  "Rhinoplastie": "Aucune",
  "Thyroïdectomie totale": "Aucune",
  "Thyroïdectomie partielle": "Aucune",
  "Parathyroidectomie": "Aucune",
  "Extraction DDS": "Amoxicilline / Acide clavulanique",
  "Carcinome cutané": "Aucune",
  "Cholestéatome": "Aucune",
  "Adénoidectomie": "Aucune",
  "DTT": "Aucune",
  "Turbinoplastie": "Aucune",
  "Adénoamygdalectomie": "Aucune",

  "Varices": "Aucune",
  "Cataracte": "Céfuroxime"
};

const ANTIBIO_DOSES = {
  "Céfazoline": "2 g",
  "Céfoxitine": "2 g",
  "Amoxicilline / Acide clavulanique": "2 g",
  "Métronidazole": "1 g",
  "Céfuroxime": ""
};

const SIMPLE_PEROP_SPECIALITES = [
  "Endoscopie digestive",
  "ORL",
  "Ophtalmologie",
  "Cardiologie interventionnelle",
  "Radiologie interventionnelle"
];

const SIMPLE_PEROP_GESTES = [
  "Vertébroplastie",
  "Canal carpien",
  "Ostéosynthèse poignet",
  "Ostéosynthèse cheville",
  "Arthroscopie de genou",
  "Arthroscopie d'épaule",
  "Appendicectomie",
  "Cholécystectomie",
  "Hernie inguinale",
  "Hernie ombilicale",
  "Conisation",
  "Cerclage",
  "Nymphoplastie de réduction",
  "Biopsies de prostate",
  "REV",
  "URS + Laser",
  "Montée de JJ"
];

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
        if(state[key] === item){
          state[key] = "";
          chip.classList.remove("active");
        }else{
          state[key] = item;
          [...box.children].forEach(c=>c.classList.remove("active"));
          chip.classList.add("active");
        }
      }else{
        const arr = state[key];
        const idx = arr.indexOf(item);

        if(idx > -1){
          arr.splice(idx, 1);
          chip.classList.remove("active");
        }else{
          arr.push(item);
          chip.classList.add("active");
        }
      }

      if(key === "monitorage") renderMonitorageDetails();
      if(key === "va"){
        renderVADetails();
        updateCurare();
      }
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

    if(list.includes(previousScope)){
      s.value = previousScope;
    }

    box.appendChild(s);
  }

  if(state.monitorage.includes("KTA")){
    const s = document.createElement("select");
    s.id = "ktaSite";

    const list = ["Radial droit","Radial gauche","Fémoral droit","Fémoral gauche"];
    fillSelect(s, list, "Localisation KTA...");

    if(list.includes(previousKta)){
      s.value = previousKta;
    }

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

    if(list.includes(previousKtc)){
      s.value = previousKtc;
    }

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
  if(state.ventilation === "Autre"){
    $("ventilationPrecision").classList.remove("hidden");
  }else{
    $("ventilationPrecision").classList.add("hidden");
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
    createChips("alrOptions", alrList, "alr", false);
  }

  if(neuraxialList.length === 0){
    $("neuraxialCard").classList.add("hidden");
    state.neuraxial = [];
    $("periduraleDetails").classList.add("hidden");
    $("periduraleNiveau").value = "";
  }else{
    $("neuraxialCard").classList.remove("hidden");
    createChips("neuraxialOptions", neuraxialList, "neuraxial", false);
    renderNeuraxialDetails();
  }
}

function renderNeuraxialDetails(){
  const hasPeridurale =
    state.neuraxial.includes("Péridurale") ||
    state.neuraxial.includes("Péridurale thoracique");

  if(hasPeridurale){
    $("periduraleDetails").classList.remove("hidden");
  }else{
    $("periduraleDetails").classList.add("hidden");
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
  if(state.antibio === "Autre"){
    $("antibioOtherBlock").classList.remove("hidden");
  }else{
    $("antibioOtherBlock").classList.add("hidden");
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
    $("copyBtn").textContent = "Copié ✓";

    setTimeout(()=>{
      $("copyBtn").textContent = "Copier le CR";
    }, 1500);
  }catch{
    report.select();
    document.execCommand("copy");

    $("copyBtn").textContent = "Copié ✓";

    setTimeout(()=>{
      $("copyBtn").textContent = "Copier le CR";
    }, 1500);
  }
}

function renderReport(){
  const date = formatDateFR($("date").value);
  const anesth = anesthSelect.value;

  const chirs = [...document.querySelectorAll(".chirurgien")]
    .map(x=>x.value)
    .filter(Boolean);

  const gestes = [...document.querySelectorAll(".field")]
    .filter(x=>x.querySelector(".geste-select"))
    .map(buildGesteLabel)
    .filter(Boolean);

  let txt = "INTERVENTION\n";
  txt += `Date : ${date}\n`;
  txt += `Anesthésiste : ${anesth}\n`;
  txt += `Chirurgien : ${chirs.join(", ")}\n`;
  txt += `Intervention : ${gestes.join(" associée à ")}\n\n`;

  const mon = [];

  if(state.monitorage.includes("Scope")){
    const derivations = $("scopeDerivations")?.value || "3 dérivations";
    mon.push(`Scope cardiotensionnel ${derivations}`);
  }

  if(state.monitorage.includes("SpO2")) mon.push("SpO2");
  if(state.monitorage.includes("VVP")) mon.push("Voie veineuse périphérique");
  if(state.monitorage.includes("PICC Line")) mon.push("Présence d'un PICC Line");
  if(state.monitorage.includes("Mid Line")) mon.push("Présence d'un Mid Line");
  if(state.monitorage.includes("BIS")) mon.push("BIS");
  if(state.monitorage.includes("TOF")) mon.push("TOF");

  if(mon.length || state.monitorage.includes("KTA") || state.monitorage.includes("KTC")){
    txt += "INSTALLATION\n";

    if(mon.length){
      txt += mon.join(", ") + ".\n";
    }

    const kta = $("ktaSite")?.value;

    if(kta){
      txt += kta.includes("Radial")
        ? `Mise en place d'un cathéter artériel en ${kta.toLowerCase()} après test d'Allen négatif.\n`
        : `Mise en place d'un cathéter artériel en ${kta.toLowerCase()}.\n`;
    }

    const ktc = $("ktcSite")?.value;

    if(ktc){
      txt += `Mise en place d'un cathéter veineux central échoguidé en ${ktc.toLowerCase()}.\n`;
    }

    txt += "\n";
  }

  const ordre = ["Sufentanil","Rémifentanil","Kétamine","Etomidate","Propofol"];
  const meds = ordre.filter(x=>state.induction.includes(x));
  const curares = state.curare.filter(x=>x !== "Aucun");

  if(meds.length){
    txt += "INDUCTION\n";

    txt += $("sequenceRapide").checked
      ? "Induction en séquence rapide par "
      : "Induction par ";

    txt += meds.join(", ");

    if(curares.length){
      txt += " puis curarisation par " + curares.join(", ");
    }

    txt += ".\n\n";
  }

  if(state.va){
    txt += "VOIES AÉRIENNES\n";

    if(state.va === "Ventilation spontanée"){
      txt += "Geste effectué en ventilation spontanée.\n";
    }

    if(state.va === "Masque laryngé"){
      txt += `Mise en place d'un masque laryngé taille ${$("mlSize")?.value || ""}.\n`;
    }

    if(state.va === "Intubation oro-trachéale"){
      if(!$("sequenceRapide").checked && state.ventilation){
        if(state.ventilation === "Facile") txt += "Ventilation au masque facile.\n";
        if(state.ventilation === "Difficile") txt += "Ventilation au masque difficile.\n";
        if(state.ventilation === "Impossible") txt += "Ventilation au masque impossible.\n";

        if(state.ventilation === "Autre"){
          const precision = $("ventilationPrecision").value;
          if(precision) txt += `Ventilation au masque : ${precision}.\n`;
        }
      }

      txt += `Intubation oro-trachéale atraumatique avec une sonde ${$("tubeSize")?.value || ""}, auscultation symétrique, pression du ballonnet vérifiée au manomètre, absence de bris dentaire.\n`;
    }

    txt += "\n";
  }

  if(state.entretien){
    txt += "ENTRETIEN\n";

    txt += state.entretien === "Sevoflurane"
      ? "Entretien anesthésique par sévoflurane.\n\n"
      : "Entretien anesthésique par propofol en AIVOC.\n\n";
  }

  if(state.analgesie.length){
    txt += "ANALGÉSIE\n";
    txt += `Analgésie multimodale par ${state.analgesie.join(", ")}.\n\n`;
  }

  if(state.alr.length){
    txt += "ALR PÉRIPHÉRIQUE\n";
    txt += `ALR de type ${state.alr.join(", ")} réalisée de manière échoguidée avec ${$("localVolume").value} mL de ${$("localAgent").value}.\n\n`;
  }

  if(state.neuraxial.length){
    txt += "ALR NEURAXIALE\n";

    state.neuraxial.forEach(n=>{
      if(n === "Péridurale" || n === "Péridurale thoracique"){
        const niveau = $("periduraleNiveau").value;
        txt += `${n} réalisée`;
        if(niveau) txt += ` au niveau ${niveau}`;
        txt += ".\n";
      }else{
        txt += `${n} réalisée.\n`;
      }
    });

    txt += "\n";
  }

  const peropVisible = !$("peropCard").classList.contains("hidden");
  const diurese = $("diurese").value;
  const saignement = $("saignement").value;
  const remplissage = $("remplissage").value;
  const norad = $("noradCheck").checked;
  const noradText = $("noradText").value;
  const incident = $("incidentCheck").checked;
  const incidentText = $("incidentText").value;

  if(peropVisible && (diurese || saignement || remplissage || norad || incident)){
    txt += "PER-OPÉRATOIRE\n";

    if(diurese) txt += `Diurèse : ${diurese} mL.\n`;
    if(saignement) txt += `Saignement estimé : ${saignement} mL.\n`;
    if(remplissage) txt += `Remplissage : ${remplissage}.\n`;

    if(norad){
      txt += "Support vasopresseur peropératoire par noradrénaline 16 µg/mL";
      if(noradText) txt += ` (${noradText})`;
      txt += ".\n";
    }

    if(incident && incidentText){
      txt += `Incident peropératoire : ${incidentText}\n`;
    }

    txt += "\n";
  }

  txt += "ANTIBIOPROPHYLAXIE\n";

  if(state.antibio === "Aucune"){
    txt += "Pas d'antibioprophylaxie.\n";
  }else if(state.antibio === "Autre"){
    const autre = $("antibioOtherText").value;
    txt += autre
      ? `Antibioprophylaxie par ${autre}.\n`
      : "Antibioprophylaxie par autre antibiotique à préciser.\n";
  }else{
    const dose = ANTIBIO_DOSES[state.antibio];
    txt += dose
      ? `Antibioprophylaxie par ${state.antibio} ${dose}.\n`
      : `Antibioprophylaxie par ${state.antibio}.\n`;
  }

  report.value = txt;
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
