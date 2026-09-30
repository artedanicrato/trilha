import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './src/server/routes';
import { initializeDatabase } from './src/server/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // Request security & body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Initialize persistent database
  await initializeDatabase();

  // Mount API endpoints
  app.use('/api', apiRouter);

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Trilha Sonora Gráfica & Eletrônicos - Crato CE',
      timestamp: new Date().toISOString(),
    });
  });

  if (!isProduction) {
    // Development mode: Mount Vite dev server middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
    console.log('[Trilha Sonora] Servidor rodando em modo desenvolvimento com Vite middleware.');
  } else {
    // Production mode: Serve built static files from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('[Trilha Sonora] Servidor rodando em modo produção servindo dist.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Trilha Sonora] Servidor online em http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Trilha Sonora] Falha ao iniciar servidor:', err);
  process.exit(1);
});
