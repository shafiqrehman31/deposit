import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { Lead, CmsContent, PipedriveConfig, AnalyticsData } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = parseInt(process.env.PORT || '3000', 10);

// Use absolute project pathing for stable read bundling on Vercel
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// AES-256-GCM Encryption key derived from server secret
const SERVER_SECRET = process.env.ENCRYPTION_SECRET || 'deposit-hero-secure-master-salt-2026-uk';
const ENCRYPTION_KEY = crypto.createHash('sha256').update(SERVER_SECRET).digest();

function encryptText(text: string): { encryptedData: string; iv: string; tag: string } {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  return { encryptedData: encrypted, iv: iv.toString('hex'), tag };
}

function decryptText(encryptedData: string, ivHex: string, tagHex: string): string {
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Decryption failed:', err);
    return '';
  }
}

// Default data state fallback
const defaultCms: CmsContent = {
  siteName: 'Deposit Hero',
  tagline: 'UK Tenancy Deposit Claim Specialists',
  contactEmail: 'claims@mydeposithero.co.uk',
  contactPhone: '0800 048 5321',
  officeAddress: '124 City Road, London, EC1V 2NX, United Kingdom',
  heroBadge: 'Regulated Tenancy Deposit Recovery Specialists',
  heroHeadline: 'Claim up to 3x your tenancy deposit compensation.',
  heroSubtitle: 'Under the UK Housing Act 2004, if your landlord failed to protect your deposit in an approved scheme within 30 days or provide prescribed information, you could be legally owed £1,000s in compensation. 100% No Win No Fee.',
  ctaText: 'Check Eligibility in 60s',
  logoUrl: '',
  faviconUrl: '',
  stats: {
    claimsRecovered: '£4.2M+',
    successRate: '98.4%',
    averagePayout: '£2,850',
    clientRating: '4.9 / 5.0',
  },
  services: [
    {
      id: 'srv-1',
      title: 'Unprotected Deposit Claims',
      tagline: 'Housing Act 2004 Section 213 Enforcement',
      description: 'If your landlord or letting agent kept your deposit in their private bank account without registering it in DPS, TDS, or MyDeposits, they are strictly liable for 1x to 3x the deposit amount in compensation.',
      statKicker: 'Statutory Penalty 1x - 3x Deposit Value',
    },
    {
      id: 'srv-2',
      title: 'Late Deposit Protection Claims',
      tagline: '30-Day Strict Legal Window',
      description: 'Even if your landlord eventually protected your deposit, doing so after the statutory 30-day deadline remains an irrevocable legal breach. You remain fully eligible for compensation.',
      statKicker: 'Late Compliance Does Not Cancel The Breach',
    },
    {
      id: 'srv-3',
      title: 'Prescribed Information Failures',
      tagline: 'Statutory Notice & Certificate Omission',
      description: 'Landlords are legally required to provide official scheme information, contact details, dispute procedures, and deposit certificate within 30 days. Failure triggers the exact same 1x-3x penalty.',
      statKicker: 'Strict Technical Liability for Landlords',
    },
    {
      id: 'srv-4',
      title: 'Tenancy Renewal Multipliers',
      tagline: 'Superstrike vs Rodrigues Precedent',
      description: 'If your tenancy was renewed or became a periodic tenancy, each term counts as a separate deposit transaction under UK case law, potentially doubling or tripling your total compensation award.',
      statKicker: 'Separate Penalties Per Renewal Term',
    },
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'Can my landlord evict me if I make a deposit compensation claim?',
      answer: 'No. Retaliatory eviction is unlawful. If your deposit was not protected or protected late, your landlord cannot serve a valid Section 21 eviction notice until the deposit has been returned to you in full.',
    },
    {
      id: 'faq-2',
      question: 'How much compensation could I receive?',
      answer: 'Under Section 214 of the Housing Act 2004, the court must order the landlord to pay a statutory penalty of between 1 and 3 times the amount of the deposit for each breach.',
    },
  ],
  legalDisclaimer: 'Deposit Hero is a dedicated legal intake portal working alongside SRA-regulated solicitors.',
};

// Memory store fallback for Serverless lifecycle runs
let memoryDb = {
  cms: defaultCms,
  leads: [] as Lead[],
};

// Load database file safely without breaking when read-only or empty
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const rawData = fs.readFileSync(DB_FILE, 'utf-8');
      if (rawData.trim()) {
        const parsed = JSON.parse(rawData);
        memoryDb.cms = parsed.cms || defaultCms;
        memoryDb.leads = parsed.leads || [];
        return;
      }
    }
  } catch (error) {
    console.error("Database reading failed, using internal fallbacks:", error);
  }
  memoryDb.cms = defaultCms;
}

// Save database file safely while catching serverless write exceptions gracefully
function saveDatabase() {
  try {
    // Only attempt structural writes if running outside Vercel production environments
    if (!process.env.VERCEL) {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), 'utf-8');
    }
  } catch (error) {
    console.error("Database write blocked by serverless target system filesystem:", error);
  }
}

// Initialize Database data mapping
loadDatabase();

// --- API ROUTES ---

// GET: CMS configuration settings payload
app.get('/api/cms', (req: Request, res: Response) => {
  res.json(memoryDb.cms);
});

// POST: Update CMS configuration parameters
app.post('/api/cms', (req: Request, res: Response) => {
  memoryDb.cms = { ...memoryDb.cms, ...req.body };
  saveDatabase();
  res.json({ success: true, data: memoryDb.cms });
});

// GET: Fetch all active leads
app.get('/api/leads', (req: Request, res: Response) => {
  res.json(memoryDb.leads);
});

// POST: Process and record new incoming inquiry entries
app.post('/api/leads', (req: Request, res: Response) => {
  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'new',
    ...req.body
  };
  memoryDb.leads.unshift(newLead);
  saveDatabase();
  res.json({ success: true, lead: newLead });
});

// Serve frontend assets statically in production mode
if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Start listener cleanly when running locally
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
  });
}

export default app;
