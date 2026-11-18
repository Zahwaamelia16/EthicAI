/*
 * EthicAI - AI Transparency Checklist
 * Bagian yang dikerjakan: checklist 5 pertanyaan dan halaman hasil evaluasi.
 * Empat pertanyaan selain pertanyaan pertama disusun dari aspek yang muncul
 * pada desain halaman hasil: izin penggunaan, verifikasi, pemahaman ulang,
 * serta hak cipta/sumber.
 */

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

const elements = {
  header: document.getElementById("siteHeader"),
  footer: document.getElementById("siteFooter"),
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
  improvementSection: document.getElementById("improvementSection"),
  improvementList: document.getElementById("improvementList"),
  doneList: document.getElementById("doneList"),
  declarationButton: document.getElementById("declarationButton"),
  restartButton: document.getElementById("restartButton"),
  toast: document.getElementById("toast")
};

function getAnsweredCount() {
  return answers.filter((answer) => answer !== null).length;
}

function renderQuestion() {
  const question = questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];
  const answeredCount = getAnsweredCount();
  const percentage = Math.round((answeredCount / questions.length) * 100);

  elements.progressText.textContent = `${answeredCount} dari ${questions.length} pertanyaan terjawab`;
  elements.progressPercent.textContent = `${percentage}%`;
  elements.progressFill.style.width = `${percentage}%`;
  elements.progressTrack.setAttribute("aria-valuenow", String(answeredCount));

  elements.questionNumber.textContent = `${String(currentQuestion + 1).padStart(2, "0")} / ${question.category}`;
  elements.questionTitle.textContent = question.title;
  elements.questionDescription.textContent = question.description;

  document.querySelectorAll('input[name="answer"]').forEach((input) => {
    input.checked = input.value === selectedAnswer;
  });
  elements.yesOption.classList.toggle("selected", selectedAnswer === "yes");
  elements.noOption.classList.toggle("selected", selectedAnswer === "no");

  elements.backButton.disabled = currentQuestion === 0;
  elements.nextButton.disabled = selectedAnswer === null;
  elements.nextButton.textContent = currentQuestion === questions.length - 1 ? "Lihat Hasil" : "Lanjut";

  if (answeredCount === questions.length) {
    elements.helperText.textContent = "Semua pertanyaan sudah dijawab. Lihat ringkasan evaluasimu.";
  } else {
    elements.helperText.textContent = "Jawab seluruh pertanyaan untuk melihat ringkasan evaluasi";
  }
}

function chooseAnswer(value) {
  answers[currentQuestion] = value;
  renderQuestion();
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => elements.toast.classList.remove("show"), 2800);
}

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

