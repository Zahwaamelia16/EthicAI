/*
 * EthicAI - AI Transparency Checklist
 * Checklist, hasil evaluasi, deklarasi AI, dan Academic Citation Generator.
 * Penyimpanan menggunakan Firebase melalui firebase.js.
 */


/* =========================================================
   1. NAVIGASI HALAMAN ETHICAI
   ========================================================= */

const ethicAIPages = {
  home: document.getElementById("homeView"),
  guide: document.getElementById("panduan"),
  checklist: document.getElementById("checklistView"),
  citation: document.getElementById("generator"),
  declaration: document.getElementById("declaration")
};

const ethicAIHeader = document.getElementById("siteHeader");
const ethicAIFooter = document.getElementById("siteFooter");
const ethicAIResultView = document.getElementById("resultView");

function showEthicAIPage(page, options = {}) {
  if (!ethicAIPages[page]) return;

  // Menampilkan halaman yang dipilih dan menyembunyikan halaman lainnya.
  Object.entries(ethicAIPages).forEach(([pageName, element]) => {
    element.classList.toggle("is-hidden", pageName !== page);
  });

  // Hasil checklist hanya ditampilkan melalui proses evaluasi.
  ethicAIResultView.classList.add("is-hidden");

  // Menampilkan header dan footer saat berpindah halaman.
  ethicAIHeader.classList.remove("is-hidden");
  ethicAIFooter.classList.remove("is-hidden");

  // Header khusus beranda.
  ethicAIHeader.classList.toggle("home-header", page === "home");

  // Mengatur menu aktif pada navbar.
  let activeTarget = "#top";

  if (page === "guide") {
    activeTarget = "#panduan";
  } else if (page === "checklist") {
    activeTarget = "#checklist";
  } else if (page === "citation" || page === "declaration") {
    activeTarget = "#generator";
  }

  document.querySelectorAll(".main-nav a").forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === activeTarget
    );
  });

  // Memperbarui alamat halaman.
  if (options.updateUrl !== false && options.hash) {
    history.replaceState(null, "", options.hash);
  }

  // Mengatur posisi halaman.
  if (options.targetId) {
    const target = document.getElementById(options.targetId);

    if (target && options.scroll !== false) {
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 25,
        behavior: "smooth"
      });
    }
  } else if (options.scroll !== false) {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
}


/* =========================================================
   2. CHECKLIST TRANSPARANSI AI
   ========================================================= */

const questions = [
  {
    category: "TRANSPARANSI",
    title: "Apakah kamu mencantumkan penggunaan AI dalam tugas?",
    description: "Sebutkan tool dan bentuk bantuan AI secara jelas.",
    habit: "Mengungkapkan penggunaan AI",
    improvementTitle: "Ungkapkan penggunaan AI",
    improvementText: "Jelaskan tool AI yang kamu gunakan dan bagian tugas yang dibantu. Ikuti format pengungkapan yang diminta dosen atau institusi."
  },
  {
    category: "KEPATUHAN",
    title: "Apakah penggunaan AI sudah sesuai dengan aturan dosen atau institusi?",
    description: "Periksa pedoman tugas dan batas penggunaan AI yang diperbolehkan.",
    habit: "Memastikan penggunaan AI sesuai aturan",
    improvementTitle: "Pastikan izin penggunaan AI",
    improvementText: "Kamu menjawab “Tidak” untuk kesesuaian aturan dosen atau institusi. Baca pedoman tugas, lalu konfirmasikan batas penggunaan AI kepada dosen sebelum menyerahkan tugas."
  },
  {
    category: "VERIFIKASI",
    title: "Apakah kamu memverifikasi informasi yang dihasilkan AI?",
    description: "Bandingkan informasi dengan sumber tepercaya dan periksa kebenarannya.",
    habit: "Memverifikasi informasi dari AI",
    improvementTitle: "Verifikasi informasi dari AI",
    improvementText: "Jangan langsung menggunakan jawaban AI. Periksa kembali fakta, data, dan referensi melalui sumber tepercaya sebelum memasukkannya ke tugas."
  },
  {
    category: "PEMAHAMAN",
    title: "Apakah kamu memahami dan mengolah kembali hasil dari AI?",
    description: "Pastikan hasil AI kamu pahami, periksa, dan sesuaikan dengan pemikiranmu sendiri.",
    habit: "Memahami dan mengolah kembali hasil",
    improvementTitle: "Pahami dan olah kembali hasil AI",
    improvementText: "Gunakan AI sebagai alat bantu belajar. Pelajari hasilnya, pastikan kamu memahami isinya, lalu tulis kembali dengan pemahamanmu sendiri."
  },
  {
    category: "HAK CIPTA & SUMBER",
    title: "Apakah kamu memperhatikan hak cipta dan mencantumkan sumber?",
    description: "Periksa penggunaan materi, kutipan, dan referensi yang disertakan dalam tugas.",
    habit: "Memperhatikan hak cipta dan sumber",
    improvementTitle: "Perhatikan hak cipta dan sumber",
    improvementText: "Periksa hak penggunaan materi yang kamu pakai. Cantumkan sumber yang relevan dan jangan menganggap seluruh keluaran AI sebagai referensi yang sudah terverifikasi."
  }
];

const answers = Array(questions.length).fill(null);

let currentQuestion = 0;
let toastTimeout;
let isSavingEvaluation = false;
let evaluationSaved = false;

const elements = {
  checklistView: document.getElementById("checklistView"),
  resultView: document.getElementById("resultView"),

  progressText: document.getElementById("progressText"),
  progressPercent: document.getElementById("progressPercent"),
  progressTrack: document.getElementById("progressTrack"),
  progressFill: document.getElementById("progressFill"),

  questionNumber: document.getElementById("questionNumber"),
  questionTitle: document.getElementById("questionTitle"),
  questionDescription: document.getElementById("questionDescription"),

  yesOption: document.getElementById("yesOption"),
  noOption: document.getElementById("noOption"),

  backButton: document.getElementById("backButton"),
  nextButton: document.getElementById("nextButton"),
  helperText: document.getElementById("helperText"),

  scoreNumber: document.getElementById("scoreNumber"),
  scoreCaption: document.getElementById("scoreCaption"),
  scoreHeading: document.getElementById("scoreHeading"),
  scoreDescription: document.getElementById("scoreDescription"),

  improvementList: document.getElementById("improvementList"),
  doneList: document.getElementById("doneList"),

  declarationButton: document.getElementById("declarationButton"),
  restartButton: document.getElementById("restartButton"),

  toast: document.getElementById("toast")
};


