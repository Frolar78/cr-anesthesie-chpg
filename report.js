function renderReport(){
  const date = formatDateFR($("date").value);
const anesths = [...document.querySelectorAll(".anesthesiste")]
  .map(x=>x.value)
  .filter(Boolean);

  const chirs = [...document.querySelectorAll(".chirurgien")]
    .map(x=>x.value)
    .filter(Boolean);

  const gestes = [...document.querySelectorAll(".field")]
    .filter(x=>x.querySelector(".geste-select"))
    .map(buildGesteLabel)
    .filter(Boolean);

  let txt = "INTERVENTION\n";
  txt += `Date : ${date}\n`;
  txt += `Anesthésiste : ${anesths.join(", ")}\n`;
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

const position = $("positionPatient")?.value;

if(position || mon.length || state.monitorage.includes("KTA") || state.monitorage.includes("KTC")){
    txt += "INSTALLATION\n";

    if(position){
      txt += `Patient installé en ${position.toLowerCase()}.\n`;
    }

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
  txt += `Mise en place atraumatique d'un masque laryngé taille ${$("mlSize")?.value || ""}, absence de bris dentaire.\n`;
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

      const gestesThoraciques = getSelectedGestesRaw();
      const isThoracicSelective =
        gestesThoraciques.includes("Lobectomie pulmonaire") ||
        gestesThoraciques.includes("Segmentectomie") ||
        gestesThoraciques.includes("Œsophagectomie Lewis-Santy");

      if(isThoracicSelective){
        const tailleSelective = $("selectiveTubeSize")?.value || "";
        txt += `Intubation oro-trachéale avec une sonde sélective gauche ${tailleSelective} sans ergot, contrôle fibroscopique de la position.\n`;
      }else{
        txt += `Intubation oro-trachéale atraumatique avec une sonde ${$("tubeSize")?.value || ""}, auscultation symétrique, pression du ballonnet vérifiée au manomètre, absence de bris dentaire.\n`;
      }
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
const norad = $("noradToggle").classList.contains("active");
  const noradText = $("noradText").value;
const incident = $("incidentToggle").classList.contains("active");
  const incidentText = $("incidentText").value;

if(peropVisible && (diurese || saignement || remplissage || norad || incident || (state.transfusionActive && state.transfusion.length) || (state.drainsActive && state.drains.length))){
    txt += "PER-OPÉRATOIRE\n";

    if(diurese) txt += `Diurèse : ${diurese} mL.\n`;
    if(saignement) txt += `Saignement estimé : ${saignement} mL.\n`;
    if(remplissage) txt += `Remplissage : ${remplissage}.\n`;
    if(state.transfusionActive && state.transfusion.length){
  const transf = [];

  if(state.transfusion.includes("CGR")){
    const q = $("qteCGR").value;
    transf.push(q ? `${q} CGR` : "CGR");
  }

  if(state.transfusion.includes("PFC")){
    const q = $("qtePFC").value;
    transf.push(q ? `${q} PFC` : "PFC");
  }

  if(state.transfusion.includes("Plaquettes")){
    const q = $("qtePlaquettes").value;
    transf.push(q ? `${q} Plaquettes` : "Plaquettes");
  }

  if(state.transfusion.includes("Fibrinogène")){
  const q = $("qteFibrinogene").value;
  transf.push(q ? `Fibrinogène ${q} g` : "Fibrinogène");
}

if(state.transfusion.includes("Calcium")){
  const q = $("qteCalcium").value;
  transf.push(q ? `Calcium ${q} g` : "Calcium");
}

  if(state.transfusion.includes("Autre")){
    const autre = $("transfusionOtherText").value.trim();
    if(autre) transf.push(autre);
  }

  if(transf.length){
    txt += `Transfusion peropératoire : ${transf.join(", ")}.\n`;
  }
}
if(state.drainsActive && state.drains.length){
  const drains = [];

  if(state.drains.includes("Drain thoracique")){
    const txt = $("drainThoraciqueText").value.trim();
    drains.push(txt ? `Drain thoracique ${txt}` : "Drain thoracique");
  }

  if(state.drains.includes("Redon")){
    const txt = $("redonText").value.trim();
    drains.push(txt ? `Redon ${txt}` : "Redon");
  }

  if(state.drains.includes("Lame")){
    const txt = $("lameText").value.trim();
    drains.push(txt ? `Lame ${txt}` : "Lame");
  }

  if(state.drains.includes("Sonde vésicale")){
    const txt = $("svText").value.trim();
    drains.push(txt ? `Sonde vésicale ${txt} Fr` : "Sonde vésicale");
  }

  if(state.drains.includes("SNG")){
    drains.push("SNG");
  }

  if(state.drains.includes("Autre")){
    const txt = $("drainsOtherText").value.trim();
    if(txt) drains.push(txt);
  }

  if(drains.length){
    txt += `Dispositifs : ${drains.join(", ")}.\n`;
  }
}
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
const reveil = state.reveil || [];
const destination = $("destinationPostop")?.value;
const complicationExtubation = $("complicationExtubationText")?.value?.trim();
const intubeVentileReason = $("intubeVentileReason")?.value?.trim();

if(reveil.length || destination){
  txt += "SUITES IMMÉDIATES\n";

  const intube = reveil.includes("Patient transféré intubé ventilé");
  const complication = reveil.includes("Complication extubation");
  const extubation = reveil.includes("Extubation");

  if(intube){
    let phrase = "Patient transféré intubé ventilé";

    if(destination){
      phrase += " en " + destination.toLowerCase();
    }

    if(intubeVentileReason){
      phrase += " en raison de " + intubeVentileReason;
    }

    txt += phrase + ".\n";
  }else{
    if(complication && complicationExtubation){
      txt += `Complication à l’extubation : ${complicationExtubation}.\n`;
    }else if(extubation){
      txt += "Patient extubé en SSPI sans complication.\n";
    }

    if(destination){
      txt += `Transfert en ${destination.toLowerCase()} pour suite de la prise en charge.\n`;
    }
  }

  txt += "\n";
}
    report.value = txt;
}

function buildDPIReport(){
  let txt = report.value;

  txt = txt.split("INTERVENTION\n").join("");
  txt = txt.split("INSTALLATION\n").join("");
  txt = txt.split("INDUCTION\n").join("");
  txt = txt.split("VOIES AÉRIENNES\n").join("");
  txt = txt.split("ENTRETIEN\n").join("");
  txt = txt.split("ANALGÉSIE\n").join("");
  txt = txt.split("ALR PÉRIPHÉRIQUE\n").join("");
  txt = txt.split("ALR NEURAXIALE\n").join("");
  txt = txt.split("PER-OPÉRATOIRE\n").join("");
  txt = txt.split("ANTIBIOPROPHYLAXIE\n").join("");
  txt = txt.split("SUITES IMMÉDIATES\n").join("");

  return txt;
}
