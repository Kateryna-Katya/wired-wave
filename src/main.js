document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Скрипт для мобильного меню (Header)
  // ==========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const headerNav = document.querySelector('.header__nav');
  const navLinks = document.querySelectorAll('.nav__link');

  const toggleMenu = () => {
      headerNav.classList.toggle('is-open');

      const iconElement = menuToggle.querySelector('svg');
      if (headerNav.classList.contains('is-open')) {
          iconElement.setAttribute('data-lucide', 'x');
      } else {
          iconElement.setAttribute('data-lucide', 'menu');
      }
      lucide.createIcons();
  };

  menuToggle.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          if (window.innerWidth < 768) {
              setTimeout(() => {
                  if (headerNav.classList.contains('is-open')) {
                      toggleMenu();
                  }
              }, 200);
          }
      });
  });


  // ==========================================================================
  // 2. Скрипт для Cookie Pop-up (Этап 5)
  // ==========================================================================
  const cookiePopup = document.getElementById('cookiePopup');
  const acceptCookiesButton = document.getElementById('acceptCookies');
  const cookieAccepted = localStorage.getItem('wiredwave_cookies_accepted');

  const showCookiePopup = () => {
      if (!cookieAccepted) {
          cookiePopup.classList.remove('is-hidden');
      }
  }

  const hideCookiePopup = () => {
      cookiePopup.classList.add('is-hidden');
      localStorage.setItem('wiredwave_cookies_accepted', 'true');
  }

  showCookiePopup();
  acceptCookiesButton.addEventListener('click', hideCookiePopup);

  // ==========================================================================
  // 3. JS Анимации (Сюда будут добавляться анимации Hero, AOS, формы и т.д.)
  // ==========================================================================
});

// ==========================================================================
    // 4. JS Анимация Hero-секции (Dynamic Network Flow)
    // ==========================================================================
    const canvas = document.getElementById('digitalGridCanvas');

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const nodes = [];
        const numNodes = 80;
        const linkDistance = 150;
        const particleSize = 1.5;

        const particleColor = 'rgba(255, 193, 7, 1)'; // Secondary Amber

        // Класс для частицы
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
            }

            update() {
                this.x += this.speedX;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.speedX *= -1;
                if (this.y < 0 || this.y > height) this.speedY *= -1;

                this.draw();
            }

            draw() {
                ctx.fillStyle = particleColor;
                ctx.beginPath();
                ctx.arc(this.x, this.y, particleSize, 0, Math.PI * 2);
                ctx.shadowColor = particleColor;
                ctx.shadowBlur = 5;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        // Инициализация узлов
        const initNodes = () => {
            nodes.length = 0;
            for (let i = 0; i < numNodes; i++) {
                nodes.push(new Particle());
            }
        };

        // Соединение частиц
        function connect() {
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < linkDistance) {
                        ctx.strokeStyle = `rgba(76, 175, 80, ${0.5 - (distance / linkDistance / 2)})`; // Зеленая линия
                        ctx.lineWidth = 1 - (distance / linkDistance * 0.8);

                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Главный цикл анимации
        function animateNetwork() {
            requestAnimationFrame(animateNetwork);
            // Создаем темный след
            ctx.fillStyle = 'rgba(20, 30, 48, 0.4)';
            ctx.fillRect(0, 0, width, height);

            connect();
            particles.forEach(p => p.update());
        }

        // Адаптивность и запуск
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initNodes();
        });

        initNodes();
        animateNetwork();
    }