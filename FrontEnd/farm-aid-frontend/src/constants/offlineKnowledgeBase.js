// Offline knowledge base dataset for Farm-Aid.
// Bilingual (English + Setswana) disease articles stored locally so the
// Knowledge Base is available fully offline, as required by the specification.
// Each article conforms to the `knowledgeBase` IndexedDB schema:
//   { id, titleEn, titleTn, contentEn, contentTn, diseaseCode, category,
//     species: string[], symptoms, treatment, prevention, notifiable, tags, imageUrl }

const KB_ARTICLES = [
  {
    id: 'kb-fmd',
    diseaseCode: 'FMD',
    titleEn: 'Foot and Mouth Disease (FMD)',
    titleTn: 'Bolwetse jwa Dilo tsa Maoto le Meno (FMD)',
    category: 'disease',
    species: ['cattle', 'sheep', 'goat'],
    notifiable: true,
    imageUrl: '/images/diseases/fmd.png',
    tags: ['fmd', 'foot and mouth', 'notifiable', 'lameness', 'salivation'],
    contentEn:
      'Foot and Mouth Disease is a highly contagious viral disease that affects cloven-hoofed animals including cattle, sheep, goats and pigs. It is a NOTIFIABLE disease — suspected cases must be reported to the Department of Veterinary Services immediately. Early detection protects the national herd and Botswana beef exports.',
    contentTn:
      'Bolwetse jwa Foot and Mouth (FMD) ke bolwetse jwa moroetsi gore jwa mennana jwa dirôwana tse di nang le maoto a a arogantsweng jaaka kgomo, dinku, dipodi le dikolobe. Ke BOLWETSE JO BO TLHOKAGALANG GO BELWA — dintlha tse di belaegwang di tshwanetse go romelwa kwa Lefapeng la Tirelo ya Merogo ya Kgodi ka bonako. Go lemoga ga epe go sireletsa kgomo ya lefatshe le dikhiso tsa nama ya Botswana.',
    symptoms: [
      'Fever and loss of appetite',
      'Blisters on the mouth, tongue and gums',
      'Blisters and soreness between the hooves',
      'Profuse drooling / excessive salivation',
      'Lameness and reluctance to move',
      'Drop in milk production',
    ],
    treatment:
      'There is no specific cure for FMD. Supportive care and strict isolation are essential. Do NOT move animals. Report immediately to DVS. Vaccination is used for control in affected zones. Always follow veterinary advice.',
    prevention:
      'Control animal movement, vaccinate in high-risk zones, disinfect vehicles and equipment, quarantine new animals, and report suspected cases immediately.',
  },
  {
    id: 'kb-lsd',
    diseaseCode: 'LSD',
    titleEn: 'Lumpy Skin Disease (LSD)',
    titleTn: 'Bolwetse jwa Maibidi a Lerato (LSD)',
    category: 'disease',
    species: ['cattle'],
    notifiable: true,
    imageUrl: '/images/diseases/lsd.png',
    tags: ['lsd', 'lumpy skin', 'nodules', 'skin'],
    contentEn:
      'Lumpy Skin Disease is a viral disease of cattle transmitted by biting insects (flies and mosquitoes). It causes fever and characteristic firm nodules on the skin. Report suspected cases to DVS.',
    contentTn:
      'Lumpy Skin Disease ke bolwetse jwa moroetsi jwa kgomo le jwa mennangwa ke ditshikelelo tse di omang (ditsie le mfenese). Jwa baka molelo le maibidi a a thata mo letlalo. Belwa dintlha tse di belaegwang kwa DVS.',
    symptoms: [
      'High fever',
      'Firm raised nodules/lumps on the skin',
      'Reduced milk yield',
      'Swelling of legs and udder',
      'Watery eyes and nasal discharge',
    ],
    treatment:
      'Supportive care: anti-inflammatories, antibiotics for secondary infections, wound care and fly control. Isolate affected animals and consult a veterinarian.',
    prevention:
      'Control biting insects, vaccinate cattle in affected areas, and quarantine/screen new animals before introduction.',
  },
  {
    id: 'kb-heartwater',
    diseaseCode: 'HEARTWATER',
    titleEn: 'Heartwater',
    titleTn: 'Pelo e e Kenngwang ke Mmu (Heartwater)',
    category: 'disease',
    species: ['cattle', 'sheep', 'goat'],
    notifiable: false,
    tags: ['heartwater', 'tick', 'cowdria', 'nervous'],
    contentEn:
      'Heartwater is a tick-borne disease caused by Ehrlichia (Cowdria) ruminantium. It affects cattle, sheep and goats and often causes sudden death. It is transmitted by the bont tick (Amblyomma).',
    contentTn:
      'Heartwater ke bolwetse le jwa mennangwa ke ditiki (ticks) bo bo bakwang ke Ehrlichia (Cowdria) ruminantium. Jwa kgomo, dinku le dipodi, gantši jwa baka loso lwakgabidipana. Jwa mennangwa ke tiki ya bont (Amblyomma).',
    symptoms: [
      'High fever',
      'Nervous signs: circling, head pressing, tremors',
      'Convulsions',
      'Swelling of the head and neck',
      'Sudden death',
    ],
    treatment:
      'Early treatment with tetracyclines (e.g. oxytetracycline) is effective. Severely affected animals may need supportive care. Consult a veterinarian promptly.',
    prevention:
      'Tick control (dipping), strategic tick-borne disease control programmes, and prompt treatment of new cases.',
  },
  {
    id: 'kb-anthrax',
    diseaseCode: 'ANTHRAX',
    titleEn: 'Anthrax',
    titleTn: 'Anthrax (Bolwetse jwa Mokoena)',
    category: 'disease',
    species: ['cattle', 'sheep', 'goat'],
    notifiable: true,
    tags: ['anthrax', 'notifiable', 'sudden death', 'zoonotic'],
    contentEn:
      'Anthrax is a serious, rapidly fatal bacterial disease that can infect animals and humans (zoonotic). It is a NOTIFIABLE disease. Suspected carcasses must NOT be opened — report immediately to DVS.',
    contentTn:
      'Anthrax ke bolwetse jo bogolo jwa moroetsi gore le jwa bolawa jwa ka bonako bo bo kgonang go tshwarwa ke dirôwana le batho (zoonotic). Ke BOLWETSE JO BO TLHOKAGALANG GO BELWA. Diphôô tse di belaegwang DI TSHOANETSE GO SE GO BULWA — belwa DVS ka bonako.',
    symptoms: [
      'Sudden death without prior signs',
      'High fever before death',
      'Blood oozing from body openings after death',
      'Swelling of the neck and throat',
    ],
    treatment:
      'Anthrax responds to antibiotics (penicillin, oxytetracycline) if treated very early. Do NOT open suspected carcasses. Vaccination is available in endemic areas. Report immediately.',
    prevention:
      'Annual vaccination in endemic areas, proper disposal of carcasses (do not open), and control of scavengers.',
  },
  {
    id: 'kb-ccpp',
    diseaseCode: 'CCPP',
    titleEn: 'Contagious Caprine Pleuropneumonia (CCPP)',
    titleTn: 'CCPP (Bolwetse jwa Mafetsa a Dipodi)',
    category: 'disease',
    species: ['goat'],
    notifiable: true,
    imageUrl: '/images/diseases/ccpp.png',
    tags: ['ccpp', 'goat', 'pneumonia', 'notifiable', 'breathing'],
    contentEn:
      'Contagious Caprine Pleuropneumonia is a highly contagious and severe respiratory disease of goats. It is a NOTIFIABLE disease and can cause high mortality. Spread is by close contact and inhalation.',
    contentTn:
      'CCPP ke bolwetse jwa mafetsa jo jwa mennana thata jwa dipodi. Ke BOLWETSE JO BO TLHOKAGALANG GO BELWA, bo ka baka dintsho tse di kwa godimo. Jwa anamana ka go kgobokana le go hefa.',
    symptoms: [
      'High fever',
      'Difficult, rapid breathing',
      'Coughing and nasal discharge',
      'Frothy saliva',
      'Standing with neck extended',
      'Sudden death',
    ],
    treatment:
      'Early antibiotic treatment (e.g. tylosin, oxytetracycline) can be effective. Isolate affected goats and provide supportive care. Consult a veterinarian urgently.',
    prevention:
      'Vaccination, quarantine of new goats, good ventilation, and avoiding overcrowding.',
  },
  {
    id: 'kb-ppr',
    diseaseCode: 'PPR',
    titleEn: 'Peste des Petits Ruminants (PPR)',
    titleTn: 'PPR (Bolwetse jwa Dipodi le Dinku)',
    category: 'disease',
    species: ['sheep', 'goat'],
    notifiable: true,
    tags: ['ppr', 'peste', 'diarrhea', 'notifiable'],
    contentEn:
      'PPR is a highly contagious viral disease of sheep and goats causing fever, diarrhoea, pneumonia and high mortality. It is a NOTIFIABLE disease.',
    contentTn:
      'PPR ke bolwetse jwa moroetsi gore jwa mennana jwa dinku le dipodi bo jwa baka molelo, malwetse a a tsididi, pneumonia le dintsho tse di kwa godimo. Ke BOLWETSE JO BO TLHOKAGALANG GO BELWA.',
    symptoms: [
      'High fever',
      'Watery diarrhoea',
      'Nasal and eye discharge',
      'Mouth ulcers',
      'Pneumonia and coughing',
    ],
    treatment:
      'No specific cure; supportive care and antibiotics for secondary infections. Vaccination is the key control measure. Report suspected cases.',
    prevention:
      'Vaccination of flocks, quarantine of new animals, and prompt reporting.',
  },
  {
    id: 'kb-blackleg',
    diseaseCode: 'BLACKLEG',
    titleEn: 'Blackleg',
    titleTn: 'Blackleg (Bolwetse jwa Maoto a a Bomau)',
    category: 'disease',
    species: ['cattle', 'sheep'],
    notifiable: false,
    tags: ['blackleg', 'clostridial', 'sudden death', 'muscle'],
    contentEn:
      'Blackleg is a rapidly fatal clostridial disease of cattle and sheep, mainly affecting young well-fed animals. It causes crepitant (crackling) swellings of the muscles.',
    contentTn:
      'Blackleg ke bolwetse jwa moroetsi gore le jwa bolawa jwa kgomo le dinku, go kgetsehlwa thata dipodiantsho tse di nnyane tse di nonofatseng. Jwa baka maibidi a a nang le modumo a mo maseleng.',
    symptoms: [
      'Sudden lameness',
      'Crepitant (crackling) swellings on muscles',
      'High fever',
      'Loss of appetite',
      'Sudden death',
    ],
    treatment:
      'Usually fatal; very early antibiotic treatment may help. Prevention through vaccination is far more effective.',
    prevention:
      'Vaccinate calves and lambs (clostridial vaccine), avoid feeding high-energy diets that predispose, and manage grazing on contaminated land.',
  },
  {
    id: 'kb-CCPP-goat-pasteurellosis',
    diseaseCode: 'PASTEURELLOSIS',
    titleEn: 'Pasteurellosis (Mannheimia / Pasteurella)',
    titleTn: 'Pasteurellosis (Bolwetse jwa Mafetsa)',
    category: 'disease',
    species: ['cattle', 'sheep', 'goat'],
    notifiable: false,
    tags: ['pasteurellosis', 'pneumonia', 'respiratory', 'cough'],
    contentEn:
      'Pasteurellosis is a common bacterial respiratory disease causing pneumonia in cattle, sheep and goats, often triggered by stress or viral infections.',
    contentTn:
      'Pasteurellosis ke bolwetse jo bogolo jwa mafetsa bo bo bakwang ke moroetsi gore mo kgomong, dinku le dipodi, gantši bo bulelwa ke kgathetseno kapa malwetse a moroetsi gore.',
    symptoms: [
      'Fever and depression',
      'Difficult breathing and coughing',
      'Nasal discharge',
      'Reduced appetite',
    ],
    treatment:
      'Antibiotics (oxytetracycline, florfenicol) and supportive care. Isolate and provide good ventilation.',
    prevention:
      'Reduce stress, good ventilation, vaccination where available, and prompt treatment of viral infections.',
  },
  {
    id: 'kb-mastitis',
    diseaseCode: 'MASTITIS',
    titleEn: 'Mastitis (Udder Infection)',
    titleTn: 'Mastitis (Malwetse a Maene)',
    category: 'disease',
    species: ['cattle', 'goat', 'sheep'],
    notifiable: false,
    imageUrl: '/images/diseases/mastitis.png',
    tags: ['mastitis', 'udder', 'milk', 'mammary'],
    contentEn:
      'Mastitis is inflammation of the udder, usually caused by bacterial infection. It reduces milk production and quality and can make milk unsafe.',
    contentTn:
      'Mastitis ke kubulwa jwa maene, gantši bo bakwa ke moroetsi gore. Jwa fokotsa tsamaiso le boleng jwa mashi, jwa ka dirisa mashi a a sa siroleng.',
    symptoms: [
      'Swollen, hot or painful udder',
      'Abnormal milk (clots, watery, discoloured)',
      'Reduced milk yield',
      'Fever in severe cases',
    ],
    treatment:
      'Intramammary antibiotics and anti-inflammatories as advised by a vet. Discard affected milk. Improve hygiene.',
    prevention:
      'Clean milking hygiene, dry-cow therapy, teat dipping, and prompt treatment of cases.',
  },
  {
    id: 'kb-pinkeye',
    diseaseCode: 'PINKEYE',
    titleEn: 'Infectious Bovine Keratoconjunctivitis (Pinkeye)',
    titleTn: 'Pinkeye (Bolwetse jwa Leitlho la Kgomo)',
    category: 'disease',
    species: ['cattle'],
    notifiable: false,
    imageUrl: '/images/diseases/pink_eye.png',
    tags: ['pinkeye', 'eye', 'keratoconjunctivitis', 'flies'],
    contentEn:
      'Pinkeye is a contagious eye infection of cattle, spread by flies. It causes painful, watery eyes and can lead to blindness if untreated.',
    contentTn:
      'Pinkeye ke tshwarano ya leitlho la kgomo e e anamangwang ke ditshikelelo. Jwa baka maatla a a bogolwang a leitlho, bo ka baka go bohloka ga leitlho fa bo sa alafiwe.',
    symptoms: [
      'Watery, painful eyes',
      'Redness and swelling around the eye',
      'Cloudiness or ulcer of the cornea',
      'Squinting and light sensitivity',
    ],
    treatment:
      'Antibiotic eye ointments/injections as advised by a vet. Fly control and isolation reduce spread.',
    prevention:
      'Fly control, prompt isolation and treatment, and avoiding dusty conditions.',
  },
  {
    id: 'kb-footrot',
    diseaseCode: 'FOOTROT',
    titleEn: 'Foot Rot',
    titleTn: 'Foot Rot (Bolwetse jwa Maoto)',
    category: 'disease',
    species: ['cattle', 'sheep', 'goat'],
    notifiable: false,
    imageUrl: '/images/diseases/foot_rot.png',
    tags: ['foot rot', 'hoof', 'lameness', 'feet'],
    contentEn:
      'Foot rot is a bacterial infection of the hoof causing lameness, swelling and foul-smelling discharge between the claws.',
    contentTn:
      'Foot Rot ke tshwarano ya moroetsi gore ya maoto e e bakang go gobala, go kgaba le go ntsholola go kunakang gare ga maoto.',
    symptoms: [
      'Lameness and reluctance to walk',
      'Swelling above the hoof',
      'Foul-smelling discharge between claws',
      'Reduced grazing and weight loss',
    ],
    treatment:
      'Clean and trim the hoof, use footbaths (copper/zinc sulphate), and antibiotics as advised by a vet.',
    prevention:
      'Keep pens dry, regular hoof trimming, footbaths, and prompt treatment of lame animals.',
  },
  {
    id: 'kb-ringworm',
    diseaseCode: 'RINGWORM',
    titleEn: 'Ringworm (Dermatophytosis)',
    titleTn: 'Ringworm (Bolwetse jwa Letlalo)',
    category: 'disease',
    species: ['cattle', 'sheep', 'goat'],
    notifiable: false,
    imageUrl: '/images/diseases/ringworm.png',
    tags: ['ringworm', 'skin', 'fungal', 'zoonotic'],
    contentEn:
      'Ringworm is a fungal skin infection causing circular, scaly, hairless patches. It can spread to humans (zoonotic).',
    contentTn:
      'Ringworm ke tshwarano ya letlalo e e bakwang ke moroetsi gore o o bakiwang ke ditlhare tse di bakiwang ke fungal, tse di bakiwang ke maibidi a a nang le dikgaba tsa letlalo le dihuba. E ka anamana go batho.',
    symptoms: [
      'Circular, scaly skin patches',
      'Hair loss in affected areas',
      'Itching and crusting',
    ],
    treatment:
      'Topical antifungal washes and isolation. Disinfect equipment. Handle with gloves (zoonotic).',
    prevention:
      'Good hygiene, isolate affected animals, disinfect equipment, and avoid overcrowding.',
  },
  {
    id: 'kb-CCPP-prevention',
    diseaseCode: 'VACCINATION',
    titleEn: 'Vaccination & Herd Health Calendar',
    titleTn: 'Go Tlhatlanya le Lotsatsi la Bophelo jwa Kgomo',
    category: 'prevention',
    species: ['cattle', 'sheep', 'goat'],
    notifiable: false,
    tags: ['vaccination', 'prevention', 'calendar', 'deworming'],
    contentEn:
      'Routine vaccination and deworming protect your herd. Common vaccines include clostridial (blackleg), FMD (in controlled zones), LSD and PPR. Keep records of each animal and follow local DVS guidance.',
    contentTn:
      'Go tlhatlanya le go phepha ga meletlo go sireletsa kgomo ya lona. Ditshedi tse di tlwaelegile go tlhatlanya di akaretsa clostridial (blackleg), FMD (mo mafelong a a laolwang), LSD le PPR. Boloka direkoto tsa leruo le le lengwe le le lengwe le latelela dikatiso tsa DVS.',
    symptoms: [],
    treatment: 'Follow a herd health calendar set with your veterinarian.',
    prevention:
      'Vaccinate on schedule, deworm regularly, keep clean records, and report notifiable diseases immediately.',
  },
  {
    id: 'kb-nutrition',
    diseaseCode: 'NUTRITION',
    titleEn: 'Animal Nutrition & Supplementation',
    titleTn: 'Dijo le Pokello ya Dijo tsa Leruo',
    category: 'nutrition',
    species: ['cattle', 'sheep', 'goat'],
    notifiable: false,
    tags: ['nutrition', 'feed', 'supplement', 'lick'],
    contentEn:
      'Balanced nutrition improves growth, milk yield and disease resistance. Provide clean water, good pasture, and mineral licks (especially phosphorus and salt). Supplement in the dry season.',
    contentTn:
      'Dijo tse di nang le boleng di tokafatsa kgolo, mashi le go lwa le malwetse. Fana ka mashi a a tshweletseng sentle, jawang le dikhuno tsa minerals (go kgetsehlwa phosphorus le letshwa). Tlhatlhosa mo pakeng e e omileng.',
    symptoms: [],
    treatment: 'Adjust rations with advice from an extension officer or veterinarian.',
    prevention:
      'Provide clean water, mineral licks, quality pasture, and seasonal supplementation.',
  },
  {
    id: 'kb-biosecurity',
    diseaseCode: 'BIOSECURITY',
    titleEn: 'Farm Biosecurity Basics',
    titleTn: 'Tshireletso ya Polasi (Biosecurity)',
    category: 'management',
    species: ['cattle', 'sheep', 'goat'],
    notifiable: false,
    tags: ['biosecurity', 'prevention', 'hygiene', 'quarantine'],
    contentEn:
      'Good biosecurity keeps disease out of your farm. Quarantine new animals, control visitors and vehicles, disinfect equipment, and keep records. Report notifiable diseases immediately.',
    contentTn:
      'Tshireletso e e siameng ya polasi e thibela malwetse go tsena mo polaseng. Kgaoganya leruo le lesha, laola baeti le dikoloi, hlakola ditiro, le boloka direkoto. Belwa malwetse a a tlhokagelang go belwa ka bonako.',
    symptoms: [],
    treatment: 'Implement a written biosecurity plan with your vet.',
    prevention:
      'Quarantine new stock, limit visitors, disinfect, control vermin, and maintain clean water and feed.',
  },
];

export default KB_ARTICLES;

export function getKBArticles() {
  return KB_ARTICLES;
}