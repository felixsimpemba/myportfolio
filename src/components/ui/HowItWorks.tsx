
import React from 'react';
import { Section } from './Section';
import { SectionTitle } from './SectionTitle';
import { StepCard } from './StepCard';
import { UserPlus, Edit, Eye, Share2 } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Your Account",
      description: "Sign up for a free account in seconds."
    },
    {
      icon: Edit,
      title: "Build Your Profile",
      description: "Add your experience, skills, and projects."
    },
    {
      icon: Eye,
      title: "Customize Your Design",
      description: "Choose a template and personalize your portfolio."
    },
    {
      icon: Share2,
      title: "Publish & Share",
      description: "Share your portfolio with the world."
    }
  ];

  return (
    <Section id="how-it-works" className="bg-muted/50">
      <SectionTitle>How It Works</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <StepCard 
            key={index} 
            step={index + 1} 
            icon={step.icon} 
            title={step.title} 
            description={step.description} 
          />
        ))}
      </div>
    </Section>
  );
};
