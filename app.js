const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  const closeNav = (returnFocus = false) => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) navToggle.focus();
  };

  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  siteNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeNav()));
  document.addEventListener('click', event => {
    if (siteNav.classList.contains('open') && !siteNav.contains(event.target) && !navToggle.contains(event.target)) closeNav();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && siteNav.classList.contains('open')) closeNav(true);
  });
}

const filterButtons = [...document.querySelectorAll('.filter-button')];
const findingCards = [...document.querySelectorAll('.finding-card')];
const filterStatus = document.querySelector('#filter-status');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    findingCards.forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
    if (filterStatus) {
      const visibleCount = findingCards.filter(card => !card.hidden).length;
      filterStatus.textContent = `${visibleCount} ${visibleCount === 1 ? 'hallazgo visible' : 'hallazgos visibles'}`;
    }
  });
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (!reducedMotion && 'IntersectionObserver' in window) {
  document.body.classList.add('reveal-ready');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px' });
  revealItems.forEach(item => revealObserver.observe(item));
}

const siteHeader = document.querySelector('.site-header');
const progressBar = document.querySelector('#reading-progress-bar');
const backToTop = document.querySelector('#back-to-top');
let scrollTicking = false;

const updateScrollUI = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(100, Math.max(0, scrollTop / scrollable * 100)) : 0;
  if (progressBar) progressBar.style.width = `${progress}%`;
  siteHeader?.classList.toggle('scrolled', scrollTop > 8);
  if (backToTop) {
    const showBackToTop = scrollTop > 700;
    backToTop.hidden = !showBackToTop;
    backToTop.classList.toggle('visible', showBackToTop);
  }
  scrollTicking = false;
};

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateScrollUI);
    scrollTicking = true;
  }
}, { passive: true });
window.addEventListener('resize', updateScrollUI);
updateScrollUI();

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
});

const navLinks = [...document.querySelectorAll('.site-nav a')];
const observedSections = navLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${visible.target.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-20% 0px -60%', threshold: [0, 0.2, 0.5] });
  observedSections.forEach(section => sectionObserver.observe(section));
}

const dialog = document.querySelector('#image-dialog');
const dialogImage = dialog?.querySelector('img');
const dialogClose = dialog?.querySelector('.dialog-close');

const closeDialog = () => {
  if (!dialog?.open) return;
  dialog.close();
  document.body.style.overflow = '';
};

document.querySelectorAll('.figure-button').forEach(button => {
  button.addEventListener('click', () => {
    if (!dialog || !dialogImage) return;
    dialogImage.src = button.dataset.image;
    dialogImage.alt = button.dataset.alt || 'Gráfica ampliada';
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  });
});

dialogClose?.addEventListener('click', closeDialog);
dialog?.addEventListener('click', event => {
  if (event.target === dialog) closeDialog();
});
dialog?.addEventListener('close', () => {
  document.body.style.overflow = '';
});

document.querySelector('#print-page')?.addEventListener('click', () => window.print());
