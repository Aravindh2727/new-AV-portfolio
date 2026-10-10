/**
 * Comprehensive Developer Ecosystem Seed Data
 * Designed for immediate seeding into Firestore via Admin Settings or automated scripts
 */

export const INITIAL_PROFILE = {
  name: 'Aravindh V',
  title: 'Full Stack & AI/ML Engineer',
  shortBio: 'Building intelligent, scalable full-stack applications and high-performance developer systems.',
  about: 'I am a passionate software engineer specializing in modern React ecosystems, resilient cloud architectures, and practical machine learning solutions. With a focus on elegant UI/UX and rock-solid system design, I create web applications that solve real-world problems. Experienced in architecting end-to-end products from design systems to scalable databases.',
  location: 'Tamil Nadu, India',
  email: 'aravindh.dev@example.com',
  phone: '+91 98765 43210',
  profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  resumeUrl: 'https://example.com/aravindh-resume.pdf',
  githubUrl: 'https://github.com/aravindh-dev',
  linkedinUrl: 'https://linkedin.com/in/aravindh-dev',
  leetcodeUrl: 'https://leetcode.com/u/aravindh_dev',
  hackerrankUrl: 'https://hackerrank.com/aravindh_dev',
  portfolioUrl: 'http://localhost:5173',
  showcaseUrl: 'http://localhost:5174',
  availabilityStatus: 'Open to Opportunities',
  heroTags: ['Full Stack Engineer', 'AI/ML Architect', 'React & Cloud Practitioner'],
  stats: {
    yearsExperience: '3+',
    projectsCompleted: '15+',
    technologiesMastered: '22+',
    contributions: '650+'
  },
  updatedAt: new Date().toISOString()
};

export const INITIAL_SETTINGS = {
  portfolioUrl: 'http://localhost:5173',
  showcaseUrl: 'http://localhost:5174',
  adminUrl: 'http://localhost:5175',
  contactEmail: 'aravindh.dev@example.com',
  footerText: '© 2026 Aravindh V. Engineered with React, Vite & Firebase.',
  metaDescription: 'Personal developer ecosystem showcasing engineering projects, skills, and experience.',
  maintenanceMode: false
};

