'use server';

/**
 * @fileOverview This file defines a Genkit flow for calculating the safety score of a prescription.
 *
 * It takes prescription text or image as input and returns a safety score along with potential issues.
 * - `getPrescriptionSafetyScore` - The main function to initiate the prescription safety check.
 * - `PrescriptionSafetyScoreInput` - The input type for the `getPrescriptionSafetyScore` function.
 * - `PrescriptionSafetyScoreOutput` - The output type for the `getPrescriptionSafetyScore` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrescriptionSafetyScoreInputSchema = z.object({
  prescriptionText: z
    .string()
    .describe('The text content of the prescription.')
    .optional(),
  prescriptionImage: z
    .string()
    .describe(
      "A photo of a prescription, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
    .optional(),
});
export type PrescriptionSafetyScoreInput = z.infer<typeof PrescriptionSafetyScoreInputSchema>;

const PrescriptionSafetyScoreOutputSchema = z.object({
  safetyScore: z
    .number()
    .describe('A score indicating the safety of the prescription (0-100).'),
  issues: z.array(
    z.string().describe('A list of potential issues with the prescription.')
  ),
});
export type PrescriptionSafetyScoreOutput = z.infer<typeof PrescriptionSafetyScoreOutputSchema>;

export async function getPrescriptionSafetyScore(
  input: PrescriptionSafetyScoreInput
): Promise<PrescriptionSafetyScoreOutput> {
  return prescriptionSafetyScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prescriptionSafetyScorePrompt',
  input: {schema: PrescriptionSafetyScoreInputSchema},
  output: {schema: PrescriptionSafetyScoreOutputSchema},
  prompt: `You are a pharmacist AI assistant that evaluates the safety of prescriptions.

  Analyze the prescription information provided and generate a safety score between 0 and 100.
  Also, identify any potential issues or concerns related to the prescription, such as dosage problems, drug interactions, or other relevant safety considerations.

  Return the safety score and a list of any identified issues.

  Consider the following prescription information:
  {{#if prescriptionText}}
  Prescription Text: {{{prescriptionText}}}
  {{/if}}
  {{#if prescriptionImage}}
  Prescription Image: {{media url=prescriptionImage}}
  {{/if}}
  `,
});

const prescriptionSafetyScoreFlow = ai.defineFlow(
  {
    name: 'prescriptionSafetyScoreFlow',
    inputSchema: PrescriptionSafetyScoreInputSchema,
    outputSchema: PrescriptionSafetyScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
