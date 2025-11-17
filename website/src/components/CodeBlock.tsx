import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = 'text', className, showLineNumbers = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className={cn("relative group", className)}>
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleCopy}
          className="h-8 px-2"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>

      <pre className="bg-muted/50 border rounded-lg p-4 overflow-x-auto">
        <code className={`language-${language} text-sm`}>
          {showLineNumbers ? (
            <div className="table">
              {lines.map((line, i) => (
                <div key={i} className="table-row">
                  <span className="table-cell pr-4 text-muted-foreground select-none text-right">
                    {i + 1}
                  </span>
                  <span className="table-cell">{line}</span>
                </div>
              ))}
            </div>
          ) : (
            code
          )}
        </code>
      </pre>
    </div>
  );
}
