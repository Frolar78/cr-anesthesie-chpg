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

function initDate(){
  const d=new Date();
  const yyyy=d.getFullYear();
  const mm=String(d.getMonth()+1).padStart(2,"0");
  const dd=String(d.getDate()).padStart(2,"0");
  $("date").value=`${yyyy}-${mm}-${dd}`;
}

function formatDateFR(v){
  if(!v) return "";
  return new Date(v).toLocaleDateString("fr-FR");
}

function updateChirurgiens(){
  const spec=specialiteSelect.value;
  const list=DATA.specialites[spec]?.chirurgiens || [];

  document.querySelectorAll(".chirurgien").forEach(sel=>{
    fillSelect(sel,list,"Chirurgien...");
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

  gestes.forEach(g=>{
    (ALR_MAP[g]||[]).forEach(a=>alrs.add(a));
  });

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
  const list=sr
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

  report.value=txt;
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

  document.addEventListener("change",renderReport);
  document.addEventListener("input",renderReport);

  renderReport();
}

init();
