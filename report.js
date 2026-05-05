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

  if(mon.length || state.monitorage.includes("KTA") || state.monitorage.includes("KTC")){
    txt += "INSTALLATION\n";

    const position = $("positionPatient")?.value;
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
  const reveil = state.reveil || [];
  const destination = $("destinationPostop")?.value;
  const stableHemo = $("stableHemodynamique")?.checked;
  const stableRespi = $("stableRespiratoire")?.checked;

  if(reveil.length || destination){
    txt += "SUITES IMMÉDIATES\n";

    if(reveil.length){
      txt += reveil.join(". ") + ".\n";
    }

    if(destination){
      if(destination === "SSPI"){
        txt += "Patient transféré en SSPI";
      }else if(destination === "Réanimation"){
        txt += "Patient transféré en réanimation";
      }else if(destination === "USCC"){
        txt += "Patient transféré en USCC";
      }else{
        txt += "Patient transféré en secteur d’hospitalisation";
      }

      const stabilites = [];

      if(stableHemo) stabilites.push("stable sur le plan hémodynamique");
      if(stableRespi) stabilites.push("stable sur le plan respiratoire");

      if(stabilites.length){
        txt += ", " + stabilites.join(" et ");
      }

      txt += ".\n";
    }

    txt += "\n";
  }
  report.value = txt;
}
function buildDPIReport(){
  let txt = report.value;

  const titres = [
    "INTERVENTION",
    "INSTALLATION",
    "INDUCTION",
    "VOIES AÉRIENNES",
    "ENTRETIEN",
    "ANALGÉSIE",
    "ALR PÉRIPHÉRIQUE",
    "ALR NEURAXIALE",
    "PER-OPÉRATOIRE",
    "ANTIBIOPROPHYLAXIE",
    "SUITES IMMÉDIATES"
  ];

  titres.forEach(t=>{
    txt = txt.split(t + "\n").join("");
  });

  txt = txt
    .split("\n")
    .map(l=>l.trim())
    .filter(Boolean)
    .join("\n");

  return txt;
}