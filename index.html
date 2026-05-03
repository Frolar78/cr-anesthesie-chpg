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
    const opt=document.createElement("option");
    opt.value="";
    opt.textContent=placeholder;
    select.appendChild(opt);
  }
  list.forEach(v=>{
    const o=document.createElement("option");
    o.value=v;
    o.textContent=v;
    select.appendChild(o);
  });
}

function createChips(containerId, list, key, single=false){
  const container=$(containerId);
  container.innerHTML="";

  list.forEach(item=>{
    const chip=document.createElement("div");
    chip.className="chip";
    chip.textContent=item;

    chip.onclick=()=>{
      if(single){
        state[key]= item===state[key] ? "" : item;
        [...container.children].forEach(c=>c.classList.remove("active"));
        if(state[key]) chip.classList.add("active");
      }else{
        const arr=state[key];
        const idx=arr.indexOf(item);
        if(idx>-1){
          arr.splice(idx,1);
          chip.classList.remove("active");
        }else{
          arr.push(item);
          chip.classList.add("active");
        }
      }

      if(key==="va"){
        renderVADetails();
        updateCurare();
      }

      renderReport();
    };

    container.appendChild(chip);
  });
}

function initDate(){
  const d=new Date();
  $("date").value = new Date(d.getTime()-d.getTimezoneOffset()*60000)
    .toISOString()
    .split("T")[0];
}

