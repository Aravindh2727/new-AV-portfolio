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
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config.js';

/**
 * Generic Firestore Operations
 */

export async function fetchCollection(collectionName, queryConstraints = []) {
  try {
    const colRef = collection(db, collectionName);
    const q = queryConstraints.length > 0 ? query(colRef, ...queryConstraints) : colRef;
    const querySnapshot = await getDocs(q);
    const results = [];
    querySnapshot.forEach((docSnap) => {
      results.push({ id: docSnap.id, ...docSnap.data() });
    });
    return results;
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    throw error;
  }
}

export async function fetchDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching document ${collectionName}/${docId}:`, error);
    throw error;
  }
}

export async function createDocument(collectionName, data) {
  try {
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, {
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
}

export async function upsertDocument(collectionName, docId, data, merge = true) {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: new Date().toISOString()
      },
      { merge }
    );
    return docId;
  } catch (error) {
    console.error(`Error setting document ${collectionName}/${docId}:`, error);
    throw error;
  }
}

export async function updateDocumentFields(collectionName, docId, data) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    return docId;
  } catch (error) {
    console.error(`Error updating document ${collectionName}/${docId}:`, error);
    throw error;
  }
}

export async function removeDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return docId;
  } catch (error) {
    console.error(`Error deleting document ${collectionName}/${docId}:`, error);
    throw error;
  }
}
