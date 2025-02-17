const texts = [];
const images = [];
let currentIndex = 0;
let manualMode = false;
let autoPlay;

const textBox = document.getElementById("text-box");
const imageBox = document.getElementById("image-box");
const progressBar = document.getElementById("progress-bar");
const pageIndicator = document.getElementById("page-indicator");
const manualBtn = document.getElementById("manual-btn");
const bgMusic = document.getElementById("bg-music");
const musicSelect = document.getElementById("music-select");
const judulElement = document.querySelector(".judul");

// Fungsi untuk mengambil data dari JSON dan mereset index ke awal
async function loadContent(title) {
  try {
    const response = await fetch("content.json");
    const data = await response.json();

    if (data[title]) {
      texts.length = 0;
      images.length = 0;
      
      texts.push(...data[title].texts);
      images.push(...data[title].images);

      currentIndex = 0; // Reset ke awal setiap kali judul berubah
      judulElement.innerText = title;
      updateContent();
    } else {
      console.error("Judul tidak ditemukan di content.json");
    }
  } catch (error) {
    console.error("Gagal memuat data:", error);
  }
}

// Fungsi untuk memuat judul cerita dari JSON ke navbar
async function loadTitles() {
  try {
    const response = await fetch('content.json');
    const data = await response.json();
    
    const navList = document.getElementById("nav-list");
    navList.innerHTML = ""; // Kosongkan daftar sebelum mengisi ulang

    Object.keys(data).forEach(title => {
      const listItem = document.createElement("li");
      listItem.textContent = title;
      listItem.onclick = () => changeTitle(title); // Event klik untuk mengganti cerita
      navList.appendChild(listItem);
    });

  } catch (error) {
    console.error("Gagal memuat judul:", error);
  }
}

// Fungsi untuk mengganti judul dan reset ke awal
async function changeTitle(title) {
  await loadContent(title); // Panggil fungsi untuk memuat ulang teks dari awal
  document.getElementById("nav-list").style.display = "none";
}

// Panggil fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  loadTitles();
  showWelcomeAlert();
  loadMusic();
});

// Perbaikan Alert Selamat Datang
function showWelcomeAlert() {
  Swal.fire({
    title: "Selamat Datang!",
    text: "Pilih cerita dan nikmati bacaanmu.",
    icon: "info",
    confirmButtonText: "Mulai",
    allowOutsideClick: false,
    allowEscapeKey: false,
  }).then(() => {
    loadContent("Permen Pagi Itu"); // Mulai dengan cerita pertama
    toggleMusic(); // Langsung mainkan musik
    resetAutoPlay(); // Langsung mulai auto-play
  });
}
// Fungsi untuk memperbarui tampilan konten
function updateContent() {
    textBox.style.opacity = "0";  
    textBox.style.transform = "translateY(-30px)";  

    setTimeout(() => {  
        let formattedText = texts[currentIndex].replace(/∆/g, "<br>");  
        let lines = formattedText.split("<br>");

        textBox.innerHTML = lines.map((line, i) => {
            let letters = line.split("").map((char, j) => 
                `<span style="animation-delay: ${(i * 2.5) + (j * 0.1)}s">${char}</span>`
            ).join("");
            return `<div class="text-line">${letters}</div>`;
        }).join("");

        textBox.style.opacity = "1";  
        textBox.style.transform = "translateY(0)";  
    }, 900);  

    imageBox.style.opacity = "0";  
    setTimeout(() => {  
        imageBox.style.backgroundImage = `url('${images[currentIndex] || "default.jpg"}')`;  
        imageBox.style.opacity = "1";  
    }, 900);  

    pageIndicator.innerText = `${currentIndex + 1} / ${texts.length}`;  
    progressBar.style.width = `${((currentIndex + 1) / texts.length) * 100}%`;  
}

// Fungsi untuk maju ke teks berikutnya
function nextText() {
  if (currentIndex < texts.length - 1) {
    currentIndex++;
  } else {
    currentIndex = 0; // Jika sampai akhir, kembali ke awal
  }
  updateContent();
  resetAutoPlay(); // Reset timer autoplay setelah berpindah teks
}