// Menghitung jumlah pertanyaan yang sudah dijawab.
function getAnsweredCount() {
  return answers.filter((answer) => answer !== null).length;
}


// Menampilkan pertanyaan checklist.
function renderQuestion() {
  const question = questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];
  const answeredCount = getAnsweredCount();

  const percentage = Math.round(
    (answeredCount / questions.length) * 100
  );

  elements.progressText.textContent =
    `${answeredCount} dari ${questions.length} pertanyaan terjawab`;

  elements.progressPercent.textContent = `${percentage}%`;
  elements.progressFill.style.width = `${percentage}%`;

  elements.progressTrack.setAttribute(
    "aria-valuenow",
    String(answeredCount)
  );

  elements.questionNumber.textContent =
    `${String(currentQuestion + 1).padStart(2, "0")} / ${question.category}`;

  elements.questionTitle.textContent = question.title;
  elements.questionDescription.textContent = question.description;

  document.querySelectorAll('input[name="answer"]').forEach((input) => {
    input.checked = input.value === selectedAnswer;
  });

  elements.yesOption.classList.toggle(
    "selected",
    selectedAnswer === "yes"
  );

  elements.noOption.classList.toggle(
    "selected",
    selectedAnswer === "no"
  );

  elements.backButton.disabled = currentQuestion === 0;
  elements.nextButton.disabled = selectedAnswer === null;

  elements.nextButton.textContent =
    currentQuestion === questions.length - 1
      ? "Lihat Hasil"
      : "Lanjut";

  if (answeredCount === questions.length) {
    elements.helperText.textContent =
      "Semua pertanyaan sudah dijawab. Lihat ringkasan evaluasimu.";
  } else {
    elements.helperText.textContent =
      "Jawab seluruh pertanyaan untuk melihat ringkasan evaluasi";
  }
}


// Memilih jawaban Ya atau Tidak.
function chooseAnswer(value) {
  answers[currentQuestion] = value;
  renderQuestion();
}


// Menampilkan notifikasi kecil.
function showToast(message) {
  if (!elements.toast) return;

  elements.toast.textContent = message;
  elements.toast.classList.add("show");

  window.clearTimeout(toastTimeout);

  toastTimeout = window.setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 2800);
}


/* =========================================================
   3. PENYIMPANAN HASIL CHECKLIST KE FIREBASE
   ========================================================= */

async function saveEvaluationToFirebase() {
  if (isSavingEvaluation || evaluationSaved) return;

  if (typeof window.simpanHasilEvaluasi !== "function") {
    console.error("Fungsi Firebase simpanHasilEvaluasi belum tersedia.");

    showToast(
      "Koneksi Firebase belum siap. Silakan muat ulang halaman."
    );

    return;
  }

  const yesCount = answers.filter(
    (answer) => answer === "yes"
  ).length;

  const percentage = Math.round(
    (yesCount / questions.length) * 100
  );

  const noIndexes = questions
    .map((question, index) => {
      return answers[index] === "no" ? index : -1;
    })
    .filter((index) => index !== -1);

  const completedHabits = questions.filter(
    (question, index) => answers[index] === "yes"
  );

  const scoreMessage = getScoreMessage(percentage);

  const evaluationData = {
    jawaban: questions.map((question, index) => ({
      kategori: question.category,
      pertanyaan: question.title,
      jawaban: answers[index] === "yes" ? "Ya" : "Tidak"
    })),

    jumlahYa: yesCount,
    totalPertanyaan: questions.length,
    skorPersentase: percentage,

    rekomendasi: noIndexes.map((index) => ({
      kategori: questions[index].category,
      judul: questions[index].improvementTitle,
      deskripsi: questions[index].improvementText
    })),

    kebiasaanDiterapkan: completedHabits.map(
      (question) => question.habit
    ),

    ringkasan: {
      judul: scoreMessage.heading.replace("\n", " "),
      deskripsi: scoreMessage.description
    }
  };

  isSavingEvaluation = true;

  try {
    const documentId =
      await window.simpanHasilEvaluasi(evaluationData);

    evaluationSaved = true;

    console.log("Evaluasi berhasil disimpan:", documentId);
    showToast("Hasil evaluasi berhasil disimpan!");

  } catch (error) {
    console.error("Gagal menyimpan evaluasi:", error);

    showToast(
      "Hasil evaluasi gagal disimpan. Periksa koneksi Firebase."
    );

  } finally {
    isSavingEvaluation = false;
  }
}


// Menentukan pesan berdasarkan skor checklist.
function getScoreMessage(percentage) {
  if (percentage === 100) {
    return {
      heading: "Sangat baik,\nterus pertahankan",
      description: "Kamu sudah menunjukkan kebiasaan transparansi AI yang baik. Tetap periksa kembali aturan tugas dan keakuratan seluruh isi sebelum dikumpulkan."
    };
  }

  if (percentage >= 80) {
    return {
      heading: "Sudah baik,\nmasih bisa ditingkatkan",
      description: "Kamu telah menerapkan sebagian besar kebiasaan transparansi AI. Pastikan penggunaan AI juga sesuai aturan tugasmu."
    };
  }

  if (percentage >= 60) {
    return {
      heading: "Cukup baik,\nada yang perlu diperiksa",
      description: "Beberapa kebiasaan transparansi AI sudah kamu terapkan. Tinjau kembali bagian yang masih terlewat sebelum menyerahkan tugas."
    };
  }

  if (percentage >= 40) {
    return {
      heading: "Masih perlu\nbeberapa perbaikan",
      description: "Ada beberapa aspek penggunaan AI yang perlu kamu periksa. Gunakan rekomendasi di bawah sebagai panduan untuk memperbaiki proses pengerjaan tugas."
    };
  }

  return {
    heading: "Saatnya meninjau\nproses penggunaan AI",
    description: "Belum banyak kebiasaan transparansi AI yang kamu terapkan. Tidak apa-apa, mulai perbaiki prosesmu satu per satu sebelum tugas dikumpulkan."
  };
}


