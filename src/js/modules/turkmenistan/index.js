import { CONFIG } from './config.js';
import { CONTENT } from './data/content.js';
import { FACILITIES, FACILITY_TYPES, PROJECTS, PROJECT_TYPES } from './data/facilities.js';
import { FACILITY_MODELS } from './data/models.js';
import { resolveAsset } from './lib/assets.js';

/**
 * Публичная точка входа секции.
 *
 *   import { initTurkmenistanMap } from './sections/turkmenistan';
 *   const map = initTurkmenistanMap(document.querySelector('#turkmenistan'));
 *   // map.destroy() — если секция живёт в SPA и её размонтируют
 *
 * Тяжёлый three.js подгружается динамическим импортом и только когда секция
 * реально появляется во вьюпорте.
 */
export function initTurkmenistanMap(root, options = {}) {
  if (!root) return null;

  // Повторный вызов на том же элементе гасит предыдущую карту. Иначе в SPA или
  // при горячей перезагрузке сцены копятся одна поверх другой.
  if (root.__turkmenistanMap) {
    root.__turkmenistanMap.destroy();
    root.__turkmenistanMap = null;
  }

  const content = options.content ?? CONTENT;
  const config = mergeDeep(structuredClone(CONFIG), options.config ?? {});

  const dom = {
    stage: root.querySelector('[data-tm-stage]'),
    canvas: root.querySelector('[data-tm-canvas]'),
    overlay: root.querySelector('[data-tm-overlay]'),
    loader: root.querySelector('[data-tm-loader]'),
    title: root.querySelector('[data-tm-title]'),
    panel: root.querySelector('[data-tm-panel]'),
    reset: root.querySelector('[data-tm-reset]'),
    hint: root.querySelector('[data-tm-hint]'),
    facilities: root.querySelector('[data-tm-legend-facilities]'),
    projects: root.querySelector('[data-tm-legend-projects]'),
    projectsTitle: root.querySelector('[data-tm-projects-title]'),
    notes: root.querySelector('[data-tm-notes]'),
    a11y: root.querySelector('[data-tm-a11y]'),
    live: root.querySelector('[data-tm-live]'),
  };

  renderStaticContent(dom, content);

  const state = { selected: null, hovered: null, map: null, destroyed: false };

  setPanel(dom, content, null);
  dom.reset?.addEventListener('click', () => select(null));

  function select(id) {
    if (state.selected === id) return;
    state.selected = id;
    state.map?.setSelected(id);
    setPanel(dom, content, id);
    root.classList.toggle('is-welayat-selected', Boolean(id));
    dom.a11y?.querySelectorAll('button').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.welayat === id));
    });
    if (dom.live) {
      dom.live.textContent = id ? content.welayats[id]?.name ?? '' : content.back;
    }
    root.dispatchEvent(new CustomEvent('welayat:change', { detail: { id }, bubbles: true }));
  }

  renderA11yControls(dom, content, select);

  if (!supportsWebGL()) {
    root.classList.add('is-fallback');
    if (dom.loader) dom.loader.textContent = content.fallback;
    return { destroy() {}, select };
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry) return;
      if (entry.isIntersecting && !state.map) {
        boot();
      }
      if (state.map && state.map !== 'loading') {
        state.map[entry.isIntersecting ? 'start' : 'stop']();
      }
    },
    { rootMargin: '200px 0px' },
  );
  observer.observe(root);

  async function boot() {
    state.map = 'loading';
    try {
      const [{ createWelayatMap }, geojson] = await Promise.all([
        import('./map/createWelayatMap.js'),
        fetch(resolveAsset(config.assetsBase, config.geojsonUrl)).then((response) => {
          if (!response.ok) throw new Error(`GeoJSON ${response.status}`);
          return response.json();
        }),
      ]);

      if (state.destroyed) return;

      const map = await createWelayatMap({
        canvas: dom.canvas,
        container: dom.stage,
        overlayRoot: dom.overlay,
        config,
        content,
        geojson,
        facilities: { list: FACILITIES, types: FACILITY_TYPES, models: FACILITY_MODELS },
        projects: { list: PROJECTS, types: PROJECT_TYPES },
        onSelect: select,
        onHover: (id) => {
          state.hovered = id;
          dom.stage.classList.toggle('is-hovering', Boolean(id));
        },
      });

      if (state.destroyed) {
        map.destroy();
        return;
      }

      state.map = map;
      state.map.setSelected(state.selected);
      state.map.start();
      root.classList.add('is-ready');
    } catch (error) {
      console.error('[turkmenistan] map init failed', error);
      root.classList.add('is-fallback');
      state.map = null;
      // Отдельный текст: WebGL здесь ни при чём, упала именно инициализация.
      if (dom.loader) dom.loader.textContent = content.error ?? content.fallback;
    }
  }

  const api = {
    select,
    destroy() {
      root.__turkmenistanMap = null;
      state.destroyed = true;
      observer.disconnect();
      if (state.map && state.map !== 'loading') state.map.destroy();
      state.map = null;
    },
  };

  root.__turkmenistanMap = api;
  return api;
}

