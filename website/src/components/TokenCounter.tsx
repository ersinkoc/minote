import { useEffect, useState } from 'react';
import { TrendingDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface TokenCounterProps {
  jsonTokens: number;
  minoteTokens: number;
  className?: string;
}

export function TokenCounter({ jsonTokens, minoteTokens, className }: TokenCounterProps) {
  const [displayJson, setDisplayJson] = useState(0);
  const [displayMinote, setDisplayMinote] = useState(0);
  const savings = ((jsonTokens - minoteTokens) / jsonTokens * 100).toFixed(1);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const jsonStep = jsonTokens / steps;
    const minoteStep = minoteTokens / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setDisplayJson(Math.round(jsonStep * currentStep));
      setDisplayMinote(Math.round(minoteStep * currentStep));

      if (currentStep >= steps) {
        clearInterval(interval);
        setDisplayJson(jsonTokens);
        setDisplayMinote(minoteTokens);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [jsonTokens, minoteTokens]);

  return (
    <div className={cn("grid grid-cols-3 gap-4", className)}>
      <div className="bg-card border rounded-lg p-4">
        <div className="text-sm text-muted-foreground mb-1">JSON Tokens</div>
        <div className="text-3xl font-bold text-red-400">{displayJson.toLocaleString()}</div>
      </div>

      <div className="bg-card border rounded-lg p-4">
        <div className="text-sm text-muted-foreground mb-1">MINOTE Tokens</div>
        <div className="text-3xl font-bold text-green-400">{displayMinote.toLocaleString()}</div>
      </div>

      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
        <div className="text-sm text-green-400 mb-1 flex items-center gap-1">
          <TrendingDown className="w-4 h-4" />
          Savings
        </div>
        <div className="text-3xl font-bold text-green-400">{savings}%</div>
      </div>
    </div>
  );
}
