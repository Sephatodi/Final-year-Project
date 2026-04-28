// diseases-db.js
// PouchDB database initialization and disease documents
// Run this file to seed your local PouchDB instance

import PouchDB from 'pouchdb';

// Initialize local database
const db = new PouchDB('farm_aid_diseases');

// ============================================
// DISEASE DOCUMENTS (27 diseases)
// ============================================

const diseaseDocuments = [
  // SHEEP & GOATS (1-9)
  {
    _id: 'disease_caseous_lymphadenitis',
    type: 'disease',
    name: 'Caseous Lymphadenitis',
    localName: 'CL',
    species: ['sheep', 'goats'],
    category: 'bacterial',
    notifiable: false,
    identification: {
      signs: [
        'Painless, enlarging abscesses on lymph nodes (jaw, neck, flank)',
        'Thick, toothpaste-like pus',
        'Weight loss in advanced cases'
      ],
      onset: 'chronic',
      mortalityRate: 'low',
      seasonality: 'year-round'
    },
    treatment: {
      stepByStep: [
        'Isolate affected animal',
        'Lance abscess when soft (sterile gloves, disinfect area)',
        'Drain pus, remove necrotic core',
        'Flush with 1% povidone-iodine',
        'Inject long-acting oxytetracycline (20 mg/kg IM once)',
        'Burn or bury pus-contaminated materials'
      ],
      medicines: [
        { name: 'Oxytetracycline LA', dosage: '20 mg/kg IM once', route: 'IM' },
        { name: 'Tulathromycin', dosage: '2.5 mg/kg SQ once', route: 'SQ' }
      ],
      supportiveCare: 'Isolation, wound care'
    },
    prevention: 'Cull affected animals, maintain hygiene, avoid sharing equipment',
    withdrawalTimes: { meat: 28, milk: 120 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_ovine_respiratory_complex',
    type: 'disease',
    name: 'Ovine/Goat Respiratory Complex',
    localName: 'Pasteurellosis',
    species: ['sheep', 'goats'],
    category: 'bacterial',
    notifiable: false,
    identification: {
      signs: [
        'Fever (104–106°F)',
        'Mucopurulent nasal discharge',
        'Cough, rapid breathing',
        'Head tilt',
        'Off feed'
      ],
      onset: 'acute',
      mortalityRate: 'moderate',
      seasonality: 'stress-related (transport, weather)'
    },
    treatment: {
      stepByStep: [
        'Isolate from herd',
        'Check temperature – if >104°F, treat',
        'Administer antibiotics',
        'Give NSAID for fever/pain',
        'Provide warm dry shelter, electrolytes if anorexic'
      ],
      medicines: [
        { name: 'Tulathromycin (Draxxin)', dosage: '2.5 mg/kg SQ single dose', route: 'SQ' },
        { name: 'Florfenicol (Nuflor)', dosage: '20 mg/kg IM, repeat in 48h', route: 'IM' },
        { name: 'Flunixin meglumine (Banamine)', dosage: '1.1 mg/kg IV once', route: 'IV' },
        { name: 'Meloxicam', dosage: '0.5 mg/kg PO', route: 'PO' }
      ],
      supportiveCare: 'Electrolytes, warm shelter'
    },
    prevention: 'Vaccination, reduce stress, proper ventilation',
    withdrawalTimes: { meat: 28, milk: 120 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_coccidiosis_small',
    type: 'disease',
    name: 'Coccidiosis',
    localName: 'Cocci',
    species: ['sheep', 'goats', 'cattle'],
    category: 'parasitic',
    notifiable: false,
    identification: {
      signs: [
        'Watery to bloody diarrhea',
        'Straining (tenesmus)',
        'Dehydration',
        'Rough hair coat',
        'Pale mucous membranes'
      ],
      onset: 'acute',
      mortalityRate: 'moderate in young',
      seasonality: 'wet season, overcrowding'
    },
    treatment: {
      stepByStep: [
        'Oral drench with anticoccidial',
        'Provide oral rehydration solution (electrolytes + glucose)',
        'Clean pens completely (steam clean if possible)',
        'Isolate affected kids/lambs/calves'
      ],
      medicines: [
        { name: 'Amprolium (Corid)', dosage: '10 mg/kg once daily for 5 days', route: 'PO' },
        { name: 'Sulfadimethoxine (Di-Methox)', dosage: '50 mg/kg day 1, then 25 mg/kg for 4 days', route: 'PO' }
      ],
      supportiveCare: 'Electrolytes, clean environment'
    },
    prevention: 'Clean housing, avoid overcrowding, coccidiostats in feed',
    withdrawalTimes: { meat: 5, milk: 48 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_orf_soremouth',
    type: 'disease',
    name: 'Contagious Ecthyma',
    localName: 'Orf / Soremouth',
    species: ['sheep', 'goats'],
    category: 'viral',
    notifiable: false,
    zoonotic: true,
    identification: {
      signs: [
        'Scabby, proliferative lesions on lips, nostrils, teats, coronary band',
        'Lesions progress: vesicles → pustules → thick brown scabs'
      ],
      onset: 'subacute',
      mortalityRate: 'low',
      seasonality: 'year-round'
    },
    treatment: {
      stepByStep: [
        'Isolate animal',
        'Apply topical antiseptic/emollient daily',
        'If secondary infection – systemic antibiotics',
        'Provide soft palatable feed (gruel)',
        'Wear gloves (zoonotic)'
      ],
      medicines: [
        { name: 'Topical iodine ointment', dosage: 'Apply to lesions daily', route: 'topical' },
        { name: 'Penicillin G procaine', dosage: '20,000 IU/kg IM daily x 3 days', route: 'IM' }
      ],
      supportiveCare: 'Soft feed, isolation'
    },
    prevention: 'Vaccination (live vaccine – careful use), quarantine new animals',
    withdrawalTimes: { meat: 10, milk: 48 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_footrot',
    type: 'disease',
    name: 'Footrot',
    localName: 'Fouling',
    species: ['sheep', 'goats', 'cattle'],
    category: 'bacterial',
    notifiable: false,
    identification: {
      signs: [
        'Lameness',
        'Interdigital dermatitis',
        'Under-run sole with foul odor',
        'Separation of hoof horn'
      ],
      onset: 'subacute',
      mortalityRate: 'low',
      seasonality: 'wet conditions'
    },
    treatment: {
      stepByStep: [
        'Restrain animal, trim hoof to remove necrotic tissue',
        'Soak foot in 10% zinc sulfate or 5% formalin (15 min)',
        'Apply topical oxytetracycline spray',
        'Systemic: Long-acting oxytetracycline (20 mg/kg IM single dose)',
        'Repeat footbath in 7 days',
        'Keep on dry ground'
      ],
      medicines: [
        { name: 'Oxytetracycline LA', dosage: '20 mg/kg IM once', route: 'IM' },
        { name: 'Zinc sulfate solution', dosage: '10% solution, 15 min soak', route: 'topical' },
        { name: 'Oxytetracycline spray', dosage: 'Apply to cleaned hoof', route: 'topical' }
      ],
      supportiveCare: 'Dry housing, hoof trimming'
    },
    prevention: 'Footbaths, dry paddocks, cull chronic cases',
    withdrawalTimes: { meat: 28, milk: 120 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_mastitis_small',
    type: 'disease',
    name: 'Mastitis',
    localName: 'Udder infection',
    species: ['sheep', 'goats', 'cattle'],
    category: 'bacterial',
    notifiable: false,
    identification: {
      signs: [
        'Swollen, hot, painful udder',
        'Watery, clotted, or bloody milk',
        'Fever',
        'Anorexia',
        'Doe/ewe isolates young'
      ],
      onset: 'acute',
      mortalityRate: 'low with treatment',
      seasonality: 'periparturient'
    },
    treatment: {
      stepByStep: [
        'Milk out affected half frequently',
        'Intramammary infusion (after milking)',
        'Systemic antibiotics',
        'NSAID for pain/fever',
        'Supportive fluids, bottle-feed young'
      ],
      medicines: [
        { name: 'Cloxacillin intramammary', dosage: '1 tube per affected quarter after milking', route: 'intramammary' },
        { name: 'Penicillin G procaine', dosage: '20,000 IU/kg IM daily for 3 days', route: 'IM' },
        { name: 'Meloxicam', dosage: '0.5 mg/kg PO once daily', route: 'PO' }
      ],
      supportiveCare: 'Frequent milking, fluids, separate from young'
    },
    prevention: 'Teat dipping, dry cow therapy, hygiene',
    withdrawalTimes: { meat: 10, milk: 48 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_bloat_frothy',
    type: 'disease',
    name: 'Frothy Bloat',
    localName: 'Bloat',
    species: ['sheep', 'goats', 'cattle'],
    category: 'metabolic',
    notifiable: false,
    emergency: true,
    identification: {
      signs: [
        'Distended left abdomen (tight, drum-like)',
        'Dyspnea (difficulty breathing)',
        'Grunting',
        'Sudden death'
      ],
      onset: 'peracute',
      mortalityRate: 'high if untreated',
      seasonality: 'lush pasture, grain feeding'
    },
    treatment: {
      stepByStep: [
        'Pass stomach tube – if gas releases = free gas bloat',
        'If frothy: Give antifoaming agent',
        'Roll animal side-to-side',
        'If severe and not responding – emergency trocarization (left paralumbar fossa)',
        'After recovery: rumen transfaunation'
      ],
      medicines: [
        { name: 'Poloxalene (Therabloat)', dosage: '5–10 g orally', route: 'PO' },
        { name: 'Vegetable oil + Docusate', dosage: '100–200 ml oil + 30 ml docusate', route: 'PO' }
      ],
      supportiveCare: 'Rumen transfaunation after recovery'
    },
    prevention: 'Avoid sudden grain changes, use bloat preventatives in feed',
    withdrawalTimes: { meat: 0, milk: 0 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_johnes_small',
    type: 'disease',
    name: "Johne's Disease",
    localName: 'Paratuberculosis',
    species: ['sheep', 'goats', 'cattle'],
    category: 'bacterial',
    notifiable: true,
    identification: {
      signs: [
        'Chronic weight loss with normal appetite',
        'Bottle jaw (submandibular edema)',
        'Intermittent diarrhea'
      ],
      onset: 'chronic',
      mortalityRate: 'high (eventual)',
      seasonality: 'year-round'
    },
    treatment: {
      stepByStep: [
        'Isolate and cull positive animals',
        'Supportive: high-energy diet, electrolytes',
        'No effective treatment – focus on herd biosecurity',
        'Test annually (fecal PCR)'
      ],
      medicines: [],
      supportiveCare: 'Nutritional support, culling'
    },
    prevention: 'Test and cull, buy from Johne’s-free herds, colostrum hygiene',
    withdrawalTimes: { meat: 0, milk: 0 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_listeriosis',
    type: 'disease',
    name: 'Listeriosis',
    localName: 'Circling Disease',
    species: ['sheep', 'goats', 'cattle'],
    category: 'bacterial',
    notifiable: false,
    zoonotic: true,
    identification: {
      signs: [
        'Circling',
        'Facial paralysis (drooping ear/snout)',
        'Fever',
        'Depression',
        'Abortion'
      ],
      onset: 'subacute',
      mortalityRate: 'high without treatment',
      seasonality: 'associated with silage feeding'
    },
    treatment: {
      stepByStep: [
        'High-dose Penicillin G',
        'Dexamethasone for brain swelling',
        'Supportive fluids, soft feed',
        'Remove spoiled silage (common source)'
      ],
      medicines: [
        { name: 'Penicillin G', dosage: '40,000 IU/kg IM BID x 5–7 days', route: 'IM' },
        { name: 'Dexamethasone', dosage: '0.1 mg/kg IV once', route: 'IV' }
      ],
      supportiveCare: 'Fluids, soft feed, nursing care'
    },
    prevention: 'Avoid feeding spoiled silage, rodent control',
    withdrawalTimes: { meat: 10, milk: 48 },
    createdAt: new Date().toISOString()
  },

  // CATTLE (10-21)
  {
    _id: 'disease_brd_shipping_fever',
    type: 'disease',
    name: 'Bovine Respiratory Disease',
    localName: 'Shipping Fever',
    species: ['cattle'],
    category: 'bacterial/viral',
    notifiable: false,
    identification: {
      signs: [
        'Fever (>104°F)',
        'Depression',
        'Nasal discharge',
        'Cough',
        'Decreased feed intake',
        'Rapid breathing'
      ],
      onset: 'acute',
      mortalityRate: 'moderate',
      seasonality: 'stress-related (shipping, weaning)'
    },
    treatment: {
      stepByStep: [
        'Check temperature – if >104°F, treat',
        'Administer antibiotic',
        'NSAID for fever/pain',
        'Isolate from healthy cattle',
        'Re-evaluate in 48h – if no improvement, switch antibiotic'
      ],
      medicines: [
        { name: 'Tulathromycin (Draxxin)', dosage: '2.5 mg/kg SQ single dose', route: 'SQ' },
        { name: 'Florfenicol (Nuflor)', dosage: '40 mg/kg SQ once', route: 'SQ' },
        { name: 'Gamithromycin (Zactran)', dosage: '6 mg/kg SQ', route: 'SQ' },
        { name: 'Flunixin meglumine (Banamine)', dosage: '2.2 mg/kg IV once', route: 'IV' },
        { name: 'Enrofloxacin (Baytril)', dosage: '7.5–12.5 mg/kg SQ once (if no improvement)', route: 'SQ' }
      ],
      supportiveCare: 'Isolation, good ventilation'
    },
    prevention: 'Vaccination (IBR, BVD, PI3, BRSV), minimize stress',
    withdrawalTimes: { meat: 28, milk: 120 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_pinkeye',
    type: 'disease',
    name: 'Infectious Bovine Keratoconjunctivitis',
    localName: 'Pinkeye',
    species: ['cattle'],
    category: 'bacterial',
    notifiable: false,
    identification: {
      signs: [
        'Excessive tearing',
        'Squinting',
        'Corneal opacity (white/blue spot)',
        'Central ulcer',
        'Photophobia'
      ],
      onset: 'subacute',
      mortalityRate: 'low',
      seasonality: 'summer, fly season'
    },
    treatment: {
      stepByStep: [
        'Restrain head, flush eye with saline',
        'Subconjunctival injection',
        'Topical antibiotic ointment twice daily for 3–5 days',
        'Patch eye to reduce light',
        'Systemic long-acting oxytetracycline',
        'Control flies (ear tags, pour-on insecticide)'
      ],
      medicines: [
        { name: 'Oxytetracycline LA', dosage: '50 mg subconjunctival or 20 mg/kg IM once', route: 'subconjunctival/IM' },
        { name: 'Tulathromycin', dosage: '100 mg subconjunctival', route: 'subconjunctival' },
        { name: 'Cloxacillin ophthalmic ointment', dosage: 'Apply BID x 3–5 days', route: 'topical ocular' }
      ],
      supportiveCare: 'Eye patch, fly control'
    },
    prevention: 'Fly control, vaccination (autogenous vaccines available)',
    withdrawalTimes: { meat: 28, milk: 120 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_bovine_mastitis',
    type: 'disease',
    name: 'Bovine Mastitis',
    localName: 'Udder Infection',
    species: ['cattle'],
    category: 'bacterial',
    notifiable: false,
    identification: {
      signs: [
        'Abnormal milk (clots, watery, bloody)',
        'Udder swelling/heat/pain',
        'Fever',
        'Decreased milk yield',
        'Sick cow appearance'
      ],
      onset: 'acute',
      mortalityRate: 'low with treatment',
      seasonality: 'periparturient, environmental'
    },
    treatment: {
      stepByStep: [
        'Milk out quarter frequently (every 2–4h)',
        'Collect milk sample for culture (before antibiotics)',
        'Intramammary infusion (after milking)',
        'Systemic antibiotics',
        'NSAID for pain/fever',
        'Fluid therapy if dehydrated',
        'Oxytocin (20 IU IV) to help milk letdown if udder engorged'
      ],
      medicines: [
        { name: 'Ceftiofur (Spectramast)', dosage: '1 tube per affected quarter after milking', route: 'intramammary' },
        { name: 'Cloxacillin (Orbenin)', dosage: '1 tube per affected quarter after milking', route: 'intramammary' },
        { name: 'Ceftiofur (Excede)', dosage: '2.2 mg/kg IM daily x 3–5 days', route: 'IM' },
        { name: 'Meloxicam (Metacam)', dosage: '0.5 mg/kg IV once daily', route: 'IV' },
        { name: 'Oxytocin', dosage: '20 IU IV', route: 'IV' }
      ],
      supportiveCare: 'Frequent milking, fluids, nutritional support'
    },
    prevention: 'Teat dipping, dry cow therapy, milking hygiene, cull chronic cows',
    withdrawalTimes: { meat: 4, milk: 0 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_bvd',
    type: 'disease',
    name: 'Bovine Viral Diarrhea',
    localName: 'BVD',
    species: ['cattle'],
    category: 'viral',
    notifiable: true,
    identification: {
      signs: [
        'Fever',
        'Diarrhea (watery to bloody)',
        'Oral erosions',
        'Nasal discharge',
        'Leukopenia',
        'Abortions',
        'Persistently infected (PI) calves – poor growth, ill-thrift'
      ],
      onset: 'acute or chronic',
      mortalityRate: 'variable',
      seasonality: 'year-round'
    },
    treatment: {
      stepByStep: [
        'Isolate, provide clean bedding',
        'Oral electrolyte solutions (2–4 L twice daily)',
        'Anti-diarrheal: Kaolin-pectin',
        'Antibiotics (prevent secondary bacterial infection)',
        'NSAID for fever',
        'Test for BVD-PI; cull PI animals'
      ],
      medicines: [
        { name: 'Oxytetracycline', dosage: '10 mg/kg IM daily x 3 days', route: 'IM' },
        { name: 'Flunixin (Banamine)', dosage: '1.1 mg/kg IV once', route: 'IV' },
        { name: 'Oral electrolytes', dosage: '2–4 L BID', route: 'PO' }
      ],
      supportiveCare: 'Isolation, fluids, nutritional support'
    },
    prevention: 'Vaccination, biosecurity, test and cull PI animals',
    withdrawalTimes: { meat: 28, milk: 120 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_anaplasmosis',
    type: 'disease',
    name: 'Anaplasmosis',
    localName: 'Tick Fever',
    species: ['cattle'],
    category: 'rickettsial',
    notifiable: false,
    identification: {
      signs: [
        'High fever (105–107°F)',
        'Pale/yellow mucous membranes (icterus)',
        'Weakness',
        'Red urine (hemoglobinuria)',
        'Sudden death in adults'
      ],
      onset: 'acute',
      mortalityRate: 'high in adults',
      seasonality: 'tick season'
    },
    treatment: {
      stepByStep: [
        'Immediate: Oxytetracycline LA',
        'Blood transfusion if severe anemia (PCV <12%)',
        'Support: B-complex vitamins, fluids, flunixin if fever >106°F',
        'Keep animal quiet, no stress',
        'After recovery: Imidocarb dipropionate to clear carrier status'
      ],
      medicines: [
        { name: 'Oxytetracycline LA', dosage: '20 mg/kg IM once, repeat in 48h', route: 'IM' },
        { name: 'Imidocarb dipropionate (Imizol)', dosage: '3 mg/kg SQ once', route: 'SQ' },
        { name: 'Flunixin (Banamine)', dosage: '1.1 mg/kg IV if fever >106°F', route: 'IV' }
      ],
      supportiveCare: 'Blood transfusion, fluids, quiet housing'
    },
    prevention: 'Tick control, vaccination, maintain stable herd (endemic stability)',
    withdrawalTimes: { meat: 28, milk: 120 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_laminitis',
    type: 'disease',
    name: 'Laminitis',
    localName: 'Founder',
    species: ['cattle', 'sheep', 'goats'],
    category: 'metabolic',
    notifiable: false,
    identification: {
      signs: [
        'Reluctant to walk',
        'Arched back',
        'Heat in hooves',
        '"Sawhorse" stance',
        'Separation of hoof wall in chronic cases'
      ],
      onset: 'subacute to chronic',
      mortalityRate: 'low',
      seasonality: 'grain feeding, lush pasture'
    },
    treatment: {
      stepByStep: [
        'Soft bedding (sand or shavings)',
        'NSAID for pain',
        'Vasodilator (optional, questionable efficacy)',
        'Correct diet: Remove grain, feed hay only',
        'Hoof trim by farrier – relieve sole pressure',
        'Cold water footbath (15 min twice daily) for acute cases'
      ],
      medicines: [
        { name: 'Ketoprofen', dosage: '3 mg/kg IV once daily', route: 'IV' },
        { name: 'Aspirin', dosage: '100 mg/kg PO BID', route: 'PO' },
        { name: 'Isoxsuprine', dosage: '1 mg/kg PO BID (optional)', route: 'PO' }
      ],
      supportiveCare: 'Soft bedding, hoof trimming, dietary change'
    },
    prevention: 'Avoid sudden grain changes, balanced diet, regular hoof care',
    withdrawalTimes: { meat: 15, milk: 5 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_milk_fever',
    type: 'disease',
    name: 'Milk Fever',
    localName: 'Hypocalcemia',
    species: ['cattle'],
    category: 'metabolic',
    notifiable: false,
    emergency: true,
    identification: {
      signs: [
        'Early – excitability, muscle tremors',
        'Later – lateral recumbency',
        '"S" bend in neck',
        'Bloat',
        'Cold extremities'
      ],
      onset: 'peracute',
      mortalityRate: 'high if untreated',
      seasonality: 'around calving (especially high-producing dairy cows)'
    },
    treatment: {
      stepByStep: [
        'IV Calcium gluconate 23% – 500 ml slowly over 10–20 min (monitor heart)',
        'If not standing in 1h: Subcutaneous calcium borogluconate (250 ml) + follow-up oral calcium gel',
        'Roll cow to sternum if bloating',
        'Prevent recurrence: Oral calcium bolus at calving'
      ],
      medicines: [
        { name: 'Calcium gluconate 23%', dosage: '500 ml IV slowly over 10–20 min', route: 'IV' },
        { name: 'Calcium borogluconate', dosage: '250 ml SC', route: 'SC' },
        { name: 'Oral calcium gel', dosage: '1 tube PO', route: 'PO' }
      ],
      supportiveCare: 'Monitor heart during IV, roll if bloating'
    },
    prevention: 'Low-calcium diet pre-calving, oral calcium boluses at calving',
    withdrawalTimes: { meat: 0, milk: 0 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_mannheimiosis',
    type: 'disease',
    name: 'Pneumonic Mannheimiosis',
    localName: 'Mannheimia haemolytica',
    species: ['cattle', 'sheep', 'goats'],
    category: 'bacterial',
    notifiable: false,
    identification: {
      signs: [
        'Fever',
        'Open-mouth breathing',
        'Foul nasal discharge',
        'Sudden death (fibrinous pleuropneumonia)'
      ],
      onset: 'peracute to acute',
      mortalityRate: 'high',
      seasonality: 'stress-related'
    },
    treatment: {
      stepByStep: [
        'Immediate antibiotic',
        'NSAID for fever/pain',
        'Furosemide if pulmonary edema',
        'Oxygen support if possible (nose tube O2)'
      ],
      medicines: [
        { name: 'Florfenicol (Nuflor)', dosage: '40 mg/kg SQ once', route: 'SQ' },
        { name: 'Tulathromycin (Draxxin)', dosage: '2.5 mg/kg SQ', route: 'SQ' },
        { name: 'Flunixin (Banamine)', dosage: '2.2 mg/kg IV once', route: 'IV' },
        { name: 'Furosemide', dosage: '0.5 mg/kg IV', route: 'IV' }
      ],
      supportiveCare: 'Oxygen, quiet environment'
    },
    prevention: 'Vaccination (Mannheimia + Pasteurella), reduce stress',
    withdrawalTimes: { meat: 28, milk: 120 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_calf_scours',
    type: 'disease',
    name: 'Calf Scours',
    localName: 'Neonatal Diarrhea',
    species: ['cattle'],
    category: 'bacterial/viral/parasitic',
    notifiable: false,
    identification: {
      signs: [
        'Watery diarrhea (yellow/green)',
        'Sunken eyes',
        'Weakness',
        'Prolonged suckle reflex'
      ],
      onset: 'acute',
      mortalityRate: 'high if untreated',
      seasonality: 'calving season'
    },
    treatment: {
      stepByStep: [
        'Stop milk feeding for 12h (continue oral electrolytes)',
        'Oral electrolyte solution: 2–4 L in divided doses over 24h',
        'Antibiotics only if septic (fever >103.5°F)',
        'Oral probiotics after antibiotics',
        'Warm dry housing'
      ],
      medicines: [
        { name: 'Enrofloxacin (Baytril)', dosage: '5 mg/kg SQ once (if septic)', route: 'SQ' },
        { name: 'Trimethoprim-sulfa', dosage: '15 mg/kg PO BID (if septic)', route: 'PO' },
        { name: 'Oral electrolytes', dosage: '2–4 L over 24h', route: 'PO' }
      ],
      supportiveCare: 'Warm housing, electrolytes, probiotics'
    },
    prevention: 'Colostrum management, clean calving area, dam vaccination (scour vaccines)',
    withdrawalTimes: { meat: 14, milk: 48 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_grass_tetany',
    type: 'disease',
    name: 'Grass Tetany',
    localName: 'Hypomagnesemia',
    species: ['cattle'],
    category: 'metabolic',
    notifiable: false,
    emergency: true,
    identification: {
      signs: [
        'Staggering',
        'Muscle twitching',
        'Wild-eyed, belligerent',
        'Recumbency with paddling',
        'Sudden death'
      ],
      onset: 'peracute',
      mortalityRate: 'high',
      seasonality: 'spring on lush grass'
    },
    treatment: {
      stepByStep: [
        'Slow IV: 250 ml calcium-magnesium solution (containing 5 g Mg sulfate) in 500 ml saline over 15 min',
        'Follow with subcutaneous magnesium sulfate (20% solution, 60 ml)',
        'After recovery: Oral magnesium supplement (magnesium oxide 60g daily)'
      ],
      medicines: [
        { name: 'Magnesium sulfate + calcium gluconate combination', dosage: '250 ml IV over 15 min', route: 'IV' },
        { name: 'Magnesium sulfate 20%', dosage: '60 ml SC', route: 'SC' },
        { name: 'Magnesium oxide', dosage: '60 g PO daily', route: 'PO' }
      ],
      supportiveCare: 'Monitor heart during IV'
    },
    prevention: 'Magnesium supplementation in feed or water, avoid lush grass-only diets',
    withdrawalTimes: { meat: 0, milk: 0 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_blackleg',
    type: 'disease',
    name: 'Blackleg',
    localName: 'Clostridium chauvoei',
    species: ['cattle'],
    category: 'bacterial',
    notifiable: false,
    identification: {
      signs: [
        'Sudden death in young cattle (6–24 months)',
        'Swollen, crepitant (gas-filled) muscles (usually hind leg/hip)',
        'Lameness before death'
      ],
      onset: 'peracute',
      mortalityRate: 'very high',
      seasonality: 'year-round'
    },
    treatment: {
      stepByStep: [
        'In early cases: High-dose Penicillin G',
        'Drain gas from swelling if needed (vet procedure)',
        'NSAID for pain',
        'Prevention: Annual vaccination (7-way clostridial)'
      ],
      medicines: [
        { name: 'Penicillin G', dosage: '40,000 IU/kg IV/IM BID x 5 days', route: 'IV/IM' },
        { name: 'NSAID (Flunixin or Ketoprofen)', dosage: 'Standard dose', route: 'IV' }
      ],
      supportiveCare: 'Often too late – prevention key'
    },
    prevention: 'Annual 7-way clostridial vaccination, avoid contaminated ground',
    withdrawalTimes: { meat: 10, milk: 48 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_rabies',
    type: 'disease',
    name: 'Rabies',
    localName: 'Rabies',
    species: ['cattle', 'sheep', 'goats', 'all mammals'],
    category: 'viral',
    notifiable: true,
    zoonotic: true,
    identification: {
      signs: [
        'Sudden behavior change (aggression or depression)',
        'Drooling (hypersalivation)',
        'Difficulty swallowing',
        'Progressive paralysis'
      ],
      onset: 'subacute',
      mortalityRate: '100% fatal',
      seasonality: 'year-round'
    },
    treatment: {
      stepByStep: [
        'Report immediately to veterinary authorities',
        'No treatment – always fatal',
        'Euthanasia required',
        'Humans exposed need post-exposure prophylaxis (PEP)'
      ],
      medicines: [],
      supportiveCare: 'None'
    },
    prevention: 'Annual vaccination (dogs, cats, livestock in endemic areas)',
    withdrawalTimes: { meat: 0, milk: 0 },
    createdAt: new Date().toISOString()
  },

  // GOAT-SPECIFIC (22-24)
  {
    _id: 'disease_cae',
    type: 'disease',
    name: 'Caprine Arthritis Encephalitis',
    localName: 'CAE',
    species: ['goats'],
    category: 'viral',
    notifiable: false,
    identification: {
      signs: [
        'Kids – progressive hind limb weakness, head tilt, incoordination (encephalitis)',
        'Adults – chronic swollen knees (carpal hygroma), weight loss'
      ],
      onset: 'chronic',
      mortalityRate: 'low (but debilitating)',
      seasonality: 'year-round'
    },
    treatment: {
      stepByStep: [
        'NSAID for arthritis',
        'Hyaluronic acid injections into joints (by vet)',
        'For severe neurological kids – euthanasia',
        'Do not feed infected doe’s colostrum – heat-treat colostrum (56°C/1h) or use frozen from negative doe'
      ],
      medicines: [
        { name: 'Meloxicam', dosage: '0.5 mg/kg PO daily', route: 'PO' },
        { name: 'Hyaluronic acid', dosage: 'Veterinary administration into joints', route: 'intra-articular' }
      ],
      supportiveCare: 'Joint support, quality of life assessment'
    },
    prevention: 'Test and cull, heat-treat colostrum, raise kids separately from positive does',
    withdrawalTimes: { meat: 15, milk: 5 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_urolithiasis',
    type: 'disease',
    name: 'Urolithiasis',
    localName: 'Urinary Calculi',
    species: ['goats', 'sheep'],
    category: 'metabolic',
    notifiable: false,
    emergency: true,
    identification: {
      signs: [
        'Straining to urinate',
        'Dribbling urine',
        'Crying',
        'Bloated abdomen',
        '"Pencil-dropping" posturing'
      ],
      onset: 'acute',
      mortalityRate: 'high if not treated',
      seasonality: 'associated with grain feeding'
    },
    treatment: {
      stepByStep: [
        'Sedation: Xylazine – relaxes urethra',
        'Attempt to retropulse stone into bladder (manual pressure via rectum)',
        'If blocked: Needle cystocentesis (relieve bladder)',
        'Surgery – urethrostomy (veterinarian required)',
        'After recovery: Ammonium chloride to acidify urine',
        'Prevent: Reduce grain, increase salt intake'
      ],
      medicines: [
        { name: 'Xylazine', dosage: '0.05 mg/kg IV', route: 'IV' },
        { name: 'Ammonium chloride', dosage: '10 g/day PO x 7 days', route: 'PO' }
      ],
      supportiveCare: 'Emergency bladder relief, surgery'
    },
    prevention: 'Avoid high-grain diets, provide ample water, use ammonium chloride in feed',
    withdrawalTimes: { meat: 7, milk: 48 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_pregnancy_toxemia',
    type: 'disease',
    name: 'Pregnancy Toxemia',
    localName: 'Twin Lamb/Kid Disease',
    species: ['sheep', 'goats'],
    category: 'metabolic',
    notifiable: false,
    identification: {
      signs: [
        'Late pregnancy',
        'Off feed',
        'Lethargy',
        'Teeth grinding',
        'Neurological signs (star gazing, blindness)',
        'Ketotic breath'
      ],
      onset: 'subacute',
      mortalityRate: 'high if untreated',
      seasonality: 'late gestation (twin pregnancies at risk)'
    },
    treatment: {
      stepByStep: [
        'Oral propylene glycol or glycerin',
        'IV dextrose 20% – 100 ml slowly',
        'Dexamethasone to induce labor if near term',
        'Calcium gluconate (25 ml SQ)',
        'C-section if unresponsive'
      ],
      medicines: [
        { name: 'Propylene glycol', dosage: '60 ml BID PO', route: 'PO' },
        { name: 'Dextrose 20%', dosage: '100 ml IV slowly', route: 'IV' },
        { name: 'Dexamethasone', dosage: '2 mg/45 kg IM', route: 'IM' },
        { name: 'Calcium gluconate', dosage: '25 ml SQ', route: 'SC' }
      ],
      supportiveCare: 'Nutritional support, C-section if needed'
    },
    prevention: 'Proper late-gestation nutrition, avoid obesity, monitor body condition',
    withdrawalTimes: { meat: 10, milk: 48 },
    createdAt: new Date().toISOString()
  },

  // ADDITIONAL DISEASES ALL SPECIES (25-27)
  {
    _id: 'disease_tetanus',
    type: 'disease',
    name: 'Tetanus',
    localName: 'Lockjaw',
    species: ['cattle', 'sheep', 'goats'],
    category: 'bacterial',
    notifiable: false,
    identification: {
      signs: [
        'Stiff gait',
        'Sensitivity to touch',
        'Erect ears',
        'Tail rigid',
        'Prolapsed third eyelid',
        'Convulsions triggered by noise'
      ],
      onset: 'subacute (3–14 days post-wound)',
      mortalityRate: 'high',
      seasonality: 'year-round'
    },
    treatment: {
      stepByStep: [
        'Clean wound thoroughly',
        'Tetanus antitoxin (10,000–20,000 IU IV/IM once)',
        'High-dose Penicillin G',
        'Diazepam for muscle spasms',
        'Dark, quiet housing'
      ],
      medicines: [
        { name: 'Tetanus antitoxin', dosage: '10,000–20,000 IU IV/IM once', route: 'IV/IM' },
        { name: 'Penicillin G', dosage: '40,000 IU/kg IM BID x 5–7 days', route: 'IM' },
        { name: 'Diazepam', dosage: '0.05–0.1 mg/kg IV as needed', route: 'IV' }
      ],
      supportiveCare: 'Dark, quiet environment, nursing care'
    },
    prevention: 'Vaccination (tetanus toxoid), wound hygiene',
    withdrawalTimes: { meat: 10, milk: 48 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_heartwater',
    type: 'disease',
    name: 'Heartwater',
    localName: 'Ehrlichia ruminantium',
    species: ['cattle', 'sheep', 'goats'],
    category: 'rickettsial',
    notifiable: true,
    identification: {
      signs: [
        'High fever',
        'Neurological signs (head pressing, circling, convulsions)',
        'Hydrothorax (fluid in lungs – "pump water")'
      ],
      onset: 'acute',
      mortalityRate: 'high',
      seasonality: 'tick season'
    },
    treatment: {
      stepByStep: [
        'Oxytetracycline LA (20 mg/kg IM once, repeat in 48h)',
        'Supportive care: fluids, anti-inflammatories',
        'Control ticks (acaricodes)',
        'Prevention: Vaccination in endemic areas'
      ],
      medicines: [
        { name: 'Oxytetracycline LA', dosage: '20 mg/kg IM once, repeat in 48h', route: 'IM' },
        { name: 'Flunixin', dosage: '1.1 mg/kg IV once', route: 'IV' }
      ],
      supportiveCare: 'Fluids, tick control'
    },
    prevention: 'Tick control, vaccination (in endemic areas)',
    withdrawalTimes: { meat: 28, milk: 120 },
    createdAt: new Date().toISOString()
  },

  {
    _id: 'disease_enterotoxemia',
    type: 'disease',
    name: 'Enterotoxemia',
    localName: 'Overeating Disease',
    species: ['sheep', 'goats', 'cattle'],
    category: 'bacterial',
    notifiable: false,
    identification: {
      signs: [
        'Sudden death',
        'Abdominal pain',
        'Diarrhea (sometimes bloody)',
        'Convulsions',
        'Recumbency',
        'Common in fast-growing kids/lambs'
      ],
      onset: 'peracute to acute',
      mortalityRate: 'very high',
      seasonality: 'associated with grain feeding'
    },
    treatment: {
      stepByStep: [
        'Antitoxin (C. perfringens types C & D) – 10 ml IV/IM',
        'Oral activated charcoal (1 g/kg)',
        'Penicillin G (40,000 IU/kg IM BID x 3 days)',
        'Fluids',
        'Prevention: Annual vaccination (CDT vaccine)'
      ],
      medicines: [
        { name: 'C. perfringens antitoxin', dosage: '10 ml IV/IM once', route: 'IV/IM' },
        { name: 'Penicillin G', dosage: '40,000 IU/kg IM BID x 3 days', route: 'IM' },
        { name: 'Activated charcoal', dosage: '1 g/kg PO', route: 'PO' }
      ],
      supportiveCare: 'Fluids, nursing care'
    },
    prevention: 'Annual CDT vaccination (Clostridium perfringens types C + D + tetanus)',
    withdrawalTimes: { meat: 10, milk: 48 },
    createdAt: new Date().toISOString()
  }
];

// ============================================
// MEDICINE REFERENCE DOCUMENTS
// ============================================

const medicineDocuments = [
  {
    _id: 'medicine_oxytetracycline_la',
    type: 'medicine',
    name: 'Oxytetracycline LA',
    class: 'Tetracycline',
    indications: ['Footrot', 'Anaplasmosis', 'Pinkeye', 'BRD', 'Heartwater', 'Mastitis'],
    dosage: '20 mg/kg IM once (repeat in 48h for anaplasmosis)',
    route: ['IM', 'SC', 'subconjunctival'],
    withdrawal: { meat: 28, milk: 120 },
    precautions: 'Do not use in young animals (teeth staining), avoid IV'
  },
  {
    _id: 'medicine_tulathromycin',
    type: 'medicine',
    name: 'Tulathromycin',
    class: 'Macrolide',
    brand: 'Draxxin',
    indications: ['BRD', 'Respiratory infections', 'Pinkeye', 'Footrot'],
    dosage: '2.5 mg/kg SQ single dose',
    route: ['SQ'],
    withdrawal: { meat: 28, milk: 'Not for lactating dairy' },
    precautions: 'Do not use in calves under 2 weeks'
  },
  {
    _id: 'medicine_florfenicol',
    type: 'medicine',
    name: 'Florfenicol',
    class: 'Amphenicol',
    brand: 'Nuflor',
    indications: ['BRD', 'Mannheimiosis', 'Respiratory infections'],
    dosage: '40 mg/kg SQ once (cattle) or 20 mg/kg IM repeat 48h (sheep/goats)',
    route: ['SQ', 'IM'],
    withdrawal: { meat: 38, milk: 'Not for lactating dairy' },
    precautions: 'Do not use in breeding animals'
  },
  {
    _id: 'medicine_flunixin',
    type: 'medicine',
    name: 'Flunixin Meglumine',
    class: 'NSAID',
    brand: 'Banamine',
    indications: ['Fever', 'Pain', 'Inflammation', 'Endotoxemia'],
    dosage: '1.1–2.2 mg/kg IV once daily',
    route: ['IV', 'IM'],
    withdrawal: { meat: 4, milk: 48 },
    precautions: 'Do not exceed 3 days, avoid in dehydrated animals'
  },
  {
    _id: 'medicine_meloxicam',
    type: 'medicine',
    name: 'Meloxicam',
    class: 'NSAID',
    brand: 'Metacam',
    indications: ['Pain', 'Inflammation', 'Arthritis', 'Mastitis'],
    dosage: '0.5 mg/kg IV/PO once daily',
    route: ['IV', 'PO', 'SQ'],
    withdrawal: { meat: 15, milk: 5 },
    precautions: 'Do not use in dehydrated or hypovolemic animals'
  },
  {
    _id: 'medicine_calcium_gluconate',
    type: 'medicine',
    name: 'Calcium Gluconate 23%',
    class: 'Mineral',
    indications: ['Milk fever', 'Pregnancy toxemia'],
    dosage: '500 ml IV slowly over 10–20 min (cattle), 100 ml IV (sheep/goats)',
    route: ['IV'],
    withdrawal: { meat: 0, milk: 0 },
    precautions: 'Monitor heart rate during IV – stop if bradycardia'
  },
  {
    _id: 'medicine_penicillin_g',
    type: 'medicine',
    name: 'Penicillin G Procaine',
    class: 'Beta-lactam',
    indications: ['Mastitis', 'Listeriosis', 'Blackleg', 'Tetanus', 'Enterotoxemia'],
    dosage: '20,000–40,000 IU/kg IM BID',
    route: ['IM'],
    withdrawal: { meat: 10, milk: 48 },
    precautions: 'Do not use IV (procaine reaction)'
  },
  {
    _id: 'medicine_amprolium',
    type: 'medicine',
    name: 'Amprolium',
    class: 'Coccidiostat',
    brand: 'Corid',
    indications: ['Coccidiosis'],
    dosage: '10 mg/kg PO once daily x 5 days',
    route: ['PO'],
    withdrawal: { meat: 5, milk: 48 },
    precautions: 'May cause thiamine deficiency if overdosed'
  }
];

// ============================================
// SYMPTOM INDEX (for quick search)
// ============================================

const symptomIndex = [
  { symptom: 'fever', diseases: ['disease_ovine_respiratory_complex', 'disease_brd_shipping_fever', 'disease_anaplasmosis', 'disease_heartwater'] },
  { symptom: 'diarrhea', diseases: ['disease_coccidiosis_small', 'disease_calf_scours', 'disease_bvd', 'disease_johnes_small'] },
  { symptom: 'lameness', diseases: ['disease_footrot', 'disease_laminitis', 'disease_blackleg'] },
  { symptom: 'cough', diseases: ['disease_ovine_respiratory_complex', 'disease_brd_shipping_fever', 'disease_mannheimiosis'] },
  { symptom: 'abortion', diseases: ['disease_bvd', 'disease_listeriosis'] },
  { symptom: 'swollen udder', diseases: ['disease_mastitis_small', 'disease_bovine_mastitis'] },
  { symptom: 'bloat', diseases: ['disease_bloat_frothy'] },
  { symptom: 'circling', diseases: ['disease_listeriosis'] },
  { symptom: 'sudden death', diseases: ['disease_blackleg', 'disease_enterotoxemia', 'disease_grass_tetany', 'disease_bloat_frothy'] },
  { symptom: 'paralysis', diseases: ['disease_rabies', 'disease_tetanus', 'disease_cae'] }
];

// ============================================
// DATABASE INITIALIZATION FUNCTION
// ============================================

export async function initializeDatabase() {
  try {
    // Get all existing documents
    const existingDocs = await db.allDocs({ include_docs: true });
    const existingIds = existingDocs.rows.map(row => row.id);
    
    // Filter documents that don't exist yet
    const documentsToAdd = [...diseaseDocuments, ...medicineDocuments];
    const newDocs = documentsToAdd.filter(doc => !existingIds.includes(doc._id));
    
    // Bulk insert new documents
    if (newDocs.length > 0) {
      const result = await db.bulkDocs(newDocs);
      console.log(`✅ Added ${result.length} new documents to database`);
    } else {
      console.log('📚 Database already up to date');
    }
    
    return { success: true, added: newDocs.length };
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    return { success: false, error };
  }
}

// ============================================
// QUERY FUNCTIONS
// ============================================

export async function getAllDiseases() {
  const result = await db.allDocs({
    include_docs: true,
    startkey: 'disease_',
    endkey: 'disease_\uffff'
  });
  return result.rows.map(row => row.doc);
}

export async function getDiseaseById(id) {
  try {
    const doc = await db.get(id);
    return doc;
  } catch (error) {
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getDiseasesBySpecies(species) {
  const allDiseases = await getAllDiseases();
  return allDiseases.filter(disease => disease.species.includes(species));
}

export async function searchDiseasesBySymptom(symptom) {
  const symptomLower = symptom.toLowerCase();
  const matchedIds = symptomIndex
    .filter(item => item.symptom.includes(symptomLower))
    .flatMap(item => item.diseases);
  
  const uniqueIds = [...new Set(matchedIds)];
  const diseases = await Promise.all(uniqueIds.map(id => getDiseaseById(id)));
  return diseases.filter(d => d !== null);
}

export async function getEmergencyDiseases() {
  const allDiseases = await getAllDiseases();
  return allDiseases.filter(disease => disease.emergency === true);
}

export async function getNotifiableDiseases() {
  const allDiseases = await getAllDiseases();
  return allDiseases.filter(disease => disease.notifiable === true);
}

export async function getAllMedicines() {
  const result = await db.allDocs({
    include_docs: true,
    startkey: 'medicine_',
    endkey: 'medicine_\uffff'
  });
  return result.rows.map(row => row.doc);
}

// ============================================
// EXPORT DATABASE INSTANCE
// ============================================

export { db };
export default db;
