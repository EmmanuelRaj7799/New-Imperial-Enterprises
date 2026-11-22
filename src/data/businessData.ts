export const BUSINESS_INFO = {
  name: 'NEW IMPERIAL ENTERPRISES',
  displayName: 'New Imperial Enterprises',
  tagline: 'Crafting Spaces. Creating Possibilities.',
  phones: [
    { display: '9700110084', href: 'tel:9700110084', label: 'Primary Phone' },
    { display: '7013248518', href: 'tel:7013248518', label: 'Secondary Phone' },
  ],
  gstin: '36BZUPM1868G1ZQ',
  email: 'amju620@gmail.com',
  whatsappBase: 'https://wa.me/919700110084',
  whatsappDefaultMessage:
    'Hello New Imperial Enterprises, I would like to enquire about your services. Please contact me.',
  logoPath: '/assets/aistudio/Gemini_Generated_Image_hsy9ldhsy9ldhsy9_edited_54561d07.png',
} as const;

export function buildWhatsAppUrl(customMessage?: string): string {
  const msg = customMessage?.trim() || BUSINESS_INFO.whatsappDefaultMessage;
  return `${BUSINESS_INFO.whatsappBase}?text=${encodeURIComponent(msg)}`;
}

export const IMAGES = {
  heroFacade: '/src/assets/images/hero_facade_architecture_1795259488834.jpg',
  aluminiumWindows: '/src/assets/images/aluminium_windows_doors_1795259483946.jpg',
  glassPartitions: '/src/assets/images/glass_office_partitions_1795259611522.jpg',
  upvcWindows: '/src/assets/images/upvc_windows_residence_1795259521417.jpg',
  gypsumCeiling: '/src/assets/images/interior_gypsum_ceiling_1795259516456.jpg',
  glassRailings: '/src/assets/images/glass_ss_railings_1795259495693.jpg',
  acpMetalwork: '/src/assets/images/acp_facade_metalwork_1795259523088.jpg',
  workshopCraft: '/src/assets/images/workshop_fabrication_craft_1795259652300.jpg',
  cupboardsWorkstations: '/src/assets/images/aluminium_cupboards_workstations_1795259554415.jpg',
  blackCurtains: '/src/assets/images/black_curtains_interior_1795259488164.jpg',
} as const;

export interface ServiceItemDetail {
  title: string;
  description: string;
  applications: string[];
  highlights: string[];
}

