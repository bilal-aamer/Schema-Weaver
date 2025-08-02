# **App Name**: Schema Weaver

## Core Features:

- Text to JSON Conversion: Convert unstructured plain text into structured format strictly following a desired JSON schema using the OpenAI API.
- Web App Interface: Expose the system via a web app for easy access and interaction.
- Input Handling: Allow users to input text and upload JSON schema files via a form.
- Output Display: Display the converted JSON output in a readable format, with syntax highlighting.
- Output Validation & Correction: Integrate a 'tool' that, if a converted output does not strictly adhere to its given schema, uses an LLM tool to self-correct its output. 
- Large context support: Handle large input context windows (50k text inputs, 100k schema files) by allowing users to load external documents (e.g., .txt, .json) into the application

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) for a professional and reliable feel.
- Background color: Light gray (#F5F5F5) for a clean and modern look.
- Accent color: Teal (#009688) for interactive elements and highlights.
- Body and headline font: 'Inter' (sans-serif) for a clean, readable, and modern appearance, suitable for both headers and body text.
- Use simple, outline-style icons for a clean and consistent look.
- Employ a clear and intuitive layout with distinct sections for input, schema upload, and output display.