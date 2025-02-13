const texts = [
  "Sunrise membara membawa kenangan, desingan ombak dan kicauan burung, membawa manis pagi itu.",
  
  "Belaian angin, membuat nyaman setiap insan, kau datang dengan permen, memikat rasa yang lalu.",
  
  "Bising menjadi saksi, akan sukanya aku dengan damai, dan alayya (langit) pagi itu, menjadi saksi, akan jatuhnya aku padamu.",
  
  "Diam mu mengajarkanku, betapa indahnya sunyi, jarak mengajarkanku, betapa berharganya waktu, kau mengajarkanku betapa indahnya bertahan.",
 
  "Melalui semuanya melewati masa yang akan datang, walau tahu semua tidak baik baik saja, senyum bisa melupakan segalanya.",
  
  "Kata Heraclitus, kita tidak pernah menginjak sungai yang sama dua kali, tapi aku tetap akan merindukan air yang kita lihat pagi itu.",
  
  "Kado terbaik adalah rindu yang ku rasa, rasa terbaik adalah manisnya masa, masa terbaik adalah sunrise kala itu, dan yang terbaik adalah yang mengajarkanku artinya rindu.",
  
  "Tak banyak kata yang bisa ku rangkai, takkan cukup masa tuk bisa menggambarkan, betapa rindunya aku akan permen pagi itu.",
  
  "Aku rasa ini adalah kado terakhir, dari aku yang sudah menanti, tp bukan berarti penantian ini akan berhenti, hanya saja aku akan berada di barisan paling belakang.",
  
  "Tempat mu takkan terganti, yang pertama tetap akan menjadi yang pertama, karena selenic (bulan) hanya ada satu, dan yang berikutnya itu adalah sesuatu yang lain.",
  
 "Pertemuan kita di awali dengan malam, penantian pertama di hiasi oleh sunrise, perpisahan di iringin oleh selenic, dan kini kado terakhir di hari terbaik.",

  "You will always be beautiful, and there will be many people waiting to take care of you, but will you be friends with me?",
];

const images = [
  "img1.jpg", "img2.jpg", "img3.jpg", 
  "img4.jpg", "img5.jpg", "img6.jpg", "img7.jpg", "img8.jpg", "img9.jpg", "img10.jpg", "img11.jpg", "img12.jpg",
];

let currentIndex = 0;
let manualMode = false;
let autoPlay;

const textBox = document.getElementById("text-box");
const imageBox = document.getElementById("image-box");
const progressBar = document.getElementById("progress-bar");
const pageIndicator = document.getElementById("page-indicator");
const manualBtn = document.getElementById("manual-btn");
const bgMusic = document.getElementById("bg-music");

document.addEventListener("DOMContentLoaded", function () {
  showWelcomeAlert();
});

function showWelcomeAlert() {
  Swal.fire({
    title: "Selamat Datang!",
    text: "Nikmatin yah, dan baca semua deh sampai habis.",
    icon: "info",
    confirmButtonText: "Mulai",
    allowOutsideClick: false,
    allowEscapeKey: false
  }).then((result) => {
    if (result.isConfirmed) {
      toggleMusic(); 
      updateContent(); 
    }
  });
}
  

// Inisialisasi pertama kali
function updateContent() {
  textBox.style.opacity = "0";
  textBox.style.transform = "translateY(-30px)";
  setTimeout(() => {
    textBox.innerText = texts[currentIndex];
    textBox.style.opacity = "1";
    textBox.style.transform = "translateY(0)";
  }, 300);

  imageBox.style.opacity = "0";
  setTimeout(() => {
    imageBox.style.backgroundImage = `url('${images[currentIndex] || "default.jpg"}')`;
    imageBox.style.opacity = "1";
  }, 300);

  pageIndicator.innerText = `${currentIndex + 1} / ${texts.length}`;
  progressBar.style.width = `${((currentIndex + 1) / texts.length) * 100}%`;
}

// Fungsi untuk maju ke teks berikutnya
function nextText() {
  if (currentIndex < texts.length - 1) {
    currentIndex++;
  } else {
    currentIndex = 0; // Jika sudah di akhir, kembali ke awal
  }
  updateContent();
}

// Fungsi untuk kembali ke teks sebelumnya
function prevText() {
  if (currentIndex > 0) {
    currentIndex--;
    updateContent();
  }
}

function toggleManualMode() {
  manualMode = !manualMode;
  let manualBtn = document.getElementById("manual-btn");
  let manualIcon = manualBtn.querySelector("i");
  let manualText = manualBtn.querySelector(".btn-text");

  if (manualMode) {
    clearInterval(autoPlay);
    manualIcon.classList.replace("fa-hand-pointer", "fa-rotate-right");
    manualText.innerText = "Manual Mode: ON";
  } else {
    autoPlay = setInterval(nextText, 5000);
    manualIcon.classList.replace("fa-rotate-right", "fa-hand-pointer");
    manualText.innerText = "Manual Mode: OFF";
  }
}

function toggleMusic() {
  let music = document.getElementById("bg-music");
  let musicBtn = document.getElementById("music-btn");
  let musicIcon = musicBtn.querySelector("i");
  let musicText = musicBtn.querySelector(".btn-text");

  if (music.paused) {
    music.play();
    musicIcon.classList.replace("fa-play", "fa-pause");
    musicText.innerText = "Stop Musik";
  } else {
    music.pause();
    musicIcon.classList.replace("fa-pause", "fa-play");
    musicText.innerText = "Mainkan Musik";
  }
}


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

// Auto-play jika manual mode mati
if (!manualMode) {
  autoPlay = setInterval(nextText, 5000);
}

