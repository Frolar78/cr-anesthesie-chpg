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
if(key === "transfusion") renderTransfusionDetails();
      renderALR();
      renderPeropVisibility();
      renderReport();
    };

    box.appendChild(chip);
  });
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
    const gestes = getSelectedGestesRaw();
    const isThoracicSelective =
      gestes.includes("Lobectomie pulmonaire") ||
      gestes.includes("Segmentectomie") ||
      gestes.includes("Œsophagectomie Lewis-Santy");

    if(isThoracicSelective){
      box.innerHTML += `
        <select id="selectiveTubeSize">
          <option value="">Taille sonde sélective...</option>
          <option>35 Fr</option>
          <option>37 Fr</option>
          <option>39 Fr</option>
          <option>41 Fr</option>
        </select>
      `;
    }else{
      box.innerHTML += `<input id="tubeSize" placeholder="Taille sonde (7.5)">`;
    }

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

function renderNeuraxialDetails(){
  const hasPeridurale =
    state.neuraxial.includes("Péridurale") ||
    state.neuraxial.includes("Péridurale thoracique");

  $("periduraleDetails").classList.toggle("hidden", !hasPeridurale);

  if(!hasPeridurale){
    $("periduraleNiveau").value = "";
  }
}

function renderAntibioDetails(){
  const isOther = state.antibio === "Autre";

  $("antibioOtherBlock").classList.toggle("hidden", !isOther);

  if(!isOther){
    $("antibioOtherText").value = "";
  }
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
function renderTransfusionDetails(){
  const isOther = state.transfusion.includes("Autre");

  $("transfusionOtherText").classList.toggle("hidden", !isOther);

  if(!isOther){
    $("transfusionOtherText").value = "";
  }
}
