import { swiper } from '../main';
import { debounce } from './utils';

const searchWrapper = document.querySelector('.js-search');
const searchTrigger = document.querySelector('.js-search-trigger');
const searchInput = document.querySelector('.js-search-input');
const searchCloseBtn = document.querySelector('.js-search-close');
const searchResultBox = document.querySelector('.js-search-results');

/* ===================================================================
    1. ИНДЕКС КОНТЕНТА
    На реальном сайте этот массив строится один раз при загрузке:
    либо вручную (как тут, для демо), либо автоматически —
    обходом DOM (document.querySelectorAll('.content-section'))
    и извлечением текста заголовка/абзацев в объект.
  =================================================================== */
export function buildIndexFromDOM() {
  return [...document.querySelectorAll('.js-content-section')].map(section => ({
      id: section.id,
      title: section.querySelector('.js-content-title')?.textContent.trim() || '',
      text: section.querySelector('.js-content-text')?.textContent.trim() || '',
      el: section,
      swiperIndex: section.dataset.slideIndex || ''
    }));
}

const searchIndex = buildIndexFromDOM();

export const initSearch = () => {
  
  /* ===================================================================
      ПОИСК
    Простое совпадение по подстроке в заголовке и тексте (без учёта
    регистра). Для реального сайта с большим объёмом контента вместо
    этого стоит подключить полноценную библиотеку — например,
    Fuse.js (нечёткий поиск, опечатки) или lunr.js (полнотекстовый
    индекс). Здесь логика полностью на чистом JS, без зависимостей.
  =================================================================== */

  const search = (query) => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return [];
    }
    
    return searchIndex
      .map(item => {
        const inTitle = item.title.toLowerCase().includes(q);
        const inText = item.text.toLowerCase().includes(q);
        if (!inTitle && !inText) {
          return null;
        }
        // совпадение в заголовке важнее — поднимаем выше в выдаче
        const score = inTitle ? 2 : 1;
        return { ...item, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);
  };

  const highlight = (text, query) => {
    const q = query.trim();
    if (!q) {
      return text;
    }
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${escaped})`, 'ig'), '<mark>$1</mark>');
  }; 

  const snippet = (text, query, radius = 40) => {
    const idx = text.toLowerCase().indexOf(query.trim().toLowerCase());
    if (idx === -1) {
      return text.slice(0, 90) + '…';
    }
    const start = Math.max(0, idx - radius);
    const end = Math.min(text.length, idx + query.length + radius);
    return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
  };


  /* ===================================================================
      РЕНДЕР ВЫДАЧИ
  =================================================================== */

  let activeIndex = -1;
  let currentResults = [];

  const renderResults = (query) => {
    currentResults = search(query);
    activeIndex = -1;

    if (!query.trim()) {
      searchResultBox.innerHTML = '<div class="search__hint">Start entering the query…</div>';
      searchResultBox.classList.add('is-open');
      return;
    }

    if (currentResults.length === 0) {
      searchResultBox.innerHTML = `<div class="search__empty">Nothing was found for the query «${query}»</div>`;
      searchResultBox.classList.add('is-open');
      return;
    }

    searchResultBox.innerHTML = currentResults.map((item, i) => `
      <button type="button" class="search__result" role="option" data-index="${i}" data-target="${item.id}">
        <span class="search__result-title">${highlight(item.title, query)}</span>
        <span class="search__result-meta">${highlight(snippet(item.text, query), query)}</span>
      </button>
    `).join('');

    searchResultBox.classList.add('is-open');
  };

  const setActive = (i) => {
    const options = searchResultBox.querySelectorAll('.search__result');
    options.forEach(o => o.classList.remove('is-active'));
    if (options[i]) {
      options[i].classList.add('is-active');
      options[i].scrollIntoView({ block: 'nearest' });
    }
    activeIndex = i;
  };

  const goToResult = (id) => {
    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    if (target.closest('.swiper-slide')) {
      console.log(target.dataset.slideIndex);
      swiper.slideToLoop(target.dataset.slideIndex);
    }
    // collapse();
    console.log('target: ', target);
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.add('is-flashed');
    // setTimeout(() => console.log('proverka'), 900);
    setTimeout(() => target.classList.remove('is-flashed'), 900);
  };

  const debounceSearch = debounce((q) => renderResults(q), 200);

  /* ===================================================================
      СОБЫТИЯ
  =================================================================== */

  // Расширяет блок поиска при нажатии на него
  const expandWrapper = () => {
    searchWrapper.classList.add('is-expanded');
    searchTrigger.setAttribute('aria-expanded', 'true');
    setTimeout(() => searchInput.focus(), 200);
  };

  // Уменьшает блок поиска при нажатии на кнопку крестика внутри блока поиска
  function collapse() {
    searchWrapper.classList.remove('is-expanded');
    searchTrigger.setAttribute('aria-expanded', 'false');
    searchResultBox.classList.remove('is-open');
    searchInput.value = '';
  };

  searchTrigger.addEventListener('click', expandWrapper);
  searchCloseBtn.addEventListener('click', collapse);

  searchInput.addEventListener('input', (e) => debounceSearch(e.target.value));

  searchInput.addEventListener('keydown', (e) => {
    const count = currentResults.length;
    
    if (e.key === 'ArrowDown' && count) {
      e.preventDefault();
      setActive((activeIndex + 1) % count);
    } else if (e.key === 'ArrowUp' && count) {
      e.preventDefault();
      setActive((activeIndex - 1 + count) % count);
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      goToResult(currentResults[activeIndex].id);
    } else if (e.key === 'Escape') {
      collapse();
      searchTrigger.focus();
    }
  });

  searchResultBox.addEventListener('click', (e) => {
    const btn = e.target.closest('.search__result');
    if (btn) {
      goToResult(btn.dataset.target);
    }
  });

  document.addEventListener('click', (e) => {
    if (!searchWrapper.contains(e.target) && searchWrapper.classList.contains('is-expanded')) {
      collapse();
    }
  });
};
