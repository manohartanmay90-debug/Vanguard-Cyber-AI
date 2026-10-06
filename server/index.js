import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

import express from 'express';
import cors from 'cors';
import { z } from 'zod';

if (!process.env.GEMINI_API_KEY && process.env.gemini_API_KEY) {
  process.env.GEMINI_API_KEY = process.env.gemini_API_KEY;
}

// Validate required environment variables at startup
const EnvSchema = z.object({
  PORT: z.string().default('3000'),
  SUPABASE_URL: z.string().optional().default('https://kgwhrftenthdtoeffhfa.supabase.co'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
});

const envResult = EnvSchema.safeParse(process.env);
if (!envResult.success) {
  console.warn('⚠️ Environment variable warnings:');
  envResult.error.errors.forEach(e => console.warn(`  - ${e.path.join('.')}: ${e.message}`));
}

import chatRouter from './routes/chat.js';
import adminRouter from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: '10kb' }));

// Health check (supports both /health and /api/health)
app.get(['/health', '/api/health'], (_req, res) => res.json({ status: 'ok', service: 'Vanguard Cyber AI Firewall' }));

// API Routes (supports both /api/chat and /chat for serverless rewrites)
app.use(['/api/chat', '/chat'], chatRouter);
app.use(['/api/admin', '/admin'], adminRouter);

// 404 handler
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('server\\index.js') || 
  process.argv[1].endsWith('server/index.js') ||
  process.argv[1].endsWith('server')
);

if (isDirectRun && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🛡️  Vanguard Cyber AI Firewall running on port ${PORT}`);
  });
}

export default app;

