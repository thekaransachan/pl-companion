import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api/fpl': {
            target: 'https://fantasy.premierleague.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/fpl/, '/api'),
          },
          '/api/premier-league': {
            target: 'https://sdp-prem-prod.premier-league-prod.pulselive.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/premier-league/, '/api'),
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
