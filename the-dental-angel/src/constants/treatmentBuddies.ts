// Treatment Buddies Data
// Stories and support from people who've been through dental procedures

export interface Buddy {
  id: string;
  name: string;
  avatar: string; // Emoji for now
  age: string;
  location: string;
  procedure: ProcedureType;
  procedureDate: string; // e.g., "6 months ago"
  rating: number; // 1-5 stars for their experience
  story: string;
  tips: string[];
  wouldDoAgain: boolean;
}

export type ProcedureType =
  | 'crown'
  | 'root-canal'
  | 'implant'
  | 'extraction'
  | 'wisdom-teeth'
  | 'filling'
  | 'whitening'
  | 'braces'
  | 'deep-cleaning'
  | 'veneer';

export interface ProcedureInfo {
  id: ProcedureType;
  name: string;
  icon: string;
  description: string;
}

export const PROCEDURES: ProcedureInfo[] = [
  {
    id: 'crown',
    name: 'Dental Crown',
    icon: '👑',
    description: 'Caps that cover damaged teeth',
  },
  {
    id: 'root-canal',
    name: 'Root Canal',
    icon: '🦷',
    description: 'Treatment for infected tooth nerves',
  },
  {
    id: 'implant',
    name: 'Dental Implant',
    icon: '🔩',
    description: 'Permanent tooth replacement',
  },
  {
    id: 'extraction',
    name: 'Tooth Extraction',
    icon: '🪥',
    description: 'Tooth removal procedure',
  },
  {
    id: 'wisdom-teeth',
    name: 'Wisdom Teeth',
    icon: '😬',
    description: 'Wisdom tooth removal',
  },
  {
    id: 'filling',
    name: 'Cavity Filling',
    icon: '✨',
    description: 'Filling cavities and decay',
  },
  {
    id: 'whitening',
    name: 'Teeth Whitening',
    icon: '💎',
    description: 'Professional whitening treatment',
  },
  {
    id: 'braces',
    name: 'Braces/Invisalign',
    icon: '😁',
    description: 'Teeth straightening',
  },
  {
    id: 'deep-cleaning',
    name: 'Deep Cleaning',
    icon: '🧹',
    description: 'Scaling and root planing',
  },
  {
    id: 'veneer',
    name: 'Veneers',
    icon: '🌟',
    description: 'Cosmetic tooth covers',
  },
];

