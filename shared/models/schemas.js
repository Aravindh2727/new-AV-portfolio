/**
 * Shared Data Models & Schemas for Portfolio Ecosystem
 */

export const createDefaultProfile = () => ({
  name: 'Aravindh V',
  title: 'Full Stack & AI/ML Engineer',
  shortBio: 'Building intelligent, scalable full-stack applications and high-performance developer systems.',
  about: 'I am a passionate software engineer specializing in modern React ecosystems, resilient cloud architectures, and practical machine learning solutions. With a focus on elegant UI/UX and rock-solid system design, I create web applications that solve real-world problems.',
  location: 'Tamil Nadu, India',
  email: 'aravindh@example.com',
  phone: '+91 98765 43210',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  resumeUrl: 'https://example.com/resume.pdf',
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com' },
    { platform: 'LinkedIn', url: 'https://linkedin.com' },
    { platform: 'LeetCode', url: 'https://leetcode.com' },
    { platform: 'HackerRank', url: 'https://hackerrank.com' }
  ],
  portfolioUrl: 'http://localhost:5173',
  showcaseUrl: 'http://localhost:5174',
  availabilityStatus: 'Open to Opportunities',
  heroTags: ['Full Stack Developer', 'AI Solutions Architect', 'React & Cloud Enthusiast'],
  stats: {
    yearsExperience: '2+',
    projectsCompleted: '15+',
    technologiesMastered: '20+',
    contributions: '500+'
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
  contactEmail: 'contact@example.com',
  footerText: '© 2026 Aravindh V. Engineered with modern React & Firebase.',
  metaDescription: 'Personal developer ecosystem showcasing engineering projects, skills, and experience.',
  maintenanceMode: false,
  deployHookPortfolio: 'https://api.render.com/deploy/srv-db5qhc3l550s73b2h2o0?key=dbNKn5ckvVY',
  deployHookShowcase: 'https://api.render.com/deploy/srv-db5qoafavr4c739o9qf0?key=7Usx2xUf1NI',
  deployHookAdmin: 'https://api.render.com/deploy/srv-db5r13g473hc73c43vj0?key=ofHb1sEzg3A'
});
