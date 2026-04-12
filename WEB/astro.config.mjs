// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: { host: '0.0.0.0', port: 3000 },
  site: 'https://laura-mauricio.com',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
