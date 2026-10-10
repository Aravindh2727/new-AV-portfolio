# Personal Developer Portfolio Ecosystem (2026)

A modern, production-grade 3-website developer ecosystem built from scratch with **React 18**, **Vite**, **Vanilla CSS**, **Firebase (Auth & Cloud Firestore)**, and **Cloudinary**.

The ecosystem consists of three independently deployable applications sharing a **single source of truth** in Cloud Firestore:

1. **Personal Portfolio Website** (`portfolio/` on port `5173`) — *"Who I am"*
2. **Project Showcase Website** (`project-showcase/` on port `5174`) — *"What I have built"*
3. **Admin Portal / CMS** (`admin/` on port `5175`) — *"How I manage everything"*

---

## 1. System Architecture

```text
                    ┌────────────────────────────────────────┐
                    │          ADMIN PORTAL / CMS            │
                    │         (http://localhost:5175)        │
                    │                                        │
                    │  • Projects CRUD & Status Toggles      │
                    │  • Skills & Categories CRUD            │
                    │  • Experience & Education CRUD         │
                    │  • Certifications & Achievements CRUD  │
                    │  • Profile & Socials Management        │
                    │  • Contact Messages Inbox              │
                    │  • System Settings & 1-Click Seeder    │
                    └───────────────────┬────────────────────┘
                                        │
                                        ▼
                    ┌────────────────────────────────────────┐
                    │           FIREBASE CLOUD               │
                    │                                        │
                    │  • Firebase Authentication             │
                    │  • Cloud Firestore (Single Source)     │
                    │  • Granular Security Rules             │
                    └───────────────────┬────────────────────┘
                                        │
                        ┌───────────────┴───────────────┐
                        │                               │
                        ▼                               ▼
     ┌───────────────────────────────────┐    ┌───────────────────────────────────┐
     │         PERSONAL PORTFOLIO        │    │          PROJECT SHOWCASE         │
     │      (http://localhost:5173)      │    │      (http://localhost:5174)      │
     │                                   │    │                                   │
     │  • Developer Bio & Availability   │    │  • Interactive High-Tech Gallery  │
     │  • Skills & Proficiencies         │    │  • Instant Search & Tech Filters  │
     │  • Career Experience Timeline     │    │  • Dynamic Slug Details Pages     │
     │  • Academic Education             │    │  • Problem vs. Solution Specs     │
     │  • Verified Certifications        │    │  • Architecture & Features List   │
     │  • Curated Featured Projects      │    │  • Screenshot Lightbox            │
     │  • Firestore Contact Inquiries    │    │  • Project Inquiry Form           │
     └─────────────────┬─────────────────┘    └─────────────────┬─────────────────┘
                       │                                        │
                       └─────────────── Cross Links ────────────┘
                                                │
                                                ▼
                                    ┌────────────────────────┐
                                    │       CLOUDINARY       │
                                    │                        │
                                    │  • Direct Media Upload │
                                    │  • CDN Optimization    │
                                    └────────────────────────┘
```

---

## 2. Directory Structure

```text
new-portfolio-2026/
├── portfolio/                   # Personal Portfolio Web Application
│   ├── src/
│   │   ├── components/          # Navbar, Hero, About, Skills, Timelines, Featured, Contact, Footer
│   │   ├── styles/              # portfolio.css (Obsidian glassmorphism design system)
│   │   ├── App.jsx              # Main dynamic portfolio application
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js           # Configured with @shared alias & port 5173
│   └── .env.example
│
├── project-showcase/            # Standalone High-Tech Project Showcase
│   ├── src/
│   │   ├── components/          # ShowcaseNavbar, ShowcaseFooter
│   │   ├── pages/               # ShowcaseHome, ProjectDetails (/projects/:slug)
│   │   ├── styles/              # showcase.css (Cyber emerald & cyan gallery theme)
│   │   ├── App.jsx              # Showcase routing & data access
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js           # Configured with @shared alias & port 5174
│   └── .env.example
│
├── admin/                       # Admin Portal & CMS Dashboard
│   ├── src/
│   │   ├── components/          # AdminLayout, ConfirmModal, ImageUploadField, Toast
│   │   ├── context/             # AuthContext (Firebase Auth + protected routes)
│   │   ├── pages/               # Login, Dashboard, Profile, Projects, Skills, Exp, Edu, Certs, etc.
│   │   ├── styles/              # admin.css (High-density developer CMS theme)
│   │   ├── App.jsx              # Protected routing
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js           # Configured with @shared alias & port 5175
│   └── .env.example
│
├── shared/                      # Shared Single Source of Truth Layer
│   ├── constants/               # categories.js (Skill & Project taxonomy)
│   ├── firebase/                # config.js, auth.js, firestore.js, queries.js
│   ├── models/                  # schemas.js (Data schemas & model factories)
│   ├── services/                # cloudinary.js, seedData.js
│   └── utilities/               # formatters.js, slugify.js
│
├── firestore.rules              # Production Firestore Security Rules
├── package.json                 # Root npm workspaces configuration
├── .env.example                 # Root environment variables template
└── README.md
```