/* =========================================================
   4. MENAMPILKAN HASIL CHECKLIST
   ========================================================= */

function renderResult() {
  const yesCount = answers.filter(
    (answer) => answer === "yes"
  ).length;

  const percentage = Math.round(
    (yesCount / questions.length) * 100
  );

  const noIndexes = questions
    .map((question, index) => {
      return answers[index] === "no" ? index : -1;
    })
    .filter((index) => index !== -1);

  const completedHabits = questions.filter(
    (question, index) => answers[index] === "yes"
  );

  const scoreMessage = getScoreMessage(percentage);

  elements.scoreNumber.textContent = `${percentage}%`;

  elements.scoreCaption.textContent =
    `${yesCount} dari ${questions.length} jawaban “Ya”`;

  // HTML ini hanya berasal dari template tetap, bukan input pengguna.
  elements.scoreHeading.innerHTML =
    scoreMessage.heading.replace("\n", "<br />");

  elements.scoreDescription.textContent =
    scoreMessage.description;

  // Menampilkan rekomendasi perbaikan.
  elements.improvementList.replaceChildren();

  if (noIndexes.length === 0) {
    const completeMessage = document.createElement("div");

    completeMessage.className = "no-improvement";

    completeMessage.textContent =
      "Tidak ada jawaban “Tidak”. Pertahankan kebiasaan transparansi dan tanggung jawab dalam menggunakan AI.";

    elements.improvementList.appendChild(completeMessage);

  } else {
    noIndexes.forEach((index) => {
      const question = questions[index];

      const item = document.createElement("article");
      item.className = "improvement-item";

      const title = document.createElement("h3");

      title.textContent =
        `${String(index + 1).padStart(2, "0")} / ${question.improvementTitle}`;

      const description = document.createElement("p");
      description.textContent = question.improvementText;

      item.append(title, description);
      elements.improvementList.appendChild(item);
    });
  }

  // Menampilkan kebiasaan yang sudah dilakukan.
  elements.doneList.replaceChildren();

  if (completedHabits.length === 0) {
    const emptyItem = document.createElement("li");

    emptyItem.className = "done-empty";

    emptyItem.textContent =
      "Belum ada kebiasaan yang ditandai sudah dilakukan. Mulailah dari satu langkah kecil.";

    elements.doneList.appendChild(emptyItem);

  } else {
    completedHabits.forEach((question) => {
      const item = document.createElement("li");

      const icon = document.createElement("i");

      icon.setAttribute("data-lucide", "check");
      icon.className = "list-check-icon";
      icon.setAttribute("aria-hidden", "true");

      const text = document.createElement("span");
      text.textContent = question.habit;

      item.append(icon, text);
      elements.doneList.appendChild(item);
    });
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}


// Berpindah ke halaman hasil checklist.
function showResult() {
  if (answers.some((answer) => answer === null)) {
    showToast("Lengkapi semua pertanyaan terlebih dahulu.");
    return;
  }

  renderResult();

  // Simpan hasil evaluasi ke Firebase.
  saveEvaluationToFirebase();

  elements.checklistView.classList.add("is-hidden");
  elements.resultView.classList.remove("is-hidden");

  ethicAIHeader.classList.add("is-hidden");
  ethicAIFooter.classList.remove("is-hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// Tombol Lanjut.
function goToNext() {
  if (answers[currentQuestion] === null) return;

  if (currentQuestion === questions.length - 1) {
    showResult();
    return;
  }

  currentQuestion += 1;
  renderQuestion();
}


// Tombol Kembali.
function goToPrevious() {
  if (currentQuestion === 0) return;

  currentQuestion -= 1;
  renderQuestion();
}


// Mengulang checklist dari awal.
function restartChecklist() {
  answers.fill(null);
  currentQuestion = 0;
  evaluationSaved = false;

  elements.resultView.classList.add("is-hidden");
  elements.checklistView.classList.remove("is-hidden");

  ethicAIHeader.classList.remove("is-hidden");
  ethicAIFooter.classList.remove("is-hidden");

  renderQuestion();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// Event listener pilihan jawaban.
document.querySelectorAll('input[name="answer"]').forEach((input) => {
  input.addEventListener("change", (event) => {
    chooseAnswer(event.target.value);
  });
});

elements.backButton.addEventListener("click", goToPrevious);
elements.nextButton.addEventListener("click", goToNext);
elements.restartButton.addEventListener("click", restartChecklist);


// Tombol menuju Generator Deklarasi AI.
elements.declarationButton.addEventListener("click", () => {
  const declarationEvent = new CustomEvent("ethicai:open-generator", {
    detail: {
      answers: [...answers],
      questions
    }
  });

  window.dispatchEvent(declarationEvent);
});

renderQuestion();

if (window.lucide) {
  window.lucide.createIcons();
}


/* =========================================================
   5. GENERATOR DEKLARASI PENGGUNAAN AI
   ========================================================= */

(() => {
  const declarationView = document.getElementById("declaration");

  const checklistBanner =
    document.getElementById("declChecklistBanner");

  const sampleBtn =
    document.getElementById("fillSampleBtn");

  const styleButtons =
    document.querySelectorAll(".decl-style-btn");

  const form =
    document.getElementById("declarationForm");

  const resetBtn =
    document.getElementById("resetDeclBtn");

  const emptyStateCard =
    document.getElementById("declEmptyStateCard");

  const resultStateCard =
    document.getElementById("declResultStateCard");

  const declarationOutput =
    document.getElementById("declarationOutput");

  const copyBtn =
    document.getElementById("copyDeclBtn");

  const regenerateBtn =
    document.getElementById("regenerateDeclBtn");

  const copyBadge =
    document.getElementById("declCopyBadge");

  if (
    !declarationView ||
    !form ||
    !emptyStateCard ||
    !resultStateCard ||
    !declarationOutput
  ) {
    console.error("Elemen Generator Deklarasi AI belum lengkap.");
    return;
  }

  // Disesuaikan dengan tombol Standar, Formal, dan Ringkas di HTML.
  const styleOrder = ["standard", "formal", "concise"];

  let currentStyle = "standard";


  // Mengamankan teks dari input pengguna sebelum dimasukkan ke innerHTML.
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };

      return entities[char];
    });
  }


  function cleanEnding(text) {
    return text.trim().replace(/[.?!,]+$/, "");
  }


  function toMidSentence(text) {
    const cleaned = cleanEnding(text);

    if (!cleaned) return "";

    if (
      cleaned.length > 1 &&
      cleaned[1] === cleaned[1].toUpperCase() &&
      /[A-Z]/.test(cleaned[1])
    ) {
      return cleaned;
    }

    return cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
  }


  function toStartSentence(text) {
    const cleaned = cleanEnding(text);

    if (!cleaned) return "";

    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }


  // Mengatur tombol gaya bahasa yang aktif.
  function setActiveStyleButton(style) {
    currentStyle = style;

    styleButtons.forEach((button) => {
      button.classList.toggle(
        "is-active",
        button.dataset.style === style
      );
    });
  }


  // Mengisi form dengan contoh.
  if (sampleBtn) {
    sampleBtn.addEventListener("click", () => {
      document.getElementById("aiTools").value =
        "ChatGPT, Gemini";

      document.getElementById("aiPurpose").value =
        "memahami konsep dasar materi dan mengeksplorasi sudut pandang awal";

      document.getElementById("aiAssistance").value =
        "brainstorming ide, penyusunan kerangka, penyuntingan tata bahasa";

      document.getElementById("taskPart").value =
        "penyusunan kerangka Bab 1 dan pengecekan kejelasan abstrak";

      document.getElementById("humanReview").value =
        "Saya memverifikasi seluruh fakta dan referensi melalui jurnal akademik serta menulis ulang seluruh isi dengan bahasa sendiri";

      showToast("Contoh pengisian berhasil dimuat.");
    });
  }


  // Mengisi teks deklarasi sesuai gaya yang dipilih.
  function generateDeclarationText(style = currentStyle) {
    const tools = escapeHTML(
      cleanEnding(document.getElementById("aiTools").value)
    );

    const purpose = escapeHTML(
      toMidSentence(document.getElementById("aiPurpose").value)
    );

    const assistance = escapeHTML(
      toMidSentence(document.getElementById("aiAssistance").value)
    );

    const taskPart = escapeHTML(
      toMidSentence(document.getElementById("taskPart").value)
        .replace(/^bagian\s+/i, "")
    );

    const review = escapeHTML(
      toStartSentence(document.getElementById("humanReview").value)
    );

    const templates = {
      standard: {
        p1: `Saya menggunakan ${tools} untuk ${purpose}. Bantuan AI mencakup ${assistance}, khususnya pada bagian ${taskPart}.`,
        p2: `${review}. Saya bertanggung jawab atas isi, keakuratan, dan orisinalitas tugas akhir ini.`,
        note: "Tinjau dan sesuaikan sebelum dimasukkan ke tugas."
      },

      formal: {
        p1: `Pernyataan Penggunaan Kecerdasan Buatan: Dalam penyusunan karya akademik ini, penulis memanfaatkan ${tools} guna ${purpose}, dengan bentuk bantuan berupa ${assistance} pada bagian ${taskPart}.`,
        p2: `${review}. Seluruh substansi, validasi sumber ilmiah, serta keaslian karya ini sepenuhnya menjadi tanggung jawab akademik penulis.`,
        note: "Sesuaikan dengan format pernyataan akademik dosen atau kampus."
      },

      concise: {
        p1: `Saya menggunakan ${tools} untuk ${purpose} dan memperoleh bantuan ${assistance} pada bagian ${taskPart}.`,
        p2: `${review}. Saya telah meninjau hasilnya dan bertanggung jawab atas isi tugas akhir ini.`,
        note: "Sesuaikan dengan proses penggunaan AI yang sebenarnya."
      }
    };

    const selected = templates[style] || templates.standard;

    return `
      <p>${selected.p1}</p>
      <p>${selected.p2}</p>
      <p class="decl-box-note" contenteditable="false">${selected.note}</p>
    `;
  }


  // Menyimpan hasil deklarasi ke Firebase.
  async function saveDeclarationToFirebase() {
    if (typeof window.simpanHasilDeklarasi !== "function") {
      console.error("Fungsi Firebase simpanHasilDeklarasi belum tersedia.");
      showToast("Koneksi Firebase belum siap.");
      return;
    }

    const declarationText = Array.from(
      declarationOutput.querySelectorAll("p:not(.decl-box-note)")
    )
      .map((paragraph) => paragraph.innerText.trim())
      .join("\n\n");

    const declarationData = {
      toolName: document.getElementById("aiTools").value.trim(),
      purpose: document.getElementById("aiPurpose").value.trim(),
      assistance: document.getElementById("aiAssistance").value.trim(),
      taskPart: document.getElementById("taskPart").value.trim(),
      humanReview: document.getElementById("humanReview").value.trim(),
      declaration: declarationText,
      style: currentStyle
    };

    try {
      const documentId =
        await window.simpanHasilDeklarasi(declarationData);

      console.log("Deklarasi berhasil disimpan:", documentId);
      showToast("Deklarasi berhasil disimpan ke database!");

    } catch (error) {
      console.error("Gagal menyimpan deklarasi:", error);
      showToast("Deklarasi berhasil dibuat, tetapi gagal disimpan ke database.");
    }
  }


  // Tombol gaya bahasa: Standar, Formal, dan Ringkas.
  styleButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      setActiveStyleButton(button.dataset.style);

      declarationOutput.innerHTML =
        generateDeclarationText(currentStyle);

      copyBadge?.classList.add("is-hidden");

      await saveDeclarationToFirebase();
    });
  });


  // Membuat deklarasi.
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    setActiveStyleButton("standard");

    declarationOutput.innerHTML =
      generateDeclarationText("standard");

    emptyStateCard.classList.add("is-hidden");
    resultStateCard.classList.remove("is-hidden");

    copyBadge?.classList.add("is-hidden");

    await saveDeclarationToFirebase();
  });


  // Mengganti gaya deklarasi secara berurutan.
  if (regenerateBtn) {
    regenerateBtn.addEventListener("click", async () => {
      const currentIndex = styleOrder.indexOf(currentStyle);

      const nextIndex =
        (currentIndex + 1) % styleOrder.length;

      setActiveStyleButton(styleOrder[nextIndex]);

      declarationOutput.innerHTML =
        generateDeclarationText(currentStyle);

      copyBadge?.classList.add("is-hidden");

      await saveDeclarationToFirebase();
    });
  }


  // Menyalin deklarasi.
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const cleanText = Array.from(
        declarationOutput.querySelectorAll("p:not(.decl-box-note)")
      )
        .map((paragraph) => paragraph.innerText.trim())
        .join("\n\n");

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(cleanText);
        } else {
          const tempInput = document.createElement("textarea");

          tempInput.value = cleanText;
          tempInput.style.position = "fixed";
          tempInput.style.opacity = "0";

          document.body.appendChild(tempInput);
          tempInput.select();

          const copied = document.execCommand("copy");

          tempInput.remove();

          if (!copied) {
            throw new Error("Gagal menyalin deklarasi.");
          }
        }

        copyBadge?.classList.remove("is-hidden");

        window.setTimeout(() => {
          copyBadge?.classList.add("is-hidden");
        }, 3500);

      } catch (error) {
        console.error("Gagal menyalin deklarasi:", error);
        showToast("Gagal menyalin. Silakan salin teks secara manual.");
      }
    });
  }


  // Mengosongkan form deklarasi.
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      form.reset();

      setActiveStyleButton("standard");

      resultStateCard.classList.add("is-hidden");
      emptyStateCard.classList.remove("is-hidden");

      copyBadge?.classList.add("is-hidden");

      if (checklistBanner) {
        checklistBanner.classList.add("is-hidden");
      }
    });
  }


  // Menerima data checklist saat pengguna menuju halaman deklarasi.
  window.addEventListener("ethicai:open-generator", (event) => {
    if (
      checklistBanner &&
      event.detail &&
      Array.isArray(event.detail.answers)
    ) {
      const userAnswers = event.detail.answers;

      const answeredCount = userAnswers.filter(
        (answer) => answer !== null
      ).length;

      if (answeredCount > 0) {
        const yesCount = userAnswers.filter(
          (answer) => answer === "yes"
        ).length;

        const missedCategories = (event.detail.questions || [])
          .filter((question, index) => userAnswers[index] === "no")
          .map((question) => question.category);

        checklistBanner.textContent =
          missedCategories.length > 0
            ? `Catatan dari Checklist (${yesCount}/${answeredCount} terpenuhi): pastikan aspek ${missedCategories.join(", ")} sudah kamu periksa sebelum menyerahkan tugas.`
            : `Hasil Checklist (${yesCount}/${answeredCount} terpenuhi): seluruh indikator transparansi sudah baik, lanjutkan menyusun deklarasimu di bawah.`;

        checklistBanner.classList.remove("is-hidden");
      }
    }

    showEthicAIPage("declaration", {
      hash: "#declaration"
    });
  });

})();


