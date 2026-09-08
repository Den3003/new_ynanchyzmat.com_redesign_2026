import 'modern-normalize';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/parallax';
import '../styles/main.scss';
import { tick } from './modules/timeZone';
import 'virtual:svg-icons-register';
import Swiper from 'swiper';
// Добавляем импорт модуля Mousewheel
import { 
  Autoplay, 
  EffectFade, 
  Mousewheel, 
  Navigation,
  Parallax,
} from 'swiper/modules';
import { modalController } from './modules/modal';
import { initSearch } from './modules/search';
import { initNavigation, navigationLinkActive } from './modules/navigation';
import { initRiskTimeline } from './modules/riskSection';
import { initFeedbackForm } from './modules/form';
import { initTurkmenistanMap } from './modules/turkmenistan/index';


// 1. Получаем текущий pathname без query-параметров и хэшей
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  console.log('currentPath: ', currentPath);

const form = document.getElementById('contactsForm');
if (form) {
  initFeedbackForm(form);
}


// Секция карты 

const section = document.querySelector('#turkmenistan');
const map = initTurkmenistanMap(section, { config: { debug: { logPerformance: true } } });

// Пример внешнего управления: карта сообщает о смене велаята.
section?.addEventListener('welayat:change', (event) => {
  if (import.meta.env.DEV) {
    console.info('welayat →', event.detail.id);
  }
});

if (import.meta.hot) {
  import.meta.hot.dispose(() => map?.destroy());
}



tick();
modalController({
  modal: '.modal',
  btnOpen: '.main-celebration__button',
  btnClose: '.modal__close',
  blockVisible: '.main-celebration__block',
});

modalController({
  modal: '.modal-h2s',
  btnOpen: '.main-h2s__button',
  btnClose: '.modal-h2s__close',
  blockVisible: '.main-h2s__block',
});

modalController({
  modal: '.modal-laboratory',
  btnOpen: '.main-laboratory__button',
  btnClose: '.modal-laboratory__close',
  blockVisible: '.main-laboratory__block',
});

// const searchIndex = buildIndexFromDOM();
// console.log(!!window.location.hash);

// const swiperSlide = document.getElementById(window.location.hash.slice(1));
// console.log('swiperSlide: ', swiperSlide.dataset.slideIndex);

initSearch();
initNavigation();
initRiskTimeline();


// Слайдер Главной страницы на весь экран

