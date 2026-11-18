const avatarFrame = document.querySelector('.avatar-frame');
const avatarToggle = avatarFrame.querySelector('.avatar-toggle');
avatarToggle.hidden = false;
avatarToggle.addEventListener('click', () => {
  const paused = avatarFrame.classList.toggle('is-paused');
  const label = paused ? 'Resume portrait animation' : 'Pause portrait animation';
  avatarToggle.setAttribute('aria-label', label);
  avatarToggle.title = label;
  avatarToggle.firstElementChild.textContent = paused ? '▶' : 'Ⅱ';
});


(() => {
  const layout = document.querySelector('.experience-layout');
  const tabList = layout.querySelector('.experience-tabs');
  const tabs = [...tabList.querySelectorAll('[role="tab"]')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  const mobile = matchMedia('(max-width: 560px)');

  function syncOrientation() {
    tabList.setAttribute('aria-orientation', mobile.matches ? 'horizontal' : 'vertical');
  }

  function selectTab(activeIndex) {
    tabs.forEach((tab, index) => {
      const selected = index === activeIndex;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[index].hidden = !selected;
    });
  }

  tabs.forEach((tab, index) => {
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;
    tab.addEventListener('click', () => selectTab(index));
  });

  tabList.addEventListener('keydown', event => {
    const index = tabs.indexOf(event.target);
    if (index < 0) return;
    const nextKey = mobile.matches ? 'ArrowRight' : 'ArrowDown';
    const prevKey = mobile.matches ? 'ArrowLeft' : 'ArrowUp';
    let nextIndex;
    switch (event.key) {
      case nextKey: nextIndex = (index + 1) % tabs.length; break;
      case prevKey: nextIndex = (index + tabs.length - 1) % tabs.length; break;
      case 'Home': nextIndex = 0; break;
      case 'End': nextIndex = tabs.length - 1; break;
      default: return;
    }
    event.preventDefault();
    selectTab(nextIndex);
    tabs[nextIndex].focus();
  });

  mobile.addEventListener('change', syncOrientation);
  syncOrientation();
  selectTab(0);
  layout.classList.add('is-tabbed');
  tabList.hidden = false;
})();

;
(() => {
  const entry = document.querySelector('#village-entry');
  const portfolio = document.querySelector('#portfolio-content');
  const intro = document.querySelector('#intro');
  const enter = entry.querySelector('.entry-enter');
  const replay = portfolio.querySelector('.entry-replay');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let closeTimer;

  function showGate(event) {
    entry.classList.remove('is-opening');
    entry.hidden = false;
    enter.disabled = false;
    portfolio.inert = true;
    document.body.classList.add('at-village-gate');
    if (event) enter.focus({ preventScroll: true });
  }

  function showPortfolio() {
    clearTimeout(closeTimer);
    entry.hidden = true;
    entry.classList.remove('is-opening');
    enter.disabled = false;
    portfolio.inert = false;
    document.body.classList.remove('at-village-gate');
    window.scrollTo({ top: 0, behavior: 'instant' });
    intro.focus({ preventScroll: true });
  }

  enter.addEventListener('click', () => {
    if (reducedMotion.matches) {
      showPortfolio();
      return;
    }
    enter.disabled = true;
    entry.classList.add('is-opening');
    closeTimer = setTimeout(showPortfolio, 1700);
  });

  entry.addEventListener('animationend', (event) => {
    if (event.target === entry && event.animationName === 'gate-reveal') showPortfolio();
  });
  entry.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') showPortfolio();
  });
  replay.addEventListener('click', showGate);
  replay.hidden = false;

  if (!location.hash) showGate();
})();
