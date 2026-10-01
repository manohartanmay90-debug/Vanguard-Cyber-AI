import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';

if (!process.env.GEMINI_API_KEY && process.env.gemini_API_KEY) {
  process.env.GEMINI_API_KEY = process.env.gemini_API_KEY;
}

// Validate required environment variables at startup
const EnvSchema = z.object({
  PORT: z.string().default('3000'),
  SUPABASE_URL: z.string().min(1, 'SUPABASE_URL is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
});

const envResult = EnvSchema.safeParse(process.env);
if (!envResult.success) {
  console.error('❌ Missing required environment variables:');
  envResult.error.errors.forEach(e => console.error(`  - ${e.path.join('.')}: ${e.message}`));
  process.exit(1);
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

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'Aegis AI Firewall' }));

// API Routes
app.use('/api/chat', chatRouter);
app.use('/api/admin', adminRouter);

// 404 handler
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🛡️  Aegis AI Firewall running on port ${PORT}`);
});