// Fungsi untuk kembali ke teks sebelumnya
function prevText() {
  if (currentIndex > 0) {
    currentIndex--;
    updateContent();
    resetAutoPlay(); // Reset timer autoplay setelah berpindah teks
  }
}

// Fungsi untuk mengaktifkan / menonaktifkan mode manual
function toggleManualMode() {
  manualMode = !manualMode;
  let manualIcon = manualBtn.querySelector("i");
  let manualText = manualBtn.querySelector(".btn-text");

  if (manualMode) {
    clearInterval(autoPlay);
    manualIcon.classList.replace("fa-hand-pointer", "fa-rotate-right");
    manualText.innerText = "Manual Mode: ON";
  } else {
    resetAutoPlay(); // Reset autoplay saat keluar dari mode manual
    manualIcon.classList.replace("fa-rotate-right", "fa-hand-pointer");
    manualText.innerText = "Manual Mode: OFF";
  }
}

// Fungsi untuk mereset interval autoplay
function resetAutoPlay() {
  if (!manualMode) {
    clearInterval(autoPlay); // Hentikan interval lama
    autoPlay = setInterval(nextText, 15000); // Mulai ulang interval autoplay
  }
}

// Auto-play pertama kali saat halaman dimuat
if (!manualMode) {
  autoPlay = setInterval(nextText, 15000);
}

// Fungsi untuk memainkan / menghentikan musik
function toggleMusic() {
  let musicBtn = document.getElementById("music-btn");
  let musicIcon = musicBtn.querySelector("i");
  let musicText = musicBtn.querySelector(".btn-text");

  if (bgMusic.paused) {
    bgMusic.play();
    musicIcon.classList.replace("fa-play", "fa-pause");
    musicText.innerText = "Stop Musik";
  } else {
    bgMusic.pause();
    musicIcon.classList.replace("fa-pause", "fa-play");
    musicText.innerText = "Mainkan Musik";
  }
}

// Auto-play jika manual mode mati
if (!manualMode) {
  autoPlay = setInterval(nextText, 15000);
}

// Fungsi untuk membuka / menutup navbar
function toggleNavbar() {
  let navList = document.getElementById("nav-list");
  navList.style.display = navList.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", (e) => {
      if (!e.target.closest(".navbar, .nav-list")) {
        document.getElementById("nav-list").style.display = "none";
      }
    });

function toggleTheme() {
  let container = document.querySelector(".container");
  let themeBtn = document.getElementById("theme-btn");
  let themeIcon = themeBtn.querySelector("i");
  let themeText = themeBtn.querySelector(".btn-text");

  container.classList.toggle("light-mode");

  if (container.classList.contains("light-mode")) {
    themeIcon.classList.replace("fa-sun", "fa-moon");
    themeText.innerText = "Ganti ke Gelap";
  } else {
    themeIcon.classList.replace("fa-moon", "fa-sun");
    themeText.innerText = "Ganti ke Terang";
  }
}

function changeMusic() {
  const selectedMusic = musicSelect.value;
  if (selectedMusic) {
    bgMusic.src = selectedMusic;
    bgMusic.load(); // Muat ulang musik agar perubahan diterapkan
    bgMusic.play(); // Mulai putar lagu baru
  }
}

function loadMusic() {
  const selectElement = document.getElementById("music-select");

  fetch("music.json")
    .then(response => response.json())
    .then(data => {
      selectElement.innerHTML = ""; // Kosongkan dulu opsi yang ada

      data.forEach(music => {
        const option = document.createElement("option");
        option.value = music.file;
        option.textContent = music.title;
        selectElement.appendChild(option);
      });

      // Pastikan ada lagu pertama yang dipilih saat halaman dimuat
      if (data.length > 0) {
        bgMusic.src = data[0].file;
        bgMusic.load();
      }

      // Hapus instance Choices.js sebelumnya jika ada
      if (selectElement.choicesInstance) {
        selectElement.choicesInstance.destroy();
      }

      // Terapkan Choices.js untuk dropdown musik
      selectElement.choicesInstance = new Choices(selectElement, {
        searchEnabled: false,
        itemSelectText: '',
        shouldSort: false,
      });

      // Tambahkan event listener agar musik berubah saat pilihan diubah
      selectElement.addEventListener("change", changeMusic);
    })
    .catch(error => console.error("Error mengambil data:", error));
}