// Video Library Data
// Curated dental education topics - links to YouTube search results

export interface Video {
  id: string;
  title: string;
  description: string;
  duration: string; // Approximate
  category: VideoCategory;
  searchQuery: string; // YouTube search query
  tags: string[];
}

export type VideoCategory = 'common' | 'preventive' | 'cosmetic' | 'emergency' | 'kids';

export interface CategoryInfo {
  id: VideoCategory;
  title: string;
  icon: string; // Ionicons name
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'common',
    title: 'Common Procedures',
    icon: 'medical-outline',
    description: 'Crowns, root canals, fillings & more',
  },
  {
    id: 'preventive',
    title: 'Preventive Care',
    icon: 'shield-checkmark-outline',
    description: 'Cleanings, X-rays & checkups',
  },
  {
    id: 'cosmetic',
    title: 'Cosmetic Dentistry',
    icon: 'sparkles-outline',
    description: 'Whitening, veneers & smile makeovers',
  },
  {
    id: 'emergency',
    title: 'Dental Emergencies',
    icon: 'warning-outline',
    description: 'What to do when problems arise',
  },
  {
    id: 'kids',
    title: 'Kids & Families',
    icon: 'people-outline',
    description: 'Pediatric dental care',
  },
];

// Helper to create YouTube search URL
export function getYouTubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

