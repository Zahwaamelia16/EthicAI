
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

import {
  getAuth,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

// Konfigurasi Firebase EthicAI
const firebaseConfig = {
  apiKey: "AIzaSyDIA_CmQrIxcbA7Wg_cA4-7HHeXSxIqFWg",
  authDomain: "ethicai-database.firebaseapp.com",
  projectId: "ethicai-database",
  storageBucket: "ethicai-database.firebasestorage.app",
  messagingSenderId: "926080766999",
  appId: "1:926080766999:web:fc6834dec7d6a697d17852"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Autentikasi anonim
const authReady = signInAnonymously(auth)
  .then(({ user }) => {
    console.log("Autentikasi Firebase berhasil!");
    return user;
  })
  .catch((error) => {
    console.error("Gagal melakukan autentikasi:", error);
    return null;
  });

// =====================================
// 1. MENYIMPAN HASIL EVALUASI CHECKLIST
// =====================================

window.simpanHasilEvaluasi = async function(data) {
  const user = await authReady;

  if (!user) {
    throw new Error("Autentikasi Firebase belum berhasil.");
  }

  const dokumen = await addDoc(
    collection(db, "hasil_evaluasi"),
    {
      ...data,
      ownerUid: user.uid,
      createdAt: serverTimestamp()
    }
  );

  console.log("Hasil evaluasi berhasil disimpan!");
  return dokumen.id;
};

// =====================================
// 2. MENYIMPAN HASIL GENERATOR SITASI
// =====================================

window.simpanHasilSitasi = async function(data) {
  const user = await authReady;

  if (!user) {
    throw new Error("Autentikasi Firebase belum berhasil.");
  }

  const dokumen = await addDoc(
    collection(db, "hasil_sitasi"),
    {
      ...data,
      ownerUid: user.uid,
      createdAt: serverTimestamp()
    }
  );

  console.log("Hasil sitasi berhasil disimpan!");
  return dokumen.id;
};

// =====================================
// 3. MENYIMPAN HASIL GENERATOR DEKLARASI
// =====================================

window.simpanHasilDeklarasi = async function(data) {
  const user = await authReady;

  if (!user) {
    throw new Error("Autentikasi Firebase belum berhasil.");
  }

  const dokumen = await addDoc(
    collection(db, "hasil_deklarasi"),
    {
      ...data,
      ownerUid: user.uid,
      createdAt: serverTimestamp()
    }
  );

  console.log("Hasil deklarasi berhasil disimpan!");
  return dokumen.id;
};

console.log("Firebase EthicAI berhasil diinisialisasi!");
