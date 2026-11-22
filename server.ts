import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '64kb' }));

function getConfiguredApiKey(): string | null {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key || key === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return key;
}

const IMPERIAL_SYSTEM_INSTRUCTION = `You are the "Imperial AI Assistant", the official virtual assistant for NEW IMPERIAL ENTERPRISES.

VERIFIED BUSINESS FACTS (use ONLY these facts; NEVER invent anything else):
- Business Name: NEW IMPERIAL ENTERPRISES
- Tagline: Crafting Spaces. Creating Possibilities.
- Phone Numbers: 9700110084, 7013248518
- WhatsApp: https://wa.me/919700110084
- GSTIN: 36BZUPM1868G1ZQ
- Email: Only share an email address if explicitly provided in the conversation context; otherwise direct customers to phone numbers 9700110084 / 7013248518, WhatsApp, or the Contact page enquiry form.

COMPLETE LIST OF SERVICES OFFERED:
1. Aluminium Works:
   - Aluminium windows
   - Aluminium doors
   - Aluminium partitions
   - Aluminium glass partitions
   - Aluminium French windows
   - Aluminium profile cupboard works
   - Aluminium workstations
   - Customized aluminium fabrication
2. Glass Works:
   - 12 mm glass partitions
   - 45x25 glass partition systems
   - Aluminium glass partitions
   - Glass elevations
   - All types of glass work
   - Glass railings
   - Glass installation works
3. UPVC Windows and Doors:
   - UPVC windows
   - UPVC doors
   - Customized UPVC solutions
4. Interior and Ceiling Works:
   - Gypsum ceilings
   - Gypsum partitions
   - Grid ceilings
   - 2x2 grid ceilings
   - ACP works
   - All types of paint works
   - Aluminium workstations
   - Wooden workstations
5. Railings and Metal Works:
   - SS railings
   - Glass railings
   - Aluminium railings
   - Aluminium glass railings
   - MS works
6. Additional Services:
   - Black NDS curtains
   - Electrical works
   - Aluminium profile cupboard works
   - Customized interior and fabrication solutions

ENQUIRY PROCESS:
1. Customer Enquiry
2. Project Discussion
3. Design & Execution
4. Installation & Finishing

STRICT BEHAVIOUR RULES:
- Respond naturally, concisely (typically 2-4 crisp sentences or short bullet points), and professionally in clear everyday English.
- Understand common phrasing variations and simple English questions.
- Ask what type of work the customer needs when helpful.
- Collect enquiry details (Name, Contact Number, Service Required, and Project Location) ONLY if the customer agrees to share them.
- When a customer asks for a quotation, pricing, estimate, or site discussion, offer to connect them directly on WhatsApp (https://wa.me/919700110084) or via phone (9700110084 / 7013248518) or the Contact page form.
- NEVER invent prices, rates per sq ft, discounts, project timelines, warranties, certifications, founding year, experience counts, office address, or technical specifications.
- NEVER claim that a quotation, site visit, or booking has been confirmed.
- If asked something outside verified company information, politely state that the team can clarify directly and share the phone numbers 9700110084 and 7013248518.`;

interface ChatMessageInput {
  role: 'user' | 'model';
  text: string;
}

app.get('/api/chat/status', (_req: Request, res: Response) => {
  const configured = Boolean(getConfiguredApiKey());
  res.json({ configured });
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const apiKey = getConfiguredApiKey();
  if (!apiKey) {
    res.status(503).json({
      error: 'AI assistant is awaiting Gemini API configuration.',
      code: 'AI_NOT_CONFIGURED',
    });
    return;
  }

  const body = req.body as {
    messages?: unknown;
    configuredEmail?: unknown;
  };

  if (!Array.isArray(body?.messages) || body.messages.length === 0) {
    res.status(400).json({ error: 'A valid conversation message array is required.' });
    return;
  }

  const sanitizedMessages: ChatMessageInput[] = [];
  for (const item of body.messages.slice(-16)) {
    if (
      item &&
      typeof item === 'object' &&
      ('role' in item) &&
      ('text' in item) &&
      (item.role === 'user' || item.role === 'model') &&
      typeof item.text === 'string'
    ) {
      const trimmed = item.text.trim();
      if (trimmed.length > 0 && trimmed.length <= 2000) {
        sanitizedMessages.push({ role: item.role, text: trimmed });
      }
    }
  }

  if (sanitizedMessages.length === 0 || sanitizedMessages[sanitizedMessages.length - 1].role !== 'user') {
    res.status(400).json({ error: 'The latest message must be a valid user message.' });
    return;
  }

  let emailNote = '';
  if (typeof body.configuredEmail === 'string') {
    const emailCandidate = body.configuredEmail.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailCandidate) && emailCandidate.length <= 160) {
      emailNote = `\n- Verified Configured Business Email: ${emailCandidate}`;
    }
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const contents = sanitizedMessages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents,
      config: {
        systemInstruction: `${IMPERIAL_SYSTEM_INSTRUCTION}${emailNote}`,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const reply = response.text?.trim();
    if (!reply) {
      res.status(502).json({
        error: 'No response was returned by the assistant. Please call 9700110084 or 7013248518.',
      });
      return;
    }

    const latestUserText = sanitizedMessages[sanitizedMessages.length - 1].text.toLowerCase();
    const quoteIntent = /quote|quotation|price|cost|rate|estimate|whatsapp|talk|team|call|visit|enquir/.test(
      latestUserText
    );

    res.json({
      reply,
      suggestWhatsApp: quoteIntent || reply.toLowerCase().includes('whatsapp'),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unable to reach AI service.';
    console.error('[Imperial AI Assistant Error]', message);
    res.status(502).json({
      error: 'The AI assistant is temporarily unavailable. You can reach our team directly at 9700110084 or 7013248518.',
    });
  }
});

// Safe site config endpoint (never exposes secrets)
app.get('/api/site-config', (_req: Request, res: Response) => {
  const rawEmail = process.env.BUSINESS_EMAIL?.trim() ?? '';
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail) ? rawEmail : '';
  res.json({
    defaultEmail: validEmail,
  });
});

// Contact form enquiry submission endpoint
const DATA_DIR = path.resolve(process.cwd(), 'data');
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
    // Retain recent records safely without unbounded disk growth
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
    const distDir = path.resolve(process.cwd(), 'dist');
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
