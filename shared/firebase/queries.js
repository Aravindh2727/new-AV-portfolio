import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config.js';
import {
  INITIAL_PROFILE,
  INITIAL_SETTINGS,
  INITIAL_PROJECTS,
  INITIAL_SKILLS,
  INITIAL_EDUCATION,
  INITIAL_EXPERIENCE,
  INITIAL_CERTIFICATIONS,
  INITIAL_ACHIEVEMENTS
} from '../services/seedData.js';

// Local storage fallback key for dev/demo offline mode
const LOCAL_STORAGE_KEY = 'portfolio_cms_local_store_v1';

function getLocalStore() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Local storage error:', e);
  }
  const defaultStore = {
    profile: { ...INITIAL_PROFILE },
    settings: { ...INITIAL_SETTINGS },
    projects: INITIAL_PROJECTS.map((p, i) => ({ id: `p-${i + 1}`, ...p })),
    skills: INITIAL_SKILLS.map((s, i) => ({ id: `s-${i + 1}`, ...s })),
    education: INITIAL_EDUCATION.map((e, i) => ({ id: `e-${i + 1}`, ...e })),
    experience: INITIAL_EXPERIENCE.map((exp, i) => ({ id: `exp-${i + 1}`, ...exp })),
    certifications: INITIAL_CERTIFICATIONS.map((c, i) => ({ id: `c-${i + 1}`, ...c })),
    achievements: INITIAL_ACHIEVEMENTS.map((a, i) => ({ id: `a-${i + 1}`, ...a })),
    contactMessages: []
  };
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultStore));
  } catch {}
  return defaultStore;
}

function saveLocalStore(store) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.warn('Error saving local store:', e);
  }
}

/**
 * ========================================================
 * PROFILE QUERIES
 * ========================================================
 */
export async function getProfile() {
  if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, 'portfolio', 'profile');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (error) {
      console.warn('Firestore getProfile error, using fallback:', error);
    }
  }
  return getLocalStore().profile;
}

export async function updateProfile(data) {
  const updated = {
    ...data,
    updatedAt: new Date().toISOString()
  };

  if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, 'portfolio', 'profile');
      await setDoc(docRef, updated, { merge: true });
    } catch (error) {
      console.error('Firestore updateProfile error:', error);
      throw error;
    }
  }

  // Also update local store for seamless fallback
  const store = getLocalStore();
  store.profile = { ...store.profile, ...updated };
  saveLocalStore(store);

  return store.profile;
}

/**
 * ========================================================
 * SETTINGS QUERIES
 * ========================================================
 */
export async function getSettings() {
  if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, 'portfolio', 'settings');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (error) {
      console.warn('Firestore getSettings error, using fallback:', error);
    }
  }
  return getLocalStore().settings;
}

export async function updateSettings(data) {
  const updated = {
    ...data,
    updatedAt: new Date().toISOString()
  };

  if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, 'portfolio', 'settings');
      await setDoc(docRef, updated, { merge: true });
    } catch (error) {
      console.error('Firestore updateSettings error:', error);
      throw error;
    }
  }

  const store = getLocalStore();
  store.settings = { ...store.settings, ...updated };
  saveLocalStore(store);

  return store.settings;
}

/**
 * ========================================================
 * PROJECTS QUERIES
 * ========================================================
 */
export async function getProjects({ publishedOnly = false, featuredOnly = false, category = null } = {}) {
  let projects = [];

  if (isFirebaseConfigured()) {
    try {
      const colRef = collection(db, 'projects');
      const constraints = [];

      if (publishedOnly) {
        constraints.push(where('published', '==', true));
      }
      if (featuredOnly) {
        constraints.push(where('featured', '==', true));
      }

      const q = constraints.length > 0 ? query(colRef, ...constraints) : colRef;
      const snapshot = await getDocs(q);

      snapshot.forEach((snap) => {
        projects.push({ id: snap.id, ...snap.data() });
      });

      // Sort in memory by displayOrder ascending
      projects.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));

      if (projects.length > 0) {
        if (category && category !== 'All') {
          projects = projects.filter(
            p => p.category?.toLowerCase() === category.toLowerCase()
          );
        }
        return projects;
      }
    } catch (error) {
      console.warn('Firestore getProjects error, using fallback:', error);
    }
  }

  // Fallback to local store
  const store = getLocalStore();
  let list = [...(store.projects || [])];

  if (publishedOnly) {
    list = list.filter(p => p.published === true);
  }
  if (featuredOnly) {
    list = list.filter(p => p.featured === true);
  }
  if (category && category !== 'All') {
    list = list.filter(p => p.category?.toLowerCase() === category.toLowerCase());
  }

  list.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
  return list;
}