---

## 3. Technology Stack

* **Frontend Framework**: React 18
* **Build Tool**: Vite 5
* **Routing**: React Router DOM 6
* **Database & Auth**: Firebase Auth & Cloud Firestore
* **Media Storage**: Cloudinary (Direct unsigned upload preset)
* **Icons**: Lucide React
* **Styling**: Vanilla CSS (Tailored HSL tokens, glassmorphism, responsive flex/grid)

---

## 4. Local Development Setup

### Prerequisites
* Node.js v18+ (tested on Node v24)
* npm v9+

### 1. Installation
Install all dependencies across all three workspaces with a single command from the root directory:
```bash
npm install
```

### 2. Environment Variables
Create `.env` in the root folder (or inside `portfolio/.env`, `project-showcase/.env`, `admin/.env`) using `.env.example`:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration (Unsigned Upload)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=portfolio_unsigned_preset

# Cross-Application URLs
VITE_PORTFOLIO_URL=http://localhost:5173
VITE_SHOWCASE_URL=http://localhost:5174
VITE_ADMIN_URL=http://localhost:5175
```

> **Note on Demo Mode**: The application includes a fallback data store and demo authentication. If Firebase keys are not provided immediately, you can still test everything locally.
> To log into the Admin portal in demo mode:
> * **Email**: `admin@portfolio.dev`
> * **Password**: `admin123456`

### 3. Launching Applications
Run all three dev servers simultaneously:
```bash
# Terminal 1: Portfolio (Port 5173)
npm run dev:portfolio

# Terminal 2: Project Showcase (Port 5174)
npm run dev:showcase

