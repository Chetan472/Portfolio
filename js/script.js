 /* =========================================================
   CHETAN TELI — PORTFOLIO
   script.js — all interactivity
   ========================================================= */
(function(){
  'use strict';

  /* ---------------------------------------------------------
     0. LOADING SCREEN
  --------------------------------------------------------- */
  const loader = document.getElementById('loader');
  const loaderBarFill = document.getElementById('loaderBarFill');
  let progress = 0;
  const loaderInterval = setInterval(() => {
    progress += Math.random() * 35 + 25;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loaderInterval);
      setTimeout(() => {
        if (loader) loader.classList.add('loaded');
        document.body.style.overflow = '';
      }, 150);
    }
    if (loaderBarFill) loaderBarFill.style.width = progress + '%';
  }, 80);

  window.addEventListener('load', () => {
    document.body.style.overflow = '';
    if (loader) {
      setTimeout(() => {
        loader.classList.add('loaded');
      }, 200);
    }
  });

  /* ---------------------------------------------------------
     1. INIT LIBRARIES (AOS / Typed.js / Particles.js)
  --------------------------------------------------------- */
  if (window.AOS) {
    AOS.init({ duration: 600, once: true, offset: 40, easing: 'ease-out' });
  }

  if (window.Typed) {
    new Typed('#typed-role', {
      strings: ['Frontend & React.js Developer', 'React.js Developer', 'Frontend Developer', 'JavaScript Developer'],
      typeSpeed: 55,
      backSpeed: 30,
      backDelay: 1400,
      loop: true,
      showCursor: false
    });
  } else {
    const el = document.getElementById('typed-role');
    if (el) el.textContent = 'Frontend & React.js Developer';
  }

  /* ---------------------------------------------------------
     2. NAVBAR — scroll state, mobile menu, scroll spy
  --------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const scrollProgress = document.getElementById('scrollProgress');
  const scrollTopBtn = document.getElementById('scrollTop');

  function onScroll(){
    const y = window.scrollY;

    if (navbar) navbar.classList.toggle('scrolled', y > 20);

    /* scroll progress bar */
    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = docHeight > 0 ? (y / docHeight) * 100 + '%' : '0%';
    }

    /* scroll to top visibility */
    if (scrollTopBtn) scrollTopBtn.classList.toggle('show', y > 400);

    /* scroll spy */
    let current = 'home';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (y >= top) current = sec.id;
    });
    navLinkItems.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------------
     3. THEME TOGGLE (default: light, toggle: dark)
  --------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
  const savedTheme = localStorageSafeGet('portfolio-theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorageSafeSet('portfolio-theme', next);
    });
  }

  function applyTheme(theme){
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeIcon) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
      }
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
      }
    }
  }

  /* Safe localStorage wrappers (works when available; degrades quietly otherwise) */
  function localStorageSafeGet(key){
    try { return window.localStorage.getItem(key); } catch(e){ return null; }
  }
  function localStorageSafeSet(key, val){
    try { window.localStorage.setItem(key, val); } catch(e){ /* ignore */ }
  }

  /* ---------------------------------------------------------
     4. CURSOR GLOW + TRAIL (fine-pointer devices only)
  --------------------------------------------------------- */
  const isFinePointer = window.matchMedia('(pointer:fine)').matches;
  const glow = document.getElementById('cursorGlow');
  const dot = document.getElementById('cursorDot');
  if (isFinePointer && glow && dot) {
    document.body.classList.add('has-fine-pointer');
    let mouseX = 0, mouseY = 0, dotX = 0, dotY = 0;

    window.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      glow.style.left = mouseX + 'px';
      glow.style.top = mouseY + 'px';
    });

    (function animateDot(){
      dotX += (mouseX - dotX) * 0.25;
      dotY += (mouseY - dotY) * 0.25;
      dot.style.left = dotX + 'px';
      dot.style.top = dotY + 'px';
      requestAnimationFrame(animateDot);
    })();

    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => dot.style.transform = 'translate(-50%,-50%) scale(2.4)');
      el.addEventListener('mouseleave', () => dot.style.transform = 'translate(-50%,-50%) scale(1)');
    });
  }

  /* ---------------------------------------------------------
     5. ANIMATED COUNTERS (About stats)
  --------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el){
    const target = parseFloat(el.dataset.count);
    const isDecimal = el.dataset.decimal === 'true';
    const duration = 1400;
    const start = performance.now();

    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = isDecimal ? value.toFixed(2) : Math.round(value);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = isDecimal ? target.toFixed(2) : target;
    }
    requestAnimationFrame(tick);
  }

  /* ---------------------------------------------------------
     6. SKILL PROGRESS BARS
  --------------------------------------------------------- */
  const barFills = document.querySelectorAll('.bar-fill');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const level = entry.target.dataset.level;
        entry.target.style.width = level + '%';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  barFills.forEach(el => barObserver.observe(el));

  /* ---------------------------------------------------------
     7. PROJECT FILTERING
  --------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const categories = card.dataset.category.split(' ');
        const show = filter === 'all' || categories.includes(filter);
        card.style.display = show ? '' : 'none';
      });
    });
  });

  /* ---------------------------------------------------------
     8. CERTIFICATE MODAL
  --------------------------------------------------------- */
  const certModal = document.getElementById('certModal');
  const certModalTitle = document.getElementById('certModalTitle');
  const certModalClose = document.getElementById('certModalClose');

  document.querySelectorAll('.view-cert-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.cert-card');
      const title = card.querySelector('h3').textContent;
      certModalTitle.textContent = title;
      certModal.classList.add('active');
    });
  });
  certModalClose.addEventListener('click', () => certModal.classList.remove('active'));
  certModal.addEventListener('click', (e) => {
    if (e.target === certModal) certModal.classList.remove('active');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') certModal.classList.remove('active');
  });

  /* ---------------------------------------------------------
     9. CONTACT FORM — validation + EmailJS + toast
  --------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('cfSubmit');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const toastClose = document.getElementById('toastClose');

  /*
    EmailJS setup:
    1. Create an account at https://www.emailjs.com/
    2. Replace the placeholders below with your Service ID, Template ID and Public Key.
    3. emailjs.init() only needs to run once — it already runs at the bottom of this block.
  */
  const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
  const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

  if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const validators = {
    'cf-name': v => v.trim().length >= 2 || 'Please enter your name.',
    'cf-email': v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.',
    'cf-subject': v => v.trim().length >= 3 || 'Please enter a subject.',
    'cf-message': v => v.trim().length >= 10 || 'Message should be at least 10 characters.'
  };

  function validateField(input){
    const rule = validators[input.id];
    if (!rule) return true;
    const result = rule(input.value);
    const errorEl = form.querySelector(`.form-error[data-for="${input.id}"]`);
    const group = input.closest('.form-group');
    if (result === true) {
      group.classList.remove('invalid');
      errorEl.textContent = '';
      return true;
    } else {
      group.classList.add('invalid');
      errorEl.textContent = result;
      return false;
    }
  }

  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.closest('.form-group').classList.contains('invalid')) validateField(input);
    });
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();

    const inputs = form.querySelectorAll('input, textarea');
    let allValid = true;
    inputs.forEach(input => { if (!validateField(input)) allValid = false; });
    if (!allValid) return;

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const finish = (success, message) => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      showToast(success, message);
      if (success) form.reset();
    };

    if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
      emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
        .then(() => finish(true, "Thanks for reaching out — I'll reply soon."))
        .catch(() => finish(false, 'Something went wrong. Please try emailing me directly.'));
    } else {
      /* EmailJS not configured yet — simulate a successful send so the flow can be demoed */
      setTimeout(() => finish(true, "Thanks for reaching out — I'll reply soon. (Connect EmailJS in js/script.js to send for real.)"), 1100);
    }
  });

  function showToast(success, message){
    toast.classList.toggle('error', !success);
    toast.querySelector('.toast-title').textContent = success ? 'Message sent' : 'Message not sent';
    toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 5500);
  }
  toastClose.addEventListener('click', () => toast.classList.remove('show'));

  /* ---------------------------------------------------------
     10. FOOTER YEAR
  --------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     11. ScrollReveal (supplementary ambient reveal on top of AOS)
  --------------------------------------------------------- */
  if (window.ScrollReveal) {
    const sr = ScrollReveal({ distance: '40px', duration: 900, easing: 'cubic-bezier(.4,0,.2,1)', reset: false });
    sr.reveal('.timeline-item', { interval: 120, origin: 'left' });
    sr.reveal('.floating-icon', { interval: 100, origin: 'top' });
  }

})();