export const INITIAL_PROJECTS = [
  {
    title: 'FarmFlow AI',
    slug: 'farmflow-ai',
    shortDescription: 'AI-powered precision agriculture platform with crop disease diagnostics and climate analytics.',
    description: 'FarmFlow AI is an intelligent agricultural management suite designed to empower farmers and agronomists with computer-vision disease diagnosis, soil nutrient recommendations, and predictive weather forecasting. Built using modern web standards and high-throughput real-time APIs.',
    category: 'AI / ML',
    technologies: ['React', 'FastAPI', 'Python', 'PyTorch', 'TailwindCSS', 'Firebase', 'Chart.js'],
    features: [
      'Real-time leaf disease detection using fine-tuned MobileNetV3 with 96.4% test accuracy',
      'Hyperlocal weather forecasting integration with automated irrigation advisories',
      'Soil nutrient balance calculator with chemical fertilizer dosage recommendations',
      'Offline-first field inspection logs with periodic cloud sync'
    ],
    problem: 'Traditional farming often suffers from delayed pest identification, over-fertilization, and unpredictable weather shifts leading to substantial crop yield losses.',
    solution: 'FarmFlow AI provides instant mobile-friendly diagnostics and automated agronomist advice within seconds, democratizing precision farming for smallholder farmers.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1000&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80'
    ],
    githubUrl: 'https://github.com/aravindh-dev/farmflow-ai',
    liveUrl: 'https://farmflow-ai-demo.web.app',
    demoUrl: 'https://farmflow-ai-demo.web.app/preview',
    videoUrl: 'https://youtube.com',
    featured: true,
    published: true,
    displayOrder: 1,
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    title: 'CloudSentinel Hub',
    slug: 'cloudsentinel-hub',
    shortDescription: 'Multi-cloud observability, anomalous workload detection, and automated cost optimization dashboard.',
    description: 'A centralized cloud management dashboard that ingests telemetry across distributed Kubernetes clusters and serverless functions to monitor latency anomalies, memory leaks, and idle resource expenses.',
    category: 'Full Stack',
    technologies: ['React', 'TypeScript', 'Node.js', 'Docker', 'GraphQL', 'Prometheus', 'Cloudflare Workers'],
    features: [
      'Unified streaming metrics dashboard displaying p99 latencies, pod restarts, and error budgets',
      'Automated cost-allocation breakdown across dev, staging, and production environments',
      'Anomaly detection heuristics with automated webhook notifications to Slack and PagerDuty',
      'Role-based granular access control with SSO integration'
    ],
    problem: 'Modern microservices span heterogeneous cloud providers, making root-cause diagnostics and billing transparency notoriously complicated.',
    solution: 'Aggregates telemetry into a single glass pane with actionable cost-reduction insights and automated alerting.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
    ],
    githubUrl: 'https://github.com/aravindh-dev/cloudsentinel-hub',
    liveUrl: 'https://cloudsentinel.dev',
    demoUrl: '',
    videoUrl: '',
    featured: true,
    published: true,
    displayOrder: 2,
    createdAt: '2026-02-10T12:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    title: 'DevMetrics Engine',
    slug: 'devmetrics-engine',
    shortDescription: 'Engineering productivity analytics and Git workflow bottlenecks visualizer.',
    description: 'DevMetrics Engine analyzes pull request lifecycles, code review turnaround times, and CI test flakiness across engineering organizations to help engineering managers optimize team velocity.',
    category: 'Backend',
    technologies: ['React', 'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'D3.js', 'Docker'],
    features: [
      'Interactive D3 heatmaps depicting deployment frequency and review distribution',
      'Cycle time breakdown from first commit to production deployment',
      'GitHub webhook integration processing thousands of commits per minute with low latency',
      'Privacy-preserving team aggregation avoiding individual micro-surveillance'
    ],
    problem: 'Engineering teams often struggle with invisible bottlenecks in code reviews, long PR queueing times, and flaky CI pipelines without objective metrics.',
    solution: 'Transforms GitHub telemetry into actionable DORA metrics and throughput recommendations.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1000&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80'
    ],
    githubUrl: 'https://github.com/aravindh-dev/devmetrics-engine',
    liveUrl: 'https://devmetrics-engine.web.app',
    demoUrl: 'https://devmetrics-engine.web.app/demo',
    videoUrl: '',
    featured: true,
    published: true,
    displayOrder: 3,
    createdAt: '2026-03-01T09:30:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    title: 'Nexus Neural Canvas',
    slug: 'nexus-neural-canvas',
    shortDescription: 'Generative interactive node-based creative canvas powered by WebGL & WebGPU shaders.',
    description: 'An experimental creative coding playground where creators design procedural generative graphics, audio-reactive shaders, and neural art pipelines in real-time within the browser.',
    category: 'Frontend',
    technologies: ['React', 'Three.js', 'WebGL', 'WebGPU', 'GLSL', 'Vite', 'Zustand'],
    features: [
      'Node-based visual shader editor supporting custom GLSL fragment passes',
      '60 FPS hardware-accelerated particle system rendering over 500,000 entities',
      'MIDI and Web Audio API integration for real-time music reactive visuals',
      'One-click high-resolution PNG, SVG and WebM video export'
    ],
    problem: 'Creative coding usually requires cumbersome desktop environments and complex C++/OpenGL toolchains.',
    solution: 'Brings high-performance GPU shaders and node graph workflows straight to standard modern web browsers.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80'
    ],
    githubUrl: 'https://github.com/aravindh-dev/neural-canvas',
    liveUrl: 'https://neural-canvas.dev',
    demoUrl: '',
    videoUrl: '',
    featured: false,
    published: true,
    displayOrder: 4,
    createdAt: '2026-04-12T14:15:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    title: 'PulseOps Alert Mesh',
    slug: 'pulseops-alert-mesh',
    shortDescription: 'Distributed uptime monitor and edge synthetic checking engine with global health status pages.',
    description: 'A distributed edge-monitoring system executing HTTP/gRPC synthetic health probes from 12 global points of presence with instant incident escalation and status page generation.',
    category: 'DevOps & Tools',
    technologies: ['React', 'Go', 'Redis', 'Cloudflare Workers', 'TailwindCSS', 'WebSockets'],
    features: [
      'Sub-second probe latency reporting across Americas, EMEA, and Asia-Pacific edge zones',
      'Auto-generated public status pages with incident maintenance announcements',
      'Multi-channel dispatch: SMS, Telegram, Webhook, and Discord alerts',
      'SSL/TLS certificate expiration countdown with automated renewal verification'
    ],
    problem: 'Single-region uptime monitors frequently trigger false positives or miss localized CDN/DNS routing degradation.',
    solution: 'Cross-validates health across edge nodes before sounding alerts and tracks SLA uptime with 99.99% accuracy.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'
    ],
    githubUrl: 'https://github.com/aravindh-dev/pulseops-mesh',
    liveUrl: 'https://pulseops.dev',
    demoUrl: '',
    videoUrl: '',
    featured: false,
    published: true,
    displayOrder: 5,
    createdAt: '2026-05-05T16:00:00.000Z',
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_SKILLS = [
  // Programming
  { name: 'JavaScript (ESNext)', category: 'Programming', level: 'Expert', icon: 'Code', displayOrder: 1, published: true },
  { name: 'TypeScript', category: 'Programming', level: 'Advanced', icon: 'FileCode', displayOrder: 2, published: true },
  { name: 'Python', category: 'Programming', level: 'Advanced', icon: 'Terminal', displayOrder: 3, published: true },
  { name: 'SQL', category: 'Programming', level: 'Advanced', icon: 'Database', displayOrder: 4, published: true },
  { name: 'Go (Golang)', category: 'Programming', level: 'Intermediate', icon: 'Cpu', displayOrder: 5, published: true },

  // Frontend
  { name: 'React 18 / 19', category: 'Frontend', level: 'Expert', icon: 'Atom', displayOrder: 6, published: true },
  { name: 'Vite & Next.js', category: 'Frontend', level: 'Advanced', icon: 'Zap', displayOrder: 7, published: true },
  { name: 'Modern CSS / Flex / Grid', category: 'Frontend', level: 'Expert', icon: 'Palette', displayOrder: 8, published: true },
  { name: 'State Management (Redux/Zustand)', category: 'Frontend', level: 'Advanced', icon: 'Layers', displayOrder: 9, published: true },
  { name: 'TailwindCSS', category: 'Frontend', level: 'Advanced', icon: 'Sparkles', displayOrder: 10, published: true },

  // Backend
  { name: 'Node.js & Express', category: 'Backend', level: 'Advanced', icon: 'Server', displayOrder: 11, published: true },
  { name: 'FastAPI (Python)', category: 'Backend', level: 'Advanced', icon: 'Activity', displayOrder: 12, published: true },
  { name: 'RESTful API & GraphQL', category: 'Backend', level: 'Advanced', icon: 'Network', displayOrder: 13, published: true },
  { name: 'Authentication & JWT / OAuth', category: 'Backend', level: 'Advanced', icon: 'ShieldCheck', displayOrder: 14, published: true },

  // Full Stack
  { name: 'Firebase & Firestore', category: 'Full Stack', level: 'Expert', icon: 'Flame', displayOrder: 15, published: true },
  { name: 'End-to-End System Design', category: 'Full Stack', level: 'Advanced', icon: 'Boxes', displayOrder: 16, published: true },

  // Databases
  { name: 'Cloud Firestore', category: 'Databases', level: 'Expert', icon: 'Database', displayOrder: 17, published: true },
  { name: 'PostgreSQL', category: 'Databases', level: 'Advanced', icon: 'HardDrive', displayOrder: 18, published: true },
  { name: 'MongoDB', category: 'Databases', level: 'Advanced', icon: 'Database', displayOrder: 19, published: true },
  { name: 'Redis Caching', category: 'Databases', level: 'Intermediate', icon: 'Cpu', displayOrder: 20, published: true },

  // AI / ML
  { name: 'PyTorch & Deep Learning', category: 'AI / ML', level: 'Intermediate', icon: 'Brain', displayOrder: 21, published: true },
  { name: 'Computer Vision (OpenCV)', category: 'AI / ML', level: 'Advanced', icon: 'Eye', displayOrder: 22, published: true },
  { name: 'LLM Prompt Engineering & RAG', category: 'AI / ML', level: 'Advanced', icon: 'Cpu', displayOrder: 23, published: true },

  // Tools & Deployment
  { name: 'Git & GitHub Workflows', category: 'Tools', level: 'Expert', icon: 'GitBranch', displayOrder: 24, published: true },
  { name: 'Docker & Containers', category: 'Deployment', level: 'Advanced', icon: 'Container', displayOrder: 25, published: true },
  { name: 'Cloudinary CDN Integration', category: 'Tools', level: 'Advanced', icon: 'Image', displayOrder: 26, published: true },
  { name: 'CI/CD & GitHub Actions', category: 'Deployment', level: 'Intermediate', icon: 'Workflow', displayOrder: 27, published: true }
];