// Curated dental education topics
export const VIDEOS: Video[] = [
  // Common Procedures
  {
    id: 'crown-explained',
    title: 'What is a Dental Crown?',
    description:
      'Learn why crowns are recommended, what the procedure involves, and how long they last.',
    duration: '3-5 min',
    category: 'common',
    searchQuery: 'dental crown procedure explained patient education',
    tags: ['crown', 'cap', 'tooth restoration'],
  },
  {
    id: 'root-canal-explained',
    title: 'Root Canal Treatment',
    description: "What really happens during a root canal? It's not as scary as you think!",
    duration: '4-6 min',
    category: 'common',
    searchQuery: 'root canal treatment explained animation',
    tags: ['root canal', 'endodontic', 'tooth pain'],
  },
  {
    id: 'filling-explained',
    title: 'Dental Fillings Explained',
    description: 'Everything you need to know about cavity fillings, from composite to amalgam.',
    duration: '2-4 min',
    category: 'common',
    searchQuery: 'dental filling procedure explained patient',
    tags: ['filling', 'cavity', 'composite', 'amalgam'],
  },
  {
    id: 'extraction-explained',
    title: 'Tooth Extraction',
    description: 'When extractions are needed and what to expect during recovery.',
    duration: '4-6 min',
    category: 'common',
    searchQuery: 'tooth extraction procedure what to expect',
    tags: ['extraction', 'tooth removal', 'wisdom teeth'],
  },
  {
    id: 'implant-explained',
    title: 'Dental Implants 101',
    description: 'How dental implants work, the procedure timeline, and who is a good candidate.',
    duration: '5-7 min',
    category: 'common',
    searchQuery: 'dental implant procedure explained animation',
    tags: ['implant', 'tooth replacement', 'titanium'],
  },
  {
    id: 'bridge-explained',
    title: 'Dental Bridges',
    description: 'Learn about dental bridges - types, procedure, and care instructions.',
    duration: '3-5 min',
    category: 'common',
    searchQuery: 'dental bridge procedure explained',
    tags: ['bridge', 'missing tooth', 'pontic'],
  },
  {
    id: 'wisdom-teeth',
    title: 'Wisdom Teeth Removal',
    description: 'Why wisdom teeth often need removal and what recovery is like.',
    duration: '4-6 min',
    category: 'common',
    searchQuery: 'wisdom teeth removal surgery explained',
    tags: ['wisdom teeth', 'extraction', 'impacted'],
  },

  // Preventive Care
  {
    id: 'cleaning-explained',
    title: 'Professional Teeth Cleaning',
    description: 'What happens during a dental cleaning and why regular cleanings matter.',
    duration: '3-5 min',
    category: 'preventive',
    searchQuery: 'professional dental cleaning explained',
    tags: ['cleaning', 'hygiene', 'prophylaxis'],
  },
  {
    id: 'xray-explained',
    title: 'Understanding Dental X-Rays',
    description: 'Types of dental X-rays, what they show, and safety information.',
    duration: '3-5 min',
    category: 'preventive',
    searchQuery: 'dental x-ray types explained patient education',
    tags: ['x-ray', 'radiograph', 'bitewing', 'panoramic'],
  },
  {
    id: 'gum-disease-explained',
    title: 'Gum Disease Prevention',
    description: 'Recognize the signs of gum disease and learn how to prevent it.',
    duration: '4-6 min',
    category: 'preventive',
    searchQuery: 'gum disease gingivitis prevention explained',
    tags: ['gum disease', 'periodontal', 'gingivitis'],
  },
  {
    id: 'brushing-technique',
    title: 'Proper Brushing Technique',
    description: 'Are you brushing correctly? Learn the technique dentists recommend.',
    duration: '2-3 min',
    category: 'preventive',
    searchQuery: 'proper tooth brushing technique dentist',
    tags: ['brushing', 'oral hygiene', 'technique'],
  },
  {
    id: 'flossing-importance',
    title: 'How to Floss Properly',
    description: 'The importance of flossing and the correct technique.',
    duration: '2-3 min',
    category: 'preventive',
    searchQuery: 'how to floss teeth properly dentist',
    tags: ['flossing', 'oral hygiene', 'interdental'],
  },
  {
    id: 'deep-cleaning',
    title: 'Deep Cleaning (Scaling)',
    description: 'What is a deep cleaning and when is it needed?',
    duration: '4-5 min',
    category: 'preventive',
    searchQuery: 'dental deep cleaning scaling root planing explained',
    tags: ['deep cleaning', 'scaling', 'periodontal'],
  },

  // Cosmetic Dentistry
  {
    id: 'whitening-explained',
    title: 'Teeth Whitening Options',
    description: 'Compare professional whitening vs. over-the-counter products.',
    duration: '4-6 min',
    category: 'cosmetic',
    searchQuery: 'teeth whitening options professional vs home',
    tags: ['whitening', 'bleaching', 'cosmetic'],
  },
  {
    id: 'veneers-explained',
    title: 'Dental Veneers',
    description: 'What are veneers, who should get them, and what to expect.',
    duration: '5-7 min',
    category: 'cosmetic',
    searchQuery: 'dental veneers procedure explained before after',
    tags: ['veneers', 'porcelain', 'smile makeover'],
  },
  {
    id: 'bonding-explained',
    title: 'Dental Bonding',
    description: 'A quick, affordable way to fix chipped or discolored teeth.',
    duration: '3-4 min',
    category: 'cosmetic',
    searchQuery: 'dental bonding procedure explained',
    tags: ['bonding', 'composite', 'chipped tooth'],
  },
  {
    id: 'invisalign-explained',
    title: 'Invisalign Clear Aligners',
    description: 'How clear aligners work to straighten teeth without metal braces.',
    duration: '4-6 min',
    category: 'cosmetic',
    searchQuery: 'invisalign clear aligners how it works',
    tags: ['invisalign', 'clear aligners', 'orthodontics'],
  },
  {
    id: 'smile-makeover',
    title: 'Smile Makeover Options',
    description: 'Overview of cosmetic dentistry options for transforming your smile.',
    duration: '5-7 min',
    category: 'cosmetic',
    searchQuery: 'smile makeover cosmetic dentistry options',
    tags: ['smile makeover', 'cosmetic', 'transformation'],
  },

  // Emergency
  {
    id: 'toothache-help',
    title: 'Toothache Relief',
    description: 'What to do when you have tooth pain and when to see a dentist.',
    duration: '3-5 min',
    category: 'emergency',
    searchQuery: 'toothache relief home remedies when to see dentist',
    tags: ['toothache', 'pain', 'emergency'],
  },
  {
    id: 'knocked-out-tooth',
    title: 'Knocked Out Tooth',
    description: 'Critical steps to potentially save a knocked-out permanent tooth.',
    duration: '2-4 min',
    category: 'emergency',
    searchQuery: 'knocked out tooth what to do save tooth',
    tags: ['avulsed tooth', 'trauma', 'emergency'],
  },
  {
    id: 'broken-tooth',
    title: 'Broken or Chipped Tooth',
    description: 'What to do immediately if you chip or break a tooth.',
    duration: '3-4 min',
    category: 'emergency',
    searchQuery: 'broken chipped tooth what to do emergency',
    tags: ['broken tooth', 'chipped', 'emergency'],
  },
  {
    id: 'abscess-explained',
    title: 'Dental Abscess',
    description: 'Recognize the signs of a dental abscess and why it needs urgent care.',
    duration: '4-5 min',
    category: 'emergency',
    searchQuery: 'dental abscess symptoms treatment emergency',
    tags: ['abscess', 'infection', 'emergency'],
  },
  {
    id: 'lost-filling',
    title: 'Lost Filling or Crown',
    description: 'What to do when a filling or crown falls out.',
    duration: '2-4 min',
    category: 'emergency',
    searchQuery: 'lost filling crown what to do temporary fix',
    tags: ['lost filling', 'crown fell out', 'temporary'],
  },

  // Kids & Families
  {
    id: 'first-dental-visit',
    title: "Child's First Dental Visit",
    description: 'Prepare your child for their first dentist appointment.',
    duration: '3-5 min',
    category: 'kids',
    searchQuery: 'child first dental visit what to expect prepare',
    tags: ['pediatric', 'first visit', 'children'],
  },
  {
    id: 'baby-teeth-care',
    title: 'Caring for Baby Teeth',
    description: 'Why baby teeth matter and how to keep them healthy.',
    duration: '3-5 min',
    category: 'kids',
    searchQuery: 'baby teeth care importance brushing toddler',
    tags: ['baby teeth', 'primary teeth', 'children'],
  },
  {
    id: 'sealants-explained',
    title: 'Dental Sealants',
    description: "How sealants protect children's teeth from cavities.",
    duration: '2-4 min',
    category: 'kids',
    searchQuery: 'dental sealants for kids explained',
    tags: ['sealants', 'prevention', 'children'],
  },
  {
    id: 'braces-kids',
    title: 'Braces for Kids',
    description: 'When to consider braces, what to expect, and how to care for them.',
    duration: '5-7 min',
    category: 'kids',
    searchQuery: 'braces for kids what to expect orthodontics',
    tags: ['braces', 'orthodontics', 'children'],
  },
  {
    id: 'thumb-sucking',
    title: 'Thumb Sucking Effects',
    description: 'When thumb sucking becomes a concern and how to help your child stop.',
    duration: '3-4 min',
    category: 'kids',
    searchQuery: 'thumb sucking teeth effects how to stop child',
    tags: ['thumb sucking', 'habit', 'children'],
  },
];

// Helper functions
export function getVideosByCategory(category: VideoCategory): Video[] {
  return VIDEOS.filter((video) => video.category === category);
}

export function searchVideos(query: string): Video[] {
  const lowerQuery = query.toLowerCase();
  return VIDEOS.filter(
    (video) =>
      video.title.toLowerCase().includes(lowerQuery) ||
      video.description.toLowerCase().includes(lowerQuery) ||
      video.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getVideoById(id: string): Video | undefined {
  return VIDEOS.find((video) => video.id === id);
}

export function getCategoryInfo(category: VideoCategory): CategoryInfo | undefined {
  return CATEGORIES.find((cat) => cat.id === category);
}
