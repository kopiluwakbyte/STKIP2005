document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading Screen
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 1000);

    // 2. Navbar Scroll & Mobile Menu
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active link tracking
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const spans = menuToggle.querySelectorAll('span');
        if(navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // 3. Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // 4. Number Counter Animation
    const numbers = document.querySelectorAll('.stat-number');
    const numberObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.getAttribute('data-count'));
                let startValue = 0;
                const duration = 2000;
                const increment = endValue / (duration / 16);
                
                const updateCounter = () => {
                    startValue += increment;
                    if (startValue < endValue) {
                        target.innerText = Math.ceil(startValue) + (endValue > 100 ? '+' : '');
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.innerText = endValue + (endValue > 100 ? '+' : '');
                    }
                };
                updateCounter();
                observer.unobserve(target);
            }
        });
    });
    
    numbers.forEach(num => {
        numberObserver.observe(num);
    });

    // Clone testimonials for infinite auto-scroll
    const track = document.getElementById('testimonial-track');
    if(track) {
        const cards = track.innerHTML;
        track.innerHTML += cards;
    }

    // Clone gallery items for infinite auto-scroll
    const galleryTrack = document.getElementById('gallery-track');
    if(galleryTrack) {
        const galleryCards = galleryTrack.innerHTML;
        galleryTrack.innerHTML += galleryCards;
    }

    // 5. Countdown Timer
    const eventDate = new Date('2026-07-19T08:00:00').getTime();
    
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance < 0) {
            document.getElementById('days').innerText = "00";
            document.getElementById('hours').innerText = "00";
            document.getElementById('minutes').innerText = "00";
            document.getElementById('seconds').innerText = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days.toString().padStart(2, '0');
        document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
    };
    
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 6. RSVP Form Submit (Terhubung ke Google Sheets)
    const rsvpForm = document.getElementById('rsvp-form');
    if(rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Tampilkan state loading di tombol
            const submitBtn = rsvpForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'MENGIRIM...';
            submitBtn.disabled = true;

            // Ambil data form
            const formData = new FormData(rsvpForm);
            
            // --- GANTI URL DI BAWAH INI DENGAN URL GOOGLE APPS SCRIPT ANDA ---
            const scriptURL = 'https://script.google.com/macros/s/AKfycbzYbmZX2GwVlDgQNr-hrOYsFuxWZgn3eyqGc_9C8ZdZQjxB_nog5HG0OyD6JewI6s4/exec';
            
            // Jika URL belum diganti, hanya tampilkan sukses modal (untuk simulasi / testing lokal)
            if (scriptURL.includes('GANTI_DENGAN_ID_SCRIPT_ANDA')) {
                setTimeout(() => {
                    document.getElementById('success-modal').classList.add('active');
                    rsvpForm.reset();
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                }, 1000);
                return;
            }

            // Kirim data ke Google Sheets
            fetch(scriptURL, { method: 'POST', body: formData })
                .then(response => {
                    document.getElementById('success-modal').classList.add('active');
                    rsvpForm.reset();
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    alert('Maaf, terjadi kesalahan saat mengirim data. Silakan coba lagi.');
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }
});
