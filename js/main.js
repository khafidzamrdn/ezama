/* ==========================================
   TENTANG DIA, DAN WAKTU — MAIN JAVASCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Generate Floating Stars on Opening Screen
  const starsContainer = document.getElementById('starsContainer');
  if (starsContainer) {
    const starCount = 35;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      const size = Math.random() * 3 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
      star.style.animationDelay = `${Math.random() * 3}s`;
      starsContainer.appendChild(star);
    }
  }

  // 2. Opening Screen Transition
  const openingScreen = document.getElementById('openingScreen');
  const openStoryBtn = document.getElementById('openStoryBtn');
  const mainApp = document.getElementById('mainApp');
  const backToIntro = document.getElementById('backToIntro');

  if (openStoryBtn && openingScreen && mainApp) {
    openStoryBtn.addEventListener('click', () => {
      openingScreen.classList.add('fade-out');
      setTimeout(() => {
        openingScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');
        // Trigger fade in
        setTimeout(() => {
          mainApp.classList.add('visible');
        }, 50);
      }, 700);
    });
  }

  if (backToIntro && openingScreen && mainApp) {
    backToIntro.addEventListener('click', () => {
      mainApp.classList.remove('visible');
      setTimeout(() => {
        mainApp.classList.add('hidden');
        openingScreen.classList.remove('hidden');
        setTimeout(() => {
          openingScreen.classList.remove('fade-out');
        }, 50);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 700);
    });
  }

  // 3. Real-Time Timer (Since January 20, 2026, 00:00:00 WIB / UTC+7)
  const targetDate = new Date('2026-01-20T00:00:00+07:00');

  const daysCountEl = document.getElementById('daysCount');
  const hoursCountEl = document.getElementById('hoursCount');
  const minutesCountEl = document.getElementById('minutesCount');
  const secondsCountEl = document.getElementById('secondsCount');

  function updateTimer() {
    const now = new Date();
    const diff = now - targetDate;

    if (diff <= 0) {
      if (daysCountEl) daysCountEl.textContent = '0';
      if (hoursCountEl) hoursCountEl.textContent = '00';
      if (minutesCountEl) minutesCountEl.textContent = '00';
      if (secondsCountEl) secondsCountEl.textContent = '00';
      return;
    }

    const secondsTotal = Math.floor(diff / 1000);
    const days = Math.floor(secondsTotal / (3600 * 24));
    const hours = Math.floor((secondsTotal % (3600 * 24)) / 3600);
    const minutes = Math.floor((secondsTotal % 3600) / 60);
    const seconds = secondsTotal % 60;

    if (daysCountEl) daysCountEl.textContent = days.toLocaleString();
    if (hoursCountEl) hoursCountEl.textContent = String(hours).padStart(2, '0');
    if (minutesCountEl) minutesCountEl.textContent = String(minutes).padStart(2, '0');
    if (secondsCountEl) secondsCountEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);

  // 4. Ambient Audio Toggle
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const bgAudio = document.getElementById('bgAudio');
  const audioLabel = document.getElementById('audioLabel');
  let isPlaying = false;

  if (audioToggleBtn && bgAudio) {
    audioToggleBtn.addEventListener('click', () => {
      if (isPlaying) {
        bgAudio.pause();
        isPlaying = false;
        audioLabel.textContent = 'Musik';
        audioToggleBtn.style.opacity = '0.8';
      } else {
        bgAudio.play().then(() => {
          isPlaying = true;
          audioLabel.textContent = 'Jeda Musik';
          audioToggleBtn.style.opacity = '1';
        }).catch(err => {
          console.log("Audio playback prevented:", err);
          alert("Gagal memutar audio otomatis. Silakan coba lagi.");
        });
      }
    });
  }

  // 5. Navigation Active State on Scroll
  const navLinks = document.querySelectorAll('.diary-nav a');
  const sections = document.querySelectorAll('.section');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

  // 6. LocalStorage Diary Entries Management (Add, Edit, Delete)
  const STORAGE_KEY = 'tentang_dia_entries';
  const diaryForm = document.getElementById('diaryForm');
  const entryIndexInput = document.getElementById('entryIndex');
  const entryTitleInput = document.getElementById('entryTitle');
  const entryBodyInput = document.getElementById('entryBody');
  const formTitle = document.getElementById('formTitle');
  const saveEntryBtn = document.getElementById('saveEntryBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const entriesList = document.getElementById('entriesList');

  // Load default initial entries if localStorage is empty
  function getEntries() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const defaultEntries = [
        {
          id: 1,
          title: "Pertemuan Singkat di Persimpangan",
          body: "Hari ini, tanpa disengaja, aku melihatnya tersenyum dari kejauhan. Ada kehangatan yang tertinggal lama setelah ia berlalu.",
          date: "22 Januari 2026"
        }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEntries));
      return defaultEntries;
    }
    return JSON.parse(data);
  }

  function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function renderEntries() {
    if (!entriesList) return;
    const entries = getEntries();
    entriesList.innerHTML = '';

    if (entries.length === 0) {
      entriesList.innerHTML = '<p style="text-align: center; color: var(--text-muted); font-family: var(--font-serif); font-style: italic;">Belum ada catatan tersimpan.</p>';
      return;
    }

    entries.forEach((entry, index) => {
      const card = document.createElement('div');
      card.classList.add('entry-card');
      card.innerHTML = `
        <div class="entry-header">
          <div>
            <h3 class="entry-title">${escapeHTML(entry.title)}</h3>
            <span class="entry-date">${escapeHTML(entry.date)}</span>
          </div>
        </div>
        <p class="entry-body">${escapeHTML(entry.body)}</p>
        <div class="entry-footer-actions">
          <button class="btn-sm" onclick="editEntry(${index})">Edit</button>
          <button class="btn-sm btn-delete" onclick="deleteEntry(${index})">Hapus</button>
        </div>
      `;
      entriesList.appendChild(card);
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  if (diaryForm) {
    diaryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = entryTitleInput.value.trim();
      const body = entryBodyInput.value.trim();
      const index = parseInt(entryIndexInput.value);

      if (!title || !body) return;

      const entries = getEntries();
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const currentDate = new Date().toLocaleDateString('id-ID', options);

      if (index === -1) {
        // Add new
        entries.unshift({
          id: Date.now(),
          title,
          body,
          date: currentDate
        });
      } else {
        // Edit existing
        entries[index].title = title;
        entries[index].body = body;
        entries[index].date = currentDate + " (Diedit)";
      }

      saveEntries(entries);
      resetForm();
      renderEntries();
    });
  }

  window.editEntry = function(index) {
    const entries = getEntries();
    const entry = entries[index];
    if (!entry) return;

    entryIndexInput.value = index;
    entryTitleInput.value = entry.title;
    entryBodyInput.value = entry.body;
    formTitle.textContent = "Edit Catatan";
    saveEntryBtn.textContent = "Perbarui Catatan";
    cancelEditBtn.classList.remove('hidden');

    document.getElementById('catatanPribadi').scrollIntoView({ behavior: 'smooth' });
  };

  window.deleteEntry = function(index) {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus catatan ini?");
    if (!confirmed) return;

    const entries = getEntries();
    entries.splice(index, 1);
    saveEntries(entries);
    renderEntries();
  };

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', () => {
      resetForm();
    });
  }

  function resetForm() {
    diaryForm.reset();
    entryIndexInput.value = '-1';
    formTitle.textContent = "Tulis Kenangan Baru";
    saveEntryBtn.textContent = "Simpan Catatan";
    cancelEditBtn.classList.add('hidden');
  }

  // Initial render of entries
  renderEntries();

});
