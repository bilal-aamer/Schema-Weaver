'use server';

/**
 * @fileOverview Implements a Genkit flow that validates and corrects JSON output against a given schema.
 *
 * - validateAndCorrectOutput - A function that takes text and a JSON schema, converts the text to JSON, and corrects it if it doesn't match the schema.
 * - ValidateAndCorrectOutputInput - The input type for the validateAndCorrectOutput function.
 * - ValidateAndCorrectOutputOutput - The return type for the validateAndCorrectOutput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

const jsonSchemaValidator = ai.defineTool({
  name: 'jsonSchemaValidator',
  description: 'Validates a JSON string against a provided schema and returns validation result.',
  inputSchema: z.object({
    jsonString: z.string().describe('The JSON string to validate.'),
    schema: z.string().describe('The JSON schema to validate against.'),
  }),
  outputSchema: z.string(),
},
async (input) => {
  try {
    const schema = JSON.parse(input.schema);
    const jsonData = JSON.parse(input.jsonString);
    const Ajv = (await import('ajv')).default;
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(jsonData);
    if (!valid) {
      return JSON.stringify(validate.errors, null, 2);
    }
    return 'Valid JSON';
  } catch (e: any) {
    return `Failed to validate JSON: ${e.message}`;
  }
});

const correctJsonPrompt = ai.definePrompt({
  name: 'correctJsonPrompt',
  tools: [jsonSchemaValidator],
  input: {schema: ValidateAndCorrectOutputInputSchema},
  output: {schema: ValidateAndCorrectOutputOutputSchema},
  prompt: `You are a JSON validator and fixer. Given the following text and JSON schema, 
your goal is to convert the text into JSON, and then validate it against the schema using the jsonSchemaValidator tool.
If the JSON is not valid, you MUST correct the JSON so that it is valid against the schema.

Text: {{{text}}}

Schema: {{{schema}}}
`,
});

const validateAndCorrectOutputFlow = ai.defineFlow(
  {
    name: 'validateAndCorrectOutputFlow',
    inputSchema: ValidateAndCorrectOutputInputSchema,
    outputSchema: ValidateAndCorrectOutputOutputSchema,
  },
  async input => {
    const {output} = await correctJsonPrompt(input);
    return output!;
  }
);

