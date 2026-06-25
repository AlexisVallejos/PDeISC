import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { registerSocio } from './controllers/socioController.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  const extension = path.extname(req.path);
  if (extension === '.html') res.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (extension === '.css') res.setHeader('Content-Type', 'text/css; charset=utf-8');
  if (extension === '.js') res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  next();
});
app.get('/', (_req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) res.setHeader('Content-Type', 'text/html; charset=utf-8');
    if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css; charset=utf-8');
    if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  }
}));

app.post('/api/socios', registerSocio);

app.listen(PORT, () => {
  console.log(`Servidor de Registro Socios River corriendo en el puerto http://localhost:${PORT}`);
});