export const INITIAL_EDUCATION = [
  {
    degree: 'Bachelor of Engineering in Computer Science',
    institution: 'Anna University Affiliated Engineering College',
    location: 'Tamil Nadu, India',
    startYear: '2022',
    endYear: '2026',
    grade: '8.8 CGPA',
    description: 'Specialized in Data Structures, Algorithms, Cloud Computing, and Machine Learning. Published undergraduate research on deep learning architectures for environmental sensor arrays.',
    displayOrder: 1,
    published: true
  },
  {
    degree: 'Higher Secondary Certificate (HSC) - Computer Science',
    institution: 'State Board of Higher Education',
    location: 'Tamil Nadu, India',
    startYear: '2020',
    endYear: '2022',
    grade: '94.6%',
    description: 'Focused on Mathematics, Physics, Chemistry, and Computer Science fundamentals.',
    displayOrder: 2,
    published: true
  }
];

export const INITIAL_EXPERIENCE = [
  {
    company: 'NextGen Cloud Labs',
    role: 'Full Stack Engineering Intern',
    location: 'Remote / Bengaluru',
    startDate: 'Jun 2025',
    endDate: 'Dec 2025',
    currentPosition: false,
    description: 'Architected responsive customer-facing web dashboards and real-time telemetry services.',
    responsibilities: [
      'Developed high-performance React frontends that reduced initial bundle size by 35% through dynamic imports and code splitting.',
      'Created automated data synchronization pipelines leveraging Firebase Firestore real-time listeners.',
      'Integrated Cloudinary media optimization pipeline reducing median asset payload by 60% on mobile devices.'
    ],
    technologies: ['React', 'TypeScript', 'Firebase', 'Cloudinary', 'TailwindCSS'],
    companyUrl: 'https://example.com',
    displayOrder: 1,
    published: true
  },
  {
    company: 'Open Innovate Hub',
    role: 'Undergraduate Technical Lead & Contributor',
    location: 'Chennai, India',
    startDate: 'Jan 2024',
    endDate: 'May 2025',
    currentPosition: false,
    description: 'Mentored junior developers, organized hackathons, and maintained university open-source repositories.',
    responsibilities: [
      'Led a squad of 8 student developers building campus automation tools used by 4,000+ students.',
      'Conducted weekly hands-on workshops on React best practices, Git collaboration, and cloud deployment.'
    ],
    technologies: ['JavaScript', 'Python', 'React', 'Git', 'REST APIs'],
    companyUrl: 'https://example.com',
    displayOrder: 2,
    published: true
  }
];

