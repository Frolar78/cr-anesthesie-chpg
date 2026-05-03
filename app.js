const $ = id => document.getElementById(id);

const report = $("report");
const anesthSelect = $("anesthesiste");
const specialiteSelect = $("specialite");

const state = {
  monitorage: [],
  induction: [],
  curare: [],
  va: "",
  entretien: "",
  antibio: "",
  alr: ""
};

const ALR_SPECIALITES = [
  "Orthopédie",
  "Viscéral",
  "Thoracique",
  "Gynécologie / Obstétrique"
];

const ALR_MAP = {
  "PTH":["Bloc fémoral","Bloc axillaire"],
  "PTG":["Bloc fémoral","Bloc saphène au canal des adducteurs"],
  "Hallux valgus":["Bloc sciatique au creux poplité"],
  "Clou gamma":["Bloc cutané latéral de cuisse"],
  "Lobectomie pulmonaire":["Bloc paravertébral","Bloc érecteur du rachis"],
  "Appendicectomie":["TAP-bloc"],
  "Hernie inguinale":["Bloc ilio-inguinal"],
  "Hémorroïdectomie":["Bloc pudendal"],
  "Colectomie":["Bloc des grands droits","TAP-bloc"],
  "Césarienne":["TAP-bloc"]
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

function createChips(id,list,key,single=false){
  const box = $(id);
  box.innerHTML = "";

  list.forEach(item=>{
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = item;

    if(single && state[key]===item) chip.classList.add("active");
    if(!single && Array.isArray(state[key]) && state[key].includes(item)) chip.classList.add("active");

    chip.onclick = ()=>{
      if(single){
        if(state[key]===item){
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

        if(idx>-1){
          arr.splice(idx,1);
          chip.classList.remove("active");
        }else{
          arr.push(item);
          chip.classList.add("active");
        }
      }

      if(key==="monitorage") renderMonitorageDetails();

      if(key==="va"){
        renderVADetails();
        updateCurare();
      }

      renderALR();
      renderReport();
    };

    box.appendChild(chip);
  });
}

function initDate(){
  const d = new Date();
  $("date").value = new Date(d.getTime()-d.getTimezoneOffset()*60000)
    .toISOString()
    .split("T")[0];
}

function formatDateFR(v){
  if(!v) return "";
  const d = new Date(v);

  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
}

function updateChirurgiens(){
  const list = DATA.specialites[specialiteSelect.value]?.chirurgiens || [];

  document.querySelectorAll(".chirurgien").forEach(sel=>{
    const current = sel.value;
    fillSelect(sel,list,"Chirurgien...");
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
      renderALR();
      renderReport();
    };
  }

  $("gesteContainer").appendChild(wrapper);

  const sel = wrapper.querySelector(".geste-select");
  fillSelect(sel,list,"Intervention...");

  sel.addEventListener("change",()=>{
    renderGesteExtra(wrapper,sel.value);
    renderALR();
    renderReport();
  });
}

function renderGesteExtra(wrapper,geste){
  const extra = wrapper.querySelector(".geste-extra");
  extra.innerHTML = "";

  if(DATA.lateralizedGestes.includes(geste)){
    const s = document.createElement("select");
    s.className = "laterality-select";
    fillSelect(s,DATA.laterality,"Latéralité...");
    extra.appendChild(s);
  }

  if(DATA.textGestes.includes(geste)){
    const i = document.createElement("input");
    i.className = "precision-input";
    i.placeholder = "Précision...";
    extra.appendChild(i);
  }

  if(geste==="Autre..."){
    const i = document.createElement("input");
    i.className = "custom-geste";
    i.placeholder = "Préciser l'intervention";
    extra.appendChild(i);
  }
}

function buildGesteLabel(block){
  let geste = block.querySelector(".geste-select")?.value;
  if(!geste) return null;

  if(geste==="Autre..."){
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

function renderMonitorageDetails(){
  const box = $("monitorageDetails");
  box.innerHTML = "";

  if(state.monitorage.includes("KTA")){
    const s = document.createElement("select");
    s.id = "ktaSite";
    fillSelect(
      s,
      ["Radial droit","Radial gauche","Fémoral droit","Fémoral gauche"],
      "Localisation KTA..."
    );
    box.appendChild(s);
  }

  if(state.monitorage.includes("KTC")){
    const s = document.createElement("select");
    s.id = "ktcSite";
    fillSelect(
      s,
      [
        "Jugulaire interne droite",
        "Jugulaire interne gauche",
        "Sous-clavier droit",
        "Sous-clavier gauche",
        "Fémoral droit",
        "Fémoral gauche"
      ],
      "Localisation KTC..."
    );
    box.appendChild(s);
  }
}

function updateCurare(){
  const sr = $("sequenceRapide").checked;

  const list = sr
    ? ["Aucun","Atracurium","Rocuronium","Célocurine"]
    : ["Aucun","Atracurium","Rocuronium"];

  state.curare = state.curare.filter(x=>list.includes(x));

  createChips("curare",list,"curare");
}

function renderVADetails(){
  const box = $("vaDetails");
  box.innerHTML = "";

  $("srBlock").classList.add("hidden");
  $("sequenceRapide").checked = false;

  if(state.va==="Masque laryngé"){
    box.innerHTML += `<input id="mlSize" placeholder="Taille masque laryngé">`;
  }

  if(state.va==="Intubation oro-trachéale"){
    box.innerHTML += `<input id="tubeSize" placeholder="Taille sonde (7.5)">`;
    $("srBlock").classList.remove("hidden");
  }

  updateCurare();
}

function renderALR(){
  const spec = specialiteSelect.value;
  const gestes = [...document.querySelectorAll(".geste-select")].map(x=>x.value);
  const alrs = new Set();

  gestes.forEach(g=>(ALR_MAP[g]||[]).forEach(a=>alrs.add(a)));

  const card = $("alrCard");

  if(!ALR_SPECIALITES.includes(spec) || alrs.size===0){
    card.classList.add("hidden");
    state.alr = "";
    return;
  }

  card.classList.remove("hidden");
  createChips("alrOptions",[...alrs,"Aucune"],"alr",true);
}

async function copyReport(){
  try{
    await navigator.clipboard.writeText(report.value);
    $("copyBtn").textContent = "Copié ✓";

    setTimeout(()=>{
      $("copyBtn").textContent = "Copier le CR";
    },1500);
  }catch{
    alert("Impossible de copier.");
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

  if(state.monitorage.includes("Scope")) mon.push("Scope cardiotensionnel 3 dérivations");
  if(state.monitorage.includes("SpO2")) mon.push("SpO2");
  if(state.monitorage.includes("VVP")) mon.push("Voie veineuse périphérique");
  if(state.monitorage.includes("PICC Line")) mon.push("Présence d'un PICC Line");
  if(state.monitorage.includes("Mid Line")) mon.push("Présence d'un Mid Line");
  if(state.monitorage.includes("BIS")) mon.push("BIS");
  if(state.monitorage.includes("TOF")) mon.push("TOF");

  if(mon.length || state.monitorage.includes("KTA") || state.monitorage.includes("KTC")){
    txt += "INSTALLATION\n";

    if(mon.length) txt += mon.join(", ") + ".\n";

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

  const ordre = ["Sufentanil","Rémifentanil","Kétamine","Propofol"];
  const meds = ordre.filter(x=>state.induction.includes(x));
  const curares = state.curare.filter(x=>x!=="Aucun");

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

    if(state.va==="Ventilation spontanée"){
      txt += "Geste effectué en ventilation spontanée.\n";
    }

    if(state.va==="Masque laryngé"){
      txt += `Mise en place d'un masque laryngé taille ${$("mlSize")?.value || ""}.\n`;
    }

    if(state.va==="Intubation oro-trachéale"){
      txt += `Intubation oro-trachéale avec une sonde ${$("tubeSize")?.value || ""}, auscultation symétrique, pression du ballonnet vérifiée au manomètre.\n`;
    }

    txt += "\n";
  }

  if(state.entretien){
    txt += "ENTRETIEN\n";
    txt += state.entretien==="Sevoflurane"
      ? "Entretien anesthésique par sévoflurane.\n\n"
      : "Entretien anesthésique par propofol en AIVOC.\n\n";
  }

  if(state.alr && state.alr!=="Aucune"){
    txt += "ALR\n";
    txt += `ALR de type ${state.alr} réalisée de manière échoguidée avec ${$("localVolume").value} mL de ${$("localAgent").value}.\n\n`;
  }

  const diurese = $("diurese").value;
  const saignement = $("saignement").value;
  const remplissage = $("remplissage").value;
  const norad = $("noradCheck").checked;
  const noradText = $("noradText").value;

  if(diurese || saignement || remplissage || norad){
    txt += "PÉRI-OPÉRATOIRE\n";

    if(diurese) txt += `Diurèse : ${diurese} mL.\n`;
    if(saignement) txt += `Saignement estimé : ${saignement} mL.\n`;
    if(remplissage) txt += `Remplissage : ${remplissage}.\n`;

    if(norad){
      txt += "Support vasopresseur peropératoire par noradrénaline 16 µg/mL";
      if(noradText) txt += ` (${noradText})`;
      txt += ".\n";
    }

    txt += "\n";
  }

  txt += "ANTIBIOPROPHYLAXIE\n";
  txt += state.antibio==="Céfazoline"
    ? "Antibioprophylaxie par céfazoline.\n"
    : "Pas d'antibioprophylaxie.\n";

  report.value = txt;
}

function init(){
  initDate();

  if(!DATA.monitorage.includes("PICC Line")) DATA.monitorage.push("PICC Line");
  if(!DATA.monitorage.includes("Mid Line")) DATA.monitorage.push("Mid Line");

  fillSelect(anesthSelect,DATA.anesthesistes,"Choisir...");
  fillSelect(specialiteSelect,Object.keys(DATA.specialites));

  $("chirContainer").innerHTML = "";
  $("gesteContainer").innerHTML = "";

  addChir(false);
  addGeste(false);

  createChips("monitorage",DATA.monitorage,"monitorage");
  createChips("induction",DATA.induction,"induction");
  createChips("curare",["Aucun","Atracurium","Rocuronium"],"curare");
  createChips(
    "vaOptions",
    ["Ventilation spontanée","Masque laryngé","Intubation oro-trachéale"],
    "va",
    true
  );
  createChips("entretienOptions",DATA.entretien,"entretien",true);
  createChips("antibioOptions",DATA.antibio,"antibio",true);

  $("addChirBtn").onclick = ()=>addChir(true);
  $("addGesteBtn").onclick = ()=>addGeste(true);
  $("copyBtn").onclick = copyReport;

  $("sequenceRapide").addEventListener("change",()=>{
    updateCurare();
    renderReport();
  });

  $("noradCheck").addEventListener("change",()=>{
    $("noradBlock").classList.toggle("hidden", !$("noradCheck").checked);
    renderReport();
  });

  specialiteSelect.onchange = ()=>{
    updateChirurgiens();

    document.querySelectorAll(".geste-select").forEach(sel=>{
      fillSelect(
        sel,
        DATA.specialites[specialiteSelect.value]?.interventions || [],
        "Intervention..."
      );
    });

    renderALR();
    renderReport();
  };

  document.addEventListener("change",renderReport);
  document.addEventListener("input",renderReport);

  renderReport();
}

init();