export interface ServiceCategory {
  slug: string;
  route: string;
  index: string;
  title: string;
  shortTitle: string;
  tagline: string;
  summary: string;
  heroDescription: string;
  seoTitle: string;
  seoDescription: string;
  image: string;
  secondaryImage: string;
  imageAlt: string;
  items: ServiceItemDetail[];
  relatedSlugs: string[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    slug: 'aluminium-works',
    route: '/services/aluminium-works',
    index: '01',
    title: 'Aluminium Works',
    shortTitle: 'Aluminium Works',
    tagline: 'Precision-built frames, partitions, profiles and customized aluminium fabrication.',
    summary:
      'Slim-profile aluminium windows, doors, French windows, partitions, profile cupboards, workstations, and custom fabrication tailored to modern spaces.',
    heroDescription:
      'From architectural aluminium windows and French doors to office partitions, profile cupboards, and tailored workstations, every section is planned for structural neatness and lasting functionality.',
    seoTitle: 'Aluminium Works & Fabrication | New Imperial Enterprises',
    seoDescription:
      'Explore aluminium windows, doors, French windows, aluminium glass partitions, profile cupboards, workstations, and customized aluminium fabrication by New Imperial Enterprises.',
    image: IMAGES.aluminiumWindows,
    secondaryImage: IMAGES.cupboardsWorkstations,
    imageAlt: 'Modern architectural black anodized aluminium French windows and sliding doors in a contemporary residence',
    items: [
      {
        title: 'Aluminium Windows',
        description:
          'Clean-lined sliding, casement, and fixed aluminium window installations designed to bring daylight and balanced ventilation into residential and commercial rooms.',
        applications: ['Residences & Villas', 'Apartments', 'Commercial Offices', 'Institutional Buildings'],
        highlights: ['Clean mitered corners and smooth operating tracks', 'Suited for wide architectural openings', 'Available in customized profile finishes'],
      },
      {
        title: 'Aluminium Doors',
        description:
          'Durable hinged and sliding aluminium door assemblies built for regular daily operation across entrances, balconies, cabins, and commercial spaces.',
        applications: ['Balcony & Patio Access', 'Office Entrances', 'Cabin & Utility Doors', 'Retail Frontages'],
        highlights: ['Balanced frame rigidity with clean alignment', 'Compatible with glass or composite panels', 'Smooth hardware fitment and sealing'],
      },
      {
        title: 'Aluminium Partitions',
        description:
          'Structured aluminium partition systems for dividing floor plans into private cabins, meeting areas, and organized departments with clean visual lines.',
        applications: ['Corporate Workspaces', 'Clinics & Labs', 'Commercial Suites', 'Showrooms'],
        highlights: ['Modular planning suited to site layouts', 'Supports solid, half-glass, or full-height panels', 'Clean concealed perimeter finishing'],
      },
      {
        title: 'Aluminium Glass Partitions',
        description:
          'Slimline aluminium frames paired with architectural glass panes that preserve visual openness while creating defined, functional interior zones.',
        applications: ['Executive Cabins', 'Conference Rooms', 'Studio Floors', 'Reception Areas'],
        highlights: ['Balances daylight flow with spatial division', 'Crisp metallic perimeter detailing', 'Customizable panel grid proportions'],
      },
      {
        title: 'Aluminium French Windows',
        description:
          'Expansive floor-to-ceiling and double-leaf aluminium French windows that open living areas and lounges smoothly toward balconies, courtyards, and terraces.',
        applications: ['Living Rooms', 'Garden & Courtyard Extensions', 'Terrace Suites', 'Luxury Interiors'],
        highlights: ['Generous glass sightlines for natural light', 'Refined architectural symmetry', 'Tailored to site opening dimensions'],
      },
      {
        title: 'Aluminium Profile Cupboard Works',
        description:
          'Contemporary aluminium profile shutters and cupboard frameworks paired with clear, tinted, or fluted glass for wardrobes, kitchens, and display cabinetry.',
        applications: ['Bedroom Wardrobes', 'Modular Kitchens', 'Display Cabinets', 'Executive Storage'],
        highlights: ['Sleek metallic perimeter frames', 'Moisture-resistant architectural profiles', 'Crisp handle and hinge integration'],
      },
      {
        title: 'Aluminium Workstations',
        description:
          'Structured aluminium-framed workstation systems planned for organized, contemporary office layouts with clean desk divisions and wiring pathways.',
        applications: ['IT & Corporate Offices', 'Design Studios', 'Co-working Layouts', 'Commercial Floors'],
        highlights: ['Clean modular bay arrangements', 'Rigid frame support for daily office use', 'Adaptable to compact or open-plan layouts'],
      },
      {
        title: 'Customized Aluminium Fabrication',
        description:
          'Bespoke aluminium architectural fabrication executed to match unique site dimensions, design drawings, and specialized functional requirements.',
        applications: ['Custom Enclosures', 'Architectural Louvers', 'Bespoke Framing', 'Specialized Commercial Fit-outs'],
        highlights: ['Site-measured fabrication approach', 'Flexible detailing for non-standard openings', 'Coordinated finish matching across components'],
      },
    ],
    relatedSlugs: ['glass-works', 'upvc-windows-doors', 'interior-ceiling-works'],
  },
  {
    slug: 'glass-works',
    route: '/services/glass-works',
    index: '02',
    title: 'Glass Works',
    shortTitle: 'Glass Works',
    tagline: 'Architectural transparency through 12 mm partitions, 45x25 systems, elevations and railings.',
    summary:
      '12 mm glass partitions, 45x25 glass partition systems, aluminium glass partitions, architectural glass elevations, glass railings, and complete glass installation works.',
    heroDescription:
      'Architectural glass defines light, openness, and contemporary spatial clarity. We undertake complete glass partition systems, commercial elevations, glass railings, and tailored installation works.',
    seoTitle: 'Glass Partition Works & Elevations | New Imperial Enterprises',
    seoDescription:
      '12 mm glass partitions, 45x25 glass partition systems, aluminium glass partitions, glass elevations, glass railings, and all types of glass installation works.',
    image: IMAGES.glassPartitions,
    secondaryImage: IMAGES.heroFacade,
    imageAlt: 'Executive office interior featuring frameless 12mm glass partitions and slimline 45x25 aluminium glass channels',
    items: [
      {
        title: '12 mm Glass Partitions',
        description:
          'Clean, full-height 12 mm glass partitions crafted for modern boardrooms, executive cabins, retail frontages, and open contemporary interiors.',
        applications: ['Corporate Boardrooms', 'Executive Cabins', 'Retail Showrooms', 'Commercial Lobbies'],
        highlights: ['Uninterrupted sightlines with minimal visual hardware', 'Precision edge alignment and clean silicone joints', 'Compatible with patch fittings and glass doors'],
      },
      {
        title: '45x25 Glass Partition Systems',
        description:
          'Slimline 45x25 framed glass partition systems engineered for sleek architectural borders, clean geometry, and structured office division.',
        applications: ['Modern Office Suites', 'Studio Workspaces', 'Meeting Rooms', 'Interior Corridors'],
        highlights: ['Refined 45x25 slim profile aesthetic', 'Crisp horizontal and vertical framing options', 'Suited for contemporary dark or metallic interiors'],
      },
      {
        title: 'Aluminium Glass Partitions',
        description:
          'Integrated aluminium-and-glass partition installations combining durable metallic framing with luminous glass clarity for residential and commercial layouts.',
        applications: ['Commercial Offices', 'Educational Spaces', 'Healthcare Cabins', 'Residential Study Zones'],
        highlights: ['Balanced structural framing and transparency', 'Custom heights and panel configurations', 'Clean integration with door systems'],
      },
      {
        title: 'Glass Elevations',
        description:
          'Contemporary exterior glass elevation works that create a distinctive architectural facade for commercial buildings, showrooms, and modern residences.',
        applications: ['Commercial Buildings', 'Showroom Frontages', 'Office Complexes', 'Modern Residences'],
        highlights: ['Crisp exterior architectural alignment', 'Coordinated framing and weather sealing', 'Enhances building facade presence'],
      },
      {
        title: 'All Types of Glass Work',
        description:
          'Comprehensive interior and exterior architectural glass works covering fixed glazing, mirrors, cabin enclosures, decorative glass panels, and site-specific glass solutions.',
        applications: ['Residential Interiors', 'Commercial Spaces', 'Hospitality Suites', 'Retail Outlets'],
        highlights: ['Tailored sizing based on on-site measurements', 'Careful handling and clean finishing', 'Versatile glass styles for varied design themes'],
      },
      {
        title: 'Glass Railings',
        description:
          'Minimalist glass railing systems for balconies, staircases, and mezzanines that maintain unobstructed views while outlining clean safety boundaries.',
        applications: ['Balconies & Terraces', 'Internal Staircases', 'Double-Height Mezzanines', 'Commercial Atriums'],
        highlights: ['Clean metallic channel, spigot, or post integration', 'Maintains open visual depth', 'Pairs with SS or aluminium handrails'],
      },
      {
        title: 'Glass Installation Works',
        description:
          'End-to-end site measurement, preparation, hardware alignment, and precision installation for residential and commercial architectural glass applications.',
        applications: ['New Construction Projects', 'Interior Renovations', 'Commercial Fit-Outs', 'Replacement Glazing'],
        highlights: ['Attention to plumb, level, and clearance details', 'Clean silicone and hardware detailing', 'Coordinated scheduling with interior trades'],
      },
    ],
    relatedSlugs: ['aluminium-works', 'railings-metal-works', 'interior-ceiling-works'],
  },
  {
    slug: 'upvc-windows-doors',
    route: '/services/upvc-windows-doors',
    index: '03',
    title: 'UPVC Windows & Doors',
    shortTitle: 'UPVC Windows & Doors',
    tagline: 'Clean-finished UPVC windows, doors and customized architectural fenestration solutions.',
    summary:
      'Modern UPVC windows, UPVC doors, and customized UPVC configurations tailored to residential apartments, villas, and commercial buildings.',
    heroDescription:
      'Clean geometry, smooth multi-track operation, and low-maintenance exterior presentation make UPVC windows and doors a practical choice for contemporary residential and commercial buildings.',
    seoTitle: 'UPVC Windows & Doors | New Imperial Enterprises',
    seoDescription:
      'UPVC windows, UPVC doors, and customized UPVC solutions crafted for modern residential and commercial spaces by New Imperial Enterprises.',
    image: IMAGES.upvcWindows,
    secondaryImage: IMAGES.aluminiumWindows,
    imageAlt: 'Sunlit modern apartment living room with crisp white and anthracite UPVC casement and sliding balcony doors',
    items: [
      {
        title: 'UPVC Windows',
        description:
          'Precision-fitted sliding, casement, top-hung, and fixed UPVC windows offering clean interior lines and smooth daily operation.',
        applications: ['Residential Apartments', 'Independent Homes & Villas', 'Office Facades', 'Hospitality Rooms'],
        highlights: ['Clean corner finishes and snug perimeter closure', 'Low-maintenance wipe-clean surfaces', 'Flexible vent, mesh, and fixed panel layouts'],
      },
      {
        title: 'UPVC Doors',
        description:
          'Sliding and hinged UPVC doors engineered for balconies, terraces, living areas, and utility openings with balanced hardware alignment.',
        applications: ['Balcony Openings', 'Terrace Access', 'Garden & Veranda Doors', 'Interior Partition Entrances'],
        highlights: ['Smooth sliding rollers and secure locking fitment', 'Clean visual match with UPVC window suites', 'Tailored panel widths for spacious openings'],
      },
      {
        title: 'Customized UPVC Solutions',
        description:
          'Site-specific UPVC window and door combinations built to accommodate architectural bays, wide multi-track spans, ventilators, and tailored room layouts.',
        applications: ['Multi-Track Living Room Spans', 'Arch & Corner Combinations', 'Renovation Retrofits', 'Custom Commercial Openings'],
        highlights: ['Measured and planned around exact site openings', 'Flexible frame color and glass pairings', 'Coordinated installation and perimeter sealing'],
      },
    ],
    relatedSlugs: ['aluminium-works', 'glass-works', 'railings-metal-works'],
  },
  {
    slug: 'interior-ceiling-works',
    route: '/services/interior-ceiling-works',
    index: '04',
    title: 'Interior & Ceiling Works',
    shortTitle: 'Interior & Ceiling',
    tagline: 'Gypsum ceilings, 2x2 grid ceilings, ACP applications, workstations and complete paint finishes.',
    summary:
      'Gypsum ceilings & partitions, 2x2 grid ceilings, ACP works, all types of paint works, aluminium and wooden workstations, plus Black NDS curtains and electrical works.',
    heroDescription:
      'Well-executed ceilings, partitions, workstations, surface finishes, and lighting bring architectural spaces together. We coordinate interior and ceiling works for both commercial floors and modern residences.',
    seoTitle: 'Interior, Gypsum Ceiling, Grid Ceiling & ACP Works | New Imperial Enterprises',
    seoDescription:
      'Gypsum ceilings, gypsum partitions, 2x2 grid ceilings, ACP works, paint works, aluminium & wooden workstations, Black NDS curtains, and electrical works.',
    image: IMAGES.gypsumCeiling,
    secondaryImage: IMAGES.cupboardsWorkstations,
    imageAlt: 'Contemporary interior with sculpted multi-level gypsum ceiling cove lighting and 2x2 modular grid ceiling',
    items: [
      {
        title: 'Gypsum Ceilings',
        description:
          'Seamless gypsum false ceilings with clean levels, recessed lighting coves, and crisp perimeter channels tailored to living spaces, lobbies, and offices.',
        applications: ['Living Rooms & Residences', 'Commercial Lobbies', 'Conference Suites', 'Showrooms'],
        highlights: ['Smooth paint-ready seamless surfaces', 'Supports concealed linear and cove lighting', 'Clean custom multi-level profiles'],
      },
      {
        title: 'Gypsum Partitions',
        description:
          'Clean drywall gypsum partition walls constructed for swift, accurate space planning in commercial interiors and residential floor layouts.',
        applications: ['Office Cabins', 'Commercial Interiors', 'Meeting Rooms', 'Residential Room Divisions'],
        highlights: ['Crisp flush wall surfaces ready for painting', 'Clean framing for concealed electrical routing', 'Flexible layout configuration'],
      },
      {
        title: 'Grid Ceilings & 2x2 Grid Ceilings',
        description:
          'Modular grid ceiling installations, including standard 2x2 grid ceilings, ideal for organized commercial interiors requiring neat overhead service access.',
        applications: ['Corporate Offices', 'Retail Floors', 'Clinics & Institutions', 'Commercial Corridors'],
        highlights: ['Uniform modular 2x2 tile alignment', 'Convenient access to overhead lighting and wiring', 'Clean matte ceiling finish'],
      },
      {
        title: 'ACP Works',
        description:
          'Aluminium Composite Panel (ACP) cladding and architectural fascia works for building exteriors, entrance canopies, columns, and contemporary interior accents.',
        applications: ['Building Facades', 'Commercial Signage Backing', 'Entrance Canopies', 'Column Cladding'],
        highlights: ['Sharp geometric groove detailing', 'Weather-ready exterior panel finishes', 'Wide palette of metallic and solid tones'],
      },
      {
        title: 'All Types of Paint Works',
        description:
          'Thorough surface preparation and clean interior & exterior paint application across ceilings, partitions, walls, and renovated spaces.',
        applications: ['Residential Interiors', 'Commercial Offices', 'Exterior Facades', 'Ceiling & Partition Finishing'],
        highlights: ['Smooth putty, priming, and uniform coats', 'Clean edge masking around glass and frames', 'Suited for matte, satin, or textured finishes'],
      },
      {
        title: 'Aluminium & Wooden Workstations',
        description:
          'Functional modular workstations fabricated in aluminium or wood finishes to create organized, comfortable working bays for modern teams.',
        applications: ['Corporate Workfloors', 'Design & Consulting Offices', 'Executive Studios', 'Commercial Fit-Outs'],
        highlights: ['Choice of crisp aluminium or warm wooden builds', 'Planned around desk ergonomics and partitions', 'Clean integration with floor and wall outlets'],
      },
      {
        title: 'Black NDS Curtains',
        description:
          'Architectural Black NDS curtain installations designed for light control, clean vertical drape, and refined visual contrast alongside glass facades and windows.',
        applications: ['Executive Cabins', 'Media & Conference Rooms', 'Modern Residences', 'Hospitality Interiors'],
        highlights: ['Crisp floor-to-ceiling drapery presence', 'Smooth track mounting and alignment', 'Pairs cleanly with dark aluminium and glass'],
      },
      {
        title: 'Electrical Works',
        description:
          'Coordinated interior electrical works supporting ceiling lighting layouts, workstation points, switches, and clean concealed wiring during interior execution.',
        applications: ['False Ceiling Lighting', 'Office Workstations', 'Residential Renovations', 'Commercial Fit-Outs'],
        highlights: ['Planned alongside gypsum and grid ceiling execution', 'Neat fixture alignment and routing', 'Single-team coordination with interior finishes'],
      },
    ],
    relatedSlugs: ['aluminium-works', 'glass-works', 'railings-metal-works'],
  },
  {
    slug: 'railings-metal-works',
    route: '/services/railings-metal-works',
    index: '05',
    title: 'Railings & Metal Works',
    shortTitle: 'Railings & Metal',
    tagline: 'SS railings, glass railings, aluminium railings and custom MS fabrication built with precision.',
    summary:
      'Stainless steel (SS) railings, glass railings, aluminium railings, aluminium glass railings, and customized mild steel (MS) fabrication works.',
    heroDescription:
      'From brushed stainless steel and frameless glass balcony railings to aluminium handrail systems and customized MS metalwork, our fabrication focuses on alignment, finish quality, and dependable structure.',
    seoTitle: 'SS Railings, Glass Railings, Aluminium Railings & MS Works | New Imperial Enterprises',
    seoDescription:
      'Stainless steel railings, glass railings, aluminium railings, aluminium glass railings, and MS fabrication works by New Imperial Enterprises.',
    image: IMAGES.glassRailings,
    secondaryImage: IMAGES.acpMetalwork,
    imageAlt: 'Architectural cantilevered staircase and balcony with toughened glass, stainless steel spigots and aluminium handrail',
    items: [
      {
        title: 'SS Railings',
        description:
          'Clean brushed or polished stainless steel (SS) railing systems crafted for staircases, balconies, ramps, and commercial walkways.',
        applications: ['Internal & External Staircases', 'Residential Balconies', 'Commercial Walkways', 'Terraces'],
        highlights: ['Refined metallic finish and neat weld polishing', 'Clean vertical or horizontal rail profiles', 'Low-maintenance daily durability'],
      },
      {
        title: 'Glass Railings',
        description:
          'Architectural glass railing assemblies offering clear sightlines and refined contemporary styling for balconies, staircases, and mezzanine decks.',
        applications: ['Modern Balconies', 'Duplex Staircases', 'Double-Height Mezzanines', 'Terrace Perimeters'],
        highlights: ['Unobstructed views with crisp safety lines', 'Clean spigot, patch, or base-channel mounting', 'Minimalist architectural aesthetic'],
      },
      {
        title: 'Aluminium Railings',
        description:
          'Sleek, corrosion-resistant aluminium railing profiles finished to match modern window, elevation, and facade architecture.',
        applications: ['Balcony Parapets', 'Exterior Walkways', 'Contemporary Residences', 'Commercial Facades'],
        highlights: ['Crisp anodized or powder-coated finishes', 'Clean concealed fastener appearance', 'Coordinated match with aluminium windows'],
      },
      {
        title: 'Aluminium Glass Railings',
        description:
          'Combined aluminium-and-glass railing systems uniting clean metallic handrail profiles with transparent or tinted glass panels.',
        applications: ['Apartment Balconies', 'Villa Terraces', 'Staircase Landings', 'Commercial Lobbies'],
        highlights: ['Structured aluminium framing with open glass clarity', 'Smooth continuous top handrail geometry', 'Clean architectural integration'],
      },
      {
        title: 'MS Works',
        description:
          'Customized mild steel (MS) metal fabrication covering structural frames, canopies, gates, pergolas, staircase supports, and site-specific architectural metalwork.',
        applications: ['Structural Frames & Supports', 'Pergolas & Canopies', 'Gates & Safety Grills', 'Custom Fabrication'],
        highlights: ['Built to site dimensions and functional loads', 'Clean weld preparation and protective coating', 'Integrates cleanly with glass and ACP systems'],
      },
    ],
    relatedSlugs: ['glass-works', 'aluminium-works', 'interior-ceiling-works'],
  },
];

