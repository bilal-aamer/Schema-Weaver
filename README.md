# Schema Weaver

An AI-powered system built within a Next.js Firebase Studio environment that converts unstructured plain text into structured JSON format strictly following a desired JSON schema. It leverages Google AI models and the GenKit framework to achieve this.

## 🎯 Key Features

- **Text to JSON Conversion**: Converts unstructured plain text into structured JSON format using the OpenAI API, adhering to a given JSON schema.
- **Web App Interface**: Provides a user-friendly web interface for interaction.
- **Input Handling**: Allows users to input text and upload JSON schema files via a form.
- **Output Display**: Displays the converted JSON output with syntax highlighting.
- **Output Validation & Correction**: Integrates a tool to self-correct converted output that doesn't strictly adhere to the schema using an LLM.
- **Large Context Support**: Handles large input contexts by allowing users to load external documents.

## 🚀 Quick Start

To get started with this Next.js starter in Firebase Studio, take a look at `src/app/page.tsx`.

Further details on setting up and running the application can be found in the project's documentation.

## 📖 Solution Design & Implementation

### Solution Design Doc & Implementation Log

The solution is documented in detail in the [docs/blueprint.md](/docs/blueprint.md) file. This document outlines the core components, AI flows, and the overall architecture of the application.

## 🌐 Code, Deployment, and Constraints

### GitHub Repository & Deployed UI

- **GitHub Repository**: [Link to GitHub Repository] (Replace with actual link)
- **Deployed UI**: [Link to Deployed UI] (Replace with actual link)

### Constraints

- **Model Limitations**: Performance and accuracy depend on the capabilities of the chosen AI model (e.g., `gemini-1.5-flash`). More complex schemas or nuanced instructions might require a more powerful model.
- **Context Window**: The length of the natural language description and the provided schema are limited by the model's context window.
- **Output Format**: While the application attempts to correct invalid JSON, the initial output quality depends on the model's ability to adhere to the schema.
- **Error Handling**: Basic error handling is in place, but more robust error management could be implemented for production environments.

## ⚖️ Trade-offs and Future Improvements

### Trade-offs

- **Model Choice**: `gemini-1.5-flash` was chosen for its speed and cost-effectiveness during development. For higher accuracy and handling of more complex inputs, `gemini-1.5-pro` could be considered, albeit at a higher cost and potentially longer processing time.
- **Validation and Correction Logic**: The current output validation and correction is a separate step. Integrating this more tightly within the generation process or using a model capable of function calling could improve efficiency.

### Future Improvements (Given More Computation or Time)

- **Integration of more powerful models**: Explore using models like `gemini-1.5-pro` for increased accuracy with complex inputs.
- **Enhanced Error Handling**: Implement more comprehensive error management for a production environment.
- **Tighter Validation Loop**: Investigate integrating validation and correction more directly into the generation process, potentially using models with function calling capabilities.
- **Improved Context Handling for Extremely Large Inputs**: While large contexts are supported, further optimization for truly massive inputs might be explored.

## 🔧 Technical Details

This project is a Next.js application designed to demonstrate the use of AI models for converting natural language descriptions into structured JSON output based on a provided JSON schema. It utilizes Google AI models and the GenKit framework for building and deploying AI flows.

## 📝 Conclusion

Schema Weaver provides a functional example of using AI to convert unstructured text into structured JSON based on a schema. It highlights the capabilities of Google AI models and the GenKit framework within a Next.js environment. The project acknowledges current limitations and outlines potential areas for future enhancement with additional resources.