function renderResult() {
  const yesCount = answers.filter((answer) => answer === "yes").length;
  const percentage = Math.round((yesCount / questions.length) * 100);
  const noIndexes = questions
    .map((question, index) => (answers[index] === "no" ? index : -1))
    .filter((index) => index !== -1);
  const completedHabits = questions.filter((question, index) => answers[index] === "yes");
  const scoreMessage = getScoreMessage(percentage);

  elements.scoreNumber.textContent = `${percentage}%`;
  elements.scoreCaption.textContent = `${yesCount} dari ${questions.length} jawaban “Ya”`;
  elements.scoreHeading.innerHTML = scoreMessage.heading.replace("\n", "<br />");
  elements.scoreDescription.textContent = scoreMessage.description;

  elements.improvementList.replaceChildren();
  if (noIndexes.length === 0) {
    const completeMessage = document.createElement("div");
    completeMessage.className = "no-improvement";
    completeMessage.textContent = "Tidak ada jawaban “Tidak”. Pertahankan kebiasaan transparansi dan tanggung jawab dalam menggunakan AI.";
    elements.improvementList.appendChild(completeMessage);
  } else {
    noIndexes.forEach((index) => {
      const question = questions[index];
      const item = document.createElement("article");
      item.className = "improvement-item";

      const title = document.createElement("h3");
      title.textContent = `${String(index + 1).padStart(2, "0")} / ${question.improvementTitle}`;
      const description = document.createElement("p");
      description.textContent = question.improvementText;

      item.append(title, description);
      elements.improvementList.appendChild(item);
    });
  }

  elements.doneList.replaceChildren();
  if (completedHabits.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "done-empty";
    emptyItem.textContent = "Belum ada kebiasaan yang ditandai sudah dilakukan. Mulailah dari satu langkah kecil.";
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

function showResult() {
  if (answers.some((answer) => answer === null)) {
    showToast("Lengkapi semua pertanyaan terlebih dahulu.");
    return;
  }

  renderResult();
  elements.checklistView.classList.add("is-hidden");
  elements.resultView.classList.remove("is-hidden");
  elements.header.classList.add("is-hidden");
  elements.footer.classList.remove("is-hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goToNext() {
  if (answers[currentQuestion] === null) return;
  if (currentQuestion === questions.length - 1) {
    showResult();
    return;
  }
  currentQuestion += 1;
  renderQuestion();
}

function goToPrevious() {
  if (currentQuestion === 0) return;
  currentQuestion -= 1;
  renderQuestion();
}

function restartChecklist() {
  answers.fill(null);
  currentQuestion = 0;
  elements.resultView.classList.add("is-hidden");
  elements.checklistView.classList.remove("is-hidden");
  elements.header.classList.remove("is-hidden");
  elements.footer.classList.remove("is-hidden");
  renderQuestion();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Event listeners untuk pilihan jawaban.
document.querySelectorAll('input[name="answer"]').forEach((input) => {
  input.addEventListener("change", (event) => chooseAnswer(event.target.value));
});

elements.backButton.addEventListener("click", goToPrevious);
elements.nextButton.addEventListener("click", goToNext);
elements.restartButton.addEventListener("click", restartChecklist);

// Tombol ini terhubung langsung dengan bagian Generator Deklarasi AI.
elements.declarationButton.addEventListener("click", () => {
  const declarationEvent = new CustomEvent("ethicai:open-generator", {
    detail: { answers: [...answers], questions }
  });
  window.dispatchEvent(declarationEvent);
});

// Tautan Generator pada navbar.
document.getElementById("generatorNav").addEventListener("click", (event) => {
  event.preventDefault();
});

renderQuestion();
if (window.lucide) {
  window.lucide.createIcons();
}


// GENERATOR SITASI AI - ETHICAI

(() => {

  const citationForm = document.getElementById("citationForm");

  if (!citationForm) return;

  // Mengambil elemen HTML
  const previewContent = document.getElementById("previewContent");
  const resultContent = document.getElementById("resultContent");

  const citationText = document.getElementById("citationText");
  const resultFormat = document.getElementById("resultFormat");
  const usageNote = document.getElementById("usageNote");

  const copyButton = document.getElementById("copyCitation");
  const regenerateButton = document.getElementById("regenerateCitation");

  const copyNotification = document.getElementById("copyNotification");
  const notificationText = document.getElementById("notificationText");
  const notificationCaption = document.getElementById("notificationCaption");

  // Memastikan elemen HTML tersedia
  if (
    !previewContent ||
    !resultContent ||
    !citationText ||
    !resultFormat ||
    !usageNote ||
    !copyButton ||
    !regenerateButton ||
    !copyNotification ||
    !notificationText
  ) {
    console.error("Elemen Generator Sitasi belum lengkap.");
    return;
  }

  // Tampilan awal: panel hijau terlihat
  previewContent.hidden = false;
  resultContent.hidden = true;
  copyNotification.hidden = true;

  if (notificationCaption) {
    notificationCaption.hidden = true;
  }

  // Mengambil data form
  function getFormData() {

    const selectedFormat = citationForm.querySelector(
      'input[name="citationFormat"]:checked'
    );

    return {
      toolName: document.getElementById("toolName").value.trim(),
      developer: document.getElementById("developer").value.trim(),
      version: document.getElementById("version").value.trim(),
      date: document.getElementById("usageDate").value,
      purpose: document.getElementById("purpose").value.trim(),
      url: document.getElementById("toolUrl").value.trim(),
      format: selectedFormat ? selectedFormat.value : "APA"
    };

  }

  // Format tanggal Indonesia
  function formatIndonesianDate(date) {

    const dateObject = new Date(date + "T00:00:00");

    return dateObject.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

  }

  // Format tanggal IEEE
  function formatEnglishDate(date) {

    const dateObject = new Date(date + "T00:00:00");

    return dateObject.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  }

  // Membuat sitasi APA
  function generateAPA(data) {

    const year = data.date.slice(0, 4);
    const author = data.developer || data.toolName;

    const toolInformation = data.version
      ? `${data.toolName} (${data.version})`
      : data.toolName;

    let citation =
      `${author}. (${year}). ${toolInformation} [Large language model].`;

    if (data.url) {
      citation += ` ${data.url}`;
    }

    return citation;

  }

  // Membuat sitasi IEEE
  function generateIEEE(data) {

    const year = data.date.slice(0, 4);
    const author = data.developer || data.toolName;

    const toolInformation = data.version
      ? `${data.toolName} (${data.version})`
      : data.toolName;

    const accessDate = formatEnglishDate(data.date);

    let citation =
      `[1] ${author}, "${toolInformation}," ${year}. [Online].`;

    if (data.url) {
      citation += ` Available: ${data.url}.`;
    }

    citation += ` [Accessed: ${accessDate}].`;

    return citation;

  }

  // Proses membuat sitasi
  function createCitation() {

    if (!citationForm.reportValidity()) {
      return;
    }

    const data = getFormData();

    let result = "";

    if (data.format === "APA") {
      result = generateAPA(data);
    } else {
      result = generateIEEE(data);
    }

    // Menampilkan hasil sitasi
    citationText.value = result;

    resultFormat.textContent =
      `FORMAT ${data.format} · CONTOH BERDASARKAN INPUT`;

    usageNote.textContent =
      `Catatan penggunaan: ${formatIndonesianDate(data.date)}; ${data.purpose}`;

    // PANEL HIJAU HILANG
    previewContent.hidden = true;

    // CARD HASIL PUTIH MUNCUL
    resultContent.hidden = false;

    // Menyembunyikan notifikasi sebelumnya
    copyNotification.hidden = true;

    if (notificationCaption) {
      notificationCaption.hidden = true;
    }

  }

  // Tombol Generate Citation
  citationForm.addEventListener("submit", function(event) {

    event.preventDefault();
    createCitation();

  });

  // Tombol Regenerate
  regenerateButton.addEventListener("click", function() {

    createCitation();

  });

  // Tombol Copy Citation
  copyButton.addEventListener("click", async function() {

    const text = citationText.value.trim();

    if (!text) return;

    try {

      if (navigator.clipboard && window.isSecureContext) {

        await navigator.clipboard.writeText(text);

      } else {

        const temporaryInput = document.createElement("textarea");

        temporaryInput.value = text;
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";

        document.body.appendChild(temporaryInput);

        temporaryInput.select();

        const copied = document.execCommand("copy");

        temporaryInput.remove();

        if (!copied) {
          throw new Error("Gagal menyalin sitasi");
        }

      }

      notificationText.textContent =
        "Berhasil disalin ke clipboard";

    } catch (error) {

      notificationText.textContent =
        "Gagal menyalin. Silakan salin secara manual.";

    }

    // Menampilkan notifikasi
    copyNotification.hidden = false;

    if (notificationCaption) {
      notificationCaption.hidden = false;
    }

  });


  // Tombol Reset Form
  citationForm.addEventListener("reset", function() {

    setTimeout(function() {

      citationText.value = "";
      resultFormat.textContent = "";
      usageNote.textContent = "";

      // PANEL HIJAU MUNCUL KEMBALI
      previewContent.hidden = false;

      // CARD HASIL PUTIH HILANG
      resultContent.hidden = true;

      // Menyembunyikan notifikasi
      copyNotification.hidden = true;

      if (notificationCaption) {
        notificationCaption.hidden = true;
      }

    }, 0);

  });

})();

// NAVIGASI generatos sitasi tambahan

(() => {

  const checklistView = document.getElementById("checklistView");
  const resultView = document.getElementById("resultView");
  const generatorView = document.getElementById("generator");

  const checklistNav = document.getElementById("checklistNav");
  const generatorNav = document.getElementById("generatorNav");

  const header = document.getElementById("siteHeader");
  const footer = document.getElementById("siteFooter");

  // Pastikan elemen tersedia
  if (
    !checklistView ||
    !resultView ||
    !generatorView ||
    !checklistNav ||
    !generatorNav
  ) {
    return;
  }

  // Fungsi menampilkan halaman
  function openPage(page) {

    checklistView.classList.toggle(
      "is-hidden",
      page !== "checklist"
    );

    resultView.classList.add("is-hidden");

    generatorView.classList.toggle(
      "is-hidden",
      page !== "generator"
    );

    // Menampilkan header dan footer
    header?.classList.remove("is-hidden");
    footer?.classList.remove("is-hidden");

    // Mengatur menu aktif
    checklistNav.classList.toggle(
      "active",
      page === "checklist"
    );

    generatorNav.classList.toggle(
      "active",
      page === "generator"
    );

    // Memperbarui alamat halaman
    history.replaceState(
      null,
      "",
      page === "generator" ? "#generator" : "#checklist"
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }

  // Mengatur navigasi menggunakan capture
  // agar tidak bentrok dengan event sementara temanmu.
  document.addEventListener("click", function(event) {

    const link = event.target.closest(
      'a[href="#generator"], a[href="#checklist"]'
    );

    if (!link) return;

    const destination = link.getAttribute("href");

    event.preventDefault();
    event.stopPropagation();

    if (destination === "#generator") {

      openPage("generator");

    } else if (destination === "#checklist") {

      openPage("checklist");

    }

  }, true);

})();

/* =========================================================
   LOGIKA HALAMAN GENERATOR DEKLARASI AI
   ========================================================= */
(() => {
  const declarationView = document.getElementById("declaration");
  if (!declarationView) return;

  const checklistView = document.getElementById("checklistView");
  const resultView = document.getElementById("resultView");
  const citationView = document.getElementById("generator");

  const checklistNav = document.getElementById("checklistNav");
  const generatorNav = document.getElementById("generatorNav");
  const header = document.getElementById("siteHeader");
  const footer = document.getElementById("siteFooter");

  function openDeclarationPage() {
    if (checklistView) checklistView.classList.add("is-hidden");
    if (resultView) resultView.classList.add("is-hidden");
    if (citationView) citationView.classList.add("is-hidden");

    declarationView.classList.remove("is-hidden");

    if (header) header.classList.remove("is-hidden");
    if (footer) footer.classList.remove("is-hidden");

    if (checklistNav) checklistNav.classList.remove("active");
    if (generatorNav) generatorNav.classList.add("active");

    history.replaceState(null, "", "#declaration");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Buka halaman Deklarasi saat tombol "Buat Deklarasi AI" di halaman hasil diklik
  window.addEventListener("ethicai:open-generator", openDeclarationPage);

  // Buka halaman Deklarasi saat tab "AI Declaration Generator" diklik
  document.addEventListener("click", (event) => {
    const declLink = event.target.closest('a[href="#declaration"]');
    if (declLink) {
      event.preventDefault();
      event.stopPropagation();
      openDeclarationPage();
      return;
    }

    // Sembunyikan halaman Deklarasi jika user pindah ke Checklist atau Sitasi
    const otherLink = event.target.closest('a[href="#generator"], a[href="#checklist"]');
    if (otherLink) {
      declarationView.classList.add("is-hidden");
    }
  }, true);

  // Logika Form & Generator Teks Deklarasi
  const form = document.getElementById("declarationForm");
  const resetBtn = document.getElementById("resetDeclBtn");
  const emptyStateCard = document.getElementById("declEmptyStateCard");
  const resultStateCard = document.getElementById("declResultStateCard");
  const declarationOutput = document.getElementById("declarationOutput");
  const copyBtn = document.getElementById("copyDeclBtn");
  const regenerateBtn = document.getElementById("regenerateDeclBtn");
  const copyBadge = document.getElementById("declCopyBadge");

  let variantIndex = 0;

  function cleanEnding(text) {
    return text.trim().replace(/[.?!,]+$/, "");
  }

  function toMidSentence(text) {
    const cleaned = cleanEnding(text);
    if (!cleaned) return "";
    if (cleaned.length > 1 && cleaned[1] === cleaned[1].toUpperCase() && /[A-Z]/.test(cleaned[1])) {
      return cleaned;
    }
    return cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
  }

  function toStartSentence(text) {
    const cleaned = cleanEnding(text);
    if (!cleaned) return "";
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  function generateDeclarationText() {
    const tools = cleanEnding(document.getElementById("aiTools").value);
    const purpose = toMidSentence(document.getElementById("aiPurpose").value);
    const assistance = toMidSentence(document.getElementById("aiAssistance").value);
    const taskPart = toMidSentence(document.getElementById("taskPart").value).replace(/^bagian\s+/i, "");
    const review = toStartSentence(document.getElementById("humanReview").value);

    const templates = [
      {
        p1: `Saya menggunakan ${tools} untuk ${purpose}. Bantuan AI mencakup ${assistance}, serta ${taskPart}.`,
        p2: `${review}. Saya bertanggung jawab atas isi, keakuratan, dan orisinalitas tugas akhir ini.`
      },
      {
        p1: `Dalam penyusunan tugas ini, saya memanfaatkan ${tools} guna ${purpose}, khususnya melalui ${assistance} pada bagian ${taskPart}.`,
        p2: `${review}. Seluruh substansi, validasi sumber, dan keaslian karya ini sepenuhnya menjadi tanggung jawab saya.`
      }
    ];

    const selected = templates[variantIndex % templates.length];

    return `
      <p>${selected.p1}</p>
      <p>${selected.p2}</p>
      <p class="decl-box-note" contenteditable="false">Tinjau dan sesuaikan sebelum dimasukkan ke tugas</p>
    `;
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      variantIndex = 0;
      declarationOutput.innerHTML = generateDeclarationText();

      emptyStateCard.classList.add("is-hidden");
      resultStateCard.classList.remove("is-hidden");
      copyBadge.classList.add("is-hidden");
    });
  }

  if (regenerateBtn) {
    regenerateBtn.addEventListener("click", () => {
      variantIndex += 1;
      declarationOutput.innerHTML = generateDeclarationText();
      copyBadge.classList.add("is-hidden");
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const cleanText = Array.from(declarationOutput.querySelectorAll("p:not(.decl-box-note)"))
        .map((p) => p.innerText.trim())
        .join("\n\n");

      try {
        await navigator.clipboard.writeText(cleanText);
      } catch (err) {
        const tempInput = document.createElement("textarea");
        tempInput.value = cleanText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }

      copyBadge.classList.remove("is-hidden");
      setTimeout(() => {
        copyBadge.classList.add("is-hidden");
      }, 3500);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      form.reset();
      resultStateCard.classList.add("is-hidden");
      emptyStateCard.classList.remove("is-hidden");
      copyBadge.classList.add("is-hidden");
    });
  }
})();