# Terminal 3: Admin Portal (Port 5175)
npm run dev:admin
```

---

## 5. Cloud Firestore Database Setup

### Collections Schema:
1. `portfolio/profile`: Singleton document containing bio, name, title, contact details, social links, resume URL, hero tags, and availability status.
2. `portfolio/settings`: Singleton document containing cross-app URLs, footer text, contact email, and maintenance mode.
3. `projects`: Collection of project documents:
   - `title`, `slug`, `category`, `shortDescription`, `description`, `technologies[]`, `features[]`, `problem`, `solution`, `thumbnailUrl`, `screenshots[]`, `githubUrl`, `liveUrl`, `demoUrl`, `videoUrl`, `featured`, `published`, `displayOrder`, `createdAt`, `updatedAt`.
4. `skills`: `name`, `category`, `level`, `icon`, `displayOrder`, `published`.
5. `experience`: `role`, `company`, `location`, `startDate`, `endDate`, `currentPosition`, `description`, `responsibilities[]`, `technologies[]`, `companyUrl`, `displayOrder`, `published`.
6. `education`: `degree`, `institution`, `location`, `startYear`, `endYear`, `grade`, `description`, `displayOrder`, `published`.
7. `certifications`: `name`, `issuer`, `issueDate`, `credentialUrl`, `imageUrl`, `description`, `displayOrder`, `published`.
8. `achievements`: `title`, `organization`, `date`, `url`, `imageUrl`, `description`, `displayOrder`, `published`.
9. `contactMessages`: `name`, `email`, `subject`, `message`, `source`, `read`, `createdAt`.

### 1-Click Database Seeding
Navigate to **Admin Portal -> Settings** and click **"Seed Sample Ecosystem Data"**. This immediately writes high-fidelity real projects (*FarmFlow AI*, *CloudSentinel Hub*, *DevMetrics Engine*, *Nexus Neural Canvas*, *PulseOps*), categorized skills, timeline experiences, educations, and certifications directly to Cloud Firestore!

---

## 6. Firestore Security Rules

Deploy the included `firestore.rules` file to your Firebase console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null;
    }

    function isValidContactMessage() {
      let data = request.resource.data;
      return data.name is string && data.name.size() > 0 && data.name.size() <= 100 &&
             data.email is string && data.email.size() > 3 && data.email.size() <= 120 &&
             data.message is string && data.message.size() > 0 && data.message.size() <= 3000;
    }

    match /portfolio/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /projects/{projectId} {
      allow read: if (resource.data.published == true) || isAdmin();
      allow write: if isAdmin();
    }

    match /skills/{skillId} {
      allow read: if (resource.data.published == true) || isAdmin();
      allow write: if isAdmin();
    }

    match /education/{educationId} {
      allow read: if (resource.data.published == true) || isAdmin();
      allow write: if isAdmin();
    }

    match /experience/{experienceId} {
      allow read: if (resource.data.published == true) || isAdmin();
      allow write: if isAdmin();
    }

    match /certifications/{certId} {
      allow read: if (resource.data.published == true) || isAdmin();
      allow write: if isAdmin();
    }

    match /achievements/{achievementId} {
      allow read: if (resource.data.published == true) || isAdmin();
      allow write: if isAdmin();
    }

    match /contactMessages/{messageId} {
      allow create: if isValidContactMessage();
      allow read, update, delete: if isAdmin();
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 7. Cloudinary Setup

1. Create a free account at [Cloudinary](https://cloudinary.com).
2. Go to **Settings -> Upload -> Upload presets**.
3. Click **Add upload preset**.
4. Set **Signing Mode** to **Unsigned**.
5. Set the preset name (e.g. `portfolio_unsigned_preset`) and target folder `portfolio`.
6. Add `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` to your `.env` file.
7. Images uploaded in the Admin portal upload directly to Cloudinary and return the CDN URL to Firestore. The image upload field also supports direct image URL input.

---

## 8. Production Deployment

Each application is a static Single-Page Application (SPA) ready to be deployed to Vercel, Netlify, or Firebase Hosting:

### Build Commands:
```bash
# Build Portfolio
npm run build:portfolio    # outputs to portfolio/dist

# Build Project Showcase
npm run build:showcase     # outputs to project-showcase/dist

# Build Admin Portal
npm run build:admin        # outputs to admin/dist

# Build All
npm run build:all
```

### Vercel / Netlify Configuration:
* **Root Directory**: `portfolio` / `project-showcase` / `admin`
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **SPA Rewrites**: Add a `vercel.json` rewrite:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
* Set the corresponding environment variables in the host dashboard.

---

## 9. Verification & Acceptance Checklist

- [x] Three independent React applications created from scratch (`portfolio`, `project-showcase`, `admin`).
- [x] Shared architecture layer (`shared/`) with data models, Firestore queries, and Cloudinary media service.
- [x] Single source of truth in Cloud Firestore; no hardcoded frontend data.
- [x] Firebase Authentication with protected Admin routes and persistent session state.
- [x] Full CRUD on Projects, Skills, Experience, Education, Certifications, Achievements, Profile, and Settings.
- [x] Published and Featured toggles on projects.
- [x] Reordering support via `displayOrder`.
- [x] Direct image upload to Cloudinary with fallback URL support.
- [x] Public Portfolio displays only `published == true && featured == true` projects.
- [x] "View All Projects →" directs to Project Showcase.
- [x] Project Showcase features category filtering, live search, technology tags, and sorting.
- [x] Project Details page with unique slug routing (`/projects/:slug`), comparative problem/solution breakdown, features list, and screenshot lightbox.
- [x] Contact forms on both Portfolio and Showcase submitting to Firestore `contactMessages`.
- [x] Admin Contact Messages inbox with read receipts and email replies.
- [x] Granular `firestore.rules` implemented.
- [x] All 3 applications verified with production builds and browser testing.