export const HOME_SERVICE_CARDS = [
  {
    index: '01',
    title: 'Aluminium Works',
    description:
      'Windows, doors, French windows, partitions, profile cupboards, workstations, and customized aluminium fabrication.',
    image: IMAGES.aluminiumWindows,
    imageAlt: 'Aluminium windows and French doors installation',
    route: '/services/aluminium-works',
  },
  {
    index: '02',
    title: 'Glass Works',
    description:
      '12 mm glass partitions, 45x25 partition systems, glass elevations, glass railings, and complete glass installations.',
    image: IMAGES.glassPartitions,
    imageAlt: '12 mm glass partitions and 45x25 architectural office glass system',
    route: '/services/glass-works',
  },
  {
    index: '03',
    title: 'UPVC Windows & Doors',
    description:
      'Clean-finished sliding and casement UPVC windows, balcony doors, and customized architectural UPVC solutions.',
    image: IMAGES.upvcWindows,
    imageAlt: 'Modern sunlit UPVC windows and sliding balcony doors',
    route: '/services/upvc-windows-doors',
  },
  {
    index: '04',
    title: 'Interior & Ceiling Works',
    description:
      'Gypsum ceilings, 2x2 grid ceilings, gypsum partitions, paint works, workstations, Black NDS curtains, and electrical works.',
    image: IMAGES.gypsumCeiling,
    imageAlt: 'Sculpted gypsum ceiling with recessed lighting and 2x2 grid ceiling',
    route: '/services/interior-ceiling-works',
  },
  {
    index: '05',
    title: 'Railings & Metal Works',
    description:
      'Stainless steel railings, glass railings, aluminium railings, aluminium glass railings, and custom MS fabrication.',
    image: IMAGES.glassRailings,
    imageAlt: 'Staircase and balcony with glass, stainless steel, and aluminium railings',
    route: '/services/railings-metal-works',
  },
  {
    index: '06',
    title: 'ACP & Fabrication',
    description:
      'Architectural ACP cladding, facade elevations, customized metal & aluminium fabrication, and tailored exterior finishes.',
    image: IMAGES.acpMetalwork,
    imageAlt: 'Modern commercial building with metallic silver and navy ACP cladding and MS canopy',
    route: '/services/interior-ceiling-works#acp-works',
  },
];

