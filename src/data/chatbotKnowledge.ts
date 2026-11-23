import { BUSINESS_INFO, FAQ_ITEMS, PROCESS_STAGES } from './businessData';

export interface BotActionLink {
  label: string;
  to: string;
}

export interface ChatbotResponse {
  text: string;
  links?: BotActionLink[];
  showContactActions?: boolean;
  followUps?: string[];
}

interface KnowledgeTopic {
  id: string;
  keywords: string[];
  phrases?: string[];
  priority?: number;
  respond: (email: string) => ChatbotResponse;
}

export const INITIAL_QUICK_QUESTIONS: string[] = [
  'All Services',
  'Aluminium Works',
  'Glass Partitions',
  'UPVC Windows & Doors',
  'Ceilings & Interiors',
  'Railings & ACP',
  'Request a Quote',
  'Contact Details',
];

const KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  {
    id: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'hii', 'namaste', 'good morning', 'good afternoon', 'good evening'],
    priority: 1,
    respond: () => ({
      text: `Hello! Welcome to ${BUSINESS_INFO.displayName} — "${BUSINESS_INFO.tagline}"\n\nI can answer questions about our Aluminium Works, Glass Partitions, UPVC Windows & Doors, Gypsum & Grid Ceilings, Railings, ACP Cladding, Workstations, or how to request a quotation. What are you looking for today?`,
      followUps: ['All Services', 'Aluminium Works', 'Glass Partitions', 'Request a Quote'],
    }),
  },
  {
    id: 'thanks',
    keywords: ['thank', 'thanks', 'thx', 'bye', 'goodbye', 'ok thanks', 'great'],
    priority: 1,
    respond: () => ({
      text: `You're welcome! Whenever you're ready to discuss your project dimensions or material options, our team at ${BUSINESS_INFO.displayName} is just a call or WhatsApp message away.`,
      showContactActions: true,
      followUps: ['Explore Gallery', 'Contact Details'],
    }),
  },
  {
    id: 'all_services',
    phrases: ['all services', 'what services', 'what do you do', 'what do you offer', 'services list', 'our services', 'explore services'],
    keywords: ['services', 'offerings', 'offer', 'categories', 'solutions', 'portfolio'],
    priority: 3,
    respond: () => ({
      text: `${BUSINESS_INFO.displayName} offers complete architectural fabrication and interior execution across six core divisions:\n\n• Aluminium Works — windows, doors, French windows, partitions, profile cupboards, workstations & custom fabrication\n• Glass Works — 12 mm & 45x25 glass partitions, aluminium glass partitions, glass elevations & railings\n• UPVC Windows & Doors — UPVC windows, doors & customized UPVC solutions\n• Interior & Ceiling Works — gypsum ceilings & partitions, grid & 2x2 grid ceilings, ACP, painting & workstations\n• Railings & Metal Works — SS, glass, aluminium & aluminium-glass railings, plus MS works\n• Additional Works — Black NDS curtains, electrical works & tailored fabrication`,
      links: [{ label: 'View All Services', to: '/services' }],
      followUps: ['Aluminium Works', 'Glass Partitions', 'UPVC Windows & Doors', 'Request a Quote'],
    }),
  },
  {
    id: 'glass_12mm_45x25',
    phrases: ['12mm', '12 mm', '45x25', '45 x 25', 'glass partition', 'glass partitions', 'office glass', 'cabin glass', 'glass elevation', 'glass work', 'glass works'],
    keywords: ['glass', 'partition', 'partitions', 'elevation', 'elevations', 'frameless', 'toughened', 'glazing'],
    priority: 5,
    respond: () => ({
      text: `Our Glass Works division handles residential, office, and commercial glazing with clean architectural detailing:\n\n• 12 mm Glass Partitions (popular for cabins, conference rooms & commercial lobbies)\n• 45x25 Glass Partition Systems (slimline architectural perimeter framing)\n• Aluminium Glass Partitions\n• Glass Elevations & Exterior Facades\n• Glass Railings & All Types of Glass Installation Works`,
      links: [
        { label: 'Explore Glass Works', to: '/services/glass-works' },
        { label: 'View Glass Gallery', to: '/gallery' },
      ],
      showContactActions: true,
      followUps: ['Aluminium Works', 'Railings & ACP', 'Request a Quote'],
    }),
  },
  {
    id: 'aluminium_works',
    phrases: ['aluminium works', 'aluminium work', 'aluminum works', 'aluminium window', 'aluminium windows', 'aluminium door', 'aluminium doors', 'french window', 'french windows', 'profile cupboard', 'aluminium cupboard', 'aluminium partition'],
    keywords: ['aluminium', 'aluminum', 'french', 'cupboard', 'cupboards', 'sliding', 'fabrication', 'extrusion'],
    priority: 5,
    respond: () => ({
      text: `Our Aluminium Works division covers precision fabrication for homes, offices, and commercial spaces:\n\n• Aluminium Windows & Aluminium Doors\n• Aluminium French Windows (expansive floor-to-ceiling openings)\n• Aluminium Partitions & Aluminium Glass Partitions\n• Aluminium Profile Cupboard Works (wardrobes, kitchens & display cabinets)\n• Aluminium Workstations & Customized Aluminium Fabrication`,
      links: [
        { label: 'Explore Aluminium Works', to: '/services/aluminium-works' },
        { label: 'View Gallery', to: '/gallery' },
      ],
      showContactActions: true,
      followUps: ['Glass Partitions', 'UPVC Windows & Doors', 'Request a Quote'],
    }),
  },
  {
    id: 'upvc_works',
    phrases: ['upvc windows', 'upvc doors', 'upvc window', 'upvc door', 'upvc solutions'],
    keywords: ['upvc', 'u-pvc', 'casement', 'balcony door'],
    priority: 5,
    respond: () => ({
      text: `Our UPVC Windows & Doors division provides weather-tight, clean-lined installations tailored to site dimensions:\n\n• UPVC Windows (sliding, casement & custom configurations)\n• UPVC Doors (balcony, patio & interior/exterior access)\n• Customized UPVC Solutions matched to your architectural openings`,
      links: [{ label: 'Explore UPVC Windows & Doors', to: '/services/upvc-windows-doors' }],
      showContactActions: true,
      followUps: ['Aluminium Works', 'Request a Quote', 'Contact Details'],
    }),
  },
  {
    id: 'ceiling_interior',
    phrases: ['gypsum ceiling', 'gypsum ceilings', 'false ceiling', 'grid ceiling', '2x2 grid', '2x2 ceiling', 'gypsum partition', 'paint works', 'painting', 'interior works', 'wooden workstation', 'workstations'],
    keywords: ['gypsum', 'ceiling', 'ceilings', 'grid', '2x2', 'paint', 'painting', 'interior', 'interiors', 'workstation', 'workstations', 'wooden'],
    priority: 5,
    respond: () => ({
      text: `Our Interior & Ceiling Works division transforms residential and commercial interiors end-to-end:\n\n• Gypsum Ceilings & Gypsum Partitions\n• Grid Ceilings & 2x2 Modular Grid Ceilings\n• ACP Works & Cladding\n• All Types of Paint Works\n• Aluminium Workstations & Wooden Workstations`,
      links: [{ label: 'Explore Interior & Ceiling Works', to: '/services/interior-ceiling-works' }],
      showContactActions: true,
      followUps: ['Black NDS Curtains & Electrical', 'Railings & ACP', 'Request a Quote'],
    }),
  },
  {
    id: 'railings_acp_metal',
    phrases: ['ss railing', 'ss railings', 'glass railing', 'glass railings', 'aluminium railing', 'aluminium railings', 'ms works', 'ms work', 'acp works', 'acp cladding', 'metal works', 'balcony railing', 'staircase railing'],
    keywords: ['railing', 'railings', 'balustrade', 'stainless', 'ss', 'ms', 'acp', 'cladding', 'metal', 'steel', 'staircase', 'balcony', 'canopy'],
    priority: 5,
    respond: () => ({
      text: `Our Railings, ACP & Metal Works cover both exterior architectural cladding and structural safety:\n\n• SS Railings (stainless steel staircases & balconies)\n• Glass Railings & Aluminium Glass Railings\n• Aluminium Railings\n• ACP Cladding & Facade Works\n• MS Works & Customized Metal Fabrication`,
      links: [{ label: 'Explore Railings & Metal Works', to: '/services/railings-metal-works' }],
      showContactActions: true,
      followUps: ['Glass Partitions', 'Aluminium Works', 'Request a Quote'],
    }),
  },
  {
    id: 'additional_services',
    phrases: ['black nds', 'nds curtains', 'curtains', 'electrical works', 'electrical work', 'additional services', 'custom fabrication', 'customized work'],
    keywords: ['curtain', 'curtains', 'nds', 'electrical', 'electric', 'lighting', 'wiring', 'custom', 'customized'],
    priority: 5,
    respond: () => ({
      text: `Alongside our core aluminium, glass, UPVC, ceiling, and railing divisions, we also execute:\n\n• Black NDS Curtains (clean light-control drapery for offices & residences)\n• Electrical Works (lighting & interior coordination)\n• Aluminium Profile Cupboard Works\n• Customized Interior & Architectural Fabrication tailored to your drawings and site dimensions`,
      links: [{ label: 'View Additional Services', to: '/services#additional-services' }],
      showContactActions: true,
      followUps: ['Ceilings & Interiors', 'Request a Quote'],
    }),
  },
  {
    id: 'quote_pricing',
    phrases: ['how much', 'request a quote', 'get a quote', 'free quote', 'per sq ft', 'sq ft', 'sqft', 'price list', 'site visit'],
    keywords: ['quote', 'quotation', 'price', 'prices', 'pricing', 'cost', 'costs', 'rate', 'rates', 'estimate', 'budget', 'charges', 'visit', 'book', 'enquiry', 'inquiry'],
    priority: 6,
    respond: (email) => ({
      text: `Because every project depends on exact opening sizes, glass/profile selection, finish, and site conditions, we prepare quotations directly after discussing your requirements.\n\nTo get a prompt estimate:\n1. Call us on 9700110084 or 7013248518\n2. Message us directly on WhatsApp with your service requirement & site location\n3. Email us at ${email} or submit the online Contact form`,
      links: [{ label: 'Open Quotation Form', to: '/contact#enquiry-form' }],
      showContactActions: true,
      followUps: ['How Does the Process Work?', 'All Services'],
    }),
  },
  {
    id: 'contact_info',
    phrases: ['contact details', 'phone number', 'mobile number', 'call you', 'whatsapp number', 'email address', 'how to contact', 'reach you'],
    keywords: ['contact', 'phone', 'call', 'number', 'whatsapp', 'email', 'mail', 'gmail', 'reach', 'talk', 'speak'],
    priority: 6,
    respond: (email) => ({
      text: `You can reach ${BUSINESS_INFO.displayName} directly through any of our official channels:\n\n• Phone: 9700110084 / 7013248518\n• Email: ${email}\n• WhatsApp: Direct chat available below\n• GSTIN: ${BUSINESS_INFO.gstin}`,
      links: [{ label: 'Go to Contact Page', to: '/contact' }],
      showContactActions: true,
      followUps: ['Request a Quote', 'All Services'],
    }),
  },
  {
    id: 'gstin_about',
    phrases: ['gst number', 'gstin', 'about us', 'about company', 'who are you', 'company details', 'why choose'],
    keywords: ['gst', 'gstin', 'tax', 'about', 'company', 'imperial', 'trust', 'quality', 'registered'],
    priority: 4,
    respond: (email) => ({
      text: `${BUSINESS_INFO.name} ("${BUSINESS_INFO.tagline}") is a GST-registered architectural fabrication and interior execution practice (GSTIN: ${BUSINESS_INFO.gstin}).\n\nWe bring aluminium fabrication, architectural glass works, UPVC windows & doors, gypsum & grid ceilings, railings, ACP cladding, workstations, and custom metalwork under one coordinated team.\n\nOfficial Email: ${email}`,
      links: [{ label: 'Read About Us', to: '/about' }],
      showContactActions: true,
      followUps: ['How Does the Process Work?', 'All Services', 'Explore Gallery'],
    }),
  },
  {
    id: 'process_steps',
    phrases: ['how does the process work', 'how do you work', 'work process', 'project steps', 'enquiry process'],
    keywords: ['process', 'steps', 'workflow', 'stages', 'execution', 'installation', 'timeline'],
    priority: 4,
    respond: () => {
      const stagesText = PROCESS_STAGES.map(
        (stage) => `${stage.step}. ${stage.title} — ${stage.description}`
      ).join('\n');
      return {
        text: `Here is how every project moves smoothly with ${BUSINESS_INFO.displayName}:\n\n${stagesText}`,
        links: [{ label: 'Start an Enquiry', to: '/contact#enquiry-form' }],
        showContactActions: true,
        followUps: ['Request a Quote', 'All Services'],
      };
    },
  },
  {
    id: 'gallery_3d',
    phrases: ['explore gallery', 'see photos', 'our work', '3d model', '360 view', 'project photos'],
    keywords: ['gallery', 'photos', 'images', 'projects', 'samples', 'showcase', 'work', '3d', 'model'],
    priority: 4,
    respond: () => ({
      text: `You can explore our architectural visual showcase on the Gallery page — filterable by Aluminium, Glass, UPVC, Ceilings, ACP, Railings, Metal Works, and Interiors — or interact with the 360° 3D Pavilion right on the Home page to inspect finishes, sliding doors, and fabrication layers.`,
      links: [
        { label: 'Open Project Gallery', to: '/gallery' },
        { label: 'View 360° 3D Model on Home', to: '/' },
      ],
      followUps: ['All Services', 'Request a Quote'],
    }),
  },
  {
    id: 'privacy',
    keywords: ['privacy', 'policy', 'data', 'terms'],
    priority: 3,
    respond: () => ({
      text: `We use enquiry details solely to understand your project requirements and follow up with you. We never sell or rent customer contact details to third parties.`,
      links: [{ label: 'Read Privacy Policy', to: '/privacy-policy' }],
      followUps: ['Contact Details', 'All Services'],
    }),
  },
];

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getChatbotReply(rawInput: string, activeEmail?: string): ChatbotResponse {
  const email = activeEmail?.trim() || BUSINESS_INFO.email;
  const normalized = normalizeText(rawInput);

  if (!normalized) {
    return {
      text: `Please type a question or pick one of the quick topics below to learn about ${BUSINESS_INFO.displayName}.`,
      followUps: INITIAL_QUICK_QUESTIONS.slice(0, 4),
    };
  }

  const tokens = normalized.split(' ');

  let bestTopic: KnowledgeTopic | null = null;
  let bestScore = 0;

  for (const topic of KNOWLEDGE_TOPICS) {
    let score = 0;

    if (topic.phrases) {
      for (const phrase of topic.phrases) {
        if (normalized.includes(phrase)) {
          score += 12 + (topic.priority ?? 1);
        }
      }
    }

    for (const kw of topic.keywords) {
      if (kw.includes(' ')) {
        if (normalized.includes(kw)) {
          score += 8 + (topic.priority ?? 1);
        }
      } else if (tokens.includes(kw)) {
        score += 6 + (topic.priority ?? 1);
      } else if (kw.length >= 4 && normalized.includes(kw)) {
        score += 3;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }

  if (bestTopic && bestScore > 0) {
    return bestTopic.respond(email);
  }

  // Secondary check against FAQ_ITEMS token overlap
  let bestFaqScore = 0;
  let bestFaq = FAQ_ITEMS[0];
  for (const faq of FAQ_ITEMS) {
    const faqNorm = normalizeText(`${faq.question} ${faq.answer}`);
    let overlap = 0;
    for (const token of tokens) {
      if (token.length >= 3 && faqNorm.includes(token)) {
        overlap += 1;
      }
    }
    if (overlap > bestFaqScore) {
      bestFaqScore = overlap;
      bestFaq = faq;
    }
  }

  if (bestFaqScore >= 2) {
    return {
      text: bestFaq.answer,
      showContactActions: true,
      links: [{ label: 'Explore Services', to: '/services' }],
      followUps: ['All Services', 'Request a Quote', 'Contact Details'],
    };
  }

  return {
    text: `Thank you for asking! I can help with information on ${BUSINESS_INFO.displayName}'s Aluminium Works, 12 mm & 45x25 Glass Partitions, UPVC Windows & Doors, Gypsum & 2x2 Grid Ceilings, Railings, ACP Cladding, MS Fabrication, Workstations, and Quotations.\n\nFor specific site measurements or custom queries, please connect directly with our team on 9700110084 / 7013248518, email ${email}, or WhatsApp below.`,
    links: [
      { label: 'Explore All Services', to: '/services' },
      { label: 'Submit Enquiry', to: '/contact#enquiry-form' },
    ],
    showContactActions: true,
    followUps: ['All Services', 'Glass Partitions', 'Aluminium Works', 'Request a Quote'],
  };
}
