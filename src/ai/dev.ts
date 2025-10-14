import { config } from 'dotenv';
config();

import '@/ai/flows/chat-assistant-medication-guidance.ts';
import '@/ai/flows/prescription-safety-score.ts';
import '@/ai/flows/verify-prescription-from-image.ts';
import '@/ai/flows/generate-prescription-safety-score.ts';