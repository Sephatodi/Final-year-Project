// db/diseaseDataComprehensive.js

export const comprehensiveDiseaseData = [
  {
    id: 'FMD-001',
    diseaseCode: 'FMD',
    titleEn: 'Foot and Mouth Disease',
    titleTn: 'Bolwetse jwa FMD',
    contentEn: `Foot and Mouth Disease is a highly contagious viral disease affecting cloven-hoofed animals.

SYMPTOMS:
• Excessive salivation
• Lameness
• Blisters on mouth and feet
• Fever
• Reduced milk production

TREATMENT:
• No specific antiviral treatment
• Isolate affected animals
• Supportive care
• Report to veterinary services immediately

PREVENTION:
• Vaccination every 6 months
• Quarantine new animals
• Biosecurity measures
• Movement restrictions during outbreaks

NOTIFIABLE: YES - Mandatory reporting`,
    contentTn: `Bolwetse jwa FMD ke bolwetse jo o ka bonang mo diphologolong.

MATSHWAO:
• Mate a a oketsegileng
• Kgweetsana
• Marontho mo molomong le maotong
• Go ruruha
• Phokotsego ya masi

KALAFO:
• Ga go na kalafo ya virus
• Kgaola diphologolo tse di lwalang
• Tlhokomelo
• Itsise ngaka ya diphologolo

TSHIRELETSO:
• Enta mongwe le mongwe dikgwedi di le 6
• Kgaola diphologolo tse disha
• Tshireletso ya polokelo`,
    species: 'all',
    symptoms: ['Excessive salivation', 'Lameness', 'Blisters on mouth', 'Blisters on feet', 'Fever'],
    treatment: 'Isolate, supportive care, report to DVS',
    prevention: 'Vaccination every 6 months, quarantine new animals, biosecurity',
    notifiable: true,
    images: [],
    tags: ['fmd', 'foot and mouth', 'contagious', 'virus'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },
  {
    id: 'HEART-001',
    diseaseCode: 'HEARTWATER',
    titleEn: 'Heartwater Disease',
    titleTn: 'Bolwetse jwa Pelo',
    contentEn: `Heartwater is a tick-borne disease affecting cattle, goats, and sheep.

SYMPTOMS:
• High fever (41-42°C)
• Difficulty breathing
• Nervous signs: circling, tremors
• Convulsions in later stages
• Death within 24-48 hours

TREATMENT:
• Oxytetracycline injection
• Early treatment critical
• Supportive care

PREVENTION:
• Regular tick control
• Vaccination available
• Pasture rotation

NOTIFIABLE: YES`,
    contentTn: `Bolwetse jwa Pelo ke bolwetse jo o ka bonang mo ditsheng.

MATSHWAO:
• Go ruruha thata
• Phefumololo e e thata
• Ditshwanelo tsa methapo
• Go oma

KALAFO:
• Enta ya Oxytetracycline
• Kalafo ya bonako
• Tlhokomelo

TSHIRELETSO:
• Laola matshenekegedi
• Enta e a le teng
• Fetola mafelo a didibo`,
    species: 'all',
    symptoms: ['High fever', 'Difficulty breathing', 'Circling', 'Tremors', 'Convulsions'],
    treatment: 'Oxytetracycline injection, supportive care',
    prevention: 'Tick control, vaccination, pasture rotation',
    notifiable: true,
    images: [],
    tags: ['heartwater', 'tick', 'fever', 'cattle', 'goat', 'sheep'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  }
  // Add more diseases as needed
];