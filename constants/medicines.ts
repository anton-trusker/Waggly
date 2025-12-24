export interface Medicine {
  id: string;
  brandName: string;
  genericName: string;
  type: string;
  petType: 'Dogs' | 'Cats' | 'Dogs and Cats' | 'Other';
  diseaseTreatment: string;
  dosage: string;
  dosageUnit: string;
  administrationRoute: string;
  frequency: string;
  description: string;
  manufacturer: string;
  sideEffects: string;
}

export const MEDICINES: Medicine[] = [
  {
    id: 'baytril',
    brandName: 'Baytril',
    genericName: 'Enrofloxacin',
    type: 'Antibiotic - Fluoroquinolone',
    petType: 'Dogs and Cats',
    diseaseTreatment: 'Bacterial infections (skin; urinary; respiratory)',
    dosage: '5-20',
    dosageUnit: 'mg/kg/day',
    administrationRoute: 'Oral tablet',
    frequency: 'Once daily',
    description: 'Broad-spectrum antibiotic for dermal; urinary and respiratory infections.',
    manufacturer: 'Elanco',
    sideEffects: 'Gastrointestinal upset; photosensitivity; seizures (rare)'
  },
  {
    id: 'clavamox',
    brandName: 'Clavamox',
    genericName: 'Amoxicillin + Clavulanic Acid',
    type: 'Antibiotic - Beta-Lactam',
    petType: 'Dogs and Cats',
    diseaseTreatment: 'Bacterial infections (skin; soft tissue)',
    dosage: '13.75',
    dosageUnit: 'mg/kg',
    administrationRoute: 'Oral tablet/chewable/liquid',
    frequency: 'Every 12 hours',
    description: 'Combination antibiotic effective against Staphylococci and other bacteria.',
    manufacturer: 'Zoetis',
    sideEffects: 'Gastrointestinal upset; allergic reactions; nausea'
  },
  {
    id: 'amoxicillin',
    brandName: 'Amoxicillin',
    genericName: 'Amoxicillin',
    type: 'Antibiotic - Aminopenicillin',
    petType: 'Dogs and Cats',
    diseaseTreatment: 'Bacterial infections; urinary tract infections',
    dosage: '5-12',
    dosageUnit: 'mg/kg',
    administrationRoute: 'Oral',
    frequency: 'Every 12 hours',
    description: 'Broader spectrum penicillin derivative. More resistant to stomach acids.',
    manufacturer: 'Multiple brands',
    sideEffects: 'Gastrointestinal upset; allergic reactions; diarrhea'
  },
  {
    id: 'cephalexin',
    brandName: 'Cephalexin',
    genericName: 'Cephalexin',
    type: 'Antibiotic - First-Generation Cephalosporin',
    petType: 'Dogs and Cats',
    diseaseTreatment: 'Bacterial infections (skin; respiratory; wound)',
    dosage: '15-30',
    dosageUnit: 'mg/kg',
    administrationRoute: 'Oral capsule/tablet',
    frequency: 'Every 6-8 hours',
    description: 'First-generation cephalosporin for superficial/deep pyoderma.',
    manufacturer: 'Multiple brands',
    sideEffects: 'Gastrointestinal upset; allergic reactions'
  },
  {
    id: 'rimadyl',
    brandName: 'Rimadyl',
    genericName: 'Carprofen',
    type: 'NSAID - COX-2 Inhibitor',
    petType: 'Dogs',
    diseaseTreatment: 'Osteoarthritis; post-surgical pain; inflammation',
    dosage: '2',
    dosageUnit: 'mg/kg',
    administrationRoute: 'Oral tablet/chewable',
    frequency: 'Every 12 hours',
    description: 'Non-steroidal anti-inflammatory approved for canine use.',
    manufacturer: 'Zoetis',
    sideEffects: 'Gastrointestinal upset; gastric ulceration; reduced appetite'
  },
  {
    id: 'metacam',
    brandName: 'Metacam',
    genericName: 'Meloxicam',
    type: 'NSAID - COX-2 Inhibitor',
    petType: 'Dogs and Cats',
    diseaseTreatment: 'Osteoarthritis; soft-tissue injury; post-surgical pain',
    dosage: '0.1',
    dosageUnit: 'mg/kg',
    administrationRoute: 'Oral liquid/tablet/injectable',
    frequency: 'Once daily',
    description: 'NSAID for osteoarthritis and orthopedic surgery pain.',
    manufacturer: 'Zoetis',
    sideEffects: 'Gastrointestinal upset; reduced appetite; diarrhea'
  },
  {
    id: 'gabapentin',
    brandName: 'Gabapentin',
    genericName: 'Gabapentin',
    type: 'Gabapentinoid',
    petType: 'Dogs and Cats',
    diseaseTreatment: 'Chronic pain; neuropathic pain; anxiety; pre-visit sedation',
    dosage: '5-30',
    dosageUnit: 'mg/kg',
    administrationRoute: 'Oral capsule/tablet/liquid/powder',
    frequency: 'Every 8-12 hours',
    description: 'For chronic/neuropathic pain and anxiety.',
    manufacturer: 'Multiple brands',
    sideEffects: 'Sedation; ataxia; lethargy'
  },
  {
    id: 'apoquel',
    brandName: 'Apoquel',
    genericName: 'Oclacitinib',
    type: 'JAK Inhibitor',
    petType: 'Dogs',
    diseaseTreatment: 'Atopic dermatitis; pruritus; allergic inflammation',
    dosage: '0.4-0.6',
    dosageUnit: 'mg/kg',
    administrationRoute: 'Oral tablet',
    frequency: 'Twice daily (7-14 days); then once daily',
    description: 'Novel JAK inhibitor for allergy-related itching.',
    manufacturer: 'Zoetis',
    sideEffects: 'Vomiting; diarrhea; pyoderma'
  },
  {
    id: 'bravecto',
    brandName: 'Bravecto',
    genericName: 'Fluralaner',
    type: 'Parasiticide',
    petType: 'Dogs',
    diseaseTreatment: 'Fleas/Ticks',
    dosage: 'Label',
    dosageUnit: 'chew',
    administrationRoute: 'Oral',
    frequency: '12 weeks',
    description: 'Oral chewable flea and tick prevention; kills fleas within 2 hours',
    manufacturer: 'MSD',
    sideEffects: 'Vomiting; diarrhea; lethargy'
  },
  {
    id: 'nexgard',
    brandName: 'NexGard',
    genericName: 'Afoxolaner',
    type: 'Parasiticide',
    petType: 'Dogs',
    diseaseTreatment: 'Fleas/Ticks',
    dosage: 'Label',
    dosageUnit: 'chew',
    administrationRoute: 'Oral',
    frequency: '1 month',
    description: 'Monthly chewable for flea and tick prevention',
    manufacturer: 'Boehringer Ingelheim',
    sideEffects: 'Vomiting; skin irritation'
  },
  {
    id: 'simparica',
    brandName: 'Simparica',
    genericName: 'Sarolaner',
    type: 'Parasiticide',
    petType: 'Dogs',
    diseaseTreatment: 'Fleas/Ticks',
    dosage: 'Label',
    dosageUnit: 'tablet',
    administrationRoute: 'Oral',
    frequency: '1 month',
    description: 'Fast-acting monthly tablet; starts killing parasites within 3 hours',
    manufacturer: 'Zoetis',
    sideEffects: 'Vomiting; diarrhea; lethargy'
  },
  {
    id: 'revolution-plus',
    brandName: 'Revolution Plus',
    genericName: 'Selamectin/Sarolaner',
    type: 'Parasiticide',
    petType: 'Cats',
    diseaseTreatment: 'Fleas/Ticks/Heartworm/Ear Mites/Roundworms/Hookworms',
    dosage: 'Label',
    dosageUnit: 'pipette',
    administrationRoute: 'Topical',
    frequency: '1 month',
    description: 'Enhanced Revolution formula; adds tick protection',
    manufacturer: 'Zoetis',
    sideEffects: 'Application site reactions'
  },
  {
    id: 'cerenia',
    brandName: 'Cerenia',
    genericName: 'Maropitant',
    type: 'Antiemetic',
    petType: 'Dogs and Cats',
    diseaseTreatment: 'Vomiting; nausea; motion sickness',
    dosage: '1',
    dosageUnit: 'mg/kg',
    administrationRoute: 'Oral tablet',
    frequency: 'Once daily',
    description: 'Effective for vomiting but less effective for nausea-associated behaviors.',
    manufacturer: 'Zoetis',
    sideEffects: 'Gastrointestinal upset; decreased appetite'
  },
  {
    id: 'prednisone',
    brandName: 'Prednisone',
    genericName: 'Prednisone',
    type: 'Corticosteroid',
    petType: 'Dogs and Cats',
    diseaseTreatment: 'Inflammation; allergic reactions; autoimmune disease',
    dosage: '0.5-1',
    dosageUnit: 'mg/kg',
    administrationRoute: 'Oral tablet',
    frequency: 'Daily',
    description: 'Potent anti-inflammatory and immunosuppressant.',
    manufacturer: 'Multiple brands',
    sideEffects: 'Increased appetite; increased thirst; urination'
  }
];
