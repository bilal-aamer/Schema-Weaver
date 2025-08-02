'use server';

/**
 * @fileOverview Converts unstructured plain text into structured JSON format strictly following a desired JSON schema.
 *
 * - textToJsonConversion - A function that handles the text to JSON conversion process.
 * - TextToJsonConversionInput - The input type for the textToJsonConversion function.
 * - TextToJsonConversionOutput - The return type for the textToJsonConversion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TextToJsonConversionInputSchema = z.object({
  text: z.string().describe('The unstructured plain text to convert.'),
  schema: z.string().describe('The JSON schema to adhere to.'),
});
export type TextToJsonConversionInput = z.infer<typeof TextToJsonConversionInputSchema>;

const TextToJsonConversionOutputSchema = z.object({
  jsonOutput: z.string().describe('The structured JSON output.'),
  isValid: z.boolean().describe('Whether the JSON output is valid.'),
});
export type TextToJsonConversionOutput = z.infer<typeof TextToJsonConversionOutputSchema>;

export async function textToJsonConversion(input: TextToJsonConversionInput): Promise<TextToJsonConversionOutput> {
  return textToJsonConversionFlow(input);
}

const textToJsonConversionPrompt = ai.definePrompt({
  name: 'textToJsonConversionPrompt',
  input: {schema: TextToJsonConversionInputSchema},
  output: {schema: TextToJsonConversionOutputSchema},
  prompt: `You are a conversion expert. You will convert the given text into JSON format, strictly adhering to the provided JSON schema.

Text: {{{text}}}

Schema: {{{schema}}}

Output the converted JSON. Set isValid to true if the output matches the schema. Otherwise, set to false.

Ensure that the generated JSON is valid and adheres to the schema.`, 
});

const textToJsonConversionFlow = ai.defineFlow(
  {
    name: 'textToJsonConversionFlow',
    inputSchema: TextToJsonConversionInputSchema,
    outputSchema: TextToJsonConversionOutputSchema,
  },
  async input => {
    const {output} = await textToJsonConversionPrompt(input);
    return output!;
  }
);

