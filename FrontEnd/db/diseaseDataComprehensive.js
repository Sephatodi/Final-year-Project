// db/diseaseDataComprehensive.js
// Complete disease database with all 21 diseases from comprehensive JSON

export const comprehensiveDiseaseData = [
  // 1. Foot and Mouth Disease (FMD)
  {
    id: 'FMD-001',
    diseaseCode: 'FMD',
    titleEn: 'Foot and Mouth Disease (FMD)',
    titleTn: 'Bolwetse jwa Maoto le Molomo (FMD)',
    species: 'all',
    species_affected: ['Cattle', 'Goats', 'Sheep'],
    key_symptoms_signs: 'Excessive salivation, runny nose, wounds/sores on hooves and mouth, lethargy, not feeding, drop in milk production. Highly contagious, rapid spread through the herd.',
    contentEn: `Foot and Mouth Disease is a severe, highly contagious viral disease affecting cloven-hoofed animals.

SYMPTOMS:
• Excessive salivation and drooling
• Runny nose and nasal discharge
• Blisters on mouth, tongue, lips, and between hooves
• Fever (40-41°C)
• Lethargy and weakness
• Loss of appetite and reduced feeding
• Sudden drop in milk production
• Lameness and reluctance to move

KEY SIGNS:
• Highly contagious - rapid spread through herd
• Can devastate entire livestock population
• Recovery time: 2-4 weeks for uncomplicated cases

TREATMENT:
• Tetracycline antibiotics (e.g., Terramycin)
• Supportive care: soft food, clean water
• Isolate affected animals immediately
• Disinfect all equipment and footwear
• Pain relief for severe cases
• Report to DVS immediately - NOTIFIABLE DISEASE

PREVENTION:
• Vaccination is key - every 6 months
• Strict quarantine of new animals (21 days minimum)
• Do not introduce animals from unknown health status
• Maintain biosecurity measures
• Control animal movement
• Report suspected cases immediately
• Limit visitor access to farm

RECOVERY GUIDELINES:
• Isolate sick animals from healthy herd
• Provide soft feed if mouth sores are painful
• Disinfect housing and equipment thoroughly
• Expect full recovery in uncomplicated cases
• Productivity may be temporarily reduced
• Monitor for secondary infections

NOTIFIABLE: YES - Must report within 24 hours to DVS`,
    treatment: 'Tetracycline antibiotics (e.g., Terramycin)',
    precautions_prevention: 'Vaccination is key. Strict quarantine of new animals. Do not introduce animals from unknown health status. Report suspected cases immediately as it\'s a notifiable disease.',
    recovery_guidelines: 'Isolate sick animals. Provide soft feed if mouth sores are painful. Disinfect housing and equipment thoroughly. Expect full recovery in uncomplicated cases, but productivity may be temporarily reduced.',
    symptoms: ['Excessive salivation', 'Runny nose', 'Mouth sores', 'Hoof sores', 'Fever', 'Lethargy', 'Loss of appetite', 'Milk drop'],
    tags: ['fmd', 'foot and mouth', 'contagious', 'virus', 'notifiable'],
    notifiable: true,
    imageUrl: '/MyFarmData/Cattle_Health/Images/fmd.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 2. Lumpy Skin Disease (LSD)
  {
    id: 'LSD-001',
    diseaseCode: 'LSD',
    titleEn: 'Lumpy Skin Disease (LSD)',
    titleTn: 'Bolwetse jwa Matlhopi',
    species: 'all',
    species_affected: ['Cattle', 'Sheep', 'Goats'],
    key_symptoms_signs: 'Firm, raised sores (nodules) all over the hair coat, foul body odor, not feeding, fever. Very contagious and often fatal.',
    contentEn: `Lumpy Skin Disease is a viral disease affecting cattle, sheep, and goats.

SYMPTOMS:
• Firm, raised skin nodules (2-5cm) all over body
• Foul body odor
• Fever (40-41°C)
• Loss of appetite and reduced feeding
• Swollen lymph nodes
• Difficulty eating if nodules in mouth
• Swollen eyes and eyelids
• Lameness if nodules on feet

KEY SIGNS:
• Very contagious
• Often fatal, especially in young animals
• Rapid spread through susceptible herds
• Secondary infections common

TREATMENT:
• No specific antiviral treatment
• Tetracycline antibiotics for secondary infections
• Supportive care with good nutrition
• Wound care for nodules
• Pain relief
• Fluid therapy if dehydrated

PREVENTION:
• Vaccination (LSD vaccine available)
• Control insect vectors (mosquitoes, flies, ticks)
• Isolate affected animals immediately
• Quarantine new stock for 21 days
• Maintain clean housing
• Good hygiene practices

RECOVERY GUIDELINES:
• Isolate affected animals immediately
• Supportive care with good nutrition and pain relief
• Culling severely affected animals may be necessary to prevent suffering and spread
• Monitor for secondary infections
• Disinfect all equipment and housing

NOTIFIABLE: YES`,
    treatment: 'Tetracycline antibiotics',
    precautions_prevention: 'Vaccination is the most effective prevention. Control insect vectors (flies, mosquitoes) which spread the disease.',
    recovery_guidelines: 'Isolate affected animals immediately. Supportive care with good nutrition and pain relief. Culling severely affected animals may be necessary to prevent suffering and spread.',
    symptoms: ['Skin nodules', 'Fever', 'Loss of appetite', 'Foul odor', 'Swollen lymph nodes'],
    tags: ['lsd', 'lumpy skin', 'nodules', 'contagious', 'notifiable'],
    notifiable: true,
    imageUrl: '/MyFarmData/Cattle_Health/Images/lsd.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 3. Contagious Caprine Pleuropneumonia (CCPP)
  {
    id: 'CCPP-001',
    diseaseCode: 'CCPP',
    titleEn: 'Contagious Caprine Pleuropneumonia (CCPP)',
    titleTn: 'Bolwetse jwa CCPP mo Dipodinyaneng',
    species: 'goat',
    species_affected: ['Goats'],
    key_symptoms_signs: 'Excessive coughing, labored breathing, nasal discharge, diarrhea, weight loss. Highly contagious, affects the lungs, often fatal.',
    contentEn: `CCPP is a severe, highly contagious disease affecting the lungs of goats.

SYMPTOMS:
• Excessive coughing
• Labored breathing and respiratory distress
• Nasal discharge
• Diarrhea (often profuse)
• Weight loss despite feeding
• Depression and lethargy
• Fever (40-41°C)
• Reluctance to move

KEY SIGNS:
• Highly contagious - spreads rapidly
• Affects the lungs severely
• Often fatal if untreated
• Mortality can reach 30-80%

TREATMENT:
• Penicillin (high doses)
• Tetracycline antibiotics
• Oxytetracycline injections
• Supportive care with fluids
• Anti-inflammatory medication
• Respiratory support

PREVENTION:
• A specific vaccine exists for CCPP - USE IT
• Minimize mixing of goats from different herds
• Good ventilation in housing is critical
• Quarantine new animals (30 days)
• Avoid stress and overcrowding
• Regular health monitoring

RECOVERY GUIDELINES:
• Isolate sick goats immediately
• Provide a stress-free, dry environment
• Antibiotics are most effective in early stages
• Recovered animals may have permanent lung damage
• Reduce stocking density
• Improve housing ventilation

NOTIFIABLE: YES - Report to DVS`,
    treatment: 'Penicillin',
    precautions_prevention: 'A specific vaccine exists for CCPP. Minimize mixing of goats from different herds. Good ventilation in housing is critical.',
    recovery_guidelines: 'Isolate sick goats. Provide a stress-free, dry environment. Antibiotics are most effective in early stages. Recovered animals may have permanent lung damage.',
    symptoms: ['Excessive coughing', 'Labored breathing', 'Nasal discharge', 'Diarrhea', 'Weight loss'],
    tags: ['ccpp', 'goat', 'respiratory', 'pneumonia', 'contagious'],
    notifiable: true,
    imageUrl: '/MyFarmData/Goat_Management/Images/ccpp.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 4. East Coast Fever (ECF)
  {
    id: 'ECF-001',
    diseaseCode: 'ECF',
    titleEn: 'East Coast Fever (ECF)',
    titleTn: 'Bolwetse jwa East Coast Fever',
    species: 'cattle',
    species_affected: ['Cattle'],
    key_symptoms_signs: 'Diarrhea, bloody urine, weakness, swollen joints, excessive salivation, labored breathing, no milk letdown. Upon slaughter, the meat is yellow and has a foul smell.',
    contentEn: `East Coast Fever is a tick-borne parasitic disease affecting cattle.

SYMPTOMS:
• High fever (40-42°C)
• Diarrhea (often severe)
• Bloody urine (hemoglobinuria)
• Weakness and depression
• Swollen joints
• Excessive salivation
• Labored breathing
• No milk letdown
• Conjunctivitis (red eyes)
• Weight loss

KEY SIGNS:
• Upon slaughter, meat is yellow and has foul smell
• Transmitted by brown ear tick (Rhipicephalus appendiculatus)
• Highly fatal if untreated
• Mortality 50-75% without treatment

TREATMENT:
• Early diagnosis is critical
• No specific treatment identified in initial data
• Veterinary care is essential immediately
• Supportive care with fluids
• Blood transfusion may be needed

PREVENTION:
• The primary prevention is tick control
• Regular dipping or spraying every 2-3 weeks
• Acaricide application
• Pasture rotation
• Remove and destroy ticks
• Quarantine new animals
• Introduce animals only from ECF-free areas

RECOVERY GUIDELINES:
• Prognosis is poor without prompt veterinary intervention
• Focus on rigorous tick control to prevent outbreaks
• Recovered animals become carriers
• May remain weak and unthrifty
• Maintain tick control indefinitely

NOTIFIABLE: YES`,
    treatment: 'No specific treatment identified in the source. Veterinary care is essential.',
    precautions_prevention: 'The primary prevention is tick control through regular dipping or spraying, as ticks transmit the disease.',
    recovery_guidelines: 'Prognosis is poor without prompt veterinary intervention. Focus on rigorous tick control to prevent outbreaks. Recovered animals become carriers.',
    symptoms: ['High fever', 'Diarrhea', 'Bloody urine', 'Weakness', 'Swollen joints', 'No milk letdown'],
    tags: ['ecf', 'tick', 'cattle', 'fever', 'parasitic'],
    notifiable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 5. Malignant Catarrhal Fever (MCF)
  {
    id: 'MCF-001',
    diseaseCode: 'MCF',
    titleEn: 'Malignant Catarrhal Fever (MCF)',
    titleTn: 'Bolwetse jwa MCF',
    species: 'cattle',
    species_affected: ['Cattle'],
    key_symptoms_signs: 'Blindness, rough hair coat, weak joints, dry mouth, wailing sound, restlessness, head shaking, circling, tail may fall off. No cure, often fatal.',
    contentEn: `Malignant Catarrhal Fever is a fatal viral disease of cattle.

SYMPTOMS:
• Progressive blindness
• Rough, dull hair coat
• Weak joints and staggering gait
• Dry mouth with excessive salivation
• Characteristic wailing or moaning sound
• Restlessness and agitation
• Head shaking and circling
• Tail may fall off
• Fever (40-42°C)
• Nasal discharge with foul smell
• Diarrhea
• Depression

KEY SIGNS:
• No cure - almost always fatal
• Often fatal within 1-2 weeks of symptom onset
• Transmitted from wildebeest or sheep in some strains
• Mortality approaching 100%

TREATMENT:
• No cure available
• Treatment is supportive to relieve symptoms only
• Euthanasia often recommended on welfare grounds

PREVENTION:
• Prevent contact between cattle and wildebeest
• Do not house cattle near lambing sheep
• Quarantine systems to prevent mixing with reservoir hosts
• Avoid shared pastures with wildlife
• Herd selection based on geographical location

RECOVERY GUIDELINES:
• Focus on prevention as the disease is almost always fatal
• Affected animals should be euthanized on welfare grounds
• Provide pain relief and comfort if keeping alive
• Prognosis is uniformly poor

NOTIFIABLE: YES - Report to DVS`,
    treatment: 'No cure. Treatment is supportive to relieve symptoms.',
    precautions_prevention: 'Prevent contact between cattle and wildebeest (or sheep, depending on the virus strain). Do not house cattle near lambing sheep.',
    recovery_guidelines: 'Focus on prevention as the disease is almost always fatal. Affected animals should be euthanized on welfare grounds.',
    symptoms: ['Blindness', 'Rough hair coat', 'Weakness', 'Head shaking', 'Circling', 'Fever'],
    tags: ['mcf', 'cattle', 'fatal', 'neurological', 'virus'],
    notifiable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 6. Bovine Ephemeral Fever (Three-Day Sickness)
  {
    id: 'BEF-001',
    diseaseCode: 'BEF',
    titleEn: 'Bovine Ephemeral Fever (Three-Day Sickness)',
    titleTn: 'Bolwetse jwa Beke Thalane',
    species: 'cattle',
    species_affected: ['Cattle'],
    key_symptoms_signs: 'Excessive salivation, shivering, hard stool, no milk letdown, sudden lameness. Rarely kills the animal directly, but recumbent animals can suffer from other issues.',
    contentEn: `Bovine Ephemeral Fever, also called Three-Day Sickness, is a viral disease affecting cattle.

SYMPTOMS:
• Sudden onset (animals appear healthy then show signs)
• Excessive salivation and drooling
• Shivering and chilling
• Hard (constipated) stool
• Complete milk letdown stops suddenly
• Sudden lameness (all four legs)
• Stiffness and reluctance to move
• Fever (40-41°C)
• Depression and lethargy
• Reluctance to stand

KEY SIGNS:
• Rarely kills the animal directly
• Recumbent (down) animals can suffer from:
  - Bloat and pressure sores
  - Complications from lying down
  - Secondary infections
• Typical recovery in 3 days (hence the name)

TREATMENT:
• Supportive care is main treatment
• Anti-inflammatory medications to reduce fever and pain
• Traditional method of warming the animal (e.g., sun exposure) helps with shivering
• Fluid therapy for dehydrated animals
• Pain relief injections
• Regular turning if animal is recumbent

PREVENTION:
• Control insect vectors (mosquitoes, biting midges, etc.)
• Screen housing during peak insect season
• Insecticide spraying
• Vaccines are available in some regions
• Minimize stress

RECOVERY GUIDELINES:
• Ensure recumbent animals have good footing (soft, clean bedding)
• Turn animals regularly to prevent pressure sores
• Provide access to fresh water and feed
• Monitor for bloat and other complications
• Recovery is usually spontaneous within 2-4 days
• Most animals recover fully
• Keep animal calm and stress-free

NOTIFIABLE: NO - But report if suspected epidemic`,
    treatment: 'Supportive care: anti-inflammatories to reduce fever and pain. The traditional method of warming the animal (e.g., sun) helps with shivering.',
    precautions_prevention: 'Control insect vectors (mosquitoes, biting midges) which spread the virus. Vaccines are available in some regions.',
    recovery_guidelines: 'Ensure recumbent animals have good footing (soft bedding), are turned regularly, and have access to water and feed. Recovery is usually spontaneous within a few days.',
    symptoms: ['Excessive salivation', 'Shivering', 'Lameness', 'No milk letdown', 'Depression'],
    tags: ['bovine ephemeral fever', 'three day sickness', 'cattle', 'virus', 'insects'],
    notifiable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 7. Enterotoxemia (Overeating Disease)
  {
    id: 'ENTERO-001',
    diseaseCode: 'ENTEROTOXEMIA',
    titleEn: 'Enterotoxemia (Overeating Disease)',
    titleTn: 'Bolwetse jwa go ja thata',
    species: 'sheep',
    species_affected: ['Sheep', 'Goats'],
    key_symptoms_signs: 'Sudden onset, healthy animals found dead. Upon slaughter, blood clots are noticed in the body. Animals die very quickly without showing prior illness.',
    contentEn: `Enterotoxemia is a rapidly fatal disease affecting sheep and goats.

SYMPTOMS:
• SUDDEN ONSET - often the first sign is DEATH
• When animals survive long enough to show signs:
  - Severe diarrhea (may be bloody)
  - Abdominal pain (animal strains)
  - Depression and weakness
  - Tremors or convulsions
  - Fever may be present initially
• Death can occur within hours

KEY SIGNS:
• Animals die very quickly without showing prior illness
• Upon slaughter, blood clots are noticed in the body
• Healthy animals found dead are typical
• Associated with sudden access to rich feeds or grain
• Especially affects young, fast-growing animals

TREATMENT:
• Often too late for treatment due to rapid death
• If caught early:
  - High doses of antitoxin
  - Antibiotics (penicillin)
  - Fluid therapy
  - Anti-inflammatory drugs
• May help in early stages only

PREVENTION:
• Vaccination is highly effective and crucial
• Vaccinate especially young, fast-growing animals
• Annual booster shots recommended
• Avoid sudden access to large amounts of grain
• Introduce rich feeds gradually over 2-3 weeks
• Maintain consistent diet
• Avoid abrupt feed changes
• Keep grain in secure storage
• Control pasture access to prevent overeating

RECOVERY GUIDELINES:
• Focus on prevention - this is essential
• For animals showing early signs:
  - Isolate immediately
  - Intensive nursing care
  - Increase fiber content
  - Reduce concentrate feeds
  - Provide probiotics
• Keep animals calm and stress-free

NOTIFIABLE: NO - But very important to prevent`,
    treatment: 'Often too late for treatment due to rapid death. High doses of antitoxin and antibiotics (penicillin) may help in early stages.',
    precautions_prevention: 'Vaccination is highly effective and crucial, especially for young, fast-growing animals. Avoid sudden access to large amounts of grain or rich feed.',
    recovery_guidelines: 'Focus on prevention. For animals showing signs, isolate and provide intensive nursing care. Increase fiber and reduce concentrate feeds.',
    symptoms: ['Sudden death', 'Severe diarrhea', 'Abdominal pain', 'Tremors', 'Depression'],
    tags: ['enterotoxemia', 'overeating disease', 'sheep', 'goat', 'sudden death'],
    notifiable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 8. Coenurosis (Gid, Sturdy)
  {
    id: 'COENURO-001',
    diseaseCode: 'COENUROSIS',
    titleEn: 'Coenurosis (Gid, Sturdy)',
    titleTn: 'Bolwetse jwa Coenurosis',
    species: 'sheep',
    species_affected: ['Sheep', 'Goats'],
    key_symptoms_signs: 'Circling, head pressing, blindness, emaciation, intense bellowing, ear touching causes pain, diarrhea. Caused by tapeworm larvae in the brain. No effective treatment.',
    contentEn: `Coenurosis is a parasitic disease caused by tapeworm larvae in the brain of sheep and goats.

SYMPTOMS:
• Progressive neurological signs
• Circling (often in one direction)
• Head pressing (pushing head into objects or ground)
• Progressive blindness
• Emaciation (wasting) despite feeding
• Intense bellowing or moaning
• Ear touching causes pain reaction
• Diarrhea
• Incoordination and staggering
• Behavioral changes
• May progress to recumbency

KEY SIGNS:
• Caused by tapeworm larvae (Taenia multiceps) in the brain
• Larvae migrate to brain causing cysts
• No effective treatment once clinical signs appear
• Usually fatal
• Transmitted by contaminated dog feces on pasture

TREATMENT:
• Tetracycline and other measures (ear cutting, sugar water) are generally ineffective
• No effective medical treatment once clinical signs appear
• Euthanasia is often recommended on welfare grounds
• Early identification before signs appear - very difficult

PREVENTION:
• This is the ONLY effective approach
• Break the life cycle: Do not feed dogs raw sheep or goat heads/brains
• Properly dispose of all carcasses:
  - Incinerate completely
  - Or deeply bury in lime
  - Never leave exposed
• Worm dogs regularly with appropriate anthelmintics
• Keep dogs off pastures where sheep graze
• Prevent dogs from hunting sheep
• Good sanitation practices

RECOVERY GUIDELINES:
• No recovery guidelines - this disease is nearly always fatal
• Prevention is the only solution
• Affected animals should be culled immediately
• Provide humane euthanasia on welfare grounds
• Dispose carcass safely (do NOT open brain - spreads spores)

NOTIFIABLE: YES - Report to DVS`,
    treatment: 'Tetracycline and other measures (ear cutting, sugar water) are generally ineffective.',
    precautions_prevention: 'Break the life cycle: Do not feed dogs (the definitive host) raw sheep or goat heads/brains. Properly dispose of carcasses.',
    recovery_guidelines: 'No recovery guidelines. Prevention is the only solution. Affected animals should be culled to prevent suffering.',
    symptoms: ['Circling', 'Head pressing', 'Blindness', 'Emaciation', 'Bellowing', 'Incoordination'],
    tags: ['coenurosis', 'gid', 'sturdy', 'sheep', 'goat', 'parasite', 'tapeworm'],
    notifiable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 9. Trypanosomiasis (Nagana)
  {
    id: 'TRYPANO-001',
    diseaseCode: 'TRYPANOSOMIASIS',
    titleEn: 'Trypanosomiasis (Nagana)',
    titleTn: 'Bolwetse jwa Tsetse',
    species: 'cattle',
    species_affected: ['Cattle'],
    key_symptoms_signs: 'Malnourishment (emaciation), dry mouth, hard black dung, swelling of front limbs, no milk letdown. Blood clots found after death. Highly fatal.',
    contentEn: `Trypanosomiasis (Nagana) is a parasitic disease transmitted by tsetse flies.

SYMPTOMS:
• Malnourishment and severe emaciation despite feeding
• Dry mouth
• Hard, black dung (constipation)
• Swelling of front limbs (especially fetlocks and knees)
• No milk letdown - loss of milk production
• Weakness and lethargy
• Progressive wasting
• Anemia (pale mucous membranes)
• Fever (intermittent)
• Watery discharge from eyes
• Progressive weight loss

KEY SIGNS:
• Transmitted by tsetse fly vector
• Blood clots found after death
• Highly fatal if untreated (80-90% mortality)
• Endemic in certain regions (tsetse belt of Africa)
• Severely economically important

TREATMENT:
• Specific trypanocidal drugs (e.g., Veriben, Samorin)
• Early treatment essential for survival
• Requires veterinary expertise
• Multiple drug doses may be needed
• Drug cost can be significant
• Prognosis poor without early treatment

PREVENTION:
• Control the tsetse fly vector (primary strategy)
• Prevent animals from grazing in high-risk areas:
  - Mountainous areas
  - During fly seasons
  - Known tsetse habitats
• Bush clearing in endemic areas
• Fly traps and targets
• Insecticide dipping
• Screen housing during peak fly season
• Introduce animals only from trypano-free areas

RECOVERY GUIDELINES:
• Prompt treatment is essential
• Recovered animals may remain weak and unthrifty
• Work with a vet for correct drug dosage and timing
• Monitor closely during recovery
• Nutritional support important
• May require extended feeding period
• Some animals may not fully recover productivity

NOTIFIABLE: YES - Report cases to veterinary services`,
    treatment: 'Specific trypanocidal drugs (e.g., Veriben).',
    precautions_prevention: 'Control the tsetse fly vector. Prevent animals from grazing in high-risk, mountainous areas during fly seasons.',
    recovery_guidelines: 'Prompt treatment is essential. Recovered animals may remain weak and unthrifty. Work with a vet for correct drug dosage.',
    symptoms: ['Emaciation', 'Dry mouth', 'Black dung', 'Swollen limbs', 'No milk letdown'],
    tags: ['trypanosomiasis', 'nagana', 'tsetse', 'cattle', 'parasite'],
    notifiable: true,
    imageUrl: '/MyFarmData/Cattle_Health/Images/trypano.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 10. Anthrax
  {
    id: 'ANTHRAX-001',
    diseaseCode: 'ANTHRAX',
    titleEn: 'Anthrax',
    titleTn: 'Bolwetse jwa Anthrax',
    species: 'all',
    species_affected: ['Cattle', 'Sheep', 'Goats'],
    key_symptoms_signs: 'Sudden death (often the first sign). In live animals: high fever, staggering, difficulty breathing, bloody discharge from orifices. Rapidly fatal septicemia.',
    contentEn: `Anthrax is a rapidly fatal bacterial disease affecting livestock and humans.

SYMPTOMS:
• SUDDEN DEATH - often the first and only sign
• When animals live long enough to show signs:
  - High fever (41-42°C)
  - Staggering and incoordination
  - Difficulty breathing
  - Rapid, difficult breathing
  - Bloody discharge from:
    - Mouth
    - Nose
    - Rectum/anus
  - Violent muscular tremors
  - Profuse sweating
• Death usually within 24-48 hours

KEY SIGNS:
• Rapidly fatal septicemia
• Dead animal may show no signs of struggle
• Blood may not clot properly
• Spores form in carcass - DANGEROUS
• This is a ZOONOTIC disease (transmits to humans)
• Extremely serious public and animal health threat

TREATMENT:
• Do NOT treat - Report immediately
• Antibiotics (penicillin) can work in very early stages
• But rarely used due to risk of spreading spores
• No time usually - death is too rapid
• Report to veterinary authorities IMMEDIATELY

PREVENTION:
• Vaccination in endemic areas - crucial
• Annual vaccination in high-risk areas
• Do NOT disturb soil or carcasses in outbreak areas
• This causes spores to form and disperse
• Maintain strict biosecurity
• Prevent scavengers from accessing carcasses
• Report any suspicions to authorities
• This is a serious human health risk

RECOVERY GUIDELINES:
• Do NOT open a dead animal suspected of anthrax
• Opening causes spores to form
• Spores survive in soil for 50+ years
• Incinerate or deeply bury the carcass with lime
• Report to veterinary authorities immediately
• Disinfect any contaminated areas
• This is an international reportable disease

CRITICAL SAFETY INFORMATION:
• This is a NOTIFIABLE disease - MUST report
• This is a ZOONOTIC disease - humans can catch it
• Very dangerous - handle with extreme care
• Only qualified personnel should handle suspected cases
• Use appropriate PPE (gloves, masks, aprons)
• Report to health authorities as well as veterinary services

NOTIFIABLE: YES - INTERNATIONAL REPORTABLE DISEASE - Report IMMEDIATELY`,
    treatment: 'Do not treat. Report immediately. Antibiotics (penicillin) can work in early stages but are rarely used due to risk.',
    precautions_prevention: 'Vaccination in endemic areas. Do not disturb soil or carcasses in outbreak areas. This is a zoonotic disease and a serious human health risk.',
    recovery_guidelines: 'Do not open a dead animal suspected of anthrax. It causes spores to form. Incinerate or deeply bury the carcass with lime. Report to veterinary authorities.',
    symptoms: ['Sudden death', 'High fever', 'Difficulty breathing', 'Bloody discharge', 'Staggering'],
    tags: ['anthrax', 'acute', 'cattle', 'sheep', 'goat', 'zoonotic', 'notifiable'],
    notifiable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 11. Actinobacillosis (Wooden Tongue)
  {
    id: 'ACTINO-001',
    diseaseCode: 'ACTINOBACILLOSIS',
    titleEn: 'Actinobacillosis (Wooden Tongue)',
    titleTn: 'Bolwetse jwa Leme la Mopahlo',
    species: 'cattle',
    species_affected: ['Cattle', 'Sheep'],
    key_symptoms_signs: 'Difficulty eating, anorexia, excessive salivation. Soft-tissue swelling, abscesses, and draining tracts on the head, neck, and especially the tongue, which becomes hard and wooden.',
    contentEn: `Actinobacillosis is a chronic, slowly progressive bacterial infection.

SYMPTOMS:
• Difficulty eating and chewing
• Anorexia (loss of appetite or very selective eating)
• Excessive salivation and drooling
• Swelling on head, neck, and jaw
• Abscesses that drain pus
• Hardening of affected tissues (especially tongue)
• Tongue becomes hard and woody ("wooden tongue")
• Poor weight gain or weight loss
• Foul-smelling drainage
• Reluctance to eat hard feed

KEY SIGNS:
• Soft-tissue swelling
• Abscesses and draining tracts
• Most commonly affects:
  - Tongue
  - Lower jaw
  - Head and neck region
• Tissue becomes increasingly hard and fibrotic
• Progresses slowly over weeks to months

TREATMENT:
• High doses of antibiotics for a long duration:
  - Sulfonamides
  - Tetracyclines
  - Ampicillin
  - Amoxicillin
• Sodium iodide also used in some cases
• Treatment must continue for weeks
• May require surgical drainage of abscesses
• Prolonged therapy essential for cure

PREVENTION:
• Prevent oral wounds by removing coarse or sharp materials from feed:
  - Remove hay ties and wire
  - Avoid hay with sticks
  - Smooth feed troughs
  - Remove thorny vegetation
• Provide soft feed to prevent oral injuries
• Regular dental examination
• Good oral hygiene

RECOVERY GUIDELINES:
• Prognosis is fair with prolonged treatment
• Isolate affected animals to prevent spread of pus
• Provide easily consumed soft feed:
  - Crushed grain
  - Hay pellets
  - Mixed feeds
• Monitor for improvement over weeks
• Culling may be economical for severe cases
• Once healed, may have permanent tissue damage

NOTIFIABLE: NO - But follow up required`,
    treatment: 'High doses of antibiotics (sulfonamides, tetracyclines, ampicillin) for a long duration. Sodium iodide is also used.',
    precautions_prevention: 'Prevent oral wounds by removing coarse or sharp materials from feed. Provide soft feed to affected animals.',
    recovery_guidelines: 'Prognosis is fair with prolonged treatment. Isolate affected animals to prevent spread of pus. Culling may be economical for severe cases.',
    symptoms: ['Difficulty eating', 'Anorexia', 'Excessive salivation', 'Swelling on head', 'Wooden tongue'],
    tags: ['actinobacillosis', 'wooden tongue', 'cattle', 'sheep', 'bacterial'],
    notifiable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 12. Arcanobacteriosis (Lumpy Jaw)
  {
    id: 'ARCANO-001',
    diseaseCode: 'ARCANOBACTERIOSIS',
    titleEn: 'Arcanobacteriosis (Lumpy Jaw)',
    titleTn: 'Bolwetse jwa Manaka a a Matata',
    species: 'cattle',
    species_affected: ['Cattle'],
    key_symptoms_signs: 'Painful eating, weight loss. Firm, non-painful, immovable swelling on the jawbone (mandible). Draining tracts may develop.',
    contentEn: `Arcanobacteriosis, commonly called Lumpy Jaw, is a chronic bacterial infection of the jaw.

SYMPTOMS:
• Painful eating and chewing
• Weight loss and poor condition
• Progressive swelling of the jaw
• Firm, non-painful, immovable swelling on jawbone (mandible)
• Swelling is hard and bony
• Draining tracts may develop with purulent discharge
• Pus may drain from skin surface
• Difficulty grazing
• Reluctance to eat hard feed
• Bad breath (from infection)

KEY SIGNS:
• The swelling is typically:
  - Firm and hard
  - Non-painful (unlike abscesses)
  - Immovable and fixed to bone
  - Progressive and enlarging
• The infection is DEEP in the bone
• Draining sinuses may form

TREATMENT:
• Extended therapy required:
  - Penicillin (high doses, prolonged course)
  - Ampicillin
  - Amoxicillin
  - Isoniazid can be used in non-pregnant cattle
• Must treat for weeks to months
• Dental examination and possible extraction
• Surgical drainage of sinuses may help
• Pain relief during treatment

PREVENTION:
• Prevent oral wounds by removing coarse or sharp materials from feed:
  - Remove hay ties and wire
  - Smooth feed troughs
  - Avoid rough hay
• Provide soft feed when possible
• Regular dental care
• Early treatment of oral injuries
• Good oral hygiene

RECOVERY GUIDELINES:
• Culling is often recommended:
  - Infection is deep in the bone
  - Very difficult to cure completely
  - Prognosis is poor
• If treated, may have permanent jaw damage
• May never fully recover eating ability
• Some improvement possible with early, aggressive treatment
• Isolate animal during treatment

NOTIFIABLE: NO - But economically important to address`,
    treatment: 'Extended therapy with Penicillin, ampicillin, or amoxicillin. Isoniazid can be used in non-pregnant cattle.',
    precautions_prevention: 'Prevent oral wounds by removing coarse or sharp materials from feed. The prognosis is often poor.',
    recovery_guidelines: 'Culling is often recommended as the infection is deep in the bone and very difficult to cure.',
    symptoms: ['Painful eating', 'Weight loss', 'Jaw swelling', 'Draining tracts', 'Hard swelling'],
    tags: ['arcanobacteriosis', 'lumpy jaw', 'cattle', 'bone infection'],
    notifiable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 13. Omphalophlebitis (Navel/Joint Ill)
  {
    id: 'OMPH-001',
    diseaseCode: 'OMPHALOPHLEBITIS',
    titleEn: 'Omphalophlebitis (Navel/Joint Ill)',
    titleTn: 'Bolwetse jwa Navel ya Seane',
    species: 'young',
    species_affected: ['Young Calves', 'Lambs', 'Kids'],
    key_symptoms_signs: 'Depression, anorexia. Painful, swollen navel; purulent discharge from navel; swollen, painful joints (joint ill); may progress to septicemia.',
    contentEn: `Omphalophlebitis is a serious bacterial infection in newborn livestock (calves, lambs, kids).

SYMPTOMS:
• Depression and weakness in newborn
• Anorexia (reduced or no feeding)
• Painful, swollen navel
• Purulent (pus-filled) discharge from navel
• Navel may smell foul
• Swollen, painful joints (joint ill):
  - Knees, hocks, shoulders most common
  - Animal unable or reluctant to stand
  - Lameness
  - Joint swelling and heat
• May progress to septicemia:
  - High fever
  - Rapid deterioration
  - Shock
  - Death within days

KEY SIGNS:
• Infection enters through umbilical cord
• Can progress rapidly to systemic infection
• Early intervention critical
• May result in permanent joint damage

TREATMENT:
• Prompt, aggressive antibiotic therapy is ESSENTIAL:
  - Broad-spectrum antibiotics
  - High doses
  - For 5-7 days minimum
  - May need to continue 2-3 weeks
• Cleaning and disinfecting the navel:
  - Gentle cleaning with antiseptic
  - Do NOT use harsh scrubbing
  - Daily navel care
• Joint drainage may be needed for joint infections
• Fluid therapy
• Pain relief

PREVENTION:
• AT BIRTH - this is CRITICAL:
  - Dip the navel cord in strong 7% tincture of iodine
  - Do this immediately after birth
  - Repeat daily for first week of life
• Calving/lambing area hygiene:
  - Clean, dry environment
  - Well-bedded with clean straw
  - Regular cleaning
  - Disinfect between births
• Ensure colostrum intake:
  - Calves: 2-4 liters in first 24 hours
  - Lambs: 10% of body weight
  - Kids: Similar to lambs
• Isolate newborns from dirty, contaminated areas
• Clean hands when handling newborns
• Sterilize any equipment used

RECOVERY GUIDELINES:
• Early treatment is CRITICAL for survival
• Recovered animals may have permanent joint damage:
  - Stiffness
  - Reduced mobility
  - Poor growth
• Cull severely affected calves
• Monitor recovery closely:
  - Watch for relapse
  - Joint swelling may take weeks to resolve
  - Pain relief important
• Ensure adequate nutrition for recovery
• May require long-term antibiotic therapy

PROGNOSIS:
• Good with EARLY treatment
• Poor if treatment delayed
• Can be rapidly fatal if septicemia develops

NOTIFIABLE: NO - But requires immediate veterinary care`,
    treatment: 'Prompt, aggressive antibiotic therapy (broad-spectrum). Cleaning and disinfecting the navel.',
    precautions_prevention: 'At birth, dip the navel cord in a strong 7% tincture of iodine. Ensure calving/lambing areas are clean, dry, and well-bedded.',
    recovery_guidelines: 'Early treatment is critical for survival. Recovered animals may have permanent joint damage and poor growth. Cull severely affected calves.',
    symptoms: ['Depression', 'Anorexia', 'Swollen navel', 'Purulent discharge', 'Swollen joints'],
    tags: ['omphalophlebitis', 'navel ill', 'joint ill', 'newborn', 'septicemia'],
    notifiable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // ============================================================
  // GENERAL PREVENTION - The Foundation of Herd Health
  // ============================================================
  {
    id: 'PREVENTION-001',
    diseaseCode: 'GENERAL_PREVENTION',
    titleEn: 'General Disease Prevention - The Foundation of Herd Health',
    titleTn: 'Tshireletso ya Kakaretso - Motheo wa Boitekanelo jwa Serapa',
    species: 'all',
    contentEn: `GENERAL PREVENTION: The Foundation of Herd Health

Disease prevention is always better and more cost-effective than treatment. A comprehensive prevention program should include:

1. BIOSECURITY - Your Farm's First Line of Defense
   • Quarantine new animals for 2-4 weeks before introduction:
     - Keep separate from main herd
     - Observe for any signs of disease
     - Complete health history review
     - Veterinary health examination
   • Control visitor access:
     - Limit farm visitors
     - Provide clean footwear for all visitors
     - Wash hands before handling animals
   • Equipment and vehicle biosecurity:
     - Clean and disinfect equipment between farms
     - Vehicles should not drive through animal areas
     - Disinfect any equipment brought from outside
   • Feed and water:
     - Ensure clean water sources
     - Store feed to prevent contamination
     - Do not use feed from unknown sources

2. VACCINATION - Your Most Powerful Tool
   • Work with your veterinarian to develop vaccination protocol for:
     - Foot and Mouth Disease (FMD) - every 6 months
     - Lumpy Skin Disease (LSD)
     - Contagious Caprine Pleuropneumonia (CCPP) - for goats
     - Enterotoxemia - annually
     - Anthrax - in endemic areas
     - Other diseases specific to your region
   • Maintain vaccination records
   • Plan for booster shots
   • Vaccinate according to age and schedule

3. GOOD HUSBANDRY - Build Natural Resilience
   • Nutrition:
     - Provide balanced, high-quality feed
     - Ensure adequate minerals (calcium, phosphorus, salt)
     - Provide vitamins (especially vitamin A)
     - Maintain consistent diet - avoid sudden changes
   • Water:
     - Clean, fresh water available at all times
     - At least 1-2 liters per 100kg body weight daily
     - More during hot weather
   • Housing and environment:
     - Adequate ventilation to prevent respiratory disease
     - Clean, dry bedding
     - Reduce stocking density to minimize stress
     - Protect from extreme weather
     - Regular cleaning and disinfection
   • Low-stress handling:
     - Calm handling reduces stress and boosts immunity
     - Minimize noise and rough handling
     - Establish routine handling practices
     - Train handlers properly

4. REGULAR MONITORING - Early Intervention is Key
   • Observe your animals DAILY:
     - Look for reduced feed intake
     - Watch for lethargy or unusual behavior
     - Note any isolation from the herd
     - Check for unusual discharges or swelling
     - Monitor milk production changes
   • Keep records:
     - Note any health events
     - Track treatments
     - Monitor productivity
   • Early identification allows for rapid intervention
   • Separate sick animals immediately
   • Contact veterinarian at first sign of disease

5. PARASITE CONTROL
   • Internal parasites:
     - Regular deworming schedule
     - Rotate parasite drugs to prevent resistance
   • External parasites (ticks, flies, lice):
     - Regular dipping or spraying
     - Acaricide application every 2-3 weeks during tick season
     - Screen housing during fly season

6. HEALTH RECORDS
   • Keep detailed records:
     - Vaccination dates and products
     - Any disease outbreaks
     - Treatment records
     - Production records
     - Mortality records
   • This helps identify patterns
   • Essential for herd management decisions

7. VETERINARY RELATIONSHIP
   • Establish relationship with veterinarian
   • Get professional advice on:
     - Vaccination protocols
     - Parasite control
     - Nutrition programs
     - Disease prevention plans
   • Have veterinarian contact readily available

8. DISEASE AWARENESS
   • Know the diseases present in your region
   • Understand early signs of these diseases
   • Know which diseases are notifiable
   • Know reporting procedures for DVS

COST-BENEFIT OF PREVENTION:
Prevention costs are minimal compared to:
• Treatment costs (antibiotics, vet visits)
• Production losses (milk, growth, weight)
• Mortality and culling
• Herd reputation
• Quarantine and movement restrictions

A well-planned prevention program pays for itself many times over!`,
    contentTn: `TSHIRELETSO YA KAKARETSO: Motheo wa Boitekanelo jwa Serapa

Tshireletso e le go farologanya bolwetse e le mo go siamo go fapana le kalafo.

1. BIOSECURITY - Tefo ya Ntlha ya Sepelo sa Gago
   • Kgaoganya diphologolo tse disha mo lobakeng la le 2-4
   • Laola go tsena kwa sepeleng
   • Tlhatswa diaparo tsa bagaesi

2. ENTA - Sesepa sa Gago
   • Enta diphologolo go latela leano la ngaka
   • Boloka lesika la enta
   • Enta ka bolelo

3. BOISEMANEGELO JWA SETLHOHLO
   • Naya dijo tse di ntle
   • Naya meetse a a phepa
   • Boloka lefelo le le phuthololo
   • Naya tlhokomelo e e bonolo

4. KUPOKONYA KA LETSATSI
   • Lebalela diphologolo mo letsatsing
   • Ela tlhokomediso go ka bo fokolla
   • Kgaoganya diphologolo tse di lwalang

5. LAOLA PARASITES
   • Ntsha dikgwaga tsa ka go fapana
   • Tlhokkha matshenekegedi

6. BOLOKA LESIKA
   • Boloka lesika la enta
   • Boloka lesika la bolwetse
   • Boloka lesika la kalafo

7. MMUALEFA WA NGAKA
   • Itumeletsa ngaka ya diphologolo
   • Botsa seabiso

THUSO YA PELE YE E BOLOKANG TSHIMO:
Thuso ya tshireletso e mo go thapama go fapana le:
• Ditlhari tsa kalafo
• Go fokolla ga tlhapelo
• Go duela ga serapa`,
    species: 'all',
    symptoms: [],
    treatment: 'Prevention is the primary strategy',
    prevention: 'Comprehensive prevention program as detailed above',
    tags: ['prevention', 'biosecurity', 'vaccination', 'husbandry', 'monitoring'],
    notifiable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // ============================================================
  // GENERAL GUIDELINES FOR MANAGING SICK ANIMALS
  // ============================================================
  {
    id: 'MANAGEMENT-001',
    diseaseCode: 'GENERAL_MANAGEMENT',
    titleEn: 'General Guidelines for Managing Sick Animals',
    titleTn: 'Leano la Kakaretso la Tshireletso ya Diphologolo tse di Lwalang',
    species: 'all',
    contentEn: `GENERAL GUIDELINES FOR MANAGING SICK ANIMALS

When an animal becomes sick, proper management is critical for recovery and herd health. Follow these steps:

STEP 1: ISOLATE IMMEDIATELY
• Remove sick animal from healthy herd IMMEDIATELY
• Place in a designated sick pen or facility
• The sick pen should:
  - Be clean and disinfected before use
  - Have clean, dry bedding
  - Have adequate ventilation
  - Be away from main herd
  - Allow easy observation
  - Prevent direct contact with healthy animals
• IMPORTANT: Do not use this pen for healthy animals, especially calving/lambing areas
• After use, clean and disinfect thoroughly before reusing

STEP 2: PROMPT DIAGNOSIS AND TREATMENT
• Contact your veterinarian for:
  - Confirmed diagnosis
  - Specific treatment plan
  - Medication dosages and schedules
• Follow treatment plan PRECISELY:
  - Use correct dosage
  - Complete full course of treatment
  - Follow timing instructions
  - Finish antibiotic course even if animal appears better
• Keep treatment records:
  - Dates and times of treatments
  - Dosages given
  - Animal response
  - Any side effects
• Communicate with veterinarian about:
  - Progress
  - Any concerns
  - Changes in animal condition

STEP 3: SUPPORTIVE CARE
• Fresh Water:
  - Provide fresh water at all times
  - Some animals drink more when sick
  - Keep water container clean
  - Change water frequently
• High-quality, Palatable Feed:
  - Offer feed multiple times daily
  - Provide soft, easily-consumed feed
  - Avoid rough or hard feeds
  - May need specialized diet depending on disease
  - Tempt with varied feeds if not eating
  - Hand-feed if necessary
• Comfort and Reduced Stress:
  - Minimize handling stress
  - Keep area quiet
  - Provide shelter from weather
  - Avoid sudden changes
  - Gentle, calm care
• Pain Relief:
  - Administer pain medications as prescribed
  - Monitor for signs of pain
  - Adjust pain management as needed
• Special Care for Recumbent Animals:
  - Soft, clean bedding (essential)
  - Deep bedding prevents pressure sores
  - Turn animal regularly (every 2-3 hours if possible)
  - Provide tail support
  - Assist animal to stand if possible
  - Access to water and feed must be easy
  - Monitor for bloat and pneumonia

STEP 4: HYGIENE PROTOCOL - PREVENTING SPREAD
• Personal Hygiene:
  - Wash hands thoroughly after handling sick animal
  - Wear clean clothes when working with healthy herd
  - ALWAYS change clothes after handling sick animals
  - Never touch healthy animals after sick animals without cleaning
• Equipment Hygiene:
  - Disinfect all equipment used with sick animal
  - Feeding buckets, water containers, halters, etc.
  - Use separate equipment for sick animal if possible
  - Do NOT share equipment with healthy animals
  - Boots and footwear:
    - Change boots when leaving sick pen
    - Disinfect boots (foot bath)
    - Clean all mud/manure off boots
• Housing Disinfection:
  - Daily cleaning of sick pen
  - Remove soiled bedding daily
  - Fresh bedding regularly
  - Disinfect surfaces
• Waste Management:
  - Dispose of bedding properly
  - Do not spread in pastures near healthy animals
  - Compost if possible

ADDITIONAL MANAGEMENT CONSIDERATIONS:

For Different Disease Types:

INFECTIOUS DISEASES:
• Strict isolation
• Enhanced disinfection
• Report notifiable diseases to DVS
• Limit movement of animals

NUTRITIONAL/METABOLIC DISEASES:
• Dietary adjustments
• Supplements may be needed
• Monitor recovery carefully

PARASITIC DISEASES:
• Treat all animals if outbreak suspected
• Improve housing/pasture management
• Repeat treatments as recommended

TRAUMATIC INJURIES:
• Pain relief is critical
• Keep wound clean
• Prevent secondary infection
• Provide rest period

MONITORING FOR RECOVERY:
• Observe animal daily
• Signs of improvement:
  - Increased appetite
  - More alert
  - Standing/moving better
  - Normal temperature
  - Improved appearance
• Signs of deterioration:
  - Worsening condition
  - Fever returning
  - Discharge increases
  - Animal very weak
  - Contact veterinarian immediately

DIFFICULT CASES:
• If animal not improving after 3-5 days:
  - Contact veterinarian
  - Consider alternative diagnosis
  - May need different treatment
• If animal deteriorating:
  - Contact veterinarian immediately
  - Consider humane euthanasia if suffering

RETURN TO HERD:
• Only return when fully recovered
• Avoid mixing with vulnerable animals initially
• Monitor closely for relapse
• Gradually return to normal feeding
• Reintroduce to herd in stages if possible

RECORD KEEPING:
• Keep detailed records:
  - Date animal became sick
  - Symptoms observed
  - Diagnosis given
  - Treatments given (dates, doses)
  - Response to treatment
  - Date animal recovered/died
  - Costs of treatment
• This helps with future disease management

ECONOMIC CONSIDERATIONS:
• Treatment cost vs. animal value
• Production loss during illness
• Ongoing care requirements
• Probability of recovery
• Humane euthanasia may be appropriate choice in some cases

NOTIFIABLE DISEASES:
• If animal diagnosed with notifiable disease:
  - MUST report to DVS within 24 hours
  - Follow DVS quarantine/movement restrictions
  - Do not move animals without permission
  - Cooperate with animal health authorities

Remember: Quick action, proper isolation, correct treatment, and good supportive care give the sick animal the best chance of recovery and protect your whole herd!`,
    contentTn: `LEANO LA KAKARETSO LA TSHIRELETSO YA DIPHOLOGOLO TSE DI LWALANG

Fa phologolo e le le lwalang, boitekanelo jo bo siameng ke botlhokwa.

TSEBELELESO 1: KGAOGANYA KA BONAKO
• Tlosa phologolo le le lwalang mo serapeng sa boitekanelo
• Tlhotlhelela mo segolwaneng se se itilweng
• Segolwane se se lokile:
  - Se le se phuthololo le se se tlhatswa
  - Se le se nang le lelatheletsi le le phepa
  - Se le se nang le phefumo ya phasika
  - Se le se kgakgana le serapa

TSEBELELESO 2: PONO YA BONAKO LE KALAFO
• Itsise ngaka ya diphologolo
• Latela leano la kalafo:
  - Selokalweng sa go siama
  - Boloka lesika la kalafo
  - Boloka lerato la ngaka

TSEBELELESO 3: TLHOKOMELO YA BORATA
• Meetse a a phepa:
  - Naya meetse mo nako yohle
  - Boloka kontonase le a a phepa
• Dijo tse di ntle:
  - Naya dijo tse di bonolo
  - Naya dijo tse di ka jang phologolo le le lwalang
• Ponatshegelo ya Borata:
  - Phologolo ya go na le mohuba e tlhoketswe tlhokomelo e e kgethegileng

TSEBELELESO 4: POLASEJANA YA BOITEKANELO
• Tlhatswa matswana mo go utwa phologolo le le lwalang
• Tlhatswa didiriswa
• Tlhatswa ditlhako tsa gago
• Tlhatswa segolwane

MALEBELA:
• Fa phologolo e le le tlhabana e le e sa go hlabana ka letsatsi le le lengwe:
  - Itsise ngaka
  - Ela tlhokomediso mo bokgothalelong
  - Ka le ka go kgabela phologolo fa e le go owa mo botloko`,
    species: 'all',
    symptoms: [],
    treatment: 'Follow management guidelines as detailed',
    prevention: 'Proper isolation and hygiene',
    tags: ['management', 'sick animals', 'isolation', 'care', 'recovery'],
    notifiable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 14. Bluetongue
  {
    id: 'BLUE-001',
    diseaseCode: 'BLUETONGUE',
    titleEn: 'Bluetongue',
    titleTn: 'Bluetongue',
    species: 'sheep',
    species_affected: ['Sheep', 'Goats', 'Cattle'],
    key_symptoms_signs: 'Swollen blue tongue, oral ulcers, lameness, respiratory distress.',
    contentEn: 'Bluetongue is an insect-borne viral disease primarily of sheep.\n\nSYMPTOMS:\n• Swollen, cyanotic (blue) tongue\n• Oral ulcers\n• Lameness\n• Respiratory distress\n\nPREVENTION: Vaccination, insect control (midges), housing at dusk/dawn.',
    contentTn: 'Bluetongue is an insect-borne viral disease primarily of sheep.',
    treatment: 'No antiviral, supportive: anti-inflammatories, soft feed.',
    prevention: 'Vaccination, insect control (midges), housing at dusk/dawn.',
    symptoms: ['Swollen blue tongue', 'Oral ulcers', 'Lameness', 'Respiratory distress'],
    tags: ['bluetongue', 'sheep', 'virus'],
    notifiable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 15. Peste des Petits Ruminants (PPR)
  {
    id: 'PPR-001',
    diseaseCode: 'PPR',
    titleEn: 'Peste des Petits Ruminants (PPR / Goat Plague)',
    titleTn: 'Peste des Petits Ruminants (PPR)',
    species: 'goat',
    species_affected: ['Goats', 'Sheep'],
    key_symptoms_signs: 'High fever, eye/nose discharge, mouth ulcers, diarrhea, abortion.',
    contentEn: 'PPR is a highly contagious viral disease of sheep and goats.\n\nSYMPTOMS:\n• High fever\n• Eye/nose discharge\n• Mouth ulcers\n• Diarrhea\n• Abortion\n\nPREVENTION: Vaccination is highly effective. REPORTABLE.',
    contentTn: 'PPR is a highly contagious viral disease of sheep and goats.',
    treatment: 'No antiviral, supportive: fluids, antibiotics for secondary infections.',
    prevention: 'Vaccination highly effective, REPORTABLE, mortality up to 90%.',
    symptoms: ['High fever', 'Discharge', 'Mouth ulcers', 'Diarrhea'],
    tags: ['ppr', 'goat plague', 'virus', 'notifiable'],
    notifiable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 16. Mastitis
  {
    id: 'MAST-001',
    diseaseCode: 'MASTITIS',
    titleEn: 'Mastitis (Udder Infection)',
    titleTn: 'Bolwetse jwa Letsele (Mastitis)',
    species: 'all',
    species_affected: ['Cattle', 'Goats', 'Sheep'],
    key_symptoms_signs: 'Swollen/hot/painful udder, abnormal milk.',
    imageUrl: '/MyFarmData/Cattle_Health/Images/mastitis.png',
    contentEn: 'Mastitis is an inflammation of the mammary gland.\n\nSYMPTOMS:\n• Swollen/hot/painful udder\n• Abnormal milk (clots/bloody/watery)\n\nPREVENTION: Teat dipping, clean bedding, dry cow therapy.',
    contentTn: 'Mastitis ke go ruruga ga letsele.',
    treatment: 'Intramammary or systemic antibiotics, anti-inflammatories.',
    prevention: 'Teat dipping pre/post milking, clean bedding, dry cow therapy.',
    symptoms: ['Swollen udder', 'Hot udder', 'Painful udder', 'Abnormal milk'],
    tags: ['mastitis', 'udder', 'bacterial'],
    notifiable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 17. Leptospirosis
  {
    id: 'LEPTO-001',
    diseaseCode: 'LEPTOSPIROSIS',
    titleEn: 'Leptospirosis (Lepto)',
    titleTn: 'Leptospirosis',
    species: 'all',
    species_affected: ['Cattle', 'Goats', 'Sheep'],
    key_symptoms_signs: 'High fever, red urine (blood), jaundice, abortion.',
    contentEn: 'Leptospirosis is a zoonotic bacterial disease.\n\nSYMPTOMS:\n• High fever\n• Red urine\n• Jaundice\n• Abortion\n\nPREVENTION: Vaccination, rodent control.',
    contentTn: 'Leptospirosis is a zoonotic bacterial disease.',
    treatment: 'Streptomycin or oxytetracycline, fluid therapy.',
    prevention: 'Vaccination annually, rodent control, clean water sources.',
    symptoms: ['High fever', 'Red urine', 'Jaundice', 'Abortion'],
    tags: ['leptospirosis', 'zoonotic', 'bacterial'],
    notifiable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 18. Brucellosis
  {
    id: 'BRUC-001',
    diseaseCode: 'BRUCELLOSIS',
    titleEn: 'Brucellosis (Bang\'s Disease)',
    titleTn: 'Brucellosis',
    species: 'all',
    species_affected: ['Cattle', 'Goats', 'Sheep'],
    key_symptoms_signs: 'Abortions, retained placenta, weak newborns.',
    contentEn: 'Brucellosis is a highly contagious zoonosis.\n\nSYMPTOMS:\n• Abortions\n• Retained placenta\n• Orchitis in males\n\nPREVENTION: Vaccination (RB51/Strain 19), test and cull.',
    contentTn: 'Brucellosis is a highly contagious zoonosis.',
    treatment: 'NO EFFECTIVE TREATMENT - CULL.',
    prevention: 'Vaccination (RB51/Strain 19), test and cull, REPORTABLE.',
    symptoms: ['Abortions', 'Retained placenta', 'Weak newborns'],
    tags: ['brucellosis', 'zoonotic', 'notifiable', 'bacterial'],
    notifiable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 19. Johne's Disease
  {
    id: 'JOHNE-001',
    diseaseCode: 'JOHNES',
    titleEn: 'Johne\'s Disease (Paratuberculosis)',
    titleTn: 'Johne\'s Disease',
    species: 'all',
    species_affected: ['Cattle', 'Goats', 'Sheep'],
    key_symptoms_signs: 'Chronic weight loss despite appetite, profuse diarrhea, bottle jaw.',
    contentEn: 'Johne\'s disease is a chronic enteritis.\n\nSYMPTOMS:\n• Chronic weight loss\n• Profuse diarrhea\n• Bottle jaw\n\nPREVENTION: Test and cull.',
    contentTn: 'Johne\'s disease is a chronic enteritis.',
    treatment: 'No cure, supportive care only.',
    prevention: 'Test and cull, prevent young from adult feces.',
    symptoms: ['Chronic weight loss', 'Profuse diarrhea', 'Bottle jaw'],
    tags: ['johnes', 'wasting', 'bacterial'],
    notifiable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 20. Caseous Lymphadenitis (CL)
  {
    id: 'CL-001',
    diseaseCode: 'CASEOUS_LYMPHADENITIS',
    titleEn: 'Caseous Lymphadenitis (CL / Cheesy Gland)',
    titleTn: 'Caseous Lymphadenitis',
    species: 'goat',
    species_affected: ['Goats', 'Sheep'],
    key_symptoms_signs: 'External abscesses (lymph nodes), internal abscesses.',
    contentEn: 'CL is a chronic bacterial infection.\n\nSYMPTOMS:\n• External abscesses\n• Internal abscesses (weight loss)\n\nPREVENTION: Cull affected.',
    contentTn: 'CL is a chronic bacterial infection.',
    treatment: 'Surgical drainage, antibiotics, no cure for internal form.',
    prevention: 'Cull affected, no sharing needles/equipment.',
    symptoms: ['External abscesses', 'Internal abscesses', 'Weight loss'],
    tags: ['cl', 'cheesy gland', 'abscesses', 'bacterial'],
    notifiable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 21. Foot Rot
  {
    id: 'FOOT-001',
    diseaseCode: 'FOOT_ROT',
    titleEn: 'Foot Rot',
    titleTn: 'Bolwetse jwa Tlhako (Foot Rot)',
    species: 'sheep',
    species_affected: ['Sheep', 'Goats', 'Cattle'],
    key_symptoms_signs: 'Severe lameness, swelling between toes, foul discharge from hoof.',
    imageUrl: '/MyFarmData/Cattle_Health/Images/foot_rot.png',
    contentEn: 'Foot rot is a highly contagious bacterial infection of the hooves.\n\nSYMPTOMS:\n• Severe lameness\n• Swelling between toes\n• Foul discharge\n\nPREVENTION: Dry standing areas, regular hoof trimming, footbaths.',
    contentTn: 'Foot rot ke bolwetse jwa tlhako jo bo tshelanwang thata.',
    treatment: 'Antibiotics (penicillin, oxytetracycline), foot trimming.',
    prevention: 'Dry standing areas, regular hoof trimming, footbaths.',
    symptoms: ['Severe lameness', 'Swelling between toes', 'Foul discharge'],
    tags: ['foot rot', 'lameness', 'bacterial'],
    notifiable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 22. Blackleg
  {
    id: 'BLACK-001',
    diseaseCode: 'BLACKLEG',
    titleEn: 'Blackleg',
    titleTn: 'Serotswana (Blackleg)',
    species: 'cattle',
    species_affected: ['Cattle', 'Sheep'],
    key_symptoms_signs: 'Sudden death, lameness, fever, gas-filled muscle swellings.',
    contentEn: 'Blackleg is a highly fatal disease caused by clostridial spores.\n\nSYMPTOMS:\n• Sudden death\n• Lameness\n• Gas-filled muscle swellings\n\nPREVENTION: Vaccination (7-way clostridial).',
    contentTn: 'Blackleg ke bolwetse jo bo bolayang thata.',
    treatment: 'Often too late, high-dose penicillin in early stage.',
    prevention: 'Vaccination (7-way clostridial), avoid contaminated ground.',
    symptoms: ['Sudden death', 'Lameness', 'Fever', 'Gas swellings'],
    tags: ['blackleg', 'clostridial', 'bacterial'],
    notifiable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 23. Tetanus
  {
    id: 'TET-001',
    diseaseCode: 'TETANUS',
    titleEn: 'Tetanus (Lockjaw)',
    titleTn: 'Tetanus',
    species: 'sheep',
    species_affected: ['Sheep', 'Goats', 'Cattle'],
    key_symptoms_signs: 'Muscle stiffness, "sawhorse" stance, third eyelid prolapse.',
    contentEn: 'Tetanus is a frequently fatal disease caused by a neurotoxin.\n\nSYMPTOMS:\n• Muscle stiffness\n• Sawhorse stance\n• Bloat\n\nPREVENTION: Vaccination, clean castration/docking.',
    contentTn: 'Tetanus is a frequently fatal disease.',
    treatment: 'Tetanus antitoxin, high-dose penicillin, dark quiet stall.',
    prevention: 'Vaccination (part of 7-way), clean castration/docking.',
    symptoms: ['Muscle stiffness', 'Sawhorse stance', 'Third eyelid prolapse', 'Bloat'],
    tags: ['tetanus', 'lockjaw', 'clostridial'],
    notifiable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 24. Coccidiosis
  {
    id: 'COCC-001',
    diseaseCode: 'COCCIDIOSIS',
    titleEn: 'Coccidiosis',
    titleTn: 'Coccidiosis',
    species: 'young',
    species_affected: ['Calves', 'Lambs', 'Kids'],
    key_symptoms_signs: 'Watery/bloody diarrhea, straining, dehydration, weight loss.',
    contentEn: 'Coccidiosis is a parasitic disease of the intestinal tract.\n\nSYMPTOMS:\n• Watery/bloody diarrhea\n• Straining\n• Dehydration\n\nPREVENTION: Clean dry bedding, avoid overcrowding.',
    contentTn: 'Coccidiosis is a parasitic disease.',
    treatment: 'Oral coccidiostats (amprolium, toltrazuril), fluid therapy.',
    prevention: 'Clean dry bedding, avoid overcrowding, coccidiostats in feed.',
    symptoms: ['Bloody diarrhea', 'Straining', 'Dehydration', 'Weight loss'],
    tags: ['coccidiosis', 'parasitic', 'diarrhea'],
    notifiable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 25. Scrapie
  {
    id: 'SCRAP-001',
    diseaseCode: 'SCRAPIE',
    titleEn: 'Scrapie',
    titleTn: 'Scrapie',
    species: 'sheep',
    species_affected: ['Sheep', 'Goats'],
    key_symptoms_signs: 'Intense itching (scraping), ataxia (drunken gait), weight loss.',
    contentEn: 'Scrapie is a fatal, degenerative disease affecting the nervous system.\n\nSYMPTOMS:\n• Intense itching\n• Ataxia\n• Weight loss\n\nPREVENTION: Genetic resistance program. REPORTABLE.',
    contentTn: 'Scrapie is a fatal disease.',
    treatment: 'NO TREATMENT - ALWAYS FATAL.',
    prevention: 'REPORTABLE, cull affected/exposed, genetic resistance program.',
    symptoms: ['Intense itching', 'Ataxia', 'Weight loss'],
    tags: ['scrapie', 'prion', 'notifiable'],
    notifiable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 26. OPP/CAE
  {
    id: 'OPP-001',
    diseaseCode: 'OPP_CAE',
    titleEn: 'OPP/CAE',
    titleTn: 'OPP/CAE',
    species: 'sheep',
    species_affected: ['Sheep', 'Goats'],
    key_symptoms_signs: 'Chronic weight loss, pneumonia, arthritis, hard udder.',
    contentEn: 'OPP and CAE are closely related retroviral diseases.\n\nSYMPTOMS:\n• Chronic weight loss\n• Pneumonia\n• Arthritis\n• Hard udder\n\nPREVENTION: Cull positive animals.',
    contentTn: 'OPP/CAE are retroviral diseases.',
    treatment: 'No cure, anti-inflammatories for arthritis.',
    prevention: 'Cull positive animals, pasteurize colostrum/milk.',
    symptoms: ['Chronic weight loss', 'Pneumonia', 'Arthritis', 'Hard udder'],
    tags: ['opp', 'cae', 'retrovirus'],
    notifiable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 27. Milk Fever
  {
    id: 'MILK-001',
    diseaseCode: 'MILK_FEVER',
    titleEn: 'Milk Fever (Hypocalcemia)',
    titleTn: 'Letshoroma la Mashi (Milk Fever)',
    species: 'all',
    species_affected: ['Dairy cattle', 'Sheep', 'Goats'],
    key_symptoms_signs: 'Occurs 24-72 hrs after calving, weakness, recumbency, cold ears.',
    contentEn: 'Milk fever is a metabolic disease caused by low blood calcium levels.\n\nSYMPTOMS:\n• Weakness\n• Recumbency\n• Cold ears\n\nPREVENTION: Low-calcium diet pre-calving.',
    contentTn: 'Letshoroma la mashi ke bolwetse jwa metabolic.',
    treatment: 'Emergency: IV calcium gluconate (vet supervision).',
    prevention: 'Low-calcium diet pre-calving, acidogenic diets.',
    symptoms: ['Weakness', 'Recumbency', 'Cold ears'],
    tags: ['milk fever', 'hypocalcemia', 'metabolic'],
    notifiable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 28. Ketosis
  {
    id: 'KET-001',
    diseaseCode: 'KETOSIS',
    titleEn: 'Ketosis (Acetonemia)',
    titleTn: 'Ketosis',
    species: 'all',
    species_affected: ['Dairy cattle', 'Sheep', 'Goats'],
    key_symptoms_signs: 'Decreased appetite, weight loss, acetone smell on breath, ketones.',
    contentEn: 'Ketosis is a metabolic state associated with high energy demand.\n\nSYMPTOMS:\n• Decreased appetite\n• Acetone smell on breath\n• Ketones in urine/milk\n\nPREVENTION: Ensure adequate energy intake pre-calving.',
    contentTn: 'Ketosis is a metabolic state.',
    treatment: 'IV dextrose, oral propylene glycol, glucocorticoids.',
    prevention: 'Avoid obesity pre-calving, ensure adequate energy intake.',
    symptoms: ['Decreased appetite', 'Weight loss', 'Acetone breath', 'Ketones'],
    tags: ['ketosis', 'metabolic'],
    notifiable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 29. White Muscle Disease
  {
    id: 'WMD-001',
    diseaseCode: 'WHITE_MUSCLE',
    titleEn: 'White Muscle Disease',
    titleTn: 'White Muscle Disease',
    species: 'young',
    species_affected: ['Calves', 'Lambs', 'Kids'],
    key_symptoms_signs: 'Weakness, difficulty standing, stiff gait, sudden death.',
    contentEn: 'White muscle disease is a nutritional myopathy due to selenium/vitamin E deficiency.\n\nSYMPTOMS:\n• Weakness\n• Difficulty standing\n• Stiff gait\n\nPREVENTION: Supplement pregnant dams.',
    contentTn: 'White muscle disease is a nutritional deficiency.',
    treatment: 'Selenium and Vitamin E injection (Bo-Se, Mu-Se).',
    prevention: 'Supplement pregnant dams in deficient soil areas.',
    symptoms: ['Weakness', 'Difficulty standing', 'Stiff gait', 'Sudden death'],
    tags: ['white muscle', 'nutritional', 'deficiency'],
    notifiable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 30. Bloat
  {
    id: 'BLOAT-001',
    diseaseCode: 'BLOAT',
    titleEn: 'Bloat (Ruminal Tympany)',
    titleTn: 'Mpa e e Gologileng (Bloat)',
    species: 'all',
    species_affected: ['Cattle', 'Sheep', 'Goats'],
    key_symptoms_signs: 'Distended left abdomen, breathing difficulty, excessive saliva.',
    contentEn: 'Bloat is an over-distension of the rumen with gas.\n\nSYMPTOMS:\n• Distended left abdomen\n• Breathing difficulty\n• Excessive saliva\n\nPREVENTION: Avoid lush legumes, use bloat blocks.',
    contentTn: 'Mpa e e gologileng ke bothata jwa go ruruga ga mpa.',
    treatment: 'Emergency: stomach tube, trocar/cannula, anti-foaming agents.',
    prevention: 'Avoid lush legumes (alfalfa/clover), bloat blocks.',
    symptoms: ['Distended abdomen', 'Breathing difficulty', 'Excessive saliva'],
    tags: ['bloat', 'digestive', 'emergency'],
    notifiable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 31. Pink Eye
  {
    id: 'PINK-001',
    diseaseCode: 'PINK_EYE',
    titleEn: 'Pink Eye (Infectious Keratoconjunctivitis)',
    titleTn: 'Pink Eye',
    species: 'all',
    species_affected: ['Cattle', 'Sheep', 'Goats'],
    key_symptoms_signs: 'Excessive tearing, squinting, red eye, corneal opacity (blue eye).',
    imageUrl: '/MyFarmData/Cattle_Health/Images/pink_eye.png',
    contentEn: 'Pink eye is an infectious bacterial disease of the eye.\n\nSYMPTOMS:\n• Excessive tearing\n• Squinting\n• Corneal opacity (blue eye)\n\nPREVENTION: Fly control, isolate affected animals.',
    contentTn: 'Pink eye is an infectious disease of the eye.',
    treatment: 'Antibiotic eye ointment, patch eye, keep in dark barn.',
    prevention: 'Fly control, isolate affected, autogenous vaccine.',
    symptoms: ['Excessive tearing', 'Squinting', 'Red eye', 'Corneal opacity'],
    tags: ['pink eye', 'eye', 'bacterial', 'flies'],
    notifiable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 32. Orf
  {
    id: 'ORF-001',
    diseaseCode: 'ORF',
    titleEn: 'Orf (Sore Mouth)',
    titleTn: 'Orf',
    species: 'sheep',
    species_affected: ['Sheep', 'Goats'],
    key_symptoms_signs: 'Crusty scabs on lips, nose, udder; lambs/kids fail to nurse.',
    contentEn: 'Orf is a zoonotic viral disease of sheep and goats.\n\nSYMPTOMS:\n• Crusty scabs on lips and nose\n• Lambs fail to nurse\n\nPREVENTION: Vaccinate lambs, wear gloves.',
    contentTn: 'Orf is a zoonotic viral disease.',
    treatment: 'Self-limiting (3-6 weeks), topical antiseptics.',
    prevention: 'Vaccinate lambs/kids at 1-2 weeks, WEAR GLOVES.',
    symptoms: ['Crusty scabs', 'Fail to nurse', 'Mouth sores'],
    tags: ['orf', 'sore mouth', 'virus', 'zoonotic'],
    notifiable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },

  // 33. Ringworm
  {
    id: 'RING-001',
    diseaseCode: 'RINGWORM',
    titleEn: 'Ringworm (Dermatophytosis)',
    titleTn: 'Dikwaba (Ringworm)',
    species: 'all',
    species_affected: ['Cattle', 'Goats', 'Sheep'],
    key_symptoms_signs: 'Circular gray-white crusty lesions, hair loss in rings.',
    imageUrl: '/MyFarmData/Cattle_Health/Images/ringworm.png',
    contentEn: 'Ringworm is a highly contagious fungal infection of the skin.\n\nSYMPTOMS:\n• Circular gray-white crusty lesions\n• Hair loss in rings\n\nPREVENTION: Wear gloves, disinfect brushes.',
    contentTn: 'Dikwaba ke bolwetse jwa letlalo jo bo tshelanwang.',
    treatment: 'Topical antifungals (enilconazole, lime sulfur).',
    prevention: 'Wear gloves, disinfect brushes/tack, improve nutrition.',
    symptoms: ['Circular lesions', 'Hair loss', 'Crusty skin'],
    tags: ['ringworm', 'fungal', 'skin', 'zoonotic'],
    notifiable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },
];