export const BUDDIES: Buddy[] = [
  // Crown buddies
  {
    id: 'crown-1',
    name: 'Sarah M.',
    avatar: '👩',
    age: '42',
    location: 'Texas',
    procedure: 'crown',
    procedureDate: '3 months ago',
    rating: 5,
    story:
      "I was so nervous about getting my first crown, but honestly it was easier than I expected! The numbing worked well and I didn't feel any pain during the procedure. The temporary crown was a bit annoying for the two weeks I had it, but the permanent one feels just like my natural tooth.",
    tips: [
      'Ask for the temporary crown to be well-fitted - mine was loose at first',
      'Avoid sticky foods with the temporary',
      "The permanent crown may feel weird for a few days - that's normal",
    ],
    wouldDoAgain: true,
  },
  {
    id: 'crown-2',
    name: 'Michael R.',
    avatar: '👨',
    age: '55',
    location: 'California',
    procedure: 'crown',
    procedureDate: '1 year ago',
    rating: 4,
    story:
      "I've had 3 crowns now and each one has been a smooth experience. The key is finding a good dentist who takes their time. My crown has held up great for over a year with no issues. The only downside was the cost, but it was worth it to save the tooth.",
    tips: [
      'Shop around for prices - they can vary significantly',
      'Ask about different crown materials (porcelain, metal, zirconia)',
      'Get a good dental insurance plan if you can',
    ],
    wouldDoAgain: true,
  },
  {
    id: 'crown-3',
    name: 'Jennifer L.',
    avatar: '👩‍🦰',
    age: '38',
    location: 'Florida',
    procedure: 'crown',
    procedureDate: '6 months ago',
    rating: 4,
    story:
      "I needed a crown after cracking my tooth on a popcorn kernel (be careful!). The procedure itself was fine, but I was surprised by how sensitive the tooth was for the first couple weeks after. My dentist said this is normal and it did go away. Now I can't even tell which tooth has the crown!",
    tips: [
      'Use sensitive toothpaste before and after the procedure',
      "Don't eat anything too hot or cold for the first few days",
      'If sensitivity lasts more than a month, call your dentist',
    ],
    wouldDoAgain: true,
  },

  // Root canal buddies
  {
    id: 'root-canal-1',
    name: 'David K.',
    avatar: '👨‍🦱',
    age: '45',
    location: 'New York',
    procedure: 'root-canal',
    procedureDate: '4 months ago',
    rating: 5,
    story:
      "Root canals have such a bad reputation, but mine was honestly easier than getting a filling! I had been in terrible pain for days before, and the relief after the root canal was immediate. The procedure took about an hour and I felt nothing but some pressure. I wish I hadn't waited so long because of fear.",
    tips: [
      "Don't wait if you have tooth pain - it only gets worse",
      'The procedure is painless with modern anesthesia',
      'Take ibuprofen before the numbing wears off',
      "You'll likely need a crown afterward - budget for both",
    ],
    wouldDoAgain: true,
  },
  {
    id: 'root-canal-2',
    name: 'Lisa T.',
    avatar: '👩‍🦳',
    age: '52',
    location: 'Illinois',
    procedure: 'root-canal',
    procedureDate: '2 months ago',
    rating: 4,
    story:
      "I was terrified going in - I'd heard horror stories. But my endodontist was amazing and walked me through every step. Yes, it's a longer procedure than a filling, but it wasn't painful. The worst part was keeping my mouth open that long! Bring lip balm and take breaks if you need to.",
    tips: [
      'Consider seeing a specialist (endodontist) for complex cases',
      'Ask for a rubber dam - it makes it more comfortable',
      'Bring headphones and listen to something relaxing',
      "Your jaw might be sore from being open - that's normal",
    ],
    wouldDoAgain: true,
  },
  {
    id: 'root-canal-3',
    name: 'Robert J.',
    avatar: '👴',
    age: '63',
    location: 'Arizona',
    procedure: 'root-canal',
    procedureDate: '8 months ago',
    rating: 3,
    story:
      "My experience was okay but not great. The procedure itself was fine, but I had some complications afterward with lingering sensitivity. It took about 3 months for everything to feel normal. That said, I'm glad I saved the tooth rather than extracting it. Just be prepared that healing might take time.",
    tips: [
      'Be patient with recovery - it can take weeks',
      "Don't chew on that side until you get the crown",
      'Report any persistent pain to your dentist',
      "Some sensitivity is normal but sharp pain isn't",
    ],
    wouldDoAgain: true,
  },

  // Implant buddies
  {
    id: 'implant-1',
    name: 'Karen W.',
    avatar: '👱‍♀️',
    age: '58',
    location: 'Colorado',
    procedure: 'implant',
    procedureDate: '1 year ago',
    rating: 5,
    story:
      "Getting an implant was the best dental decision I ever made. Yes, it's a long process (mine took 6 months total), and yes, it's expensive. But now I have a tooth that looks and feels completely natural. I had lost my tooth to an old root canal that failed, and the implant is so much better than dealing with a bridge.",
    tips: [
      'Start saving early - implants are pricey but worth it',
      "The surgery itself is easier than you'd expect",
      'Follow all the post-op instructions carefully',
      'The waiting period for healing is the hardest part',
    ],
    wouldDoAgain: true,
  },
  {
    id: 'implant-2',
    name: 'James H.',
    avatar: '👨‍🦲',
    age: '61',
    location: 'Washington',
    procedure: 'implant',
    procedureDate: '6 months ago',
    rating: 4,
    story:
      "I got an implant to replace a tooth I lost years ago. The procedure was straightforward - the oral surgeon was great. Recovery took about a week before I felt normal. The annoying part was waiting 4 months for the bone to heal before getting the final crown. But now it's like I never lost the tooth!",
    tips: [
      'Ice your face the first day to prevent swelling',
      'Soft foods only for the first week',
      "Don't smoke - it seriously affects healing",
      'Ask about the total timeline upfront',
    ],
    wouldDoAgain: true,
  },

  // Wisdom teeth buddies
  {
    id: 'wisdom-1',
    name: 'Emily C.',
    avatar: '👧',
    age: '23',
    location: 'Massachusetts',
    procedure: 'wisdom-teeth',
    procedureDate: '2 months ago',
    rating: 4,
    story:
      "Had all four wisdom teeth out at once under sedation. I don't remember anything! Woke up loopy and my mom drove me home. The first two days were rough - lots of swelling and I lived on smoothies. By day 5 I was eating soft foods, and by week 2 I was back to normal. Not as bad as I feared!",
    tips: [
      'Stock up on soft foods before: yogurt, applesauce, soup',
      'Frozen peas make great ice packs for your face',
      'Keep your head elevated when sleeping',
      "Don't use straws! Dry socket is no joke",
    ],
    wouldDoAgain: true,
  },
  {
    id: 'wisdom-2',
    name: 'Tyler B.',
    avatar: '👦',
    age: '19',
    location: 'Ohio',
    procedure: 'wisdom-teeth',
    procedureDate: '3 months ago',
    rating: 5,
    story:
      'I was so scared but it was honestly fine! I chose to be awake with just numbing (I wanted to save money on sedation). I felt pressure but no pain. The sounds were weird but my dentist gave me headphones. Recovery was easy - I think being young helped. Was eating normally in about a week.',
    tips: [
      'Local anesthesia is cheaper if you can handle being awake',
      "Take your pain meds on schedule, don't wait for pain",
      'Rinse gently with salt water after 24 hours',
      'Netflix is your friend for recovery days',
    ],
    wouldDoAgain: true,
  },
  {
    id: 'wisdom-3',
    name: 'Amanda P.',
    avatar: '👩‍🦱',
    age: '28',
    location: 'Georgia',
    procedure: 'wisdom-teeth',
    procedureDate: '5 months ago',
    rating: 3,
    story:
      "My lower wisdom teeth were impacted so my recovery was harder than some people's. I had significant swelling for a week and some bruising on my face. It took almost 3 weeks before I felt completely normal. Not trying to scare anyone - impacted teeth are just harder. Still glad I did it!",
    tips: [
      'Impacted teeth = longer recovery, plan accordingly',
      'Take time off work - I needed 4-5 days',
      'Sleep propped up to reduce swelling',
      'Follow up if you have fever or increasing pain',
    ],
    wouldDoAgain: true,
  },

  // Filling buddies
  {
    id: 'filling-1',
    name: 'Chris M.',
    avatar: '👨',
    age: '34',
    location: 'Nevada',
    procedure: 'filling',
    procedureDate: '1 month ago',
    rating: 5,
    story:
      "Just had my first cavity filled as an adult (embarrassing but here we are!). It was so quick and easy - maybe 20 minutes total. The numbing was the worst part, and even that wasn't bad. Modern white fillings look great - you can't even tell I have one.",
    tips: [
      "Don't be embarrassed about cavities - they happen",
      'Composite fillings match your tooth color',
      'Wait for numbness to wear off before eating',
      'Small cavities = small fillings = easier appointments',
    ],
    wouldDoAgain: true,
  },

  // Deep cleaning buddies
  {
    id: 'deep-cleaning-1',
    name: 'Patricia L.',
    avatar: '👩‍🦳',
    age: '56',
    location: 'Michigan',
    procedure: 'deep-cleaning',
    procedureDate: '3 months ago',
    rating: 4,
    story:
      "I was told I needed a deep cleaning for early gum disease. It was more intense than a regular cleaning - they numbed my gums and went below the gum line. They did half my mouth one day and the other half a week later. My gums were sore for a few days but now they're so much healthier!",
    tips: [
      "Don't skip this if your dentist recommends it",
      'Gum disease is reversible if caught early',
      "It's worth the discomfort to keep your teeth",
      "You'll need to step up your home care afterward",
    ],
    wouldDoAgain: true,
  },

  // Whitening buddies
  {
    id: 'whitening-1',
    name: 'Jessica R.',
    avatar: '👩',
    age: '29',
    location: 'California',
    procedure: 'whitening',
    procedureDate: '2 weeks ago',
    rating: 5,
    story:
      "Got professional whitening done for my wedding. Results were amazing - my teeth went several shades whiter in one appointment! I did have some sensitivity that day and the next, but it went away. So much better than the drugstore strips I'd been using for years.",
    tips: [
      'Avoid coffee, wine, and colored foods for a few days after',
      'Sensitivity is normal but temporary',
      'Professional whitening lasts longer than home kits',
      'Take before/after photos - the difference is dramatic!',
    ],
    wouldDoAgain: true,
  },

  // Braces buddies
  {
    id: 'braces-1',
    name: 'Kevin S.',
    avatar: '👨‍🦱',
    age: '35',
    location: 'Oregon',
    procedure: 'braces',
    procedureDate: '6 months ago (ongoing)',
    rating: 4,
    story:
      "I always wanted straight teeth but was too self-conscious for metal braces as an adult. Invisalign was perfect for me - most people don't even notice I'm wearing aligners. Yes, you have to wear them 22 hours a day, but it becomes habit. Already seeing great progress at 6 months!",
    tips: [
      'Invisalign is great for adults but you have to be disciplined',
      'Always carry a toothbrush for after meals',
      'The first few days of new trays are uncomfortable',
      'Results are slower but worth it',
    ],
    wouldDoAgain: true,
  },

  // Veneer buddies
  {
    id: 'veneer-1',
    name: 'Monica D.',
    avatar: '👱‍♀️',
    age: '44',
    location: 'New Jersey',
    procedure: 'veneer',
    procedureDate: '4 months ago',
    rating: 5,
    story:
      "I got 4 veneers on my front teeth to fix staining and some chips. It completely transformed my smile! The process took 2 appointments - prep and then fitting the permanent veneers. They look so natural that even my dentist says they're hard to tell from real teeth.",
    tips: [
      'Choose an experienced cosmetic dentist',
      'Be specific about the shade you want',
      'Temporary veneers can be sensitive',
      "Veneers are permanent - make sure you're ready",
    ],
    wouldDoAgain: true,
  },
];

// Helper functions
export function getBuddiesByProcedure(procedure: ProcedureType): Buddy[] {
  return BUDDIES.filter((buddy) => buddy.procedure === procedure);
}

export function getProcedureInfo(procedure: ProcedureType): ProcedureInfo | undefined {
  return PROCEDURES.find((p) => p.id === procedure);
}

export function getBuddyCount(procedure: ProcedureType): number {
  return BUDDIES.filter((buddy) => buddy.procedure === procedure).length;
}

export function getAllProceduresWithBuddies(): ProcedureInfo[] {
  return PROCEDURES.filter((p) => getBuddyCount(p.id) > 0);
}
