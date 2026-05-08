const DATA = {
  anesthesistes: [
    "Dr Stéphanie ALBOUY",
    "Dr Guy ARMANDO",
    "Dr Laure BONNET",
    "Dr Mohammed BOUREGBA",
    "Dr Jean CATINEAU",
    "Dr Alexandre FERRIERO",
    "Dr Arthur FROHLICH",
    "Dr Sébastien GHIGLIONE",
    "Dr Jean-Philippe GUERIN",
    "Dr Lucile LEVASSEUR",
    "Dr Léa LEY-GHIGLIONE",
    "Dr Ruyade MENADE",
    "Dr Nicolas OPPRECHT",
    "Dr Nicolas PARTOUCHE",
    "Pr Bertrand PRUNET",
    "Dr Gildas ROUSSEAU",
    "Dr Nicolo SALA",
    "Dr Mathilde SEVERAC",
    "Dr Clément SUPLY",
    "Dr Wajdi SULTAN",
    "Dr Daisy TRAN",
    "Dr Rémy WIDEHEM",
    "Dr Félix ZAMARON"
  ],

  monitorage: ["Scope","SpO2","VVP","KTA","KTC","BIS","TOF"],

  induction: ["Sufentanil","Rémifentanil","Kétamine","Etomidate","Propofol"],

  entretien: ["Sevoflurane","Propofol AIVOC"],

  laterality: ["Droite","Gauche","Bilatéral"],

  lateralizedGestes: [
  "PTH",
  "PTG",
  "Hallux valgus",
  "Clou gamma",
  "Varices",
  "Canal carpien",
  "Ostéosynthèse poignet",
  "Ostéosynthèse cheville",
  "Hernie inguinale",
  "Colectomie",
  "Annexectomie",
  "Kystectomie ovarienne",
  "Cataracte",
  "Prothèse d'épaule",
  "Arthroscopie de genou",
  "Arthroscopie d'épaule",
  "Mastectomie partielle",
  "Mastectomie totale",
  "Surrénalectomie",
],
approachOptions: {
  "Colectomie": ["Cœlioscopie", "Laparotomie", "Robot-assistée"],
  "Appendicectomie": ["Cœlioscopie", "Laparotomie"],
  "Cholécystectomie": ["Cœlioscopie", "Laparotomie"],
  "Annexectomie": ["Cœlioscopie", "Laparotomie", "Robot-assistée"],
  "Hystérectomie": ["Cœlioscopie", "Laparotomie", "Robot-assistée"],
  "Kystectomie ovarienne": ["Cœlioscopie", "Laparotomie"],
  "Prostatectomie totale": ["Robot-assistée", "Laparotomie"],
  "Lobectomie pulmonaire": ["Thoracoscopie", "Thoracotomie", "Robot-assistée"],
  "Segmentectomie": ["Thoracoscopie", "Thoracotomie", "Robot-assistée"],
  "Sigmoïdectomie": ["Cœlioscopie", "Laparotomie", "Robot-assistée"],
  "Résection grêlique": ["Cœlioscopie", "Laparotomie", "Robot-assistée"],
  "Iléostomie": ["Cœlioscopie", "Laparotomie", "Robot-assistée"],
  "Colostomie": ["Cœlioscopie", "Laparotomie", "Robot-assistée"],
  "Cure d’éventration": ["Cœlioscopie", "Laparotomie", "Robot-assistée"],
  "Cure de hernie hiatale": ["Cœlioscopie", "Laparotomie", "Robot-assistée"],
  "Sleeve gastrectomie": ["Cœlioscopie", "Laparotomie", "Robot-assistée"],
  "Bypass gastrique": ["Cœlioscopie", "Laparotomie", "Robot-assistée"],
  "Splénectomie": ["Cœlioscopie", "Laparotomie", "Robot-assistée"],
  "Surrénalectomie": ["Cœlioscopie", "Laparotomie", "Robot-assistée"],
  "Rétablissement de continuité": ["Cœlioscopie", "Laparotomie", "Robot-assistée"],
},
  textGestes: [
    "Lobectomie pulmonaire",
    "Segmentectomie",
    "Recalibrage",
    "Vertébroplastie",
    "Segmentectomie hépatique",
    "Embolisation"
  ],

  specialites: {
    "Orthopédie": {
      chirurgiens: [
        "Dr Cédric PELEGRI",
        "Dr Adrien GUILLOT",
        "Dr Hugo DARMANTE",
        "Dr Tristan LASCAR",
        "Dr Mathieu GHREA"
      ],
      interventions: [
        "PTH","PTG","Ostéosynthèse cheville","Ostéosynthèse poignet",
        "Recalibrage","Canal carpien","Hallux valgus","Clou gamma",
        "Prothèse d'épaule","Arthroscopie de genou","Arthroscopie d'épaule",
        "Autre..."
      ]
    },

    "Viscéral": {
      chirurgiens: [
        "Pr Fabrizio PANARO",
        "Dr Adolfo GAVELLI",
        "Dr Marie-Christine MISSANA",
        "Dr Hubert PERRIN",
        "Dr Anna MARMORALE",
        "Dr Anne DUBOIS-VERDIER",
        "Dr Nicoletta AMBROSIANI",
        "Dr Tayeb BENKIRAN",
      ],
      interventions: [
        "Duodénopancréatectomie céphalique",
        "Œsophagectomie Lewis-Santy",
        "Appendicectomie",
        "Hernie inguinale",
        "Hernie ombilicale",
        "Hémorroïdectomie",
        "Colectomie",
        "Coelioscopie exploratrice",
        "Cholécystectomie",
        "Promontofixation",
        "Mastectomie partielle",
        "Mastectomie totale",
        "Injection Bulkamide",
        "Annexectomie",
        "Hystérectomie",
        "CHIP",
        "Kystectomie ovarienne",
        "Segmentectomie hépatique",
"Amputation abdomino-périnéale",
"Sigmoïdectomie",
"Résection grêlique",
"Iléostomie",
"Colostomie",
"Rétablissement de continuité",
"Cure d’éventration",
"Cure de hernie hiatale",
"Sleeve gastrectomie",
"Bypass gastrique",
"Splénectomie",
"Surrénalectomie",
"Thyroïdectomie totale",
"Parathyroïdectomie",
        "Autre..."
      ]
    },

    "Thoracique": {
      chirurgiens: [
        "Dr Tayeb BENKIRAN",
        "Pr Jean-Philippe BERTHET"
      ],
      interventions: [
        "Lobectomie pulmonaire",
        "Segmentectomie",
        "Talcage pleural",
        "Médiastinoscopie",
        "Autre..."
      ]
    },

    "Endoscopie digestive": {
      chirurgiens: [
        "Dr Alexandre CHARACHON",
        "Dr Luc DIEZ",
        "Dr Juliette LAVAYSSIERE",
        "Dr Daniela AGREFILO",
        "Dr Jean-François DEMARQUAY"
      ],
      interventions: [
        "Gastroscopie","Coloscopie","Echo-endoscopie haute","RSF","ERCP",
        "Pose de prothèse biliaire","Dissection sous-muqueuse","Mucosectomie",
        "POEM","Autre..."
      ]
    },

    "Cardiologie interventionnelle": {
      chirurgiens: ["Dr Gabriel LATCU","Dr Denis GATY"],
      interventions: ["Ablation de FA","Ablation de flutter","Autre..."]
    },

    "Radiologie interventionnelle": {
      chirurgiens: [
        "Pr Giuseppe GUZZARDI",
        "Dr Federico TORRE",
        "Dr Mathieu LIBERATORE"
      ],
      interventions: ["Vertébroplastie","Embolisation","Autre..."]
    },

    "Gynécologie / Obstétrique": {
      chirurgiens: [
        "Pr Bruno CARBONNE","Dr Jacques RAIGA","Dr Bernard BENOIT",
        "Dr Guillaume DOUCEDE","Dr Reda DJAFER","Dr Julia AUMIPHIN",
        "Dr Adrien GAUDINEAU","Dr Wafaa EL AHMADI-LAACHOURI",
        "Pr Guillaume BENOIST"
      ],
      interventions: [
        "Césarienne","Hystérectomie","Annexectomie",
        "Conisation","Nymphoplastie de réduction",
        "Curetage","Cerclage","Autre..."
      ]
    },

    "Urologie": {
      chirurgiens: [
        "Dr Xavier CARPENTIER","Dr Raffaele CURSIO",
        "Dr Maher KECHAOU","Dr Patrick-Julien TREACY"
      ],
      interventions: [
        "Prostatectomie totale","Biopsies de prostate",
        "REP","REV","URS + Laser","Montée de JJ",
        "Cystectomie totale",
        "Autre..."
      ]
    },

    "ORL": {
      chirurgiens: [
        "Dr Diane LAZARD","Dr Riadh BERGUIGA",
        "Dr Sandrine CANIVET","Dr Albert VAN HOVE"
      ],
      interventions: [
        "Septoplastie","Rhinoplastie","Thyroïdectomie totale",
        "Thyroïdectomie partielle","Parathyroidectomie",
        "Extraction DDS","Carcinome cutané","Cholestéatome",
        "Adénoidectomie","DTT","Turbinoplastie",
        "Adénoamygdalectomie","Autre..."
      ]
    },

    "Vasculaire": {
      chirurgiens: ["Dr Gianvittorio TOMMASI"],
      interventions: ["Varices","Autre..."]
    },

    "Ophtalmologie": {
      chirurgiens: [
        "Dr Frédéric BETIS","Dr Florence GASTAUD-NEGRE",
        "Dr Emilie MATAMOROS","Dr Alissa BARRADE-CARZOLI",
        "Dr Philippe BERROS","Dr Liliane LASSERRE",
        "Dr Valérie ELMALEH","Dr Cécilia LEAL",
        "Dr Thierry FERRETE"
      ],
      interventions: ["Cataracte","Autre..."]
    }
  }
};
