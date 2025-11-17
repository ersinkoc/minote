import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Play, Code } from 'lucide-react';
import { cn } from '../lib/utils';

interface ExampleCardProps {
  title: string;
  description: string;
  category: string;
  savings: string;
  onTry?: () => void;
  onViewCode?: () => void;
  className?: string;
}

export function ExampleCard({
  title,
  description,
  category,
  savings,
  onTry,
  onViewCode,
  className
}: ExampleCardProps) {
  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-300 hover:border-purple-500/50",
      className
    )}>
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge variant="info">{category}</Badge>
          <Badge variant="success">{savings} saved</Badge>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="gradient"
            onClick={onTry}
            className="flex-1"
          >
            <Play className="w-4 h-4 mr-1" />
            Try It
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onViewCode}
          >
            <Code className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
