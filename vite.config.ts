import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { devTextEditor } from './scripts/dev-text-editor.mjs';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react(), devTextEditor()],
  resolve: {
    alias: {
      '@client': `${root}client`,
      '@': root.replace(/\/$/, ''),
    },
  },
});
