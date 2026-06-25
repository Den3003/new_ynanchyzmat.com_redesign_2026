import js from '@eslint/js';
import globals from 'globals';

export default [
  // 1. Базовые рекомендуемые правила от ESLint
  js.configs.recommended,

  // 2. Конфигурация для вашего проекта
  {
    // Какие файлы обрабатывать (опционально, можно задать в ignores)
    files: ['**/*.js'],

    // Настройки языка (ECMAScript, модули, глобальные переменные)
    languageOptions: {
      ecmaVersion: 'latest',        // используем последнюю версию ECMAScript
      sourceType: 'module',         // ES-модули (import/export)
      globals: {
        ...globals.browser,         // глобальные браузерные объекты (window, document и т.д.)
        ...globals.es2021,          // глобальные ES2021 (Promise, Map и т.д.)
        // Если вы используете Node.js-скрипты (например, vite.config.js), добавьте:
        // ...globals.node,
      },
    },

    // 3. Ваши собственные правила (переопределение или дополнение)
    rules: {
      'no-unused-vars': ["error", { "varsIgnorePattern": "swiper" }],
      // Отключаем правило, которое требует явный return в стрелочных функциях
      'arrow-body-style': ['error', 'as-needed'],
      // Запрещаем использование var
      'no-var': 'error',
      // Предпочитаем const для переменных, которые не переназначаются
      'prefer-const': 'error',
      // Требуем точки с запятой
      'semi': ['error', 'always'],
      // Используем одинарные кавычки (кроме случаев, когда нужны двойные)
      'quotes': ['error', 'single', { avoidEscape: true }],
      // Запрещаем лишние пробелы
      'no-multi-spaces': 'error',
      // Максимальная длина строки (предупреждение, а не ошибка)
      'max-len': ['warn', { code: 120, ignoreUrls: true }],
      // Обязательно использовать === и !==
      'eqeqeq': ['error', 'always'],
      // Не использовать alert, confirm, prompt (можно отключить)
      'no-alert': 'warn',
      // Требовать фигурные скобки у блоков
      'curly': ['error', 'all'],
    },

    // 4. Игнорируемые файлы и папки (можно вынести в отдельный объект)
    ignores: [
      'dist/**',           // сборка Vite
      'node_modules/**',   // зависимости
      // '*.config.js',       // файлы конфигов (vite.config.js, eslint.config.js) — опционально
    ],
  },
];