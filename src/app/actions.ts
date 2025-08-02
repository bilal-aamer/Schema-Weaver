
'use server';

import { textToJsonConversion, TextToJsonConversionInput } from '@/ai/flows/text-to-json-conversion';
import { validateAndCorrectOutput, ValidateAndCorrectOutputInput } from '@/ai/flows/output-validation-correction';

interface ActionResult {
  data?: string;
  error?: string;
}

export async function convertTextToJsonAction(input: TextToJsonConversionInput): Promise<ActionResult> {
  try {
    const result = await textToJsonConversion(input);
    if (!result || !result.jsonOutput) {
        return { error: 'Failed to generate JSON from the AI model.' };
    }
    return { data: result.jsonOutput };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'An unknown error occurred during conversion.' };
  }
}

export async function correctAndConvertTextToJsonAction(input: ValidateAndCorrectOutputInput): Promise<ActionResult> {
  try {
    const result = await validateAndCorrectOutput(input);
    if (!result || !result.correctedJson) {
        return { error: 'Failed to generate or correct JSON from the AI model.' };
    }
    return { data: result.correctedJson };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'An unknown error occurred during validation and correction.' };
  }
}