export async function getProjectBySlug(slug) {
  if (!slug) return null;

  if (isFirebaseConfigured()) {
    try {
      const colRef = collection(db, 'projects');
      const q = query(colRef, where('slug', '==', slug), limit(1));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        return { id: docSnap.id, ...docSnap.data() };
      }
    } catch (error) {
      console.warn('Firestore getProjectBySlug error, using fallback:', error);
    }
  }

  const store = getLocalStore();
  return store.projects?.find(p => p.slug === slug) || null;
}

export async function getProjectById(id) {
  if (!id) return null;

  if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, 'projects', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
    } catch (error) {
      console.warn('Firestore getProjectById error:', error);
    }
  }

  const store = getLocalStore();
  return store.projects?.find(p => p.id === id) || null;
}

export async function saveProject(projectData, id = null) {
  const timestamp = new Date().toISOString();
  const payload = {
    ...projectData,
    displayOrder: Number(projectData.displayOrder) || 1,
    featured: Boolean(projectData.featured),
    published: projectData.published !== false,
    updatedAt: timestamp
  };

  let savedId = id;

  if (isFirebaseConfigured()) {
    try {
      if (id) {
        const docRef = doc(db, 'projects', id);
        await updateDoc(docRef, payload);
      } else {
        payload.createdAt = timestamp;
        const colRef = collection(db, 'projects');
        const docRef = await addDoc(colRef, payload);
        savedId = docRef.id;
      }
    } catch (error) {
      console.error('Firestore saveProject error:', error);
      throw error;
    }
  } else {
    if (!savedId) {
      savedId = `proj-${Date.now()}`;
      payload.createdAt = timestamp;
    }
  }

  // Update local store
  const store = getLocalStore();
  const index = store.projects?.findIndex(p => p.id === savedId);
  if (index !== -1 && index !== undefined) {
    store.projects[index] = { ...store.projects[index], ...payload, id: savedId };
  } else {
    store.projects.push({ ...payload, id: savedId });
  }
  saveLocalStore(store);

  return { id: savedId, ...payload };
}

export async function deleteProject(id) {
  if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, 'projects', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Firestore deleteProject error:', error);
      throw error;
    }
  }

  const store = getLocalStore();
  store.projects = store.projects.filter(p => p.id !== id);
  saveLocalStore(store);
  return id;
}

/**
 * ========================================================
 * SKILLS QUERIES
 * ========================================================
 */
export async function getSkills({ publishedOnly = false } = {}) {
  let skills = [];

  if (isFirebaseConfigured()) {
    try {
      const colRef = collection(db, 'skills');
      const q = publishedOnly ? query(colRef, where('published', '==', true)) : colRef;
      const snapshot = await getDocs(q);
      snapshot.forEach(snap => skills.push({ id: snap.id, ...snap.data() }));
      skills.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
      if (skills.length > 0) return skills;
    } catch (e) {
      console.warn('Firestore getSkills fallback:', e);
    }
  }

  const store = getLocalStore();
  let list = [...(store.skills || [])];
  if (publishedOnly) list = list.filter(s => s.published === true);
  list.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
  return list;
}

export async function saveSkill(skillData, id = null) {
  const payload = {
    ...skillData,
    displayOrder: Number(skillData.displayOrder) || 1,
    published: skillData.published !== false
  };

  let savedId = id;
  if (isFirebaseConfigured()) {
    try {
      if (id) {
        await updateDoc(doc(db, 'skills', id), payload);
      } else {
        const docRef = await addDoc(collection(db, 'skills'), payload);
        savedId = docRef.id;
      }
    } catch (error) {
      console.error('Firestore saveSkill error:', error);
      throw error;
    }
  } else {
    if (!savedId) savedId = `skill-${Date.now()}`;
  }

  const store = getLocalStore();
  const index = store.skills?.findIndex(s => s.id === savedId);
  if (index !== -1 && index !== undefined) {
    store.skills[index] = { ...store.skills[index], ...payload, id: savedId };
  } else {
    store.skills.push({ ...payload, id: savedId });
  }
  saveLocalStore(store);
  return { id: savedId, ...payload };
}

export async function deleteSkill(id) {
  if (isFirebaseConfigured()) {
    try {
      await deleteDoc(doc(db, 'skills', id));
    } catch (error) {
      console.error('Firestore deleteSkill error:', error);
      throw error;
    }
  }
  const store = getLocalStore();
  store.skills = store.skills.filter(s => s.id !== id);
  saveLocalStore(store);
  return id;
}

