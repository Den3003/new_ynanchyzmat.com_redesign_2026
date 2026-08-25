const items = document.querySelectorAll('.navigation__item[data-menu]');
export const initNavigation = () => {

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

export const navigationLinkActive = () => {
  // 1. Получаем текущий pathname без query-параметров и хэшей
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  // console.log('currentPath: ', currentPath);

  /* // 2. Находим все ссылки
  const navLinks = document.querySelectorAll('.nav-link'); */

  items.forEach(item => {
    const link = item.querySelector('.navigation__link');
    // Нормализуем href ссылки (убираем слэш на конце)
    // console.log('link.href: ', link.href);
    const linkPath = new URL(link.href).pathname.replace(/\/$/, '') || '/';
    // console.log('linkPath: ', linkPath);

    // 3. Проверяем совпадение
    // Для главной страницы — строгое совпадение.
    // Для остальных — проверка на вложенность (например, /blog/my-post подсветит /blog)
    const isActive = linkPath === '/' 
      ? currentPath === '/' 
      : currentPath.startsWith(linkPath);

      // console.log('isActive: ', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};
