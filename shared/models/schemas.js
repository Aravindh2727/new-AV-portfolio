/**
 * Shared Data Models & Schemas for Portfolio Ecosystem
 */

export const createDefaultProfile = () => ({
  name: 'Aravindh V',
  title: '',
  shortBio: '',
  about: '',
  location: '',
  email: '',
  phone: '',
  profileImage: '/avatar.jpg',
  resumeUrl: '',
  socialLinks: [],
  portfolioUrl: '',
  showcaseUrl: '',
  availabilityStatus: 'Open to Opportunities',
  heroTags: [],
  stats: {
    yearsExperience: '',
    projectsCompleted: '',
    technologiesMastered: '',
    contributions: ''
  },
  updatedAt: new Date().toISOString()
});

export const createDefaultProject = () => ({
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  category: 'Full Stack',
  technologies: [],
  features: [],
  problem: '',
  solution: '',
  thumbnailUrl: '',
  screenshots: [],
  githubUrl: '',
  liveUrl: '',
  demoUrl: '',
  videoUrl: '',
  portalLinks: [],
  featured: false,
  published: true,
  displayOrder: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

export const createDefaultSkill = () => ({
  name: '',
  category: 'Frontend',
  level: 'Advanced',
  icon: '',
  displayOrder: 1,
  published: true
});

export const createDefaultEducation = () => ({
  degree: '',
  institution: '',
  location: '',
  startYear: '',
  endYear: '',
  grade: '',
  description: '',
  displayOrder: 1,
  published: true
});

export const createDefaultExperience = () => ({
  company: '',
  role: '',
  location: '',
  startDate: '',
  endDate: '',
  currentPosition: false,
  description: '',
  responsibilities: [],
  technologies: [],
  companyUrl: '',
  displayOrder: 1,
  published: true
});

export const createDefaultCertification = () => ({
  name: '',
  issuer: '',
  issueDate: '',
  credentialUrl: '',
  imageUrl: '',
  description: '',
  displayOrder: 1,
  published: true
});

export const createDefaultAchievement = () => ({
  title: '',
  organization: '',
  date: '',
  url: '',
  imageUrl: '',
  description: '',
  displayOrder: 1,
  published: true
});

export const createDefaultContactMessage = () => ({
  name: '',
  email: '',
  subject: '',
  message: '',
  source: 'portfolio',
  read: false,
  createdAt: new Date().toISOString()
});

export const createDefaultSettings = () => ({
  portfolioUrl: 'http://localhost:5173',
  showcaseUrl: 'http://localhost:5174',
  adminUrl: 'http://localhost:5175',
  contactEmail: '',
  footerText: '© 2026 Aravindh V. Engineered with modern React & Firebase.',
  metaDescription: 'Personal developer ecosystem showcasing engineering projects, skills, and experience.',
  maintenanceMode: false,
  deployHookPortfolio: 'https://api.render.com/deploy/srv-db5qhc3l550s73b2h2o0?key=dbNKn5ckvVY',
  deployHookShowcase: 'https://api.render.com/deploy/srv-db5qoafavr4c739o9qf0?key=7Usx2xUf1NI',
  deployHookAdmin: 'https://api.render.com/deploy/srv-db5r13g473hc73c43vj0?key=ofHb1sEzg3A'
});
