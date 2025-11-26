document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Мобильное меню
    // ==========================================================================
    const menuToggle = document.getElementById('menuToggle');
    const headerNav = document.querySelector('.header__nav');
    const navLinks = document.querySelectorAll('.nav__link');

    const toggleMenu = () => {
        headerNav.classList.toggle('is-open');

        const iconElement = menuToggle.querySelector('svg');
        iconElement.setAttribute('data-lucide',
            headerNav.classList.contains('is-open') ? 'x' : 'menu'
        );

        lucide.createIcons();
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768 && headerNav.classList.contains('is-open')) {
                toggleMenu();
            }
        });
    });


    // ==========================================================================
    // 2. Cookie Pop-up
    // ==========================================================================
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptCookiesButton = document.getElementById('acceptCookies');
    const cookieAccepted = localStorage.getItem('wiredwave_cookies_accepted');

    if (!cookieAccepted) {
        cookiePopup?.classList.remove('is-hidden');
    }

    acceptCookiesButton?.addEventListener('click', () => {
        cookiePopup.classList.add('is-hidden');
        localStorage.setItem('wiredwave_cookies_accepted', 'true');
    });


    // ==========================================================================
    // 3. Hero Canvas Animation — Network Flow
    // ==========================================================================
    const canvas = document.getElementById('digitalGridCanvas');

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const numParticles = 80;
        const linkDistance = 150;
        const size = 1.7;

        const dotColor = 'rgba(255, 193, 7, 1)';       // Amber
        const linkColor = '76, 175, 80';               // Green (rgb)

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.speedX = (Math.random() - 0.5) * 0.6;
                this.speedY = (Math.random() - 0.5) * 0.6;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > width) this.speedX *= -1;
                if (this.y < 0 || this.y > height) this.speedY *= -1;

                this.draw();
            }

            draw() {
                ctx.fillStyle = dotColor;
                ctx.beginPath();
                ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
                ctx.shadowColor = dotColor;
                ctx.shadowBlur = 5;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        function initParticles() {
            particles.length = 0;
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < linkDistance) {
                        ctx.strokeStyle = `rgba(${linkColor}, ${1 - dist / linkDistance})`;
                        ctx.lineWidth = 1 - (dist / linkDistance);

                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);

            // мягкий темный след
            ctx.fillStyle = 'rgba(20, 30, 48, 0.35)';
            ctx.fillRect(0, 0, width, height);

            connectParticles();
            particles.forEach(p => p.update());
        }

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        initParticles();
        animate();
    }


    // ==========================================================================
    // 4. Слайдер отзывов
    // ==========================================================================
    const reviewCards = document.querySelectorAll('.reviews__grid .review-card');
    const indicatorDots = document.querySelectorAll('.reviews__indicator .indicator-dot');
    let currentReview = 0;

    if (reviewCards.length > 0) {
        setInterval(() => {
            reviewCards.forEach(card => card.classList.remove('review-card--visible'));
            indicatorDots.forEach(dot => dot.classList.remove('indicator-dot--active'));

            currentReview = (currentReview + 1) % reviewCards.length;

            reviewCards[currentReview].classList.add('review-card--visible');
            indicatorDots[currentReview].classList.add('indicator-dot--active');

        }, 2000);
    }

});
// ==========================================================================
    // 8. JS Логика Формы Контактов и CAPTCHA (Этап 4)
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    const captchaDisplay = document.getElementById('captchaDisplay');
    const captchaInput = document.getElementById('captchaInput');
    const captchaMessage = document.getElementById('captchaMessage');
    const submissionMessage = document.getElementById('submissionMessage');
    const policyAccept = document.getElementById('policyAccept');
    
    let correctAnswer = 0;

    /**
     * Генерирует простой математический пример (CAPTCHA).
     */
    function generateCaptcha() {
        const operator = Math.random() < 0.5 ? '+' : '-';
        let num1 = Math.floor(Math.random() * 15) + 5;
        let num2 = Math.floor(Math.random() * 10) + 1;
        
        // Гарантируем неотрицательный результат
        if (operator === '-' && num1 < num2) {
            [num1, num2] = [num2, num1];
        }

        correctAnswer = operator === '+' ? num1 + num2 : num1 - num2;
        captchaDisplay.textContent = `${num1} ${operator} ${num2} = ?`;
        captchaMessage.textContent = ''; 
        captchaInput.value = ''; 
    }

    /**
     * Валидирует ответ CAPTCHA.
     * @returns {boolean} True, если ответ верный.
     */
    function validateCaptcha() {
        if (!captchaInput.value.trim()) {
            captchaMessage.textContent = 'Пожалуйста, решите пример.';
            captchaMessage.style.color = '#FF4545'; // Красный
            return false;
        }

        const userAnswer = parseInt(captchaInput.value.trim());
        if (userAnswer === correctAnswer) {
            captchaMessage.textContent = 'Капча успешно пройдена!';
            captchaMessage.style.color = 'var(--color-primary)';
            return true;
        } else {
            captchaMessage.textContent = 'Неверный ответ. Попробуйте еще раз.';
            captchaMessage.style.color = '#FF4545';
            generateCaptcha(); 
            return false;
        }
    }

    // Инициализация CAPTCHA при загрузке страницы
    generateCaptcha();

    // Обработчик отправки формы
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        submissionMessage.style.display = 'none'; 

        const isCaptchaValid = validateCaptcha();
        const isPolicyAccepted = policyAccept.checked;

        if (isCaptchaValid && isPolicyAccepted) {
            
            // Имитация успешной отправки данных
            console.log('Form Submitted and Validated:', {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                phone: document.getElementById('contactPhone').value,
            });

            // Показываем сообщение об успехе ТОЛЬКО после успешной валидации
            submissionMessage.style.display = 'block';
            
            // Сброс формы и генерация новой капчи
            contactForm.reset();
            generateCaptcha();
            
            // Автоматически скрываем сообщение через 5 секунд
            setTimeout(() => {
                submissionMessage.style.display = 'none';
            }, 5000);

        } else if (!isPolicyAccepted) {
            alert('Пожалуйста, примите условия использования и политику конфиденциальности.');
            policyAccept.focus();
        } 
    });