/* =========================================================
   6. ACADEMIC CITATION GENERATOR
   Generator Sitasi Referensi Akademik
   Format APA 7 dan IEEE
   ========================================================= */

(() => {
  const form = document.getElementById("academicCitationForm");

  if (!form) {
    console.error("Form Academic Citation Generator tidak ditemukan.");
    return;
  }

  // Elemen HTML.
  const sourceType =
    document.getElementById("academicSourceType");

  const dynamicFields =
    document.getElementById("academicDynamicFields");

  const preview =
    document.getElementById("academicPreview");

  const result =
    document.getElementById("academicResult");

  const referenceText =
    document.getElementById("academicReferenceText");

  const inTextCitation =
    document.getElementById("academicInTextCitation");

  const formatLabel =
    document.getElementById("academicFormatLabel");

  const resultNote =
    document.getElementById("academicResultNote");

  const copyButton =
    document.getElementById("academicCopy");

  const regenerateButton =
    document.getElementById("academicRegenerate");

  const saveButton =
    document.getElementById("academicSave");

  const saveStatus =
    document.getElementById("academicSaveStatus");

  const copyNotification =
    document.getElementById("academicCopyNotification");

  const notificationText =
    document.getElementById("academicNotificationText");

  if (
    !sourceType ||
    !dynamicFields ||
    !preview ||
    !result ||
    !referenceText ||
    !inTextCitation ||
    !formatLabel ||
    !resultNote ||
    !copyButton ||
    !regenerateButton ||
    !saveButton ||
    !saveStatus ||
    !copyNotification ||
    !notificationText
  ) {
    console.error("Elemen Academic Citation Generator belum lengkap.");
    return;
  }

  let lastGeneratedData = null;
  let isSavingReference = false;
  let savedDocumentId = null;

  const defaultSaveButtonHTML = saveButton.innerHTML;


  // Mengambil format yang dipilih pengguna.
  function getSelectedFormat() {
    const selected = form.querySelector(
      'input[name="academicFormat"]:checked'
    );

    return selected ? selected.value : "APA";
  }


  // Daftar kolom input berdasarkan jenis sumber.
  const fieldSets = {

    journal: [
      {
        name: "authors",
        label: "Nama penulis *",
        placeholder: "Contoh: Pratama, A. A., & Sari, B. B.",
        help: "Masukkan nama penulis sesuai format sitasi.",
        required: true
      },
      {
        name: "year",
        label: "Tahun terbit *",
        type: "number",
        placeholder: "Contoh: 2024",
        required: true
      },
      {
        name: "title",
        label: "Judul artikel *",
        placeholder: "Masukkan judul artikel jurnal.",
        required: true
      },
      {
        name: "journalTitle",
        label: "Nama jurnal *",
        placeholder: "Contoh: Jurnal Pendidikan Indonesia",
        required: true
      },
      {
        name: "volume",
        label: "Volume *",
        placeholder: "Contoh: 8",
        required: true
      },
      {
        name: "issue",
        label: "Nomor / Issue",
        placeholder: "Contoh: 2"
      },
      {
        name: "pages",
        label: "Halaman",
        placeholder: "Contoh: 101–112"
      },
      {
        name: "doi",
        label: "DOI atau URL (opsional)",
        placeholder: "Contoh: https://doi.org/10.xxxx/xxxxx"
      }
    ],

    book: [
      {
        name: "authors",
        label: "Nama penulis *",
        placeholder: "Contoh: Pratama, A. A.",
        help: "Masukkan nama penulis sesuai format sitasi.",
        required: true
      },
      {
        name: "year",
        label: "Tahun terbit *",
        type: "number",
        placeholder: "Contoh: 2023",
        required: true
      },
      {
        name: "title",
        label: "Judul buku *",
        placeholder: "Masukkan judul buku.",
        required: true
      },
      {
        name: "edition",
        label: "Edisi buku (opsional)",
        placeholder: "Contoh: 2nd ed."
      },
      {
        name: "publisherPlace",
        label: "Kota dan negara penerbit (IEEE)",
        placeholder: "Contoh: Jakarta, Indonesia"
      },
      {
        name: "publisher",
        label: "Nama penerbit *",
        placeholder: "Contoh: Penerbit Buku",
        required: true
      },
      {
        name: "doi",
        label: "DOI atau URL (opsional)",
        placeholder: "Masukkan DOI atau URL buku."
      }
    ],

    website: [
      {
        name: "author",
        label: "Nama penulis / organisasi *",
        placeholder: "Contoh: UNESCO",
        required: true
      },
      {
        name: "publicationDate",
        label: "Tanggal publikasi (opsional)",
        type: "date",
        help: "Kosongkan jika tanggal publikasi tidak diketahui."
      },
      {
        name: "title",
        label: "Judul halaman / artikel *",
        placeholder: "Masukkan judul halaman website.",
        required: true
      },
      {
        name: "websiteName",
        label: "Nama website *",
        placeholder: "Contoh: UNESCO",
        required: true
      },
      {
        name: "accessDate",
        label: "Tanggal diakses (IEEE)",
        type: "date",
        help: "Wajib diisi saat menggunakan format IEEE."
      },
      {
        name: "url",
        label: "URL website *",
        type: "url",
        placeholder: "https://contoh.com",
        required: true
      }
    ],

    conference: [
      {
        name: "authors",
        label: "Nama penulis *",
        placeholder: "Masukkan nama penulis.",
        required: true
      },
      {
        name: "year",
        label: "Tahun terbit *",
        type: "number",
        placeholder: "Contoh: 2024",
        required: true
      },
      {
        name: "title",
        label: "Judul paper *",
        placeholder: "Masukkan judul paper.",
        required: true
      },
      {
        name: "proceedingsTitle",
        label: "Nama prosiding / konferensi *",
        placeholder: "Masukkan nama prosiding.",
        required: true
      },
      {
        name: "location",
        label: "Lokasi konferensi",
        placeholder: "Contoh: Jakarta, Indonesia"
      },
      {
        name: "pages",
        label: "Halaman paper",
        placeholder: "Contoh: 100–108"
      },
      {
        name: "publisher",
        label: "Penerbit (jika tersedia)",
        placeholder: "Masukkan nama penerbit."
      },
      {
        name: "doi",
        label: "DOI atau URL (opsional)",
        placeholder: "Masukkan DOI atau URL prosiding."
      }
    ]

  };


  // Membuat input secara dinamis.
  function renderFields() {
    const fields = fieldSets[sourceType.value];

    dynamicFields.innerHTML = fields.map((field) => {
      const id = `academic-${field.name}`;
      const type = field.type || "text";

      return `
        <div class="citation-field">

          <label for="${id}">${field.label}</label>

          <input
            type="${type}"
            id="${id}"
            name="${field.name}"
            placeholder="${field.placeholder || ""}"
            ${field.required ? "required" : ""}
            ${type === "number" ? 'min="1000" max="2100" step="1"' : ""}
          />

          <small id="help-${field.name}">
            ${field.help || ""}
          </small>

        </div>
      `;
    }).join("");

    updateFormatFields();
  }


  // Menyesuaikan beberapa kolom berdasarkan format sitasi.
  function updateFormatFields() {
    const format = getSelectedFormat();

    const authorInput = dynamicFields.querySelector(
      '[name="authors"], [name="author"]'
    );

    if (authorInput) {
      if (format === "APA") {
        authorInput.placeholder =
          sourceType.value === "website"
            ? "Contoh: UNESCO"
            : "Contoh: Pratama, A. A., & Sari, B. B.";
      } else {
        authorInput.placeholder =
          sourceType.value === "website"
            ? "Contoh: UNESCO"
            : "Contoh: A. A. Pratama and B. B. Sari";
      }
    }

    const authorHelp = dynamicFields.querySelector(
      "#help-authors, #help-author"
    );

    if (authorHelp) {
      authorHelp.textContent =
        format === "APA"
          ? "APA: gunakan nama belakang diikuti inisial nama depan."
          : "IEEE: gunakan inisial nama depan diikuti nama belakang.";
    }

    // Tanggal akses website wajib untuk format IEEE.
    const accessDateInput = dynamicFields.querySelector(
      '[name="accessDate"]'
    );

    if (accessDateInput) {
      const isIEEE = format === "IEEE";

      accessDateInput.required = isIEEE;

      const accessDateLabel = dynamicFields.querySelector(
        'label[for="academic-accessDate"]'
      );

      if (accessDateLabel) {
        accessDateLabel.textContent = isIEEE
          ? "Tanggal diakses * (IEEE)"
          : "Tanggal diakses (IEEE)";
      }
    }

    // Kota dan negara penerbit buku wajib untuk format IEEE.
    const publisherPlaceInput = dynamicFields.querySelector(
      '[name="publisherPlace"]'
    );

    if (publisherPlaceInput) {
      const isIEEE = format === "IEEE";

      publisherPlaceInput.required = isIEEE;

      const publisherPlaceLabel = dynamicFields.querySelector(
        'label[for="academic-publisherPlace"]'
      );

      if (publisherPlaceLabel) {
        publisherPlaceLabel.textContent = isIEEE
          ? "Kota dan negara penerbit * (IEEE)"
          : "Kota dan negara penerbit (IEEE)";
      }
    }
  }


  // Mengambil isi kolom berdasarkan nama.
  function getValue(name) {
    const input = dynamicFields.querySelector(
      `[name="${name}"]`
    );

    return input ? input.value.trim() : "";
  }


  // Mengambil semua data sumber.
  function getSourceData() {
    const data = {
      type: sourceType.value,
      format: getSelectedFormat()
    };

    fieldSets[data.type].forEach((field) => {
      data[field.name] = getValue(field.name);
    });

    return data;
  }


  // Mengubah DOI menjadi URL jika diperlukan.
  function normalizeLink(value) {
    if (!value) return "";

    const link = value.trim();

    if (/^10\.\d{4,9}\//i.test(link)) {
      return `https://doi.org/${link}`;
    }

    return link;
  }


  // Mengambil nomor DOI dari URL atau teks DOI.
  function getDOI(value) {
    const link = normalizeLink(value);

    const match = link.match(
      /(?:https?:\/\/)?(?:dx\.)?doi\.org\/(10\.\d{4,9}\/.+)/i
    );

    return match ? match[1] : "";
  }


  // Format tanggal APA untuk website.
  function formatAPADate(date) {
    if (!date) return "";

    const dateObject = new Date(`${date}T00:00:00`);

    return dateObject.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }


  // Format tanggal IEEE.
  function formatIEEEDate(date) {
    if (!date) return "";

    const dateObject = new Date(`${date}T00:00:00`);

    const months = [
      "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.",
      "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
    ];

    return `${months[dateObject.getMonth()]} ${dateObject.getDate()}, ${dateObject.getFullYear()}`;
  }


  // Mengambil nama penulis untuk sitasi dalam teks APA.
  function getAPAAuthorForInText(authorString) {
    const authors = authorString
      .split(/\s*&\s*|\s+and\s+/i)
      .map((author) => author.trim())
      .filter(Boolean);

    if (authors.length === 0) {
      return authorString.trim();
    }

    function getSurname(author) {
      return author.split(",")[0].trim();
    }

    if (authors.length >= 3) {
      return `${getSurname(authors[0])} et al.`;
    }

    if (authors.length === 2) {
      return `${getSurname(authors[0])} & ${getSurname(authors[1])}`;
    }

    return getSurname(authors[0]);
  }


  // Membuat sitasi dalam teks.
  function generateInTextCitation(data) {
    if (data.format === "IEEE") {
      return "[1]";
    }

    const author = data.type === "website"
      ? data.author
      : data.authors;

    const formattedAuthor =
      getAPAAuthorForInText(author);

    const year = data.type === "website"
      ? (
          data.publicationDate
            ? data.publicationDate.slice(0, 4)
            : "n.d."
        )
      : data.year;

    return `(${formattedAuthor}, ${year})`;
  }


  // Membuat daftar pustaka APA 7.
  function generateAPA(data) {
    const link = normalizeLink(data.doi || data.url || "");

    if (data.type === "journal") {
      const reference =
        `${data.authors} (${data.year}). ${data.title}. ` +
        `${data.journalTitle}, ${data.volume}` +
        `${data.issue ? `(${data.issue})` : ""}` +
        `${data.pages ? `, ${data.pages}` : ""}.`;

      return link ? `${reference} ${link}` : reference;
    }

    if (data.type === "book") {
      const reference =
        `${data.authors} (${data.year}). ${data.title}` +
        `${data.edition ? ` (${data.edition})` : ""}. ` +
        `${data.publisher}.`;

      return link ? `${reference} ${link}` : reference;
    }

    if (data.type === "website") {
      const date = data.publicationDate
        ? `(${formatAPADate(data.publicationDate)})`
        : "(n.d.)";

      const websiteName =
        data.websiteName.toLowerCase() !== data.author.toLowerCase()
          ? `${data.websiteName}. `
          : "";

      return `${data.author}. ${date}. ${data.title}. ${websiteName}${data.url}`;
    }

    if (data.type === "conference") {
      let reference =
        `${data.authors} (${data.year}). ${data.title}. ` +
        `In ${data.proceedingsTitle}` +
        `${data.pages ? ` (pp. ${data.pages})` : ""}.`;

      if (data.publisher) {
        reference += ` ${data.publisher}.`;
      }

      return link ? `${reference} ${link}` : reference;
    }

    return "";
  }


  // Membuat daftar pustaka IEEE.
  function generateIEEE(data) {
    const link = normalizeLink(data.doi || data.url || "");
    const doi = getDOI(data.doi || data.url || "");

    if (data.type === "journal") {
      let reference =
        `[1] ${data.authors}, "${data.title}," ` +
        `${data.journalTitle}, vol. ${data.volume}` +
        `${data.issue ? `, no. ${data.issue}` : ""}` +
        `${data.pages ? `, pp. ${data.pages}` : ""}, ${data.year}`;

      if (doi) {
        reference += `, doi: ${doi}.`;
      } else if (link) {
        reference += `. [Online]. Available: ${link}`;
      } else {
        reference += ".";
      }

      return reference;
    }

    if (data.type === "book") {
      let reference =
        `[1] ${data.authors}, ${data.title}` +
        `${data.edition ? `, ${data.edition}` : ""}, ` +
        `${data.publisherPlace}: ${data.publisher}, ${data.year}`;

      if (doi) {
        reference += `, doi: ${doi}.`;
      } else if (link) {
        reference += `. [Online]. Available: ${link}`;
      } else {
        reference += ".";
      }

      return reference;
    }

    if (data.type === "website") {
      return (
        `[1] ${data.author}, "${data.title}," ` +
        `${data.websiteName}. Accessed: ` +
        `${formatIEEEDate(data.accessDate)}. ` +
        `[Online]. Available: ${data.url}`
      );
    }

    if (data.type === "conference") {
      let reference =
        `[1] ${data.authors}, "${data.title}," ` +
        `in Proc. ${data.proceedingsTitle}` +
        `${data.location ? `, ${data.location}` : ""}` +
        `, ${data.year}` +
        `${data.pages ? `, pp. ${data.pages}` : ""}`;

      if (doi) {
        reference += `, doi: ${doi}.`;
      } else if (link) {
        reference += `. [Online]. Available: ${link}`;
      } else {
        reference += ".";
      }

      return reference;
    }

    return "";
  }


  // Catatan untuk hasil sitasi.
  function getFormatNote(data) {
    if (data.format === "APA") {
      if (data.type === "journal") {
        return "APA 7: cetak miring nama jurnal dan volume ketika memindahkan hasil ke Word.";
      }

      if (data.type === "book") {
        return "APA 7: cetak miring judul buku ketika memindahkan hasil ke Word.";
      }

      if (data.type === "website") {
        return "APA 7: periksa kembali tanggal publikasi, judul halaman, dan URL website.";
      }

      return "APA 7: periksa kembali judul dan informasi prosiding. Nama prosiding dicetak miring.";
    }

    return "IEEE: periksa kembali urutan penulis, informasi publikasi, nomor referensi, dan DOI.";
  }


  // Menghapus hasil generator sebelumnya.
  function clearGeneratedResult() {
    lastGeneratedData = null;
    savedDocumentId = null;

    referenceText.value = "";
    inTextCitation.value = "";

    result.hidden = true;
    preview.hidden = false;

    saveButton.disabled = true;
    saveButton.innerHTML = defaultSaveButtonHTML;

    saveStatus.textContent = "";
    copyNotification.hidden = true;
  }


  // Membuat dan menampilkan hasil referensi.
  function createReference() {
    if (!form.reportValidity()) return;

    const data = getSourceData();

    const reference = data.format === "APA"
      ? generateAPA(data)
      : generateIEEE(data);

    const inText = generateInTextCitation(data);

    if (!reference) {
      saveStatus.textContent = "Referensi belum dapat dibuat.";
      return;
    }

    referenceText.value = reference;
    inTextCitation.value = inText;

    formatLabel.textContent =
      data.format === "APA"
        ? "FORMAT APA 7"
        : "FORMAT IEEE";

    resultNote.textContent = getFormatNote(data);

    // Menyimpan hasil sementara sebelum pengguna menekan Simpan.
    lastGeneratedData = {
      sourceType: data.type,
      citationFormat: data.format,
      sourceData: { ...data },
      generatedCitation: reference,
      inTextCitation: inText
    };

    preview.hidden = true;
    result.hidden = false;

    copyNotification.hidden = true;

    saveButton.disabled = false;
    saveButton.innerHTML = defaultSaveButtonHTML;

    saveStatus.textContent = "";
    savedDocumentId = null;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }


  // Tombol Generate Citation.
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    createReference();
  });


  // Tombol Regenerate.
  regenerateButton.addEventListener("click", () => {
    createReference();
  });


  // Tombol Copy Reference.
  copyButton.addEventListener("click", async () => {
    const text = referenceText.value.trim();

    if (!text) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const tempInput = document.createElement("textarea");

        tempInput.value = text;
        tempInput.style.position = "fixed";
        tempInput.style.opacity = "0";

        document.body.appendChild(tempInput);
        tempInput.select();

        const copied = document.execCommand("copy");

        tempInput.remove();

        if (!copied) {
          throw new Error("Gagal menyalin referensi.");
        }
      }

      notificationText.textContent =
        "Referensi berhasil disalin.";

    } catch (error) {
      console.error("Gagal menyalin referensi:", error);

      notificationText.textContent =
        "Gagal menyalin. Silakan salin secara manual.";
    }

    copyNotification.hidden = false;
  });


  // Menyimpan hasil referensi ke Firebase.
  saveButton.addEventListener("click", async () => {
    if (!lastGeneratedData) {
      saveStatus.textContent =
        "Generate referensi terlebih dahulu.";

      return;
    }

    if (isSavingReference) return;

    if (savedDocumentId) {
      saveStatus.textContent =
        "Referensi ini sudah tersimpan di Firebase.";

      return;
    }

    if (typeof window.simpanHasilSitasi !== "function") {
      saveStatus.textContent =
        "Firebase belum siap. Periksa koneksi Firebase.";

      return;
    }

    isSavingReference = true;

    saveButton.disabled = true;
    saveButton.textContent = "Menyimpan...";

    saveStatus.textContent =
      "Sedang menyimpan referensi ke Firebase...";

    try {
      const documentId = await window.simpanHasilSitasi({
        ...lastGeneratedData
      });

      savedDocumentId = documentId;

      console.log("Referensi berhasil disimpan:", documentId);

      saveButton.textContent = "Referensi Tersimpan";

      saveStatus.textContent =
        "Referensi berhasil disimpan ke Firebase.";

    } catch (error) {
      console.error("Gagal menyimpan referensi:", error);

      saveButton.disabled = false;
      saveButton.textContent = "Coba Simpan Lagi";

      saveStatus.textContent =
        "Gagal menyimpan referensi. Periksa koneksi dan aturan Firebase.";

    } finally {
      isSavingReference = false;
    }
  });


  // Mengganti jenis sumber.
  sourceType.addEventListener("change", () => {
    renderFields();
    clearGeneratedResult();
  });


  // Mengganti format APA atau IEEE.
  form.querySelectorAll(
    'input[name="academicFormat"]'
  ).forEach((input) => {
    input.addEventListener("change", () => {
      updateFormatFields();
      clearGeneratedResult();
    });
  });


  // Reset seluruh formulir.
  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      renderFields();
      clearGeneratedResult();
    }, 0);
  });


  // Menampilkan kolom awal.
  renderFields();

})();


