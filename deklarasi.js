document.addEventListener('DOMContentLoaded', () => {
  // Render ikon Lucide (panah & centang)
  if (window.lucide) {
    lucide.createIcons();
  }

  const form = document.getElementById('declarationForm');
  const resetBtn = document.getElementById('resetBtn');
  const emptyStateCard = document.getElementById('emptyStateCard');
  const resultStateCard = document.getElementById('resultStateCard');
  const declarationOutput = document.getElementById('declarationOutput');
  const copyBtn = document.getElementById('copyBtn');
  const regenerateBtn = document.getElementById('regenerateBtn');
  const copyBadge = document.getElementById('copyBadge');

  let variantIndex = 0;

  // Menghapus titik/koma berlebih di akhir input pengguna
  function cleanEnding(text) {
    return text.trim().replace(/[.?!,]+$/, '');
  }

  // Mengubah huruf awal menjadi huruf kecil untuk posisi di tengah kalimat
  function toMidSentence(text) {
    const cleaned = cleanEnding(text);
    if (!cleaned) return '';
    if (cleaned.length > 1 && cleaned[1] === cleaned[1].toUpperCase() && /[A-Z]/.test(cleaned[1])) {
      return cleaned;
    }
    return cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
  }

  // Mengubah huruf awal menjadi huruf kapital untuk awal kalimat
  function toStartSentence(text) {
    const cleaned = cleanEnding(text);
    if (!cleaned) return '';
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  function generateDeclarationText() {
    const tools = cleanEnding(document.getElementById('aiTools').value);
    const purpose = toMidSentence(document.getElementById('aiPurpose').value);
    const assistance = toMidSentence(document.getElementById('aiAssistance').value);
    const taskPart = toMidSentence(document.getElementById('taskPart').value).replace(/^bagian\s+/i, '');
    const review = toStartSentence(document.getElementById('humanReview').value);

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

  // Submit form -> tampilkan hasil deklarasi
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    variantIndex = 0;
    declarationOutput.innerHTML = generateDeclarationText();

    emptyStateCard.classList.add('is-hidden');
    resultStateCard.classList.remove('is-hidden');
    copyBadge.classList.add('is-hidden');
  });

  // Tombol Regenerate -> ganti variasi kalimat formal
  regenerateBtn.addEventListener('click', () => {
    variantIndex += 1;
    declarationOutput.innerHTML = generateDeclarationText();
    copyBadge.classList.add('is-hidden');
  });

  // Tombol Copy Declaration -> salin teks bersih ke clipboard
  copyBtn.addEventListener('click', async () => {
    const cleanText = Array.from(declarationOutput.querySelectorAll('p:not(.decl-box-note)'))
      .map((p) => p.innerText.trim())
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(cleanText);
    } catch (err) {
      const tempInput = document.createElement('textarea');
      tempInput.value = cleanText;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
    }

    copyBadge.classList.remove('is-hidden');
    setTimeout(() => {
      copyBadge.classList.add('is-hidden');
    }, 3500);
  });

  // Tombol Reset Form -> kembalikan ke tampilan awal
  resetBtn.addEventListener('click', () => {
    form.reset();
    resultStateCard.classList.add('is-hidden');
    emptyStateCard.classList.remove('is-hidden');
    copyBadge.classList.add('is-hidden');
  });
});