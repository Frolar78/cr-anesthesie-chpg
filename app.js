const $ = id => document.getElementById(id);

const anesthSelect = $("anesthesiste");
const specialiteSelect = $("specialite");
const chirurgienSelect = $("chirurgien");
const interventionSelect = $("intervention");
const autreInterventionBox = $("autreInterventionBox");
const autreIntervention = $("autreIntervention");
const report = $("report");

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
  "PTH":["Bloc fémoral"],
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

function fillSelect(select, list){
  select.innerHTML="";
  list.forEach(v=>{
    const o=document.createElement("option");
    o.value=v;
    o.textContent=v;
    select.appendChild(o);
  });
}

function createChips(containerId, list, key, single=false){
  const container = $(containerId);
  container.innerHTML="";

  list.forEach(item=>{
    const chip=document.createElement("div");
    chip.className="chip";
    chip.textContent=item;

    chip.onclick=()=>{
      if(single){
        state[key]=item;
        [...container.children].forEach(c=>c.classList.remove("active"));
        chip.classList.add("active");
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

function updateSpecialite(){
  const data = DATA.specialites[specialiteSelect.value];
  fillSelect(chirurgienSelect,data.chirurgiens);
  fillSelect(interventionSelect,data.interventions);
  updateIntervention();
}

function updateIntervention(){
  const val = interventionSelect.value;

  autreInterventionBox.classList.toggle("hidden", val!=="Autre...");
  renderALR(val);
  renderReport();
}

function renderALR(intervention){
  const card = $("alrCard");
  const spec = specialiteSelect.value;

  if(!ALR_SPECIALITES.includes(spec) || !ALR_MAP[intervention]){
    card.classList.add("hidden");
    state.alr="";
    return;
  }

  card.classList.remove("hidden");
  createChips("alrOptions",[...ALR_MAP[intervention],"Aucune"],"alr",true);
}

function updateCurare(){
  const sr = state.va.includes("Séquence rapide");
  const list = sr
    ? ["Aucun","Atracurium","Rocuronium","Célocurine"]
    : ["Aucun","Atracurium","Rocuronium"];

  state.curare=[];
  createChips("curare",list,"curare");
}

function renderVADetails(){
  const zone = $("vaDetails");
  zone.innerHTML="";

  if(state.va.includes("Masque laryngé")){
    zone.innerHTML += `<div class="mt8"><input id="mlSize" placeholder="Taille masque (4)"></div>`;
  }

  if(state.va.includes("Intubation oro-trachéale")){
    zone.innerHTML += `<div class="mt8"><input id="tubeSize" placeholder="Sonde (7.5)"></div>`;
  }
}

function formatDateFR(dateStr){
  if(!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

function renderReport(){
  const date = formatDateFR($("date").value);
  const anesth = anesthSelect.value;
  const chir = chirurgienSelect.value;
  const intervention = interventionSelect.value==="Autre..."
    ? (autreIntervention.value || "Autre")
    : interventionSelect.value;

  let txt="";

  txt+="INTERVENTION\n";
  txt+=`Date : ${date}\n`;
  txt+=`Anesthésiste : ${anesth}\n`;
  txt+=`Chirurgien : ${chir}\n`;
  txt+=`Intervention : ${intervention}\n\n`;

  // INSTALLATION
  const simple = [];
  if(state.monitorage.includes("Scope")) simple.push("scope cardiotensionnel 3 dérivations");
  if(state.monitorage.includes("SpO2")) simple.push("SpO2");
  if(state.monitorage.includes("VVP")) simple.push("voie veineuse périphérique");
  if(state.monitorage.includes("BIS")) simple.push("BIS");
  if(state.monitorage.includes("TOF")) simple.push("TOF");

  if(simple.length || state.monitorage.includes("KTA") || state.monitorage.includes("KTC")){
    txt+="INSTALLATION\n";
    if(simple.length){
      txt+=simple[0].charAt(0).toUpperCase()+simple[0].slice(1);
      if(simple.length>1) txt+=", "+simple.slice(1).join(", ");
      txt+=".\n";
    }

    if(state.monitorage.includes("KTA")){
      txt+="Mise en place d'un cathéter artériel après test d'Allen négatif.\n";
    }

    if(state.monitorage.includes("KTC")){
      txt+="Mise en place d'un cathéter veineux central échoguidé.\n";
    }

    txt+="\n";
  }

  // INDUCTION
  const ordre = ["Sufentanil","Rémifentanil","Kétamine","Propofol"];
  const meds = ordre.filter(x=>state.induction.includes(x));
  const curares = state.curare.filter(x=>x!=="Aucun");

  if(meds.length){
    txt+="INDUCTION\n";

    const sr = state.va.includes("Séquence rapide");

    txt += sr
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
    txt+="VOIES AÉRIENNES\n";

    if(state.va.includes("Ventilation spontanée")){
      txt+="Geste effectué en ventilation spontanée.\n";
    }

    if(state.va.includes("Masque laryngé")){
      txt+=`Mise en place d'un masque laryngé taille ${$("mlSize")?.value||""}.\n`;
    }

    if(state.va.includes("Intubation oro-trachéale")){
      txt+=`Intubation oro-trachéale avec une sonde ${$("tubeSize")?.value||""}, auscultation symétrique, pression du ballonnet vérifiée au manomètre.\n`;
    }

    txt+="\n";
  }

  if(state.entretien){
    txt+="ENTRETIEN\n";
    txt += state.entretien==="Sevoflurane"
      ? "Entretien anesthésique par sévoflurane.\n\n"
      : "Entretien anesthésique par propofol en AIVOC.\n\n";
  }

  if(state.alr && state.alr!=="Aucune"){
    txt+="ALR\n";
    txt+=`ALR de type ${state.alr} réalisée de manière échoguidée avec ${$("localVolume").value} mL de ${$("localAgent").value}.\n\n`;
  }

  txt+="ANTIBIOPROPHYLAXIE\n";
  txt += state.antibio==="Céfazoline"
    ? "Antibioprophylaxie par céfazoline.\n"
    : "Pas d'antibioprophylaxie.\n";

  report.value = txt;
}

function copyReport(){
  navigator.clipboard.writeText(report.value);
  $("copyBtn").textContent="Copié ✓";
  setTimeout(()=>{$("copyBtn").textContent="Copier le CR";},1200);
}

function init(){
  fillSelect(anesthSelect, DATA.anesthesistes);
  fillSelect(specialiteSelect, Object.keys(DATA.specialites));

  createChips("monitorage", DATA.monitorage, "monitorage");
  createChips("induction", ["Sufentanil","Rémifentanil","Kétamine","Propofol"], "induction");
  createChips("vaOptions", ["Séquence rapide","Ventilation spontanée","Masque laryngé","Intubation oro-trachéale"], "va");
  createChips("entretienOptions", ["Sevoflurane","Propofol AIVOC"], "entretien", true);
  createChips("antibioOptions", ["Céfazoline","Non"], "antibio", true);
  updateCurare();

  specialiteSelect.onchange = updateSpecialite;
  interventionSelect.onchange = updateIntervention;
  document.addEventListener("input", renderReport);
  $("copyBtn").onclick = copyReport;

  updateSpecialite();
  renderReport();
}

init();
