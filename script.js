document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTOS PRINCIPALES ---
    const enterScreen = document.getElementById('enter-screen');
    const enterBtn = document.getElementById('enter-btn');
    const mainLayout = document.getElementById('main-layout');
    const typingText = document.getElementById('typing-text');
    const audio = document.getElementById('audio');
    
    // Elementos de Música (Mini y Full)
    const vinylFull = document.getElementById('vinyl');
    const vinylMiniAnim = document.getElementById('vinyl-mini-anim');
    const playIcon = document.getElementById('play-icon');
    const progressBar = document.getElementById('progress-bar');
    const songTitleFull = document.getElementById('song-title');
    const songArtistFull = document.getElementById('song-artist');
    const songTitleMini = document.getElementById('mini-song-title');
    const songArtistMini = document.getElementById('mini-song-artist');

    // --- ENTRADA ---
    enterBtn.addEventListener('click', () => {
        enterScreen.style.opacity = '0';
        enterScreen.style.transform = 'scale(1.1)'; // Efecto zoom out al entrar
        setTimeout(() => {
            enterScreen.style.display = 'none';
            mainLayout.classList.remove('hidden-layout');
            initTypewriter();
            playMusic();
        }, 800);
    });

    // --- MAQUINA DE ESCRIBIR (Texto más corto para el diseño bento) ---
    const welcomeMsg = "La verdadera belleza florece desde el alma.";
    function initTypewriter() {
        let i = 0;
        typingText.innerHTML = "";
        function type() {
            if (i < welcomeMsg.length) {
                typingText.innerHTML += welcomeMsg.charAt(i);
                i++;
                setTimeout(type, 70); 
            }
        }
        type();
    }

    // --- GESTIÓN DE MODALES ---
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if(modal) {
            modal.classList.add('active');
            mainLayout.style.transform = "scale(0.95)"; // Efecto de profundidad
            mainLayout.style.filter = "blur(10px) brightness(0.7)";
            
            if(modalId === 'modal-gallery') {
                setTimeout(() => { updateGallery3D(); }, 100);
            }
        }
    };

    window.closeModal = function(modalId) {
        document.getElementById(modalId).classList.remove('active');
        mainLayout.style.transform = "scale(1)";
        mainLayout.style.filter = "none";
    };
    
    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) closeModal(e.target.id);
    };

    // --- GALERÍA 3D (Adaptada a estilo Dark) ---
    const galleryImages = [
        "https://xatimg.com/image/UCQwTE98gue9.jpg",
        "https://xatimg.com/image/IgoLKiYoP4US.jpg",
        "https://xatimg.com/image/zW5u9rAT5bGG.jpg",
        "https://xatimg.com/image/PvR3iKQx9OaC.jpg",
        "https://xatimg.com/image/BNX5ggQBfmVQ.jpg",
        "https://xatimg.com/image/eqCh9ZG6GvqM.jpg",
    ];
    
    const carouselTrack = document.getElementById('carousel-3d-track');
    let galleryIndex = 0; 

    carouselTrack.innerHTML = "";
    galleryImages.forEach((src, i) => {
        const card = document.createElement('div');
        // Nueva clase CSS para las cartas oscuras
        card.className = 'card-3d-dark'; 
        card.innerHTML = `<img src="${src}" alt="Img ${i}">`;
        card.onclick = () => { galleryIndex = i; updateGallery3D(); };
        carouselTrack.appendChild(card);
    });

    window.updateGallery3D = () => {
        const cards = document.querySelectorAll('#carousel-3d-track .card-3d-dark');
        if(!cards.length) return;
        
        cards.forEach(c => c.classList.remove('active'));
        if(cards[galleryIndex]) cards[galleryIndex].classList.add('active');

        const container = document.querySelector('.gallery-container-3d');
        const containerWidth = container.offsetWidth;
        // Ajuste para el tamaño de tarjeta más ancho
        const cardWidth = 240; 
        const cardMargin = 40; 
        const fullCardSpace = cardWidth + cardMargin;

        const centerPosition = (containerWidth / 2) - (galleryIndex * fullCardSpace) - (cardWidth / 2);
        carouselTrack.style.transform = `translateX(${centerPosition}px)`;
    };

    window.moveGallery = (dir) => {
        galleryIndex += dir;
        if(galleryIndex < 0) galleryIndex = galleryImages.length - 1;
        if(galleryIndex >= galleryImages.length) galleryIndex = 0;
        updateGallery3D();
    };

    // --- MÚSICA (Control Dual: Mini y Full) ---
    const playlist = [
        { title: "Ivonny Bonita", artist: "Karol G", src: "audio/KAROL G - Ivonny Bonita.mp3" },
    ];
    let sIdx = 0; let isPlaying = false; let pInt;

    function updateTrackInfo() {
        const track = playlist[sIdx];
        // Actualizar ambos reproductores
        songTitleFull.innerText = track.title;
        songArtistFull.innerText = track.artist;
        songTitleMini.innerText = track.title;
        songArtistMini.innerText = track.artist;
        audio.src = track.src;
    }
    
    function updatePlayState(playing) {
        isPlaying = playing;
        if(playing) {
            vinylFull.classList.add('spinning-active');
            // El mini vinilo ya tiene la clase 'spinning' por defecto en HTML
            playIcon.className = "fas fa-pause";
            pInt = setInterval(() => {
                if(audio.duration) {
                    progressBar.style.width = (audio.currentTime/audio.duration)*100 + "%";
                }
            }, 100);
        } else {
            vinylFull.classList.remove('spinning-active');
            playIcon.className = "fas fa-play";
            clearInterval(pInt);
        }
    }

    window.playMusic = () => {
        audio.play().then(() => { updatePlayState(true); }).catch(() => {});
    };
    
    window.togglePlay = () => {
        if(isPlaying) {
            audio.pause(); updatePlayState(false);
        } else {
            playMusic();
        }
    };
    
    window.nextSong = () => { sIdx=(sIdx+1)%playlist.length; updateTrackInfo(); playMusic(); };
    window.prevSong = () => { sIdx=(sIdx-1+playlist.length)%playlist.length; updateTrackInfo(); playMusic(); };
    
    // Inicializar
    updateTrackInfo();
    window.addEventListener('resize', updateGallery3D);
});