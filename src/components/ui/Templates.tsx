
import React from 'react';
import { Section } from './Section';
import { SectionTitle } from './SectionTitle';
import { Card } from './Card';
import Image from 'next/image';

export const Templates = () => {
  const templates = [
    {
      name: "Minimalist",
      image: "/minimalist-template.png"
    },
    {
      name: "Modern",
      image: "/modern-template.png"
    },
    {
      name: "Creative",
      image: "/creative-template.png"
    }
  ];

  return (
    <Section id="templates">
      <SectionTitle>Choose Your Template</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {templates.map((template, index) => (
          <Card key={index} className="overflow-hidden">
            <Image src={template.image} alt={template.name} width={400} height={300} className="w-full" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-foreground">{template.name}</h3>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
};
