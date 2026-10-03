import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DIST_PATH = path.join(__dirname, 'dist');

// Serve static assets from Vite build
app.use(express.static(DIST_PATH));

// SPA catch-all fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(DIST_PATH, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CoreTaskPro server listening on 0.0.0.0:${PORT}`);
});
