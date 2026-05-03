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

function fillSelect(select,list){
  select.innerHTML="";
  list.forEach(item=>{
    const option=document.createElement("option");
    option.value=item;
    option.textContent=item;
    select.appendChild(option);
  });
}

function makeChecks(container,list,name,type="checkbox"){
  container.innerHTML="";
  list.forEach(item=>{
    const label=document.createElement("label");
    label.className="check-item";
    label.innerHTML=`
      <input type="${type}" name="${name}" value="${item}">
      ${item}
    `;
    container.appendChild(label);
  });
}

function valuesOf(name){
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(e=>e.value);
}

function valueOf(name){
  const el=document.querySelector(`input[name="${name}"]:checked`);
  return el?el.value:"";
}

function updateSpecialite(){
  const data=DATA.specialites[specialiteSelect.value];
  fillSelect(chirurgienSelect,data.chirurgiens);
  fillSelect(interventionSelect,data.interventions);
  updateIntervention();
}

function updateIntervention(){
  const intervention=interventionSelect.value;

  autreInterventionBox.classList.toggle(
    "hidden",
    intervention!=="Autre..."
  );

  renderALR(intervention);
  renderReport();
}

function renderALR(intervention){
  const list=ALR_MAP[intervention];

  if(!list){
    alrCard.classList.add("hidden");
    return;
  }

  alrCard.classList.remove("hidden");
  makeChecks(alrOptions,[...list,"Aucune"],"alr","radio");
  alrOptions.className="radio-list";
}

function renderVADetails(){
  vaDetails.innerHTML="";
  const selected=valueOf("va");

  if(selected==="Masque laryngé"){
    vaDetails.innerHTML=`
      <div class="field">
        <label>Taille</label>
        <input id="mlSize" placeholder="4">
      </div>
    `;
  }

  if(selected==="Intubation oro-trachéale"){
    vaDetails.innerHTML=`
      <div class="field">
        <label>Sonde</label>
        <input id="tubeSize" placeholder="7.5">
      </div>
    `;
  }
}

function renderReport(){
  const date=$("date").value||"";
  const anesth=anesthSelect.value||"";
  const chirurgien=chirurgienSelect.value||"";
  const spec=specialiteSelect.value||"";
  const intervention=interventionSelect.value==="Autre..."
    ? (autreIntervention.value||"Autre")
    : interventionSelect.value;

  const monitorage=valuesOf("monitorage");
  const induction=valuesOf("induction");
  const curare=valuesOf("curare");
  const va=valueOf("va");
  const entretien=valueOf("entretien");
  const antibio=valueOf("antibio");
  const alr=valueOf("alr");

  let txt="";

  txt+="INTERVENTION\n";
  txt+=`Date : ${date}\n`;
  txt+=`Anesthésiste : ${anesth}\n`;
  txt+=`Chirurgien : ${chirurgien}\n`;
  txt+=`Spécialité : ${spec}\n`;
  txt+=`Intervention : ${intervention}\n\n`;

  txt+="INSTALLATION\n";
  if(monitorage.length){
    txt+=`Monitorage : ${monitorage.join(", ")}.\n\n`;
  }

  txt+="INDUCTION\n";
  if(induction.length){
    txt+=`Induction par ${induction.join(", ")}.\n\n`;
  }

  txt+="CURARISATION\n";
  if(curare.length){
    txt+=`Curarisation : ${curare.join(", ")}.\n\n`;
  }

  txt+="VOIES AÉRIENNES\n";
  if(va==="Masque laryngé"){
    txt+=`Mise en place d'un masque laryngé taille ${$("mlSize")?.value||""}.\n\n`;
  }else if(va==="Intubation oro-trachéale"){
    txt+=`Intubation oro-trachéale avec une sonde ${$("tubeSize")?.value||""}.\n\n`;
  }else if(va){
    txt+="Ventilation spontanée conservée.\n\n";
  }

  txt+="ENTRETIEN\n";
  if(entretien){
    txt+=`Entretien anesthésique par ${entretien}.\n\n`;
  }

  if(alr && alr!=="Aucune"){
    txt+="ALR\n";
    txt+=`ALR de type ${alr} réalisée de manière échoguidée avec ${$("localVolume").value} mL de ${$("localAgent").value}.\n\n`;
  }

  txt+="ANTIBIOPROPHYLAXIE\n";
  txt+=antibio==="Céfazoline"
    ? "Antibioprophylaxie par céfazoline.\n"
    : "Pas d'antibioprophylaxie.\n";

  report.value=txt;
}

function copyReport(){
  navigator.clipboard.writeText(report.value);
  $("copyBtn").textContent="Copié ✓";
  setTimeout(()=>{$("copyBtn").textContent="Copier le CR";},1200);
}

function init(){
  fillSelect(anesthSelect,DATA.anesthesistes);
  fillSelect(specialiteSelect,Object.keys(DATA.specialites));

  makeChecks(monitorageBox,DATA.monitorage,"monitorage");
  makeChecks(inductionBox,DATA.induction,"induction");
  makeChecks(curareBox,DATA.curare,"curare");

  makeChecks(vaOptions,[
    "Ventilation spontanée",
    "Masque laryngé",
    "Intubation oro-trachéale"
  ],"va","radio");
  vaOptions.className="radio-list";

  makeChecks(entretienOptions,[
    "Sevoflurane",
    "Propofol AIVOC"
  ],"entretien","radio");
  entretienOptions.className="radio-list";

  makeChecks(antibioOptions,[
    "Céfazoline",
    "Non"
  ],"antibio","radio");
  antibioOptions.className="radio-list";

  updateSpecialite();

  document.addEventListener("change",()=>{
    renderVADetails();
    renderReport();
  });

  document.addEventListener("input",renderReport);

  specialiteSelect.addEventListener("change",updateSpecialite);
  interventionSelect.addEventListener("change",updateIntervention);

  $("copyBtn").addEventListener("click",copyReport);

  renderReport();
}

init();
