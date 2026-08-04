import 'modern-normalize';
import 'swiper/css';
import 'swiper/css/effect-fade';
import '../styles/main.scss';
import { tick } from './modules/timeZone';
import 'virtual:svg-icons-register';
import Swiper from 'swiper';
// Добавляем импорт модуля Mousewheel
import { Autoplay, EffectFade, Mousewheel } from 'swiper/modules';
import { modalController } from './modules/modal';
import { buildIndexFromDOM, initSearch } from './modules/search';

tick();
modalController({
  modal: '.modal',
  btnOpen: '.main-celebration__button',
  btnClose: '.modal__close',
  blockVisible: '.main-celebration__block',
});

const searchIndex = buildIndexFromDOM();
console.log('searchIndex: ', searchIndex);

initSearch();

export const swiper = new Swiper('.swiper', {
  modules: [Autoplay, EffectFade, Mousewheel], // Регистрируем модуль в массиве modules
  loop: true, // Бесконечный цикл слайдов
  allowTouchMove: true, // Разрешить перелистывание свайпом
  effect: 'fade',
  fadeEffect: {
    crossFade: true // Фоны будут плавно растворяться друг в друге, а не моргать
  },
  /* autoplay: {
    delay: 5000,
    disableOnInteraction: false // Автоплей не отключится навсегда, если пользователь кликнет по слайду
  }, */
  mousewheel: { // Включаем и настраиваем управление колесом мыши
    sensitivity: 1, // Чувствительность скролла (1 — стандарт)
    thresholdDelta: 15, // Минимальный порог прокрутки, чтобы избежать случайных «двойных» переключений
  },  
  on: {
    autoplayTimeLeft(s,time, percentage) {
      // percentage идет от 1 (начало слайда) до 0 (конец слайда)
      const progress = 1 - percentage;

      // Ищем внутреннюю оранжевую линию для текущего активного слайда (по realIndex)
      const activeLine = document.querySelector(
        `.swiper__progress-item[data-index="${s.realIndex}"] .swiper__progress-fill`
      );
      if (activeLine) {
        activeLine.style.transform = `scaleX(${progress})`;
      }
      // console.log('activeLine: ', activeLine);
      // console.log('time: ', time);
    },
    slideChange(s) {
      const allLines = document.querySelectorAll('.swiper__progress-fill');

      allLines.forEach((fill, index) => {
        if (index !== s.realIndex) {
          fill.style.transform = 'scaleX(0)';
        }
      });
      // console.log('s: ', s);
    },
  },
});

// Интерактив: Переключение слайдов при клике на саму оранжевую линию

document.querySelectorAll('.swiper__progress-item').forEach(track => {
  track.addEventListener('click', () => {
    const targetIndex = parseInt(track.getAttribute('data-index'), 10);
    // Используем slideToLoop, так как у нас включен режим loop: true
    swiper.slideToLoop(targetIndex);
  });
});