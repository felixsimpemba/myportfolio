
import React from 'react';
import { Card } from './Card';

interface StepCardProps {
  icon: React.ElementType;
  step: number;
  title: string;
  description: string;
}

export const StepCard: React.FC<StepCardProps> = ({ icon: Icon, step, title, description }) => {
  return (
    <Card className="text-center p-8">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <p className="text-lg font-semibold text-primary mb-2">Step {step}</p>
      <h3 className="text-xl font-semibold text-foreground mb-4">
        {title}
      </h3>
      <p className="text-muted-foreground">
        {description}
      </p>
    </Card>
  );
};
