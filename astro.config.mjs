// @ts-nocheck
import { defineConfig, fontProviders } from "astro/config";
import node from "@astrojs/node";
import icon from "astro-icon";
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://marriage.madethemes.com',
  base: '/',
  output: 'server',
  adapter: node({ mode: 'standalone' }),

  fonts: [
    {
      name: 'Cormorant Garamond',
      cssVariable: '--font-cormorant-garamond',
      provider: fontProviders.google(),
      weights: ['300', '400', '500', '600', '700'],
    },
    {
      name: 'Montserrat',
      cssVariable: '--font-montserrat',
      provider: fontProviders.google(),
      weights: ['300', '400', '500', '600'],
    },
  ],

  integrations: [
    icon({
      include: {
        // Include Bootstrap icons used in the project
        bi: ['heart-fill', 'geo-alt', 'list', 'exclamation-triangle', 'house-door-fill', 'calendar-event', 'telephone', 'clock', 'chevron-down', 'geo-alt-fill', 'pin-map', 'hourglass-split', 'map', 'send', 'stars', 'x-lg', 'clock-history', 'door-open', 'heart-fill', 'camera', 'cup-hot', 'music-note-beamed', 'balloon-heart', 'palette-fill', 'car-front-fill', 'cloud-sun-fill', 'people-fill', 'camera-fill', 'gift-fill', 'reception-4', 'balloon-heart-fill', 'heart-pulse-fill', 'envelope', 'instagram', 'facebook', 'twitter-x', 'tiktok', 'youtube', 'pinterest', 'arrow-up', 'check-circle-fill', 'lightbulb-fill', 'file-earmark-plus-fill', 'folder2-open', 'book', 'brush-fill', 'info-circle-fill', 'gear-fill',
        ],
      }
    }),
  ],

  vite: {
    resolve: {
      alias: {
        '@img': '/src/img',
      },
    },
    plugins: [tailwindcss()]
  }
});