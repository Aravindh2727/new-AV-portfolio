import {
  collection, doc, getDocs, getDoc, setDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, writeBatch, limit, onSnapshot
} from 'firebase/firestore';
import { db, auth } from './config.js';

/**
 * ========================================================
 * PROFILE QUERIES
 * ========================================================
 */
export async function getProfile() {
  try {
    const docSnap = await getDoc(doc(db, 'portfolio', 'profile'));
    if (docSnap.exists()) return docSnap.data();
  } catch (error) {
    console.error('Firestore getProfile error:', error);
  }
  return null;
}

export async function updateProfile(data) {
  const updated = { ...data, updatedAt: new Date().toISOString() };
  await setDoc(doc(db, 'portfolio', 'profile'), updated, { merge: true });
  return updated;
}

/**
 * ========================================================
 * SETTINGS QUERIES
 * ========================================================
 */
export async function getSettings() {
  try {
    const docSnap = await getDoc(doc(db, 'portfolio', 'settings'));
    if (docSnap.exists()) return docSnap.data();
  } catch (error) {
    console.error('Firestore getSettings error:', error);
  }
  return null;
}

export async function updateSettings(data) {
  const updated = { ...data, updatedAt: new Date().toISOString() };
  await setDoc(doc(db, 'portfolio', 'settings'), updated, { merge: true });
  return updated;
}

/**
 * ========================================================
 * PROJECTS QUERIES
 * ========================================================
 */
export async function getProjects({ publishedOnly, featuredOnly = false, category = null } = {}) {
  let projects = [];
  try {
    const isAdmin = Boolean(auth?.currentUser);
    const requirePublished = publishedOnly !== undefined ? publishedOnly : !isAdmin;

    const colRef = collection(db, 'projects');
    const constraints = [];
    if (requirePublished) constraints.push(where('published', '==', true));
    if (featuredOnly) constraints.push(where('featured', '==', true));

    const q = constraints.length > 0 ? query(colRef, ...constraints) : colRef;
    const snapshot = await getDocs(q);

    snapshot.forEach((snap) => projects.push({ id: snap.id, ...snap.data() }));
    projects.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));

    if (category && category !== 'All') {
      projects = projects.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }
  } catch (error) {
    console.error('Firestore getProjects error:', error);
  }
  return projects;
}

export async function getProjectBySlug(slug, { publishedOnly } = {}) {
  if (!slug) return null;
  const cleanSlug = String(slug).trim();
  const isAdmin = Boolean(auth?.currentUser);
  const requirePublished = publishedOnly !== undefined ? publishedOnly : !isAdmin;

  try {
    // 1. Query by exact slug
    const constraints = [where('slug', '==', cleanSlug)];
    if (requirePublished) {
      constraints.push(where('published', '==', true));
    }
    const q = query(collection(db, 'projects'), ...constraints, limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const snapDoc = snapshot.docs[0];
      return { id: snapDoc.id, ...snapDoc.data() };
    }

    // 1b. If not found and cleanSlug has uppercase letters, try lowercase slug
    const lowerSlug = cleanSlug.toLowerCase();
    if (lowerSlug !== cleanSlug) {
      const lowerConstraints = [where('slug', '==', lowerSlug)];
      if (requirePublished) {
        lowerConstraints.push(where('published', '==', true));
      }
      const lowerQ = query(collection(db, 'projects'), ...lowerConstraints, limit(1));
      const lowerSnapshot = await getDocs(lowerQ);
      if (!lowerSnapshot.empty) {
        const snapDoc = lowerSnapshot.docs[0];
        return { id: snapDoc.id, ...snapDoc.data() };
      }
    }
  } catch (error) {
    console.error('Firestore getProjectBySlug query error:', error);
  }

  // 2. Fallback: Check if the slug parameter is actually a Firestore Document ID
  if (!cleanSlug.includes('/')) {
    try {
      const docSnap = await getDoc(doc(db, 'projects', cleanSlug));
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!requirePublished || data.published === true) {
          return { id: docSnap.id, ...data };
        }
      }
    } catch {
      // Non-existent document or permission error on doc lookup - ignore fallback
    }
  }

  return null;
}

