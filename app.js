const $ = id => document.getElementById(id);

const report = $("report");
const anesthSelect = $("anesthesiste");
const specialiteSelect = $("specialite");

const state = {
  monitorage: [], induction: [], curare: [], va: [],
  entretien: "", antibio: "", alr: ""
};

function fillSelect(select,list,placeholder=""){
  select.innerHTML="";
  if(placeholder){
    const o=document.createElement("option");
    o.value=""; o.textContent=placeholder;
    select.appendChild(o);
  }
  list.forEach(v=>{
    const o=document.createElement("option");
    o.value=v; o.textContent=v;
    select.appendChild(o);
  });
}

function createChips(id,list,key,single=false){
  const box=$(id);
  box.innerHTML="";
  list.forEach(item=>{
    const chip=document.createElement("div");
    chip.className="chip";
    chip.textContent=item;
    chip.onclick=()=>{
      if(single){
        state[key]=state[key]===item?"":item;
        [...box.children].forEach(c=>c.classList.remove("active"));
        if(state[key]) chip.classList.add("active");
      }else{
        const arr=state[key];
        const i=arr.indexOf(item);
        if(i>-1){arr.splice(i,1); chip.classList.remove("active")}
        else {arr.push(item); chip.classList.add("active")}
      }
      renderReport();
    };
    box.appendChild(chip);
  });
}

function initDate(){
  const d=new Date();
  $("date").value=new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().split("T")[0];
}

function formatDateFR(v){
  if(!v) return "";
  const d=new Date(v);
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
}

function updateChirurgiens(){
  const list=DATA.specialites[specialiteSelect.value]?.chirurgiens||[];
  document.querySelectorAll(".chirurgien").forEach(sel=>{
    const current=sel.value;
    fillSelect(sel,list,"Chirurgien...");
    if(list.includes(current)) sel.value=current;
  });
}

function addChir(){
  const row=document.createElement("div");
  row.className="field row-inline";
  row.innerHTML=`
    <select class="chirurgien"></select>
    <button class="remove-btn" type="button">–</button>
  `;
  row.querySelector(".remove-btn").onclick=()=>{row.remove(); renderReport();};
  $("chirContainer").appendChild(row);
  updateChirurgiens();
}

function addGeste(){
  const list=DATA.specialites[specialiteSelect.value]?.interventions||[];
  const row=document.createElement("div");
  row.className="field row-inline";
  row.innerHTML=`
    <select class="geste-select"></select>
    <button class="remove-btn" type="button">–</button>
  `;
  row.querySelector(".remove-btn").onclick=()=>{row.remove(); renderReport();};
  $("gesteContainer").appendChild(row);
  fillSelect(row.querySelector(".geste-select"),list,"Intervention...");
}

function renderReport(){
  const date=formatDateFR($("date").value);
  const anesth=anesthSelect.value;
  const chirs=[...document.querySelectorAll(".chirurgien")].map(x=>x.value).filter(Boolean);
  const gestes=[...document.querySelectorAll(".geste-select")].map(x=>x.value).filter(Boolean);

  let txt="INTERVENTION\n";
  txt+=`Date : ${date}\n`;
  txt+=`Anesthésiste : ${anesth}\n`;
  txt+=`Chirurgien : ${chirs.join(", ")}\n`;
  txt+=`Intervention : ${gestes.join(" associée à ")}\n\n`;

  if(state.monitorage.length){
    const m=[];
    if(state.monitorage.includes("Scope")) m.push("Scope cardiotensionnel 3 dérivations");
    if(state.monitorage.includes("SpO2")) m.push("SpO2");
    if(state.monitorage.includes("VVP")) m.push("voie veineuse périphérique");
    if(state.monitorage.includes("KTA")) m.push("KTA");
    if(state.monitorage.includes("KTC")) m.push("KTC");
    if(state.monitorage.includes("BIS")) m.push("BIS");
    if(state.monitorage.includes("TOF")) m.push("TOF");
    txt+="INSTALLATION\n"+m.join(", ")+".\n\n";
  }

  report.value=txt;
}

function init(){
  initDate();
  fillSelect(anesthSelect,DATA.anesthesistes,"Choisir...");
  fillSelect(specialiteSelect,Object.keys(DATA.specialites));

  $("chirContainer").innerHTML="";
  $("gesteContainer").innerHTML="";
  addChir();
  addGeste();

  createChips("monitorage",DATA.monitorage,"monitorage");
  createChips("induction",DATA.induction,"induction");
  createChips("curare",["Aucun","Atracurium","Rocuronium"],"curare");
  createChips("vaOptions",["Séquence rapide","Ventilation spontanée","Masque laryngé","Intubation oro-trachéale"],"va");
  createChips("entretienOptions",DATA.entretien,"entretien",true);
  createChips("antibioOptions",DATA.antibio,"antibio",true);

  $("addChirBtn").onclick=addChir;
  $("addGesteBtn").onclick=addGeste;

  specialiteSelect.onchange=()=>{
    updateChirurgiens();
    [...document.querySelectorAll(".geste-select")].forEach(sel=>{
      fillSelect(sel,DATA.specialites[specialiteSelect.value]?.interventions||[],"Intervention...");
    });
    renderReport();
  };

  document.addEventListener("change",renderReport);
  document.addEventListener("input",renderReport);

  renderReport();
}

init();
