'use server';

/**
 * @fileOverview This file defines a Genkit flow for extracting structured information from a prescription image.
 *
 * It takes an image of a prescription as input and returns extracted details like medication name, dosage, and provider.
 * - `extractPrescriptionDetails` - The main function to initiate the prescription detail extraction.
 * - `ExtractPrescriptionDetailsInput` - The input type for the function.
 * - `ExtractPrescriptionDetailsOutput` - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractPrescriptionDetailsInputSchema = z.object({
  prescriptionImage: z
    .string()
    .describe(
      "A photo of a prescription, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractPrescriptionDetailsInput = z.infer<typeof ExtractPrescriptionDetailsInputSchema>;

const ExtractPrescriptionDetailsOutputSchema = z.object({
  name: z
    .string()
    .describe('The name of the medication, including strength (e.g., "Lisinopril 10mg").'),
  provider: z
    .string()
    .describe('The name of the doctor or clinic that provided the prescription.'),
  isFake: z
    .boolean()
    .describe('Whether the prescription appears to be fake or invalid.'),
  reasoning: z
    .string()
    .describe('The reasoning for why the prescription might be considered fake.'),
});
export type ExtractPrescriptionDetailsOutput = z.infer<typeof ExtractPrescriptionDetailsOutputSchema>;

export async function extractPrescriptionDetails(
  input: ExtractPrescriptionDetailsInput
): Promise<ExtractPrescriptionDetailsOutput> {
  return extractPrescriptionDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractPrescriptionDetailsPrompt',
  input: {schema: ExtractPrescriptionDetailsInputSchema},
  output: {schema: ExtractPrescriptionDetailsOutputSchema},
  prompt: `You are a pharmacist AI assistant that extracts key information from prescription images and assesses their authenticity.

  Analyze the prescription image provided and extract the following details:
  1. The name of the medication, including its strength (e.g., "Lisinopril 10mg").
  2. The name of the prescribing doctor or clinic.
  3. Determine if the prescription is likely to be fake. Look for inconsistencies, missing information, or unusual formatting.
  4. Provide a brief reasoning for your assessment of authenticity.

  Return the extracted information in the specified format.

  Consider the following prescription image:
  {{media url=prescriptionImage}}
  `,
});

const extractPrescriptionDetailsFlow = ai.defineFlow(
  {
    name: 'extractPrescriptionDetailsFlow',
    inputSchema: ExtractPrescriptionDetailsInputSchema,
    outputSchema: ExtractPrescriptionDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
