
"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface OutputDisplayProps {
  jsonString: string;
  isLoading: boolean;
}

export function OutputDisplay({ jsonString, isLoading }: OutputDisplayProps) {
  const [hasCopied, setHasCopied] = React.useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    if (jsonString) {
      navigator.clipboard.writeText(jsonString);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "JSON output copied to clipboard.",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg h-[644px]">
        <CardHeader>
          <CardTitle>Output</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg min-h-[644px] relative">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Output</CardTitle>
        {jsonString && (
          <Button variant="ghost" size="icon" onClick={handleCopy}>
            {hasCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy to clipboard</span>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {jsonString ? (
          <div className="bg-muted rounded-md p-4 overflow-x-auto">
            <pre><code className="text-sm text-foreground">{jsonString}</code></pre>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">Converted JSON will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