export async function getProjectById(id, { publishedOnly } = {}) {
  if (!id) return null;
  const cleanId = String(id).trim();
  const isAdmin = Boolean(auth?.currentUser);
  const requirePublished = publishedOnly !== undefined ? publishedOnly : !isAdmin;

  try {
    const docSnap = await getDoc(doc(db, 'projects', cleanId));
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (!requirePublished || data.published === true) {
        return { id: docSnap.id, ...data };
      }
    }
  } catch (error) {
    console.error('Firestore getProjectById error:', error);
  }
  return null;
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

  if (id) {
    await updateDoc(doc(db, 'projects', id), payload);
    return { id, ...payload };
  } else {
    payload.createdAt = timestamp;
    const docRef = await addDoc(collection(db, 'projects'), payload);
    return { id: docRef.id, ...payload };
  }
}

export async function deleteProject(id) {
  await deleteDoc(doc(db, 'projects', id));
  return id;
}

/**
 * ========================================================
 * SKILLS QUERIES
 * ========================================================
 */
export async function getSkills({ publishedOnly = false } = {}) {
  let skills = [];
  try {
    const colRef = collection(db, 'skills');
    const q = publishedOnly ? query(colRef, where('published', '==', true)) : colRef;
    const snapshot = await getDocs(q);
    snapshot.forEach(snap => skills.push({ id: snap.id, ...snap.data() }));
    skills.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
  } catch (e) {
    console.error('Firestore getSkills error:', e);
  }
  return skills;
}

export async function saveSkill(skillData, id = null) {
  const payload = {
    ...skillData,
    displayOrder: Number(skillData.displayOrder) || 1,
    published: skillData.published !== false
  };

  if (id) {
    await updateDoc(doc(db, 'skills', id), payload);
    return { id, ...payload };
  } else {
    const docRef = await addDoc(collection(db, 'skills'), payload);
    return { id: docRef.id, ...payload };
  }
}

export async function deleteSkill(id) {
  await deleteDoc(doc(db, 'skills', id));
  return id;
}

/**
 * ========================================================
 * EDUCATION QUERIES
 * ========================================================
 */
export async function getEducation({ publishedOnly = false } = {}) {
  let education = [];
  try {
    const colRef = collection(db, 'education');
    const q = publishedOnly ? query(colRef, where('published', '==', true)) : colRef;
    const snapshot = await getDocs(q);
    snapshot.forEach(snap => education.push({ id: snap.id, ...snap.data() }));
    education.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
  } catch (e) {
    console.error('Firestore getEducation error:', e);
  }
  return education;
}

export async function saveEducation(data, id = null) {
  const payload = {
    ...data,
    displayOrder: Number(data.displayOrder) || 1,
    published: data.published !== false
  };
  if (id) {
    await updateDoc(doc(db, 'education', id), payload);
    return { id, ...payload };
  } else {
    const docRef = await addDoc(collection(db, 'education'), payload);
    return { id: docRef.id, ...payload };
  }
}

export async function deleteEducation(id) {
  await deleteDoc(doc(db, 'education', id));
  return id;
}

/**
 * ========================================================
 * EXPERIENCE QUERIES
 * ========================================================
 */
export async function getExperience({ publishedOnly = false } = {}) {
  let experience = [];
  try {
    const colRef = collection(db, 'experience');
    const q = publishedOnly ? query(colRef, where('published', '==', true)) : colRef;
    const snapshot = await getDocs(q);
    snapshot.forEach(snap => experience.push({ id: snap.id, ...snap.data() }));
    experience.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
  } catch (e) {
    console.error('Firestore getExperience error:', e);
  }
  return experience;
}

export async function saveExperience(data, id = null) {
  const payload = {
    ...data,
    displayOrder: Number(data.displayOrder) || 1,
    published: data.published !== false,
    currentPosition: Boolean(data.currentPosition)
  };
  if (id) {
    await updateDoc(doc(db, 'experience', id), payload);
    return { id, ...payload };
  } else {
    const docRef = await addDoc(collection(db, 'experience'), payload);
    return { id: docRef.id, ...payload };
  }
}

