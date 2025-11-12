export interface SectorPathway {
  id: string;
  name: string;
  description: string;
  type: "assoc" | "mrics";
  competencies: string[];
  emergingTrends: string[];
}

export const sectorPathways: SectorPathway[] = [
  {
    id: "building-surveying",
    name: "Building Surveying",
    description: "Technical inspections, refurbishments, and maintenance programmes.",
    type: "mrics",
    competencies: ["Building pathology", "Construction technology", "Project management"],
    emergingTrends: ["Net-zero retrofits", "Digital twins", "Smart asset monitoring"]
  },
  {
    id: "quantity-surveying",
    name: "Quantity Surveying & Construction",
    description: "Cost management across the project lifecycle.",
    type: "mrics",
    competencies: ["Cost planning", "Procurement", "Commercial management"],
    emergingTrends: ["AI cost prediction", "MMC pricing", "Carbon cost modelling"]
  },
  {
    id: "commercial-real-estate",
    name: "Commercial Real Estate",
    description: "Investment, agency, and landlord & tenant advisory.",
    type: "mrics",
    competencies: ["Valuation", "Leasing", "Strategic advisory"],
    emergingTrends: ["ESG-driven portfolios", "Hybrid workplace demand", "PropTech"]
  },
  {
    id: "valuation",
    name: "Valuation",
    description: "Professional valuation services across sectors.",
    type: "mrics",
    competencies: ["Inspection", "Valuation modelling", "Report writing"],
    emergingTrends: ["Automated valuation models", "ESG adjustments", "Data ethics"]
  },
  {
    id: "project-management",
    name: "Project Management",
    description: "End-to-end delivery leadership.",
    type: "mrics",
    competencies: ["Programme management", "Stakeholder engagement", "Risk management"],
    emergingTrends: ["Agile construction", "AI scheduling", "Alliance contracting"]
  },
  {
    id: "planning-development",
    name: "Planning & Development",
    description: "Development feasibility and planning advisory.",
    type: "mrics",
    competencies: ["Development appraisals", "Planning law", "Land economics"],
    emergingTrends: ["Regeneration finance", "Biodiversity net gain", "Mixed-use models"]
  },
  {
    id: "corporate-real-estate",
    name: "Corporate Real Estate",
    description: "Portfolio and workplace strategy for occupiers.",
    type: "mrics",
    competencies: ["Portfolio strategy", "Transaction management", "Workplace consultancy"],
    emergingTrends: ["Hybrid work", "Flex leasing", "Sustainability disclosure"]
  },
  {
    id: "environmental-surveying",
    name: "Environmental Surveying",
    description: "Land, water, and environmental risk advisory.",
    type: "mrics",
    competencies: ["Environmental audit", "Sustainability", "Remediation"],
    emergingTrends: ["Climate adaptation", "Nature-based solutions", "ESG regulation"]
  },
  {
    id: "building-control",
    name: "Building Control",
    description: "Regulatory compliance for building safety.",
    type: "mrics",
    competencies: ["Regulations", "Fire safety", "Quality assurance"],
    emergingTrends: ["Building safety act", "Digital submissions", "Risk-based inspections"]
  },
  {
    id: "facilities-management",
    name: "Facilities Management",
    description: "Operational excellence for built assets.",
    type: "mrics",
    competencies: ["Service delivery", "Supply chain", "Lifecycle costing"],
    emergingTrends: ["Smart FM", "Wellbeing", "Sustainable operations"]
  },
  {
    id: "geomatics",
    name: "Geomatics",
    description: "Measurement, mapping, and geospatial intelligence.",
    type: "mrics",
    competencies: ["Remote sensing", "BIM integration", "Boundary law"],
    emergingTrends: ["LiDAR automation", "Digital twins", "Autonomous drones"]
  },
  {
    id: "art-and-antiques",
    name: "Arts & Antiques",
    description: "Valuation and advisory for fine art and collectibles.",
    type: "mrics",
    competencies: ["Cataloguing", "Market analysis", "Ethical sourcing"],
    emergingTrends: ["Digital provenance", "NFT provenance", "Global wealth"]
  },
  {
    id: "machinery-and-business-assets",
    name: "Machinery & Business Assets",
    description: "Valuing industrial assets & plant.",
    type: "mrics",
    competencies: ["Asset inspection", "Residual value", "Insurance valuation"],
    emergingTrends: ["Circular economy", "Automation", "Carbon pricing"]
  },
  {
    id: "residential",
    name: "Residential",
    description: "Agency, valuation, and management across residential market.",
    type: "mrics",
    competencies: ["Housing policy", "Estate agency", "Asset management"],
    emergingTrends: ["Build-to-rent", "PRS regulation", "Net-zero homes"]
  },
  {
    id: "rural",
    name: "Rural",
    description: "Rural land and estate management.",
    type: "mrics",
    competencies: ["Agribusiness", "Estate strategy", "Compulsory purchase"],
    emergingTrends: ["Natural capital", "Regenerative farming", "Carbon trading"]
  },
  {
    id: "valuation-restructuring",
    name: "Business Valuation & Restructuring",
    description: "Corporate finance and restructuring assignments.",
    type: "mrics",
    competencies: ["Financial modelling", "Distress advisory", "Transaction support"],
    emergingTrends: ["ESG due diligence", "Cross-border deals", "Private credit"]
  },
  {
    id: "mining-waste",
    name: "Minerals & Waste",
    description: "Extraction, minerals, and waste management.",
    type: "mrics",
    competencies: ["Resource economics", "Planning", "Environmental compliance"],
    emergingTrends: ["Critical minerals", "Automation", "Circular waste"]
  },
  {
    id: "valuation-personal-property",
    name: "Personal Property Valuation",
    description: "High-value personal assets valuation.",
    type: "mrics",
    competencies: ["Authentication", "Market research", "Insurance reporting"],
    emergingTrends: ["Digital registries", "Wealth diversification", "Specialist insurance"]
  },
  {
    id: "valuation-maritime",
    name: "Marine & Maritime",
    description: "Ports, shipping, and marine assets advisory.",
    type: "mrics",
    competencies: ["Shipping markets", "Port management", "Asset valuation"],
    emergingTrends: ["Green shipping", "Floating offshore", "Autonomous vessels"]
  },
  {
    id: "valuation-plant",
    name: "Valuation of Plant & Equipment",
    description: "Industrial asset valuations for finance and assurance.",
    type: "mrics",
    competencies: ["Depreciation", "Benchmarking", "Market evidence"],
    emergingTrends: ["Industry 4.0", "Robotics", "Circular economy"]
  },
  {
    id: "valuation-infrastructure",
    name: "Infrastructure",
    description: "Transport, utilities, and energy infrastructure.",
    type: "mrics",
    competencies: ["Project finance", "Regulatory frameworks", "Operational modelling"],
    emergingTrends: ["Energy transition", "Mobility-as-a-service", "Smart infrastructure"]
  },
  {
    id: "management-consultancy",
    name: "Management Consultancy",
    description: "Strategic advisory for built environment organisations.",
    type: "mrics",
    competencies: ["Business planning", "Change management", "Process optimisation"],
    emergingTrends: ["Digital transformation", "ESG strategy", "Data governance"]
  },
  {
    id: "property-finance-and-investment",
    name: "Property Finance & Investment",
    description: "Capital markets, funding, and portfolio optimisation.",
    type: "mrics",
    competencies: ["Investment analysis", "Debt advisory", "Risk management"],
    emergingTrends: ["Green finance", "Tokenisation", "Private debt"]
  }
];

export const assocPathways = sectorPathways
  .filter((pathway) =>
    [
      "building-surveying",
      "quantity-surveying",
      "commercial-real-estate",
      "valuation",
      "project-management",
      "planning-development",
      "corporate-real-estate",
      "environmental-surveying",
      "building-control",
      "facilities-management",
      "residential",
      "rural",
      "geomatics"
    ].includes(pathway.id)
  )
  .map((pathway) => ({ ...pathway, type: "assoc" as const }));