export const ADDITIONAL_SERVICES = [
  {
    title: 'Black NDS Curtains',
    description:
      'Floor-to-ceiling matte black NDS architectural curtains fitted for refined light control and clean visual contrast in modern rooms and executive spaces.',
    route: '/services/interior-ceiling-works',
    image: IMAGES.blackCurtains,
    imageAlt: 'Executive interior featuring floor-to-ceiling Black NDS architectural curtains',
  },
  {
    title: 'Electrical Works',
    description:
      'Coordinated interior electrical wiring, concealed lighting points, and workstation connections aligned seamlessly with ceiling and partition works.',
    route: '/services/interior-ceiling-works',
    image: IMAGES.gypsumCeiling,
    imageAlt: 'Integrated ceiling electrical and recessed linear lighting installation',
  },
  {
    title: 'Aluminium Profile Cupboard Works',
    description:
      'Sleek anodized aluminium profile cupboard shutters and glass wardrobe framing built for modern kitchens, bedrooms, and commercial displays.',
    route: '/services/aluminium-works',
    image: IMAGES.cupboardsWorkstations,
    imageAlt: 'Fluted glass aluminium profile wardrobe cupboards and modular workstations',
  },
  {
    title: 'Customized Interior & Fabrication Solutions',
    description:
      'Site-measured custom combinations across aluminium, glass, UPVC, ACP, MS, woodwork, and ceilings tailored to specific residential or commercial briefs.',
    route: '/contact',
    image: IMAGES.workshopCraft,
    imageAlt: 'Precision architectural aluminium and glass fabrication studio',
  },
];

