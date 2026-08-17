// 1. Инициализируем форматировщик ОДИН раз (Best Practice для перформанса)
const ashgabatFormatter = new Intl.DateTimeFormat('ru-RU', {
  timeZone: 'Asia/Ashgabat',
  hour: '2-digit',
  minute: '2-digit',
  // hour12: false // Использовать 24-часовой формат. Поменяйте на true, если нужен AM/PM
});

const clockElement = document.querySelectorAll('.time-zone__hour');

// 2. Функция, которая берет системное время юзера и «сдвигает» его отображение под Ашхабад
export function tick(){
  const now = new Date();
  if (clockElement.length > 0) {
    clockElement.forEach(elem => elem.textContent = ashgabatFormatter.format(now));
  }
}

// 4. Запускаем интервал каждую секунду
setInterval(tick, 60000);