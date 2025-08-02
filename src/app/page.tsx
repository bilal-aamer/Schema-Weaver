import { SchemaWeaverForm } from '@/components/schema-weaver-form';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-7xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-primary font-headline tracking-tight">
            Schema Weaver
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Convert unstructured text into structured JSON with AI-powered precision. Simply provide your text and a target schema.
          </p>
        </header>
        <SchemaWeaverForm />
      </div>
    </main>
  );
}
