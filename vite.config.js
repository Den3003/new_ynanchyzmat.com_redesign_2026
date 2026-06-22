import { defineConfig } from 'vite';
import { resolve } from 'path';
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [
    eslintPlugin({
      // Опции: можно указать, включать ли предупреждения, кэш и т.д.
      cache: false,
      include: ['**/*.js'],
      exclude: ['node_modules/**', 'dist/**'],
    }),
  ],
});