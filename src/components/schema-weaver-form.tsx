
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FileUp, Loader2, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { convertTextToJsonAction, correctAndConvertTextToJsonAction } from "@/app/actions";
import { OutputDisplay } from "@/components/output-display";

const formSchema = z.object({
  text: z.string().min(10, {
    message: "Text must be at least 10 characters.",
  }),
  schema: z.string().min(1, 'JSON schema is required.').refine(
    (val) => {
      try {
        JSON.parse(val);
        return true;
      } catch (e) {
        return false;
      }
    },
    { message: 'Invalid JSON schema format.' }
  ),
  autoCorrect: z.boolean().default(false),
});

export function SchemaWeaverForm() {
  const [output, setOutput] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();

  const textInputRef = React.useRef<HTMLInputElement>(null);
  const schemaInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      schema: "",
      autoCorrect: true,
    },
  });

  const handleFileRead = (event: React.ChangeEvent<HTMLInputElement>, field: 'text' | 'schema') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        form.setValue(field, content, { shouldValidate: true });
      };
      reader.readAsText(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setOutput('');

    try {
      const action = values.autoCorrect ? correctAndConvertTextToJsonAction : convertTextToJsonAction;
      const result = await action({ text: values.text, schema: values.schema });

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else if (result.data) {
        try {
            const parsedJson = JSON.parse(result.data);
            const formattedJson = JSON.stringify(parsedJson, null, 2);
            setOutput(formattedJson);
        } catch (e) {
            // If parsing fails, it might be an incomplete or malformed JSON string from the model.
            // We can display it as is.
            setOutput(result.data);
            toast({
                variant: "destructive",
                title: "Invalid JSON Output",
                description: "The AI model returned a malformed JSON string. Displaying raw output.",
            });
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "An Unexpected Error Occurred",
        description: error.message || "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Input</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Unstructured Text</FormLabel>
                      <Button type="button" variant="outline" size="sm" onClick={() => textInputRef.current?.click()}>
                        <FileUp className="mr-2 h-4 w-4" /> Load .txt
                      </Button>
                      <input
                        type="file"
                        ref={textInputRef}
                        className="hidden"
                        accept=".txt"
                        onChange={(e) => handleFileRead(e, 'text')}
                      />
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your unstructured text here..."
                        className="h-48 resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="schema"
                render={({ field }) => (
                  <FormItem>
                     <div className="flex justify-between items-center">
                      <FormLabel>JSON Schema</FormLabel>
                      <Button type="button" variant="outline" size="sm" onClick={() => schemaInputRef.current?.click()}>
                        <FileUp className="mr-2 h-4 w-4" /> Load .json
                      </Button>
                       <input
                        type="file"
                        ref={schemaInputRef}
                        className="hidden"
                        accept=".json"
                        onChange={(e) => handleFileRead(e, 'schema')}
                      />
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder='{ "type": "object", "properties": { ... } }'
                        className="h-48 resize-y font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="autoCorrect"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>AI Self-Correction</FormLabel>
                      <FormDescription>
                        Enable the AI to validate and correct its own output against the schema.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Convert
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="lg:sticky top-8">
        <OutputDisplay jsonString={output} isLoading={isLoading} />
      </div>
    </div>
  );
}