export const INITIAL_CERTIFICATIONS = [
  {
    name: 'Meta Front-End Developer Professional Certificate',
    issuer: 'Coursera / Meta',
    issueDate: '2025',
    credentialUrl: 'https://coursera.org',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    description: 'Comprehensive 9-course specialization covering advanced React, accessibility, UI/UX principles, and testing.',
    displayOrder: 1,
    published: true
  },
  {
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    issueDate: '2025',
    credentialUrl: 'https://aws.amazon.com',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    description: 'Demonstrated deep conceptual knowledge of cloud architecture, compute, storage, security, and billing.',
    displayOrder: 2,
    published: true
  },
  {
    name: 'Deep Learning Specialization',
    issuer: 'DeepLearning.AI / Andrew Ng',
    issueDate: '2024',
    credentialUrl: 'https://coursera.org',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    description: 'Mastered neural network foundations, convolutional neural networks, sequence models, and hyperparameter tuning.',
    displayOrder: 3,
    published: true
  }
];

export const INITIAL_ACHIEVEMENTS = [
  {
    title: '1st Place Winner — State Level Hackathon 2025',
    organization: 'Tamil Nadu Innovation Forum',
    date: 'Nov 2025',
    url: 'https://example.com',
    imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=600&q=80',
    description: 'Built FarmFlow AI prototype in 36 hours competing against 80+ collegiate engineering teams.',
    displayOrder: 1,
    published: true
  },
  {
    title: 'Top 5% Contributor & 500+ LeetCode Solutions',
    organization: 'LeetCode Community',
    date: '2025',
    url: 'https://leetcode.com',
    imageUrl: '',
    description: 'Consistent problem solver with knight badge level rating and daily algorithmic dedication.',
    displayOrder: 2,
    published: true
  },
  {
    title: 'Best Technical Paper Presentation Award',
    organization: 'National Conference on Intelligent Computing',
    date: 'Aug 2024',
    url: 'https://example.com',
    imageUrl: '',
    description: 'Authored and presented paper on lightweight edge convolutional networks for agricultural sensor processing.',
    displayOrder: 3,
    published: true
  }
];