export const WHY_CHOOSE_US_ITEMS = [
  {
    index: '01',
    title: 'Wide Range of Services',
    description:
      'Aluminium, glass, UPVC, ceilings, railings, ACP, painting, electrical, and MS fabrication coordinated with consistency.',
  },
  {
    index: '02',
    title: 'Quality-Focused Approach',
    description:
      'Careful material selection across profiles, glass thickness, hardware, and surface finishes suited to each application.',
  },
  {
    index: '03',
    title: 'Attention to Detail',
    description:
      'Clean mitered joinery, level alignments, neat silicone lines, and tidy perimeter finishing across every installation.',
  },
  {
    index: '04',
    title: 'Customized Solutions',
    description:
      'Every window, partition, cupboard, railing, or ceiling layout is discussed and planned around exact site requirements.',
  },
  {
    index: '05',
    title: 'Modern Architectural Designs',
    description:
      'Contemporary slimline framing, transparent glass partitioning, and clean ceiling geometry built for today’s spaces.',
  },
  {
    index: '06',
    title: 'Professional Execution',
    description:
      'Structured site measurement, fabrication discipline, and organized installation from initial planning through handover.',
  },
  {
    index: '07',
    title: 'Clear Customer Communication',
    description:
      'Direct discussions via phone or WhatsApp so scope, material options, and site readiness remain transparent.',
  },
  {
    index: '08',
    title: 'Multiple Categories Under One Roof',
    description:
      'Simplifies coordination across facades, partitions, ceilings, workstations, railings, and finishing trades.',
  },
];

