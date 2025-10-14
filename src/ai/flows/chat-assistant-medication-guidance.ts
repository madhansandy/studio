'use server';
/**
 * @fileOverview An AI agent that provides medication guidance based on user queries.
 *
 * - chatAssistantMedicationGuidance - A function that handles the medication guidance process.
 * - ChatAssistantMedicationGuidanceInput - The input type for the chatAssistantMedicationGuidance function.
 * - ChatAssistantMedicationGuidanceOutput - The return type for the chatAssistantMedicationGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicationSchema = z.object({
  name: z.string(),
  stockQuantity: z.number(),
  expiryDate: z.string(),
});

const PrescriptionSchema = z.object({
  name: z.string(),
  date: z.string(),
  safetyScore: z.number(),
  issues: z.array(z.string()),
});

const ChatAssistantMedicationGuidanceInputSchema = z.object({
  query: z.string().describe('The user query about their medications.'),
  medications: z.array(MedicationSchema).describe("The user's current medication inventory.").optional(),
  prescriptions: z.array(PrescriptionSchema).describe("The user's verified prescriptions.").optional(),
});
export type ChatAssistantMedicationGuidanceInput = z.infer<typeof ChatAssistantMedicationGuidanceInputSchema>;

const ChatAssistantMedicationGuidanceOutputSchema = z.object({
  response: z.string().describe('The AI assistant response to the user query.'),
});
export type ChatAssistantMedicationGuidanceOutput = z.infer<typeof ChatAssistantMedicationGuidanceOutputSchema>;

export async function chatAssistantMedicationGuidance(input: ChatAssistantMedicationGuidanceInput): Promise<ChatAssistantMedicationGuidanceOutput> {
  return chatAssistantMedicationGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatAssistantMedicationGuidancePrompt',
  input: {schema: ChatAssistantMedicationGuidanceInputSchema},
  output: {schema: ChatAssistantMedicationGuidanceOutputSchema},
  prompt: `You are a helpful AI assistant providing guidance on medications.

  Respond to the following user query regarding their medications, providing information about potential side effects or interactions. Be conversational and helpful.

  Use the following data about the user's current medications and past prescriptions to inform your answer.

  {{#if medications}}
  Current Medications in Inventory:
  {{#each medications}}
  - Name: {{name}}, Stock: {{stockQuantity}}, Expires: {{expiryDate}}
  {{/each}}
  {{/if}}

  {{#if prescriptions}}
  Verified Prescriptions:
  {{#each prescriptions}}
  - Name: {{name}}, Verified on: {{date}}, Safety Score: {{safetyScore}}{{#if issues}}, Issues: {{#each issues}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
  {{/each}}
  {{/if}}

  Query: {{{query}}} `,
});

const chatAssistantMedicationGuidanceFlow = ai.defineFlow(
  {
    name: 'chatAssistantMedicationGuidanceFlow',
    inputSchema: ChatAssistantMedicationGuidanceInputSchema,
    outputSchema: ChatAssistantMedicationGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
