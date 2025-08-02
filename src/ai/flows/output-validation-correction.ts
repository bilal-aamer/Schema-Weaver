'use server';

/**
 * @fileOverview Implements a Genkit flow that validates and corrects JSON output against a given schema.
 *
 * - validateAndCorrectOutput - A function that takes text and a JSON schema, converts the text to JSON, and corrects it if it doesn't match the schema.
 * - ValidateAndCorrectOutputInput - The input type for the validateAndCorrectOutput function.
 * - ValidateAndCorrectOutputOutput - The return type for the validateAndCorrectOutput function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ValidateAndCorrectOutputInputSchema = z.object({
  text: z.string().describe('The unstructured text to convert to JSON.'),
  schema: z.string().describe('The JSON schema to adhere to.'),
});
export type ValidateAndCorrectOutputInput = z.infer<
  typeof ValidateAndCorrectOutputInputSchema
>;

const ValidateAndCorrectOutputOutputSchema = z.object({
  correctedJson: z.string().describe('The JSON output, corrected to match the schema.'),
  validationResult: z
    .string()
    .describe('Result of validation, including any errors caught.'),
});
export type ValidateAndCorrectOutputOutput = z.infer<
  typeof ValidateAndCorrectOutputOutputSchema
>;

export async function validateAndCorrectOutput(
  input: ValidateAndCorrectOutputInput
): Promise<ValidateAndCorrectOutputOutput> {
  return validateAndCorrectOutputFlow(input);
}

const jsonStructureValidator = ai.defineTool({
  name: 'jsonStructureValidator',
  description: 'Validates if a JSON string matches the structure of a given JSON example or schema.',
  inputSchema: z.object({
    jsonString: z.string().describe('The JSON string to validate.'),
    targetStructure: z.string().describe('The target JSON structure to match.'),
  }),
  outputSchema: z.string(),
},
async (input) => {
  try {
    const targetStructure = JSON.parse(input.targetStructure);
    const jsonData = JSON.parse(input.jsonString);
    
    const targetKeys = Object.keys(targetStructure);
    const jsonKeys = Object.keys(jsonData);
    
    const missingKeys = targetKeys.filter(key => !jsonKeys.includes(key));
    if (missingKeys.length > 0) {
      return `Missing keys: ${missingKeys.join(', ')}`;
    }
    
    const extraKeys = jsonKeys.filter(key => !targetKeys.includes(key));
    if (extraKeys.length > 0) {
      return `Extra keys: ${extraKeys.join(', ')}`;
    }
    
    return 'Valid structure';
  } catch (e: any) {
    return `Validation error: ${e.message}`;
  }
});

const correctJsonPrompt = ai.definePrompt({
  name: 'correctJsonPrompt',
  tools: [jsonStructureValidator],
  input: { schema: ValidateAndCorrectOutputInputSchema },
  output: { schema: ValidateAndCorrectOutputOutputSchema },
  prompt: `You are a text-to-JSON converter. Your job is to convert the given text into JSON that matches the provided structure.

CRITICAL INSTRUCTIONS:
1. Extract information from the text and create a JSON object
2. The JSON must match the structure provided in the schema
3. Use the jsonStructureValidator tool to check if your JSON matches the structure
4. If validation fails, fix the JSON and try again
5. Return ONLY the final result in the required format

DO NOT:
- Return a schema template
- Return just "true" or "false"
- Return the input schema as output

MUST DO:
- Convert the text into actual data
- Match the structure exactly
- Return in this format:
{
  "correctedJson": "{\\"actual\\":\\"data\\",\\"from\\":\\"text\\"}",
  "validationResult": "Valid structure"
}

Text to convert: {{{text}}}

Target structure: {{{schema}}}

Now convert the text to JSON matching this structure.`,
});

const validateAndCorrectOutputFlow = ai.defineFlow(
  {
    name: 'validateAndCorrectOutputFlow',
    inputSchema: ValidateAndCorrectOutputInputSchema,
    outputSchema: ValidateAndCorrectOutputOutputSchema,
  },
  async input => {
    console.log("Input received:", input);
    const { output } = await correctJsonPrompt(input);
    console.log("AI Output:", output);
    return output!;
  }
);