export const swiper = new Swiper('.main-swiper.swiper', {
  modules: [Autoplay, EffectFade, Mousewheel], // Регистрируем модуль в массиве modules
  loop: true, // Бесконечный цикл слайдов
  allowTouchMove: true, // Разрешить перелистывание свайпом
  effect: 'fade',
  fadeEffect: {
    crossFade: true // Фоны будут плавно растворяться друг в друге, а не моргать
  },
  autoplay: {
    delay: 5000,
    disableOnInteraction: false // Автоплей не отключится навсегда, если пользователь кликнет по слайду
  },
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
        `.main-swiper__progress-item[data-index="${s.realIndex}"] .main-swiper__progress-fill`
      );
      if (activeLine) {
        activeLine.style.transform = `scaleX(${progress})`;
      }
      // console.log('activeLine: ', activeLine);
      // console.log('time: ', time);
    },
    slideChange(s) {
      const allLines = document.querySelectorAll('.main-swiper__progress-fill');

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

if (currentPath.includes('index.html') || currentPath === '/') {
  const hashTeg = window.location.hash;
  // console.log('hashTeg: ', hashTeg);
  if (hashTeg) {
    const swiperSlide = document.getElementById(window.location.hash.slice(1));
    // console.log('swiperSlide: ', swiperSlide);
    swiper.slideToLoop(swiperSlide.dataset.slideIndex);
    swiperSlide.classList.add('is-flashed');
    setTimeout(() => swiperSlide.classList.remove('is-flashed'), 2000);
  }
}



// Слайдер страницы About Us в секции Achievements

const swiperAchievements = new Swiper('.about__achievements .swiper', {
  modules: [Navigation],
  slidesPerView: 5,
  centeredSlides: true,
  spaceBetween: 60,
  initialSlide: 2,

  navigation: {
    nextEl: '.about__achievements-button-next',
    prevEl: '.about__achievements-button-prev',
  },

});

// Слайдер страницы About Us в секции Our key Clients

const swiperAboutClient = new Swiper('.about__clients .swiper', {
  modules: [Navigation],
  slidesPerView: 5,
  centeredSlides: true,
  spaceBetween: 60,
  initialSlide: 2,

  navigation: {
    nextEl: '.about__clients-button-next',
    prevEl: '.about__clients-button-prev',
  },

});

// Слайдер страницы About Us в секции Company Timeline

export const swiperTimeline = new Swiper('.about__timeline .swiper', {
  modules: [Navigation, Mousewheel],
  direction:'vertical',
  slidesPerView: 'auto',
  centeredSlides: true,
  spaceBetween: 30,
  initialSlide: 1,
  mousewheel: { // Включаем и настраиваем управление колесом мыши
    sensitivity: 1, // Чувствительность скролла (1 — стандарт)
    releaseOnEdges: true, // Отпускает скролл браузера на первом и последнем слайде
    forceToAxis: true, // Игнорирует движения по другой оси (защита от случайных диагоналей)
    thresholdDelta: 15, // Минимальный порог прокрутки, чтобы избежать случайных «двойных» переключений
  },

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

// // console.log('window.location.hash: ', window.location.hash.includes('#timeline'));
// if (currentPath.includes('about.html') && window.location.hash.includes('#timeline-')) {
//   console.log('timelineSwiper');
//   const slideTimeline = document.getElementById(window.location.hash.slice(1));
//   console.log('slideTimeline: ', slideTimeline);
//   swiperTimeline.activeIndex(slideTimeline.dataset.slideIndex);
  
//   /* const hashTeg = window.location.hash;
//   console.log('hashTeg: ', hashTeg);
//   if (hashTeg) {
//     const swiperSlide = document.getElementById(window.location.hash.slice(1));
//     console.log('swiperSlide: ', swiperSlide);
//     swiper.slideToLoop(swiperSlide.dataset.slideIndex);
//   } */
// }

if (currentPath.includes('/about.html')
    && window.location.hash.includes('#timeline-')) {
  const slideTimeline = window.location.hash[window.location.hash.length - 1];
  window.location.href = '/about.html#timeline';
  swiperTimeline.slideToLoop(slideTimeline);
  // const str = 
  console.log('slideTimeline: ', slideTimeline);
  
}

document.addEventListener('DOMContentLoaded', () => {
  navigationLinkActive();
});


//  Слайдер страницы Safety в секции At Ynanch Hyzmat

const swiperSafetyDescription = new Swiper('.safety__description .swiper', {
  modules: [EffectFade, Mousewheel],
  allowTouchMove: true,
  direction:'vertical',
  loop: true,
  // effect: 'fade',
  /* fadeEffect: {
    crossFade: true // Фоны будут плавно растворяться друг в друге, а не моргать
  }, */
  mousewheel: { // Включаем и настраиваем управление колесом мыши
    sensitivity: 1, // Чувствительность скролла (1 — стандарт)
    thresholdDelta: 15, // Минимальный порог прокрутки, чтобы избежать случайных «двойных» переключений
  },
  slidesPerView: 3,
  // centeredSlides: true,
  spaceBetween: 20,

  on: {
    slideChange(s) {
      const images = document.querySelectorAll('.safety__description-image');
      images.forEach(img => {
        if (+img.dataset.index === s.realIndex) {
          img.classList.add('safety__description-image_active');
        } else {
          img.classList.remove('safety__description-image_active');
        }
      });
    }
  }
});


//  Слайдер страницы Safety в секции Certificates

const swiperCertificates = new Swiper('.safety__certificates .swiper', {
  modules: [Navigation],
  slidesPerView: 'auto',
  centeredSlides: true,
  spaceBetween: -10,
  initialSlide: 2,

  navigation: {
    nextEl: '.safety__certificates-button-next',
    prevEl: '.safety__certificates-button-prev',
  },

});


//  Слайдер страницы Our team

export const swiperTeam = new Swiper('.team .swiper', {
  modules: [Parallax, Navigation],
  speed: 900,
  parallax: true,
  slidesPerView: 'auto',
  centeredSlides: true,
  spaceBetween: 140,

  // effect: 'creative',
  /* fadeEffect: {
    crossFade: true // Фоны будут плавно растворяться друг в друге, а не моргать
  }, */

  navigation: {
    nextEl: '.team__swiper-button-next',
    prevEl: '.team__swiper-button-prev',
  },
});

//  Когда переходим с поиска на конкретного сотрудника
if (currentPath.includes('team.html')) {
  const hashTeam = window.location.hash;
  console.log('hashTeam: ', hashTeam);
  if (hashTeam) {
    swiperTeam.slideToLoop(hashTeam.slice(1));
  }
}



//   Оранжевый круг в секции Timeline на странице About Us  надо включить
//   и сделать чтоб он срабатывал только на странице About Us

const progressTimeline = () => {

  const progress = document.querySelector('.ring-progress');

  if (!progress) {
    return;
  }

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
setTarget(swiperTimeline); // подхватить реальное состояние сразу, без ожидания первого скролла



};

progressTimeline();