export const PROCESS_STAGES = [
  {
    step: '01',
    title: 'Customer Enquiry',
    description:
      'Reach out by phone, WhatsApp, or our online enquiry form with your space type and required services.',
  },
  {
    step: '02',
    title: 'Project Discussion',
    description:
      'We discuss your functional requirements, site conditions, suitable materials, and design possibilities.',
  },
  {
    step: '03',
    title: 'Design & Execution',
    description:
      'Measurements, material selection, and precision fabrication are coordinated to suit your space.',
  },
  {
    step: '04',
    title: 'Installation & Finishing',
    description:
      'Clean on-site fitting, hardware alignment, and final detailing to complete the space neatly.',
  },
];

export type GalleryCategory =
  | 'ALL'
  | 'ALUMINIUM'
  | 'GLASS'
  | 'UPVC'
  | 'INTERIOR'
  | 'CEILING'
  | 'RAILINGS'
  | 'METAL WORKS';

export const GALLERY_FILTERS: GalleryCategory[] = [
  'ALL',
  'ALUMINIUM',
  'GLASS',
  'UPVC',
  'INTERIOR',
  'CEILING',
  'RAILINGS',
  'METAL WORKS',
];

export interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<GalleryCategory, 'ALL'>;
  secondaryCategories?: Exclude<GalleryCategory, 'ALL'>[];
  image: string;
  alt: string;
  aspect: 'landscape' | 'portrait' | 'wide';
  serviceRoute: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Structural Glass Elevation & Aluminium Facade',
    subtitle: 'Architectural glass elevation framed in dark anodized aluminium curtain sections',
    category: 'GLASS',
    secondaryCategories: ['ALUMINIUM'],
    image: IMAGES.heroFacade,
    alt: 'Modern architectural building with dark anodized aluminium and structural glass elevation at twilight',
    aspect: 'wide',
    serviceRoute: '/services/glass-works',
  },
  {
    id: 'gal-2',
    title: '12 mm Frameless & 45x25 Glass Partition Systems',
    subtitle: 'Clear toughened 12 mm glass boardroom enclosure paired with 45x25 slimline channels',
    category: 'GLASS',
    secondaryCategories: ['INTERIOR'],
    image: IMAGES.glassPartitions,
    alt: 'Executive conference room featuring 12 mm glass partitions and 45x25 aluminium glass channels',
    aspect: 'landscape',
    serviceRoute: '/services/glass-works',
  },
  {
    id: 'gal-3',
    title: 'SS, Glass & Aluminium Staircase Railings',
    subtitle: 'Toughened glass balcony and staircase railings with brushed SS spigots and aluminium handrail',
    category: 'RAILINGS',
    secondaryCategories: ['GLASS'],
    image: IMAGES.glassRailings,
    alt: 'Double-height staircase with toughened glass railings, stainless steel spigots, and aluminium handrail',
    aspect: 'portrait',
    serviceRoute: '/services/railings-metal-works',
  },
  {
    id: 'gal-4',
    title: 'Aluminium French Windows & Sliding Doors',
    subtitle: 'Full-height matte black aluminium French windows and patio doors for residential openings',
    category: 'ALUMINIUM',
    image: IMAGES.aluminiumWindows,
    alt: 'Matte black anodized aluminium French windows and sliding doors in a bright residence',
    aspect: 'landscape',
    serviceRoute: '/services/aluminium-works',
  },
  {
    id: 'gal-5',
    title: 'ACP Facade Cladding & MS Canopy Fabrication',
    subtitle: 'Metallic silver and navy ACP exterior panels paired with dark-coated MS louver canopy',
    category: 'METAL WORKS',
    secondaryCategories: ['INTERIOR'],
    image: IMAGES.acpMetalwork,
    alt: 'Commercial building facade clad in silver and navy ACP panels with mild steel architectural canopy',
    aspect: 'portrait',
    serviceRoute: '/services/railings-metal-works',
  },
  {
    id: 'gal-6',
    title: 'UPVC Casement & Sliding Balcony Doors',
    subtitle: 'Modern white and anthracite UPVC windows and multi-track balcony doors',
    category: 'UPVC',
    image: IMAGES.upvcWindows,
    alt: 'Sunlit apartment living room featuring white and charcoal UPVC windows and balcony sliding doors',
    aspect: 'landscape',
    serviceRoute: '/services/upvc-windows-doors',
  },
  {
    id: 'gal-7',
    title: 'Sculpted Gypsum Ceiling & 2x2 Grid Ceiling',
    subtitle: 'Multi-level gypsum ceiling with warm recessed cove lighting alongside 2x2 commercial grid ceiling',
    category: 'CEILING',
    secondaryCategories: ['INTERIOR'],
    image: IMAGES.gypsumCeiling,
    alt: 'Contemporary commercial lobby with sculpted gypsum ceiling, cove lighting, and 2x2 grid ceiling',
    aspect: 'landscape',
    serviceRoute: '/services/interior-ceiling-works',
  },
  {
    id: 'gal-8',
    title: 'Aluminium Profile Cupboards & Wooden Workstations',
    subtitle: 'Fluted-glass aluminium profile wardrobe shutters alongside modular oak & aluminium workstations',
    category: 'ALUMINIUM',
    secondaryCategories: ['INTERIOR'],
    image: IMAGES.cupboardsWorkstations,
    alt: 'Fluted glass aluminium profile wardrobe cupboards paired with modular aluminium and wooden workstations',
    aspect: 'landscape',
    serviceRoute: '/services/aluminium-works',
  },
  {
    id: 'gal-9',
    title: 'Black NDS Curtains & Recessed Interior Lighting',
    subtitle: 'Floor-to-ceiling matte black NDS architectural drapery paired with integrated electrical lighting',
    category: 'INTERIOR',
    secondaryCategories: ['CEILING'],
    image: IMAGES.blackCurtains,
    alt: 'Executive interior featuring floor-to-ceiling Black NDS curtains and architectural linear ceiling lighting',
    aspect: 'portrait',
    serviceRoute: '/services/interior-ceiling-works',
  },
  {
    id: 'gal-10',
    title: 'Precision Aluminium & Glass Fabrication Craft',
    subtitle: 'Measured miter joinery, anodized extrusion profiles, and architectural glass preparation',
    category: 'METAL WORKS',
    secondaryCategories: ['ALUMINIUM', 'GLASS'],
    image: IMAGES.workshopCraft,
    alt: 'Aluminium and glass fabrication studio showing extruded aluminium profiles and precision measurement',
    aspect: 'wide',
    serviceRoute: '/about',
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What services does New Imperial Enterprises provide?',
    answer:
      'New Imperial Enterprises provides aluminium fabrication, glass works, UPVC windows and doors, gypsum and 2x2 grid ceilings, gypsum partitions, ACP works, all types of paint works, SS/glass/aluminium railings, MS works, aluminium and wooden workstations, aluminium profile cupboard works, Black NDS curtains, electrical works, and customized interior and fabrication solutions.',
  },
  {
    question: 'Do you provide aluminium windows and doors?',
    answer:
      'Yes. We undertake aluminium windows, aluminium doors, aluminium French windows, aluminium partitions, aluminium glass partitions, aluminium profile cupboard works, aluminium workstations, and customized aluminium fabrication for both residential and commercial spaces.',
  },
  {
    question: 'Do you undertake glass partition works?',
    answer:
      'Yes. We execute 12 mm glass partitions, 45x25 glass partition systems, aluminium glass partitions, glass elevations, glass railings, and complete glass installation works tailored to your layout.',
  },
  {
    question: 'Do you provide 12mm glass partitions?',
    answer:
      'Yes, 12 mm glass partitions are one of our core glass work offerings, suited for office cabins, conference rooms, commercial lobbies, and contemporary interior spaces.',
  },
  {
    question: 'Do you offer UPVC windows and doors?',
    answer:
      'Yes. We provide UPVC windows, UPVC doors, and customized UPVC solutions planned around your architectural openings and functional preferences.',
  },
  {
    question: 'Do you undertake gypsum and grid ceiling works?',
    answer:
      'Yes. Our interior and ceiling division covers gypsum ceilings, gypsum partitions, grid ceilings, and 2x2 grid ceilings for residential, commercial, and office interiors.',
  },
  {
    question: 'Do you provide ACP and painting works?',
    answer:
      'Yes. We undertake ACP cladding and fascia works as well as all types of paint works as part of our interior, ceiling, and exterior architectural services.',
  },
  {
    question: 'Can I request customized fabrication work?',
    answer:
      'Yes. We undertake customized aluminium fabrication, customized UPVC solutions, custom MS works, and tailored interior and fabrication requirements based on your project discussion and site dimensions.',
  },
  {
    question: 'How can I request a quotation?',
    answer:
      'You can request a quotation by submitting your project details through our Contact Us form, calling us directly on 9700110084 or 7013248518, or starting a WhatsApp conversation with our team.',
  },
  {
    question: 'How can I contact New Imperial Enterprises?',
    answer:
      'You can reach New Imperial Enterprises by calling 9700110084 or 7013248518, emailing amju620@gmail.com, messaging us on WhatsApp at https://wa.me/919700110084, or submitting an enquiry on our Contact Us page.',
  },
];

export const ENQUIRY_SERVICE_OPTIONS = [
  'Aluminium Works (Windows, Doors, Partitions, Cupboards)',
  'Glass Works (12 mm Partitions, 45x25 Systems, Elevations)',
  'UPVC Windows & Doors',
  'Interior & Ceiling Works (Gypsum, 2x2 Grid, Paint)',
  'ACP Works & Cladding',
  'Railings & Metal Works (SS, Glass, Aluminium, MS)',
  'Workstations (Aluminium / Wooden)',
  'Black NDS Curtains & Electrical Works',
  'Customized Interior / Fabrication Project',
];
