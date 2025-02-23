import { cn } from "@pollify/lib";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@pollify/ui";
import React from "react";

type Props = React.ComponentPropsWithoutRef<"section">;

const faqs: { question: string; answer: string }[] = [
  {
    question: "What is Pollify, and how does it work?",
    answer:
      "Pollify is a polling platform that allows you to create and share polls with your audience. You can create a poll, share it with your audience, and get real-time feedback to make quicker decisions.",
  },
  {
    question: "Are the polls and responses secure?",
    answer:
      "Yes, Pollify ensures the security of polls and responses through encryption, secure authentication, and privacy controls. We take data protection seriously and implement best practices to safeguard user information.",
  },
  {
    question: "Is there a free version or trial available?",
    answer:
      "Yes, Pollify offers a free trial so users can explore its features before committing to a paid plan. We also have a free-tier plan with limited features for those who need basic polling functionalities.",
  },
  {
    question: "Can I restrict access to my polls?",
    answer:
      "Absolutely! Pollify allows you to control who can access your polls. You can set them as public or private.",
  },
  {
    question: "What pricing plans do you offer?",
    answer:
      "Pollify provides multiple pricing tiers, including a free plan, a basic plan with enhanced features, and a pro plan for advanced analytics and integrations. You can choose the plan that best suits your needs.",
  },
  {
    question: "Can I embed polls on my website or share them on social media?",
    answer:
      "Yes! Pollify offers easy embedding options so you can place polls directly on your website. You can also share polls via social media platforms with a simple link.",
  },
  {
    question: "How do I create my first poll?",
    answer:
      "Creating your first poll is simple! Sign up on Pollify, navigate to the poll creation page, enter your questions and answer choices, customize settings, and publish your poll. You can then share it instantly.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach our customer support team through email, live chat, or our dedicated support portal. We are available to assist you with any questions or issues.",
  },
  {
    question: "Can I create anonymous polls?",
    answer:
      "Yes, Pollify allows you to create anonymous polls where respondents can submit their answers without revealing their identities. This feature is useful for unbiased feedback collection.",
  },
  {
    question: "How can I report a bug or request a feature?",
    answer:
      "You can report bugs or suggest new features through our support portal or by contacting customer service. We value user feedback and continuously work on improving Pollify.",
  },
  {
    question: "Is there a limit to the number of responses per poll?",
    answer:
      "The response limit depends on your subscription plan. Free users may have a cap on responses, while paid plans offer higher or unlimited response limits.",
  },
  {
    question: "Do you provide an API for developers?",
    answer:
      "Yes, Pollify offers an API that allows developers to integrate polling functionality into their applications. Our API documentation provides detailed guidance on implementation.",
  },
];
const midIndex = Math.ceil(faqs.length / 2);
const firstFAQs = faqs.slice(0, midIndex);
const secondFAQs = faqs.slice(midIndex);

export const FAQs = ({ className, ...rest }: Props) => {
  return (
    <section className={cn("container flex flex-col", className)} {...rest}>
      <div className="mx-auto mb-16 flex max-w-3xl flex-col space-y-4">
        <h1 className="text-center text-2xl font-medium xl:text-3xl">
          Frequently Asked Questions
        </h1>
        <p className="text-accent text-center xl:text-lg">
          Find answers to common questions and learn how our polling tools can
          work for you.
        </p>
      </div>
      <Accordion
        type="single"
        collapsible={true}
        className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
        <div className="w-full space-y-4">
          {firstFAQs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </div>
        <div className="w-full space-y-4">
          {secondFAQs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </div>
      </Accordion>
    </section>
  );
};