/* =========================================================
   7. NAVIGASI BERANDA, PANDUAN, CHECKLIST, GENERATOR,
      DEKLARASI, DAN TENTANG
   ========================================================= */

(() => {
  const routes = {
    "#top": {
      page: "home"
    },

    "#panduan": {
      page: "guide"
    },

    "#checklist": {
      page: "checklist"
    },

    "#generator": {
      page: "citation"
    },

    "#declaration": {
      page: "declaration"
    },

    "#tentang": {
      page: "home",
      targetId: "tentang"
    }
  };


  // Menangani semua tautan navigasi dalam satu tempat.
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");

    if (!link) return;

    const destination = link.getAttribute("href");
    const route = routes[destination];

    if (!route) return;

    event.preventDefault();

    showEthicAIPage(route.page, {
      hash: destination,
      targetId: route.targetId
    });
  }, true);


  // Menentukan halaman saat website pertama kali dibuka.
  const initialRoute = routes[window.location.hash];

  if (initialRoute) {
    showEthicAIPage(initialRoute.page, {
      updateUrl: false,
      targetId: initialRoute.targetId,
      scroll: false
    });
  } else {
    showEthicAIPage("home", {
      updateUrl: false,
      scroll: false
    });
  }

})();


/* =========================================================
   8. FAQ ACCORDION
   Hanya satu pertanyaan yang terbuka dalam satu waktu.
   ========================================================= */

(() => {
  const faqItems = document.querySelectorAll(".home-faq-item");

  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.open = false;
        }
      });
    });
  });

})();