export async function deleteExperience(id) {
  await deleteDoc(doc(db, 'experience', id));
  return id;
}

/**
 * ========================================================
 * CERTIFICATIONS QUERIES
 * ========================================================
 */
export async function getCertifications({ publishedOnly = false } = {}) {
  let certs = [];
  try {
    const colRef = collection(db, 'certifications');
    const q = publishedOnly ? query(colRef, where('published', '==', true)) : colRef;
    const snapshot = await getDocs(q);
    snapshot.forEach(snap => certs.push({ id: snap.id, ...snap.data() }));
    certs.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
  } catch (e) {
    console.error('Firestore getCertifications error:', e);
  }
  return certs;
}

export async function saveCertification(data, id = null) {
  const payload = {
    ...data,
    displayOrder: Number(data.displayOrder) || 1,
    published: data.published !== false
  };
  if (id) {
    await updateDoc(doc(db, 'certifications', id), payload);
    return { id, ...payload };
  } else {
    const docRef = await addDoc(collection(db, 'certifications'), payload);
    return { id: docRef.id, ...payload };
  }
}

export async function deleteCertification(id) {
  await deleteDoc(doc(db, 'certifications', id));
  return id;
}

/**
 * ========================================================
 * ACHIEVEMENTS QUERIES
 * ========================================================
 */
export async function getAchievements({ publishedOnly = false } = {}) {
  let achievements = [];
  try {
    const colRef = collection(db, 'achievements');
    const q = publishedOnly ? query(colRef, where('published', '==', true)) : colRef;
    const snapshot = await getDocs(q);
    snapshot.forEach(snap => achievements.push({ id: snap.id, ...snap.data() }));
    achievements.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
  } catch (e) {
    console.error('Firestore getAchievements error:', e);
  }
  return achievements;
}

export async function saveAchievement(data, id = null) {
  const payload = {
    ...data,
    displayOrder: Number(data.displayOrder) || 1,
    published: data.published !== false
  };
  if (id) {
    await updateDoc(doc(db, 'achievements', id), payload);
    return { id, ...payload };
  } else {
    const docRef = await addDoc(collection(db, 'achievements'), payload);
    return { id: docRef.id, ...payload };
  }
}

export async function deleteAchievement(id) {
  await deleteDoc(doc(db, 'achievements', id));
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
  const colRef = collection(db, 'contactMessages');
  const docRef = await addDoc(colRef, payload);
  return docRef.id;
}

export async function getContactMessages() {
  let messages = [];
  try {
    const colRef = collection(db, 'contactMessages');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    snapshot.forEach(snap => messages.push({ id: snap.id, ...snap.data() }));
  } catch (e) {
    console.error('Firestore getContactMessages error:', e);
  }
  return messages;
}

export async function deleteContactMessage(id) {
  await deleteDoc(doc(db, 'contactMessages', id));
  return id;
}

export async function markContactMessageRead(id, read = true) {
  await updateDoc(doc(db, 'contactMessages', id), { read });
}

export function subscribeContactMessages(onUpdate, onError) {
  try {
    const colRef = collection(db, 'contactMessages');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const messages = [];
        snapshot.forEach((snap) => messages.push({ id: snap.id, ...snap.data() }));
        onUpdate(messages);
      },
      (err) => {
        console.error('Firestore subscribeContactMessages error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.error('subscribeContactMessages setup error:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * ========================================================
 * SECTION VISIBILITY HELPERS
 * ========================================================
 */
export async function toggleSectionVisibility(sectionKey, isEnabled) {
  try {
    const currentSettings = (await getSettings()) || {};
    const updatedSections = {
      ...(currentSettings.sections || {}),
      [sectionKey]: isEnabled
    };
    await updateSettings({
      ...currentSettings,
      sections: updatedSections
    });
    return updatedSections;
  } catch (err) {
    console.error('Firestore toggleSectionVisibility error:', err);
    throw err;
  }
}
