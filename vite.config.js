import { defineConfig } from 'vite';
import { resolve } from 'path';
import eslintPlugin from 'vite-plugin-eslint';
import injectHTML from 'vite-plugin-html-inject';

export default defineConfig({
  plugins: [ injectHTML(), // Включаем плагин
    eslintPlugin({
      // Опции: можно указать, включать ли предупреждения, кэш и т.д.
      cache: false,
      include: ['**/*.js'],
      exclude: ['node_modules/**', 'dist/**'],
    }),
  ],
});