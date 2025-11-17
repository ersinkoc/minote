import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { cn } from '../lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient = "from-purple-500/10 to-blue-500/10",
  className
}: FeatureCardProps) {
  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50",
      className
    )}>
      <CardHeader>
        <div className={cn(
          "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center mb-4",
          gradient
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