/**
 * ========================================================
 * EDUCATION QUERIES
 * ========================================================
 */
export async function getEducation({ publishedOnly = false } = {}) {
  let education = [];
  if (isFirebaseConfigured()) {
    try {
      const colRef = collection(db, 'education');
      const q = publishedOnly ? query(colRef, where('published', '==', true)) : colRef;
      const snapshot = await getDocs(q);
      snapshot.forEach(snap => education.push({ id: snap.id, ...snap.data() }));
      education.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
      if (education.length > 0) return education;
    } catch (e) {
      console.warn('Firestore getEducation fallback:', e);
    }
  }
  const store = getLocalStore();
  let list = [...(store.education || [])];
  if (publishedOnly) list = list.filter(e => e.published === true);
  list.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
  return list;
}

export async function saveEducation(data, id = null) {
  const payload = {
    ...data,
    displayOrder: Number(data.displayOrder) || 1,
    published: data.published !== false
  };

  let savedId = id;
  if (isFirebaseConfigured()) {
    try {
      if (id) {
        await updateDoc(doc(db, 'education', id), payload);
      } else {
        const docRef = await addDoc(collection(db, 'education'), payload);
        savedId = docRef.id;
      }
    } catch (error) {
      console.error('Firestore saveEducation error:', error);
      throw error;
    }
  } else {
    if (!savedId) savedId = `edu-${Date.now()}`;
  }

  const store = getLocalStore();
  const index = store.education?.findIndex(e => e.id === savedId);
  if (index !== -1 && index !== undefined) {
    store.education[index] = { ...store.education[index], ...payload, id: savedId };
  } else {
    store.education.push({ ...payload, id: savedId });
  }
  saveLocalStore(store);
  return { id: savedId, ...payload };
}

export async function deleteEducation(id) {
  if (isFirebaseConfigured()) {
    try {
      await deleteDoc(doc(db, 'education', id));
    } catch (error) {
      console.error('Firestore deleteEducation error:', error);
      throw error;
    }
  }
  const store = getLocalStore();
  store.education = store.education.filter(e => e.id !== id);
  saveLocalStore(store);
  return id;
}

/**
 * ========================================================
 * EXPERIENCE QUERIES
 * ========================================================
 */
export async function getExperience({ publishedOnly = false } = {}) {
  let experience = [];
  if (isFirebaseConfigured()) {
    try {
      const colRef = collection(db, 'experience');
      const q = publishedOnly ? query(colRef, where('published', '==', true)) : colRef;
      const snapshot = await getDocs(q);
      snapshot.forEach(snap => experience.push({ id: snap.id, ...snap.data() }));
      experience.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
      if (experience.length > 0) return experience;
    } catch (e) {
      console.warn('Firestore getExperience fallback:', e);
    }
  }
  const store = getLocalStore();
  let list = [...(store.experience || [])];
  if (publishedOnly) list = list.filter(e => e.published === true);
  list.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
  return list;
}

export async function saveExperience(data, id = null) {
  const payload = {
    ...data,
    displayOrder: Number(data.displayOrder) || 1,
    published: data.published !== false,
    currentPosition: Boolean(data.currentPosition)
  };

  let savedId = id;
  if (isFirebaseConfigured()) {
    try {
      if (id) {
        await updateDoc(doc(db, 'experience', id), payload);
      } else {
        const docRef = await addDoc(collection(db, 'experience'), payload);
        savedId = docRef.id;
      }
    } catch (error) {
      console.error('Firestore saveExperience error:', error);
      throw error;
    }
  } else {
    if (!savedId) savedId = `exp-${Date.now()}`;
  }

  const store = getLocalStore();
  const index = store.experience?.findIndex(e => e.id === savedId);
  if (index !== -1 && index !== undefined) {
    store.experience[index] = { ...store.experience[index], ...payload, id: savedId };
  } else {
    store.experience.push({ ...payload, id: savedId });
  }
  saveLocalStore(store);
  return { id: savedId, ...payload };
}

export async function deleteExperience(id) {
  if (isFirebaseConfigured()) {
    try {
      await deleteDoc(doc(db, 'experience', id));
    } catch (error) {
      console.error('Firestore deleteExperience error:', error);
      throw error;
    }
  }
  const store = getLocalStore();
  store.experience = store.experience.filter(e => e.id !== id);
  saveLocalStore(store);
  return id;
}

/**
 * ========================================================
 * CERTIFICATIONS QUERIES
 * ========================================================
 */
