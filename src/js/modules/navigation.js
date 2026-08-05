export const initNavigation = () => {
  const items = document.querySelectorAll('.navigation__item[data-menu]');

  items.forEach(item => {
    const link = item.querySelector('.navigation__link');
    let closeTimer;

    const openPanel = () => {
      clearTimeout(closeTimer);
      items.forEach(i => i.classList.remove('open'));
      item.classList.add('open');
      link.setAttribute('aria-expanded', 'true');
    };

    const closePanel = () => {
      closeTimer = setTimeout(() => {
        item.classList.remove('open');
        link.setAttribute('aria-expanded', 'false');
      }, 150); // небольшая задержка — не закрывать при "проскакивании" курсора
    };

    item.addEventListener('mouseenter', openPanel);
    item.addEventListener('mouseleave', closePanel);

    // доступность с клавиатуры
    link.addEventListener('focus', openPanel);

    item.addEventListener('focusout', (e) => {
      if (!item.contains(e.relatedTarget)) {
        closePanel();
      }
    });

    link.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        item.classList.remove('open');
        link.setAttribute('aria-expanded', 'false');
        link.blur();
      }
    });
  });
};