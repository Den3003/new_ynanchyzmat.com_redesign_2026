
export function initRiskTimeline() {
  const section = document.querySelector('.js-risk-section');
  if (!section) {
    return;
  }

  const progressLine = section.querySelector('.js-line-progress');
  const items = Array.from(section.querySelectorAll('.js-risk-item'));

  let progress = 0; // 0 = на 1-й точке, 1 = на 4-й точке
  const speed = 0.0005;

  function renderUI(currentProgress) {
    console.log('currentProgress: ', currentProgress);
    const dots = items.map(item => item.querySelector('.js-risk-dot'));
    if (!dots[0] || !dots[dots.length - 1]) {
      return;
    }

    // Y-координаты центров первой и последней точки
    const firstDotY = items[0].offsetTop + dots[0].offsetTop + (dots[0].offsetHeight / 2);
    const lastItem = items[items.length - 1];
    const lastDotY = lastItem.offsetTop + dots[dots.length - 1].offsetTop + (dots[dots.length - 1].offsetHeight / 2);

    // Длина оранжевой линии от первой точки до текущего прогресса
    // console.log('firstDotY: ', firstDotY);
    // console.log('lastDotY: ', lastDotY);
    const currentLineHeight = firstDotY + (currentProgress * (lastDotY - firstDotY));
    // console.log('currentLineHeight: ', currentLineHeight);
    progressLine.style.height = `${currentLineHeight}px`;

    // Проверяем каждую точку
    items.forEach((item, index) => {
      const dot = dots[index];
      const dotCenterY = item.offsetTop + dot.offsetTop + (dot.offsetHeight / 2);

      // Если оранжевая линия дошла до центра точки
      if (currentLineHeight >= dotCenterY - 5) {
        item.classList.add('is-active'); // Точка зажигается оранжевым
        item.classList.add('is-visible'); // Показываем картинку и текст
      } else {
        // Если крутим назад
        if (index !== 0) { // Первую точку и блок не гасим
          item.classList.remove('is-active');
          item.classList.remove('is-visible');
        }
      }
    });
  }

  // Перехват колесика мыши (Wheel)
  section.addEventListener('wheel', (e) => {
    const isScrollingDown = e.deltaY > 0;
    const isScrollingUp = e.deltaY < 0;
    // console.log('isScrollingDown: ', isScrollingDown);

    const shouldTrapScroll = (isScrollingDown && progress < 1) || (isScrollingUp && progress > 0);

    if (shouldTrapScroll) {
      e.preventDefault(); // Блокируем скролл страницы

      progress += e.deltaY * speed;
      // console.log('progress: ', progress);
      progress = Math.max(0, Math.min(1, progress)); // Ограничиваем от 0 до 1

      renderUI(progress);
    }
  }, { passive: false });

  // Старт: 1-я точка сразу оранжевая и с контентом, точки 2, 3, 4 — серые без контента
  renderUI(0);
}