export async function getCertifications({ publishedOnly = false } = {}) {
  let certs = [];
  if (isFirebaseConfigured()) {
    try {
      const colRef = collection(db, 'certifications');
      const q = publishedOnly ? query(colRef, where('published', '==', true)) : colRef;
      const snapshot = await getDocs(q);
      snapshot.forEach(snap => certs.push({ id: snap.id, ...snap.data() }));
      certs.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
      if (certs.length > 0) return certs;
    } catch (e) {
      console.warn('Firestore getCertifications fallback:', e);
    }
  }
  const store = getLocalStore();
  let list = [...(store.certifications || [])];
  if (publishedOnly) list = list.filter(c => c.published === true);
  list.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
  return list;
}

export async function saveCertification(data, id = null) {
  const payload = {
    ...data,
    displayOrder: Number(data.displayOrder) || 1,
    published: data.published !== false
  };

  let savedId = id;
  if (isFirebaseConfigured()) {
    try {
      if (id) {
        await updateDoc(doc(db, 'certifications', id), payload);
      } else {
        const docRef = await addDoc(collection(db, 'certifications'), payload);
        savedId = docRef.id;
      }
    } catch (error) {
      console.error('Firestore saveCertification error:', error);
      throw error;
    }
  } else {
    if (!savedId) savedId = `cert-${Date.now()}`;
  }

  const store = getLocalStore();
  const index = store.certifications?.findIndex(c => c.id === savedId);
  if (index !== -1 && index !== undefined) {
    store.certifications[index] = { ...store.certifications[index], ...payload, id: savedId };
  } else {
    store.certifications.push({ ...payload, id: savedId });
  }
  saveLocalStore(store);
  return { id: savedId, ...payload };
}

export async function deleteCertification(id) {
  if (isFirebaseConfigured()) {
    try {
      await deleteDoc(doc(db, 'certifications', id));
    } catch (error) {
      console.error('Firestore deleteCertification error:', error);
      throw error;
    }
  }
  const store = getLocalStore();
  store.certifications = store.certifications.filter(c => c.id !== id);
  saveLocalStore(store);
  return id;
}

/**
 * ========================================================
 * ACHIEVEMENTS QUERIES
 * ========================================================
 */
export async function getAchievements({ publishedOnly = false } = {}) {
  let achievements = [];
  if (isFirebaseConfigured()) {
    try {
      const colRef = collection(db, 'achievements');
      const q = publishedOnly ? query(colRef, where('published', '==', true)) : colRef;
      const snapshot = await getDocs(q);
      snapshot.forEach(snap => achievements.push({ id: snap.id, ...snap.data() }));
      achievements.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
      if (achievements.length > 0) return achievements;
    } catch (e) {
      console.warn('Firestore getAchievements fallback:', e);
    }
  }
  const store = getLocalStore();
  let list = [...(store.achievements || [])];
  if (publishedOnly) list = list.filter(a => a.published === true);
  list.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
  return list;
}

export async function saveAchievement(data, id = null) {
  const payload = {
    ...data,
    displayOrder: Number(data.displayOrder) || 1,
    published: data.published !== false
  };

  let savedId = id;
  if (isFirebaseConfigured()) {
    try {
      if (id) {
        await updateDoc(doc(db, 'achievements', id), payload);
      } else {
        const docRef = await addDoc(collection(db, 'achievements'), payload);
        savedId = docRef.id;
      }
    } catch (error) {
      console.error('Firestore saveAchievement error:', error);
      throw error;
    }
  } else {
    if (!savedId) savedId = `ach-${Date.now()}`;
  }

  const store = getLocalStore();
  const index = store.achievements?.findIndex(a => a.id === savedId);
  if (index !== -1 && index !== undefined) {
    store.achievements[index] = { ...store.achievements[index], ...payload, id: savedId };
  } else {
    store.achievements.push({ ...payload, id: savedId });
  }
  saveLocalStore(store);
  return { id: savedId, ...payload };
}

export async function deleteAchievement(id) {
  if (isFirebaseConfigured()) {
    try {
      await deleteDoc(doc(db, 'achievements', id));
    } catch (error) {
      console.error('Firestore deleteAchievement error:', error);
      throw error;
    }
  }
  const store = getLocalStore();
  store.achievements = store.achievements.filter(a => a.id !== id);
  saveLocalStore(store);
  return id;
}

/**
 * ========================================================
 * CONTACT MESSAGES
 * ========================================================
 */
