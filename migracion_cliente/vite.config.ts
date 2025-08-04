import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from 'node:path';
import Pages from 'vite-plugin-pages';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), 
    Pages({
      dirs: [{ dir: 'src', baseRoute: '' }],
      extensions: ['tsx'],
      resolver: 'react',
      routeStyle: 'nuxt',
      importMode: 'async',
    })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),     // ahora "@/algo" → "src/algo"
    },
  },
});
