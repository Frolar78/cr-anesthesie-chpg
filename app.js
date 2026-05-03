const $ = id => document.getElementById(id);

const anesthSelect = $("anesthesiste");
const specialiteSelect = $("specialite");
const chirurgienSelect = $("chirurgien");
const interventionSelect = $("intervention");
const autreInterventionBox = $("autreInterventionBox");
const autreIntervention = $("autreIntervention");
const report = $("report");

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

const state = {
  monitorage: [],
  induction: [],
  curare: [],
  va: "",
  entretien: "",
  antibio: "",
  alr: ""
};

function fillSelect(select, list){
  select.innerHTML = "";
  list.forEach(v=>{
    const o=document.createElement("option");
    o.value=v;
    o.textContent=v;
    select.appendChild(o);
  });
}

function createChips(containerId, list, key, single=false){
  const container = $(containerId);
  container.innerHTML = "";

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

      if(key==="va") renderVADetails();
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

  autreInterventionBox.classList.toggle(
    "hidden",
    val!=="Autre..."
  );

  renderALR(val);
  renderReport();
}

function renderALR(intervention){
  const card = $("alrCard");
  const list = ALR_MAP[intervention];

  if(!list){
    card.classList.add("hidden");
    state.alr="";
    return;
  }

  card.classList.remove("hidden");
  createChips("alrOptions",[...list,"Aucune"],"alr",true);
}

function renderVADetails(){
  const zone=$("vaDetails");
  zone.innerHTML="";

  if(state.va==="Masque laryngé"){
    zone.innerHTML=`
      <div class="mt8">
        <input id="mlSize" placeholder="Taille (ex 4)">
      </div>
    `;
  }

  if(state.va==="Intubation oro-trachéale"){
    zone.innerHTML=`
      <div class="mt8">
        <input id="tubeSize" placeholder="Sonde (ex 7.5)">
      </div>
    `;
  }
}

function formatDateFR(dateStr){
  if(!dateStr) return "";
  const d=new Date(dateStr);
  return d.toLocaleDateString("fr-FR");
}

function renderReport(){
  const date = formatDateFR($("date").value);
  const anesth = anesthSelect.value;
  const chir = chirurgienSelect.value;
  const intervention = interventionSelect.value==="Autre..."
    ? (autreIntervention.value||"Autre")
    : interventionSelect.value;

  let txt="";

  txt+="INTERVENTION\n";
  txt+=`Date : ${date}\n`;
  txt+=`Anesthésiste : ${anesth}\n`;
  txt+=`Chirurgien : ${chir}\n`;
  txt+=`Intervention : ${intervention}\n\n`;

  if(state.monitorage.length){
    txt+="INSTALLATION\n";
    txt+=`Monitorage : ${state.monitorage.join(", ")}.\n\n`;
  }

  if(state.induction.length){
    txt+="INDUCTION\n";
    txt+=`Induction par ${state.induction.join(", ")}.\n\n`;
  }

  if(state.curare.length){
    txt+="CURARISATION\n";
    txt+=`Curarisation : ${state.curare.join(", ")}.\n\n`;
  }

  if(state.va){
    txt+="VOIES AÉRIENNES\n";

    if(state.va==="Masque laryngé"){
      txt+=`Mise en place d'un masque laryngé taille ${$("mlSize")?.value||""}.\n\n`;
    }else if(state.va==="Intubation oro-trachéale"){
      txt+=`Intubation oro-trachéale avec une sonde ${$("tubeSize")?.value||""}.\n\n`;
    }else{
      txt+="Ventilation spontanée conservée.\n\n";
    }
  }

  if(state.entretien){
    txt+="ENTRETIEN\n";
    txt+=`Entretien anesthésique par ${state.entretien}.\n\n`;
  }

  if(state.alr && state.alr!=="Aucune"){
    txt+="ALR\n";
    txt+=`ALR de type ${state.alr} réalisée de manière échoguidée avec ${$("localVolume").value} mL de ${$("localAgent").value}.\n\n`;
  }

  txt+="ANTIBIOPROPHYLAXIE\n";
  txt+=state.antibio==="Céfazoline"
    ? "Antibioprophylaxie par céfazoline.\n"
    : "Pas d'antibioprophylaxie.\n";

  report.value=txt;
}

function copyReport(){
  navigator.clipboard.writeText(report.value);
  $("copyBtn").textContent="Copié ✓";
  setTimeout(()=>$("copyBtn").textContent="Copier le CR",1200);
}

function init(){
  fillSelect(anesthSelect, DATA.anesthesistes);
  fillSelect(specialiteSelect, Object.keys(DATA.specialites));

  createChips("monitorage", DATA.monitorage, "monitorage");
  createChips("induction", DATA.induction, "induction");
  createChips("curare", DATA.curare, "curare");

  createChips("vaOptions",[
    "Ventilation spontanée",
    "Masque laryngé",
    "Intubation oro-trachéale"
  ],"va",true);

  createChips("entretienOptions",[
    "Sevoflurane",
    "Propofol AIVOC"
  ],"entretien",true);

  createChips("antibioOptions",[
    "Céfazoline",
    "Non"
  ],"antibio",true);

  updateSpecialite();

  document.addEventListener("input",renderReport);
  specialiteSelect.onchange=updateSpecialite;
  interventionSelect.onchange=updateIntervention;
  $("copyBtn").onclick=copyReport;

  renderReport();
}

init();