export async function sendContactMessage(messageData) {
  const payload = {
    ...messageData,
    read: false,
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured()) {
    try {
      const colRef = collection(db, 'contactMessages');
      const docRef = await addDoc(colRef, payload);
      return docRef.id;
    } catch (error) {
      console.error('Firestore sendContactMessage error:', error);
      throw error;
    }
  }

  const store = getLocalStore();
  const newId = `msg-${Date.now()}`;
  store.contactMessages = store.contactMessages || [];
  store.contactMessages.unshift({ ...payload, id: newId });
  saveLocalStore(store);
  return newId;
}

export async function getContactMessages() {
  let messages = [];
  if (isFirebaseConfigured()) {
    try {
      const colRef = collection(db, 'contactMessages');
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      snapshot.forEach(snap => messages.push({ id: snap.id, ...snap.data() }));
      return messages;
    } catch (e) {
      console.warn('Firestore getContactMessages fallback:', e);
    }
  }
  const store = getLocalStore();
  return store.contactMessages || [];
}

export async function deleteContactMessage(id) {
  if (isFirebaseConfigured()) {
    try {
      await deleteDoc(doc(db, 'contactMessages', id));
    } catch (error) {
      console.error('Firestore deleteContactMessage error:', error);
      throw error;
    }
  }
  const store = getLocalStore();
  store.contactMessages = (store.contactMessages || []).filter(m => m.id !== id);
  saveLocalStore(store);
  return id;
}

export async function markContactMessageRead(id, read = true) {
  if (isFirebaseConfigured()) {
    try {
      await updateDoc(doc(db, 'contactMessages', id), { read });
    } catch (error) {
      console.error('Firestore markContactMessageRead error:', error);
    }
  }
  const store = getLocalStore();
  const msg = store.contactMessages?.find(m => m.id === id);
  if (msg) msg.read = read;
  saveLocalStore(store);
}

/**
 * ========================================================
 * SEED FIRESTORE (1-Click Database Initializer)
 * ========================================================
 */
export async function seedAllDataToFirestore() {
  if (!isFirebaseConfigured()) {
    // Reset local store to seed
    const defaultStore = {
      profile: { ...INITIAL_PROFILE },
      settings: { ...INITIAL_SETTINGS },
      projects: INITIAL_PROJECTS.map((p, i) => ({ id: `p-${i + 1}`, ...p })),
      skills: INITIAL_SKILLS.map((s, i) => ({ id: `s-${i + 1}`, ...s })),
      education: INITIAL_EDUCATION.map((e, i) => ({ id: `e-${i + 1}`, ...e })),
      experience: INITIAL_EXPERIENCE.map((exp, i) => ({ id: `exp-${i + 1}`, ...exp })),
      certifications: INITIAL_CERTIFICATIONS.map((c, i) => ({ id: `c-${i + 1}`, ...c })),
      achievements: INITIAL_ACHIEVEMENTS.map((a, i) => ({ id: `a-${i + 1}`, ...a })),
      contactMessages: []
    };
    saveLocalStore(defaultStore);
    return { success: true, count: INITIAL_PROJECTS.length, message: 'Local storage seeded successfully!' };
  }

  try {
    const batch = writeBatch(db);

    // Profile & Settings
    batch.set(doc(db, 'portfolio', 'profile'), INITIAL_PROFILE);
    batch.set(doc(db, 'portfolio', 'settings'), INITIAL_SETTINGS);

    // Projects
    for (const project of INITIAL_PROJECTS) {
      const pRef = doc(collection(db, 'projects'));
      batch.set(pRef, project);
    }

    // Skills
    for (const skill of INITIAL_SKILLS) {
      const sRef = doc(collection(db, 'skills'));
      batch.set(sRef, skill);
    }

    // Education
    for (const edu of INITIAL_EDUCATION) {
      const eRef = doc(collection(db, 'education'));
      batch.set(eRef, edu);
    }

    // Experience
    for (const exp of INITIAL_EXPERIENCE) {
      const expRef = doc(collection(db, 'experience'));
      batch.set(expRef, exp);
    }

    // Certifications
    for (const cert of INITIAL_CERTIFICATIONS) {
      const cRef = doc(collection(db, 'certifications'));
      batch.set(cRef, cert);
    }

    // Achievements
    for (const ach of INITIAL_ACHIEVEMENTS) {
      const aRef = doc(collection(db, 'achievements'));
      batch.set(aRef, ach);
    }

    await batch.commit();
    return { success: true, message: 'Cloud Firestore seeded with complete ecosystem data!' };
  } catch (error) {
    console.error('Failed to seed Firestore:', error);
    throw error;
  }
}
