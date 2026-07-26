import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bulldogfluffy.com.co',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
