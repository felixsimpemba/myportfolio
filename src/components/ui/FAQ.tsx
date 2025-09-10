
import React from 'react';
import { Section } from './Section';
import { SectionTitle } from './SectionTitle';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion';

export const FAQ = () => {
  const faqs = [
    {
      question: "Is MyPortfolio free to use?",
      answer: "Yes, MyPortfolio offers a free plan with all the essential features to create a stunning portfolio. We also offer a Pro plan with advanced features and customization options."
    },
    {
      question: "Can I use my own domain name?",
      answer: "Yes, you can connect your own domain name to your portfolio with our Pro plan."
    },
    {
      question: "Are the templates customizable?",
      answer: "Absolutely! You can customize the colors, fonts, and layout of your portfolio to match your personal brand."
    },
    {
      question: "Is there a limit to the number of projects I can add?",
      answer: "There is no limit to the number of projects you can add to your portfolio."
    }
  ];

  return (
    <Section id="faq" className="bg-muted/50">
      <SectionTitle>Frequently Asked Questions</SectionTitle>
      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
};
