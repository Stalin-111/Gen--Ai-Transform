import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { getDb } from './server/database/db.js';
import { documentRouter } from './server/routes/documents.js';
import { transformRouter } from './server/routes/transform.js';
import { qualityRouter } from './server/routes/quality.js';
import { historyRouter } from './server/routes/history.js';
import { templatesRouter } from './server/routes/templates.js';
import { exportRouter } from './server/routes/export.js';
import { statsRouter } from './server/routes/stats.js';
import { translateRouter } from './server/routes/translate.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize SQLite database
  await getDb();

  // Middleware
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'TransformAI Platform',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/documents', documentRouter);
  app.use('/api/transform', transformRouter);
  app.use('/api/quality-check', qualityRouter);
  app.use('/api/transformations', historyRouter);
  app.use('/api/templates', templatesRouter);
  app.use('/api/export', exportRouter);
  app.use('/api/stats', statsRouter);
  app.use('/api/translate', translateRouter);

  // Vite middleware for dev / static for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TransformAI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server boot error:', err);
});
