'use server';

/**
 * @fileOverview This file defines a Genkit flow for extracting information from a prescription image.
 *
 * It takes an image of a prescription as input and returns the extracted medication details, dosage instructions, and other relevant information.
 * - `verifyPrescriptionFromImage` - The main function to initiate the prescription verification from image.
 * - `VerifyPrescriptionFromImageInput` - The input type for the `verifyPrescriptionFromImage` function.
 * - `VerifyPrescriptionFromImageOutput` - The output type for the `verifyPrescriptionFromImage` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyPrescriptionFromImageInputSchema = z.object({
  prescriptionImage: z
    .string()
    .describe(
      "A photo of a prescription, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VerifyPrescriptionFromImageInput = z.infer<typeof VerifyPrescriptionFromImageInputSchema>;

const VerifyPrescriptionFromImageOutputSchema = z.object({
  medicationDetails: z
    .string()
    .describe('The extracted medication details from the prescription image.'),
  dosageInstructions: z
    .string()
    .describe('The extracted dosage instructions from the prescription image.'),
  otherRelevantInformation: z
    .string()
    .describe('Other relevant information extracted from the prescription image.'),
});
export type VerifyPrescriptionFromImageOutput = z.infer<typeof VerifyPrescriptionFromImageOutputSchema>;

export async function verifyPrescriptionFromImage(
  input: VerifyPrescriptionFromImageInput
): Promise<VerifyPrescriptionFromImageOutput> {
  return verifyPrescriptionFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyPrescriptionFromImagePrompt',
  input: {schema: VerifyPrescriptionFromImageInputSchema},
  output: {schema: VerifyPrescriptionFromImageOutputSchema},
  prompt: `You are a pharmacist AI assistant that extracts information from prescription images.

  Analyze the prescription image provided and extract the medication details, dosage instructions, and other relevant information.

  Consider the following prescription image:
  {{media url=prescriptionImage}}
  `,
});

const verifyPrescriptionFromImageFlow = ai.defineFlow(
  {
    name: 'verifyPrescriptionFromImageFlow',
    inputSchema: VerifyPrescriptionFromImageInputSchema,
    outputSchema: VerifyPrescriptionFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