function formatDateFR(v){
  if(!v) return "";
  const d = new Date(v);
  const dd = String(d.getDate()).padStart(2,"0");
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function updateChirurgiens(){
  const spec=specialiteSelect.value;
  const list=DATA.specialites[spec]?.chirurgiens || [];

  document.querySelectorAll(".chirurgien").forEach(sel=>{
    const current = sel.value;
    fillSelect(sel,list,"Chirurgien...");
    sel.value = list.includes(current) ? current : "";
  });
}

function addChir(){
  const row=document.createElement("div");
  row.className="field";
  row.innerHTML=`<select class="chirurgien"></select>`;
  $("chirContainer").appendChild(row);
  updateChirurgiens();
}

function resetGestes(){
  $("gesteContainer").innerHTML="";
}

function addGeste(){
  const spec=specialiteSelect.value;
  const list=DATA.specialites[spec]?.interventions || [];

  const block=document.createElement("div");
  block.className="field geste-block";

  block.innerHTML=`
    <select class="geste-select"></select>
    <div class="geste-extra" style="margin-top:6px"></div>
  `;

  $("gesteContainer").appendChild(block);

  const sel=block.querySelector(".geste-select");
  fillSelect(sel,list,"Intervention...");

  sel.addEventListener("change",()=>{
    renderGesteExtra(block,sel.value);
    renderALR();
    renderReport();
  });
}

function renderGesteExtra(block,geste){
  const extra=block.querySelector(".geste-extra");
  extra.innerHTML="";

  if(DATA.lateralizedGestes.includes(geste)){
    const s=document.createElement("select");
    s.className="laterality-select";
    fillSelect(s,DATA.laterality,"Latéralité...");
    extra.appendChild(s);
  }

  if(DATA.textGestes.includes(geste)){
    const i=document.createElement("input");
    i.className="precision-input";
    i.placeholder="Précision...";
    extra.appendChild(i);
  }

  if(geste==="Autre..."){
    const i=document.createElement("input");
    i.className="custom-geste";
    i.placeholder="Préciser l'intervention";
    extra.appendChild(i);
  }
}

function buildGesteLabel(block){
  let geste=block.querySelector(".geste-select")?.value;
  if(!geste) return null;

  if(geste==="Autre..."){
    geste=block.querySelector(".custom-geste")?.value || "Autre";
  }

  const lat=block.querySelector(".laterality-select")?.value;
  if(lat){
    const map={
      "Droite":"droite",
      "Gauche":"gauche",
      "Bilatéral":"bilatéral"
    };
    geste+=" "+map[lat];
  }

  const p=block.querySelector(".precision-input")?.value;
  if(p) geste+=` (${p})`;

  return geste;
}

function renderALR(){
  const spec=specialiteSelect.value;
  const gestes=[...document.querySelectorAll(".geste-select")].map(x=>x.value);
  const alrs=new Set();

  gestes.forEach(g => (ALR_MAP[g]||[]).forEach(a=>alrs.add(a)));

  const card=$("alrCard");

  if(!ALR_SPECIALITES.includes(spec) || alrs.size===0){
    card.classList.add("hidden");
    state.alr="";
    return;
  }

  card.classList.remove("hidden");
  createChips("alrOptions",[...alrs,"Aucune"],"alr",true);
}

function updateCurare(){
  const sr=state.va.includes("Séquence rapide");
  const list = sr
    ? ["Aucun","Atracurium","Rocuronium","Célocurine"]
    : ["Aucun","Atracurium","Rocuronium"];

  state.curare=[];
  createChips("curare",list,"curare");
}

function renderVADetails(){
  const zone=$("vaDetails");
  zone.innerHTML="";

  if(state.va.includes("Masque laryngé")){
    zone.innerHTML+=`<div class="mt8"><input id="mlSize" placeholder="Taille masque"></div>`;
  }

  if(state.va.includes("Intubation oro-trachéale")){
    zone.innerHTML+=`<div class="mt8"><input id="tubeSize" placeholder="Sonde (7.5)"></div>`;
  }
}

function renderReport(){
  const date=formatDateFR($("date").value);
  const anesth=anesthSelect.value;

  const chirurgiens=[...document.querySelectorAll(".chirurgien")]
    .map(x=>x.value)
    .filter(Boolean);

  const gestes=[...document.querySelectorAll(".geste-block")]
    .map(buildGesteLabel)
    .filter(Boolean);

  let txt="INTERVENTION\n";
  txt+=`Date : ${date}\n`;
  txt+=`Anesthésiste : ${anesth}\n`;
  txt+=`Chirurgien : ${chirurgiens.join(", ")}\n`;
  txt+=`Intervention : ${gestes.join(" associée à ")}\n\n`;

  // MONITORAGE
  const mon = [];
  if(state.monitorage.includes("Scope")) mon.push("Scope cardiotensionnel 3 dérivations");
  if(state.monitorage.includes("SpO2")) mon.push("SpO2");
  if(state.monitorage.includes("VVP")) mon.push("voie veineuse périphérique");
  if(state.monitorage.includes("BIS")) mon.push("BIS");
  if(state.monitorage.includes("TOF")) mon.push("TOF");

  if(mon.length || state.monitorage.includes("KTA") || state.monitorage.includes("KTC")){
    txt += "INSTALLATION\n";
    if(mon.length) txt += mon.join(", ") + ".\n";
    if(state.monitorage.includes("KTA")) txt += "Mise en place d'un cathéter artériel après test d'Allen négatif.\n";
    if(state.monitorage.includes("KTC")) txt += "Mise en place d'un cathéter veineux central échoguidé.\n";
    txt += "\n";
  }

  // INDUCTION
  const ordre = ["Sufentanil","Rémifentanil","Kétamine","Propofol"];
  const meds = ordre.filter(x=>state.induction.includes(x));
  const curares = state.curare.filter(x=>x!=="Aucun");

  if(meds.length){
    txt += "INDUCTION\n";
    txt += state.va.includes("Séquence rapide")
      ? "Induction en séquence rapide par "
      : "Induction par ";

    txt += meds.join(", ");

    if(curares.length){
      txt += " puis curarisation par " + curares.join(", ");
    }

    txt += ".\n\n";
  }

  // VA
  if(state.va.length){
    txt += "VOIES AÉRIENNES\n";

    if(state.va.includes("Ventilation spontanée")){
      txt += "Geste effectué en ventilation spontanée.\n";
    }

    if(state.va.includes("Masque laryngé")){
      txt += `Mise en place d'un masque laryngé taille ${$("mlSize")?.value||""}.\n`;
    }

    if(state.va.includes("Intubation oro-trachéale")){
      txt += `Intubation oro-trachéale avec une sonde ${$("tubeSize")?.value||""}, auscultation symétrique, pression du ballonnet vérifiée au manomètre.\n`;
    }

    txt += "\n";
  }

  // ENTRETIEN
  if(state.entretien){
    txt += "ENTRETIEN\n";
    txt += state.entretien==="Sevoflurane"
      ? "Entretien anesthésique par sévoflurane.\n\n"
      : "Entretien anesthésique par propofol en AIVOC.\n\n";
  }

  // ALR
  if(state.alr && state.alr!=="Aucune"){
    txt += "ALR\n";
    txt += `ALR de type ${state.alr} réalisée de manière échoguidée avec ${$("localVolume").value} mL de ${$("localAgent").value}.\n\n`;
  }

  // ANTIBIO
  txt += "ANTIBIOPROPHYLAXIE\n";
  txt += state.antibio==="Céfazoline"
    ? "Antibioprophylaxie par céfazoline.\n"
    : "Pas d'antibioprophylaxie.\n";

  report.value = txt;
}

function init(){
  initDate();

  fillSelect(anesthSelect,DATA.anesthesistes,"Choisir...");
  fillSelect(specialiteSelect,Object.keys(DATA.specialites));

  $("chirContainer").innerHTML="";
  addChir();
  addGeste();

  createChips("monitorage",DATA.monitorage,"monitorage");
  createChips("induction",DATA.induction,"induction");
  createChips("vaOptions",["Séquence rapide","Ventilation spontanée","Masque laryngé","Intubation oro-trachéale"],"va");
  createChips("entretienOptions",DATA.entretien,"entretien",true);
  createChips("antibioOptions",DATA.antibio,"antibio",true);

  updateCurare();

  specialiteSelect.addEventListener("change",()=>{
    updateChirurgiens();
    resetGestes();
    addGeste();
    renderALR();
    renderReport();
  });

  $("addChirBtn").onclick=addChir;
  $("addGesteBtn").onclick=addGeste;

  document.addEventListener("change", renderReport);
  document.addEventListener("input", renderReport);

  renderReport();
}

init();
