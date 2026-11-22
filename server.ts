import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '64kb' }));

function getConfiguredBusinessEmail(): string {
  const candidates = [
    process.env.BUSINESS_EMAIL,
    process.env.VITE_BUSINESS_EMAIL,
    process.env.CONTACT_EMAIL,
    process.env.COMPANY_EMAIL,
    process.env.EMAIL,
  ];
  for (const candidate of candidates) {
    if (typeof candidate !== 'string') continue;
    const cleaned = candidate.trim().replace(/^['"]|['"]$/g, '');
    if (cleaned && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned) && cleaned.length <= 160) {
      return cleaned;
    }
  }
  return '';
}

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ ok: true });
});

// Safe site config endpoint (never exposes secrets)
app.get('/api/site-config', (_req: Request, res: Response) => {
  res.json({
    defaultEmail: getConfiguredBusinessEmail(),
  });
});

// Contact form enquiry submission endpoint
const DATA_DIR = path.resolve(__dirname, 'data');
const ENQUIRIES_FILE = path.resolve(DATA_DIR, 'enquiries.json');

interface EnquiryRecord {
  referenceId: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  serviceRequired: string;
  projectLocation: string;
  message: string;
  submittedAt: string;
}

app.post('/api/enquiries', (req: Request, res: Response) => {
  const body = req.body as Record<string, unknown>;

  const fullName = typeof body?.fullName === 'string' ? body.fullName.trim() : '';
  const mobileNumber = typeof body?.mobileNumber === 'string' ? body.mobileNumber.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const serviceRequired = typeof body?.serviceRequired === 'string' ? body.serviceRequired.trim() : '';
  const projectLocation = typeof body?.projectLocation === 'string' ? body.projectLocation.trim() : '';
  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  if (fullName.length < 2 || fullName.length > 120) {
    res.status(400).json({ error: 'Please enter your full name (2 to 120 characters).' });
    return;
  }

  const digitsOnly = mobileNumber.replace(/[\s\-()+]/g, '');
  if (!/^\d{10,15}$/.test(digitsOnly)) {
    res.status(400).json({ error: 'Please enter a valid mobile number (10 to 15 digits).' });
    return;
  }

  if (email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160)) {
    res.status(400).json({ error: 'Please enter a valid email address or leave the email field empty.' });
    return;
  }

  if (serviceRequired.length < 2 || serviceRequired.length > 140) {
    res.status(400).json({ error: 'Please select or specify the service required.' });
    return;
  }

  if (projectLocation.length > 160) {
    res.status(400).json({ error: 'Project location must be 160 characters or fewer.' });
    return;
  }

  if (message.length < 5 || message.length > 2000) {
    res.status(400).json({ error: 'Please provide brief project details (at least 5 characters).' });
    return;
  }

  const referenceId = `NIE-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const submittedAt = new Date().toISOString();

  const record: EnquiryRecord = {
    referenceId,
    fullName,
    mobileNumber,
    email,
    serviceRequired,
    projectLocation,
    message,
    submittedAt,
  };

  try {
    if (!ENQUIRIES_FILE.startsWith(DATA_DIR + path.sep)) {
      throw new Error('Invalid data path');
    }
    fs.mkdirSync(DATA_DIR, { recursive: true });
    let existing: EnquiryRecord[] = [];
    if (fs.existsSync(ENQUIRIES_FILE)) {
      const raw = fs.readFileSync(ENQUIRIES_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        existing = parsed as EnquiryRecord[];
      }
    }
    existing.push(record);
    const bounded = existing.slice(-500);
    fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(bounded, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Enquiry Persistence Error]', err);
    res.status(500).json({
      error: 'Unable to record your enquiry right now. Please call 9700110084 or message us on WhatsApp.',
    });
    return;
  }

  res.status(201).json({
    success: true,
    referenceId,
    submittedAt,
    message: 'Your enquiry has been received by New Imperial Enterprises. Our team will reach out to discuss your project requirements.',
  });
});

async function startServer() {
  if (!IS_PRODUCTION) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir, { maxAge: '1h' }));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`New Imperial Enterprises server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
