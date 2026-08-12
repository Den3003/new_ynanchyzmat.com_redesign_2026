import 'modern-normalize';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import '../styles/main.scss';
import { tick } from './modules/timeZone';
import 'virtual:svg-icons-register';
import Swiper from 'swiper';
// Добавляем импорт модуля Mousewheel
import { 
  Autoplay, 
  EffectFade, 
  Mousewheel, 
  Navigation } from 'swiper/modules';
import { modalController } from './modules/modal';
import { buildIndexFromDOM, initSearch } from './modules/search';
import { initNavigation } from './modules/navigation';

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
initNavigation();

// Слайдер Главной страницы на весь экран

export const swiper = new Swiper('.main-swiper.swiper', {
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

// Слайдер страницы About Us в секции Achievements

const swiperAchievements = new Swiper('.about__achievements .swiper', {
  modules: [Navigation],
  slidesPerView: 'auto',
  centeredSlides: true,
  spaceBetween: 60,

  navigation: {
    nextEl: '.about__achievements-button-next',
    prevEl: '.about__achievements-button-prev',
  },

});

// Слайдер страницы About Us в секции Our key Clients

const swiperAboutClient = new Swiper('.about__clients .swiper', {
  modules: [Navigation],
  slidesPerView: 'auto',
  centeredSlides: true,
  spaceBetween: 60,

  navigation: {
    nextEl: '.about__clients-button-next',
    prevEl: '.about__clients-button-prev',
  },

});

// Слайдер страницы About Us в секции Company Timeline

const swiperTimeline = new Swiper('.about__timeline .swiper', {
  modules: [Navigation],
  direction:'vertical',
  slidesPerView: 'auto',
  centeredSlides: true,
  spaceBetween: 30,

  navigation: {
    nextEl: '.about__timeline-button-next',
    prevEl: '.about__timeline-button-prev',
  },

});

// console.log(swiperTimeline.progress);
swiperTimeline.on('progress', (swiper, progress) => {
  console.log(swiper);
  console.log(progress);
});


// const base = document.querySelector('.ring-base');
const progress = document.querySelector('.ring-progress');

const LENGTH = progress.getTotalLength(); // длина окружности, ~992.87 для r=158

progress.setAttribute('stroke-dasharray', LENGTH);
progress.setAttribute('stroke-dashoffset', LENGTH); // старт: толстая линия полностью скрыта

const EASE = 0.12;
let currentOffset = LENGTH;
let targetOffset = LENGTH;
let rafId = null;

function setTarget(sw){
  const p = Math.min(1, Math.max(0, sw.progress)); // 0..1
  targetOffset = LENGTH * (1 - p); // p=0 -> offset=LENGTH (не видно), p=1 -> offset=0 (виден весь круг)
  ensureLoopRunning();
}

function tickCircle(){
  currentOffset += (targetOffset - currentOffset) * EASE;
  progress.setAttribute('stroke-dashoffset', currentOffset.toFixed(2));

  if (Math.abs(targetOffset - currentOffset) < 0.05) {
    progress.setAttribute('stroke-dashoffset', targetOffset);
    rafId = null;
    return;
  }
  rafId = requestAnimationFrame(tickCircle);
}

function ensureLoopRunning(){
  if (rafId === null) {
    rafId = requestAnimationFrame(tickCircle);
  }
}

swiperTimeline.on('progress', setTarget);
swiperTimeline.on('setTranslate', setTarget);
setTarget(swiper); // подхватить реальное состояние сразу, без ожидания первого скролла



// const circle = document.querySelector('.about__timeline-20-circle circle');

// // ---- 1. Длина окружности — берём РЕАЛЬНУЮ длину через браузерный API, ----
// // ---- а не считаем 2*π*r руками (меньше шансов на ошибку в цифрах) ----
// const LENGTH = circle.getTotalLength(); // для r=158 это ≈ 992.87

// // сразу настраиваем "невидимый" штрих на всю длину окружности
// circle.style.strokeDasharray = LENGTH;
// circle.style.strokeDashoffset = LENGTH; // 0% прогресса = ничего не нарисовано

// // ---- 2. Диапазоны толщины и "дорисовки" ----
// const STROKE_MIN = 2; // толщина в начале (пока ничего не нарисовано)
// const STROKE_MAX = 10; // толщина, когда круг дорисован полностью
// const EASE = 0.12;

// let currentOffset = LENGTH;
// let currentWidth = STROKE_MIN;
// let targetOffset = LENGTH;
// let targetWidth = STROKE_MIN;
// let rafId = null;

// // ---- 3. Swiper обновляет ЦЕЛЬ ----
// function setTarget(sw){
//   const progress = Math.min(1, Math.max(0, sw.progress)); // 0..1

//   // чем больше progress, тем меньше offset -> тем больше дуги нарисовано
//   targetOffset = LENGTH * (1 - progress);

//   // толщина растёт вместе с той же величиной прогресса
//   targetWidth = STROKE_MIN + (STROKE_MAX - STROKE_MIN) * progress;

//   ensureLoopRunning();
// }

// // ---- 4. rAF-цикл: плавно подтягивает оба значения к цели ----
// function tickCircle(){
//   currentOffset += (targetOffset - currentOffset) * EASE;
//   currentWidth += (targetWidth - currentWidth) * EASE;

//   circle.style.strokeDashoffset = currentOffset.toFixed(2);
//   circle.setAttribute('stroke-width', currentWidth.toFixed(2));

//   const doneOffset = Math.abs(targetOffset - currentOffset) < 0.05;
//   const doneWidth = Math.abs(targetWidth - currentWidth) < 0.01;

//   if (doneOffset && doneWidth) {
//     currentOffset = targetOffset;
//     currentWidth = targetWidth;
//     circle.style.strokeDashoffset = currentOffset;
//     circle.setAttribute('stroke-width', currentWidth.toFixed(2));
//     rafId = null;
//     return;
//   }

//   rafId = requestAnimationFrame(tickCircle);
// }

// function ensureLoopRunning(){
//   if (rafId === null) {
//     rafId = requestAnimationFrame(tickCircle);
//   }
// }

// // ---- 5. Подключение к Swiper ----
// swiperTimeline.on('progress', setTarget);
// swiperTimeline.on('setTranslate', setTarget);
// swiperTimeline.on('init', () => {
//   currentOffset = targetOffset = LENGTH;
//   currentWidth = targetWidth = STROKE_MIN;
//   circle.style.strokeDashoffset = LENGTH;
//   circle.setAttribute('stroke-width', STROKE_MIN);
// });


