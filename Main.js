(function () {
  'use strict';

  // DOM Elements
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const reportModal = document.getElementById('reportModal');
  const modalClose = document.getElementById('modalClose');
  const modalDemoBtn = document.getElementById('modalDemoBtn');
  const modalDoneBtn = document.getElementById('modalDoneBtn');
  const modalContent = reportModal?.querySelector('.modal-content');
  const modalSuccess = document.getElementById('modalSuccess');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const reportButtons = document.querySelectorAll('[data-action="report"]');

  // Navbar scroll effect
  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  }

  // Active nav link on scroll
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Mobile menu toggle
  function toggleMobileMenu() {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isOpen);
    navMenu.classList.toggle('open');
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeMobileMenu() {
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Smooth scroll for anchor links
  function handleSmoothScroll(e) {
    const href = e.currentTarget.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      closeMobileMenu();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Modal functions
  function openModal() {
    if (!reportModal) return;
    reportModal.hidden = false;
    reportModal.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      reportModal.classList.add('active');
    });
    document.body.style.overflow = 'hidden';
    modalClose?.focus();
  }

  function closeModal() {
    if (!reportModal) return;
    reportModal.classList.remove('active');
    reportModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    setTimeout(() => {
      reportModal.hidden = true;
      resetModal();
    }, 250);
  }

  function resetModal() {
    modalContent?.removeAttribute('hidden');
    modalSuccess?.setAttribute('hidden', '');
  }

  function showModalSuccess() {
    modalContent?.setAttribute('hidden', '');
    modalSuccess?.removeAttribute('hidden');
  }

  // Contact form validation
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}Error`);
    if (field) field.classList.add('error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearErrors() {
    contactForm?.querySelectorAll('.error').forEach((el) => {
      el.classList.remove('error');
    });
    contactForm?.querySelectorAll('.form-error').forEach((el) => {
      el.textContent = '';
    });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const subject = document.getElementById('subject')?.value.trim();
    const message = document.getElementById('message')?.value.trim();

    let isValid = true;

    if (!name || name.length < 2) {
      showError('name', 'Please enter your full name');
      isValid = false;
    }

    if (!email || !validateEmail(email)) {
      showError('email', 'Please enter a valid email address');
      isValid = false;
    }

    if (!subject || subject.length < 3) {
      showError('subject', 'Please enter a subject');
      isValid = false;
    }

    if (!message || message.length < 10) {
      showError('message', 'Message must be at least 10 characters');
      isValid = false;
    }

    if (isValid) {
      formSuccess?.removeAttribute('hidden');
      contactForm.reset();
      formSuccess?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      setTimeout(() => {
        formSuccess?.setAttribute('hidden', '');
      }, 8000);
    }
  }

  // Scroll reveal animation
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  // Live activity animation
  function initActivityFeed() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;

    const activities = [
      { icon: 'water', text: 'Water leak reported in Ward 12', time: 'Just now' },
      { icon: 'light', text: 'Streetlight complaint generated', time: '2 min ago' },
      { icon: 'road', text: 'Pothole added to the city map', time: '5 min ago' },
      { icon: 'water', text: 'Garbage pile flagged in Sector 4', time: '8 min ago' },
      { icon: 'light', text: 'Broken sidewalk report submitted', time: '12 min ago' },
    ];

    let currentIndex = 0;

    setInterval(() => {
      currentIndex = (currentIndex + 1) % activities.length;
      const activity = activities[currentIndex];
      const items = activityList.querySelectorAll('.activity-item');

      if (items.length > 0) {
        const firstItem = items[0];
        firstItem.style.animation = 'none';
        firstItem.offsetHeight;
        firstItem.style.animation = '';

        const iconClass = `activity-icon activity-icon-${activity.icon}`;
        firstItem.innerHTML = `
          <span class="${iconClass}">
            ${getActivityIcon(activity.icon)}
          </span>
          <div>
            <p class="activity-text">${activity.text}</p>
            <span class="activity-time">${activity.time}</span>
          </div>
        `;
      }
    }, 5000);
  }

  function getActivityIcon(type) {
    const icons = {
      water: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z" stroke="currentColor" stroke-width="2"/></svg>',
      light: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18h6M10 22h4M12 2v1" stroke="currentColor" stroke-width="2"/></svg>',
      road: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2"/></svg>',
    };
    return icons[type] || icons.road;
  }

  // Event listeners
  function init() {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    navToggle?.addEventListener('click', toggleMobileMenu);

    navLinks.forEach((link) => {
      link.addEventListener('click', handleSmoothScroll);
    });

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      if (!link.classList.contains('nav-link')) {
        link.addEventListener('click', handleSmoothScroll);
      }
    });

    reportButtons.forEach((btn) => {
      btn.addEventListener('click', openModal);
    });

    modalClose?.addEventListener('click', closeModal);
    modalDemoBtn?.addEventListener('click', showModalSuccess);
    modalDoneBtn?.addEventListener('click', closeModal);

    reportModal?.addEventListener('click', (e) => {
      if (e.target === reportModal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && reportModal?.classList.contains('active')) {
        closeModal();
      }
    });

    contactForm?.addEventListener('submit', handleFormSubmit);

    initScrollReveal();
    initActivityFeed();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
