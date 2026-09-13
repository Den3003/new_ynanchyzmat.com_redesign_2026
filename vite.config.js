import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import eslintPlugin from 'vite-plugin-eslint';
import injectHTML from 'vite-plugin-html-inject';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons-ng';

// 🔍 Авто-поиск всех HTML-файлов в корне проекта
const getRootHtmlInputs = () => {
  const files = fs.readdirSync(__dirname);
  const htmlFiles = files.filter((file) => file.endsWith('.html'));

  return htmlFiles.reduce((acc, file) => {
    // Название ключа без .html (например: 'index', 'about', 'contacts')
    const name = path.parse(file).name;
    acc[name] = path.resolve(__dirname, file);
    return acc;
  }, {});
};

export default defineConfig({
  plugins: [ 
    injectHTML(), // Включаем плагин
    eslintPlugin({
      // Опции: можно указать, включать ли предупреждения, кэш и т.д.
      cache: false,
      include: ['**/*.js'],
      exclude: ['node_modules/**', 'dist/**'],
    }),
    createSvgIconsPlugin({
      iconDirs: ['src/assets/icons'],
      failOnError: true,
      // Оптимизация SVG с помощью SVGO (настройка под ваш стиль)
      svgoOptions: {
        multipass: true, // многопроходная оптимизация
      }
    }),
  ],

  // Проверка PHPMailer
  server: {
    proxy: {
      '/php': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/php/, ''),
      },
    },
  },

  // Настройки продакшн-сборки (Rollup)
  build: {
    outDir: 'dist',
    emptyOutDir: true, // Очищать dist перед каждой сборкой

    assetsInlineLimit: (filePath, content) => {
      if (/\.(avif|webp|jpe?g|png|gif)$/i.test(filePath)) return false;
      return content.length < 4096;
    },

    
    rolldownOptions: {
      // Передаем авто-найденные HTML страницы
      input: getRootHtmlInputs(),

      output: {
        // Красивая и чистая раскладка ассетов по папкам
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg|webp|avif)$/.test(name ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(name ?? '')) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});