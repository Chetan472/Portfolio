/* =========================================================
   Chetan Teli Portfolio
   JavaScript behavior and email fallback handling
   ========================================================= */

(function () {
  'use strict';

  const loader = document.getElementById('loader');
  const loaderBarFill = document.getElementById('loaderBarFill');
  const body = document.body;

  body.classList.add('loading');
  if (loaderBarFill) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 18;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      loaderBarFill.style.width = progress + '%';
    }, 120);
  }

  window.addEventListener('load', () => {
    body.classList.remove('loading');
    body.style.overflow = '';
    if (loader) {
      loader.classList.add('loaded');
    }
  });

  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const scrollProgress = document.getElementById('scrollProgress');
  const scrollTopBtn = document.getElementById('scrollTop');

  function updateScrollState() {
    const y = window.scrollY;
    if (navbar) {
      navbar.classList.toggle('scrolled', y > 20);
    }

    if (scrollProgress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const percent = max > 0 ? (y / max) * 100 : 0;
      scrollProgress.style.width = percent + '%';
    }

    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('show', y > 400);
    }

    let activeId = 'home';
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (y >= top) {
        activeId = section.id;
      }
    });

    navLinkItems.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === activeId);
    });
  }

  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    navLinkItems.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeIcon) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
      }
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeIcon) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
      }
    }
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem('portfolio-theme');
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch (error) {
      // ignore storage failures
    }
  }

  const savedTheme = getStoredTheme() || 'dark';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      saveTheme(next);
    });
  }

  if (window.Typed) {
    new Typed('#typed-role', {
      strings: ['Java Developer', 'Frontend Developer', 'Full Stack Developer'],
      typeSpeed: 72,
      backSpeed: 38,
      backDelay: 1200,
      loop: true,
      showCursor: true,
      cursorChar: '|',
      smartBackspace: true,
      contentType: 'html'
    });
  } else {
    const typed = document.getElementById('typed-role');
    if (typed) {
      typed.textContent = 'Java Developer';
    }
  }

  const statNumbers = document.querySelectorAll('.stat-number');
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count || '0');
        const isDecimal = el.dataset.decimal === 'true';
        let current = 0;
        const duration = 1000;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          current = target * eased;
          el.textContent = isDecimal ? current.toFixed(2) : Math.round(current);
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = isDecimal ? target.toFixed(2) : target;
          }
        }

        requestAnimationFrame(tick);
        statObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => statObserver.observe(el));

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));

      projectCards.forEach((card) => {
        const categories = (card.dataset.category || '').split(' ');
        const shouldShow = filter === 'all' || categories.includes(filter);
        card.style.display = shouldShow ? '' : 'none';
      });
    });
  });

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const form = document.getElementById('contactForm');
  const submitButton = document.getElementById('cfSubmit');
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toastTitle');
  const toastMsg = document.getElementById('toastMsg');
  const toastClose = document.getElementById('toastClose');

  const validators = {
    'cf-name': (val) => val.trim().length >= 2 || 'Please enter a valid name.',
    'cf-email': (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) || 'Please enter a valid email.',
    'cf-subject': (val) => val.trim().length >= 3 || 'Please enter a subject.',
    'cf-message': (val) => val.trim().length >= 10 || 'Message should be at least 10 characters.'
  };

  function validateField(input) {
    const key = input.id;
    const rule = validators[key];
    const errorNode = form.querySelector(`.form-error[data-for="${key}"]`);
    const group = input.closest('.form-group');

    if (!rule) return true;
    const result = rule(input.value);

    if (result === true) {
      group.classList.remove('invalid');
      if (errorNode) errorNode.textContent = '';
      return true;
    }

    group.classList.add('invalid');
    if (errorNode) errorNode.textContent = result;
    return false;
  }

  if (form) {
    form.querySelectorAll('input, textarea').forEach((input) => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.closest('.form-group').classList.contains('invalid')) {
          validateField(input);
        }
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const inputs = form.querySelectorAll('input, textarea');
      let valid = true;

      inputs.forEach((input) => {
        if (!validateField(input)) {
          valid = false;
        }
      });

      if (!valid) return;

      if (submitButton) {
        submitButton.classList.add('loading');
        submitButton.disabled = true;
      }

      const name = form.querySelector('#cf-name').value.trim();
      const email = form.querySelector('#cf-email').value.trim();
      const subject = form.querySelector('#cf-subject').value.trim();
      const message = form.querySelector('#cf-message').value.trim();

      const mailtoLink = `mailto:chetanteli75@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      )}`;

      setTimeout(() => {
        if (submitButton) {
          submitButton.classList.remove('loading');
          submitButton.disabled = false;
        }

        window.location.href = mailtoLink;
        form.reset();

        if (toast && toastTitle && toastMsg) {
          toastTitle.textContent = 'Draft ready';
          toastMsg.textContent = 'Your mail app opened. Please send the message to continue.';
          toast.classList.add('show');
        }
      }, 700);
    });
  }

  if (toastClose) {
    toastClose.addEventListener('click', () => {
      toast.classList.remove('show');
    });
  }

  if (window.AOS) {
    AOS.init({ duration: 700, once: true, offset: 30, easing: 'ease-out' });
  }
})();