/* --- Разметка, зависящая от данных ---------------------------------------- */

function renderStaticContent(dom, content) {
  if (dom.title) dom.title.textContent = content.title;
  if (dom.hint) dom.hint.textContent = content.hint;
  if (dom.reset) dom.reset.textContent = content.back;
  if (dom.projectsTitle) dom.projectsTitle.textContent = content.projectsTitle;

  if (dom.facilities) {
    dom.facilities.replaceChildren(
      ...Object.entries(FACILITY_TYPES).map(([type, definition]) => {
        const item = document.createElement('li');
        item.className = 'tm-legend__item';
        item.innerHTML = `
          <img class="tm-legend__icon" src="${resolveAsset(CONFIG.assetsBase, definition.icon)}" alt="" width="44" height="44" loading="lazy" decoding="async">
          <span class="tm-legend__label">${definition.label}</span>`;
        item.dataset.type = type;
        return item;
      }),
    );
  }

  if (dom.projects) {
    dom.projects.replaceChildren(
      ...Object.entries(PROJECT_TYPES).map(([type, definition]) => {
        const item = document.createElement('li');
        item.className = 'tm-projects__item';
        item.style.setProperty('--tm-project-color', definition.color);
        item.innerHTML = `<span class="tm-projects__dot" aria-hidden="true"></span><span>${definition.label}</span>`;
        item.dataset.type = type;
        return item;
      }),
    );
  }

  if (dom.notes) {
    dom.notes.replaceChildren(
      ...content.notes.map((note) => {
        const paragraph = document.createElement('p');
        paragraph.className = 'tm-notes__item';
        paragraph.textContent = note;
        return paragraph;
      }),
    );
  }
}

function renderA11yControls(dom, content, select) {
  if (!dom.a11y) return;

  dom.a11y.replaceChildren(
    ...Object.entries(content.welayats).map(([id, welayat]) => {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.welayat = id;
      button.setAttribute('aria-pressed', 'false');
      button.textContent = welayat.name;
      button.addEventListener('click', () => {
        const isPressed = button.getAttribute('aria-pressed') === 'true';
        select(isPressed ? null : id);
      });
      item.appendChild(button);
      return item;
    }),
  );
}

function setPanel(dom, content, id) {
  if (!dom.panel) return;

  const paragraphs = id ? content.welayats[id]?.text ?? content.intro : content.intro;
  const heading = id ? content.welayats[id]?.name : null;

  const nodes = [];
  if (heading) {
    const title = document.createElement('h3');
    title.className = 'tm-panel__heading';
    title.textContent = heading;
    nodes.push(title);
  }
  paragraphs.forEach((text) => {
    const paragraph = document.createElement('p');
    paragraph.className = 'tm-panel__text';
    paragraph.textContent = text;
    nodes.push(paragraph);
  });

  dom.panel.classList.remove('is-entering');
  // Перезапуск CSS-анимации появления.
  void dom.panel.offsetWidth;
  dom.panel.replaceChildren(...nodes);
  dom.panel.classList.add('is-entering');
}

/* --- Утилиты --------------------------------------------------------------- */

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
  } catch {
    return false;
  }
}

function mergeDeep(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      target[key] = mergeDeep(target[key] ?? {}, value);
    } else {
      target[key] = value;
    }
  }
  return target;
}
