// app/page.tsx
"use client"

import React, {useRef, useState } from "react"
import { cn } from "@/lib/utils";
import Marquee from "@/components/animata/container/marquee";
import FlickeringGrid from "@/components/ui/flickering-grid";
import Globemap from "@/components/ui/globe";
import { motion } from "framer-motion";
// import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Users,
  CheckCircle2,
  Calendar,
  Music2,
  Star,
  Award,
  Zap,
  Download,
  Globe,
  Rocket,
  Wand2,
  Clock,
  Gift,
  Sparkles,
  Video,
  MessageSquare,
  TrendingUp,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Layout } from "@/components/layout/layout"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
// import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import Link from "next/link";

const words = `Transform your creative vision into reality with AI-powered music and comedy production.`;
const Plans = [
  {
    name: "Starter",
    monthlyPrice: "15",
    yearlyPrice: "144",
    features: [
      "5 AI generations per month",
      "Basic content types",
      "Community support",
      "Watermarked outputs"
    ],
    limitations: [
      "Limited content complexity",
      "Standard generation speed",
      "No API access",
      "No commercial use"
    ],
    recommended: false,
    icon: <Rocket className="h-6 w-6 text-blue-500" />
  },
  {
    name: "Creator Pro",
    monthlyPrice: "29",
    yearlyPrice: "288",
    features: [
      "Unlimited AI generations",
      "Advanced content types",
      "Priority support",
      "No watermarks",
      "Commercial rights",
      "Custom branding"
    ],
    limitations: [
      "Individual use only",
      "Faster generation times"
    ],
    recommended: true,
    icon: <Wand2 className="h-6 w-6 text-purple-500" />
  },
  {
    name: "Enterprise",
    monthlyPrice: "99",
    yearlyPrice: "948",
    features: [
      "All Creator Pro features",
      "Team collaboration",
      "Dedicated support",
      "API access",
      "Custom AI models",
      "Advanced analytics"
    ],
    limitations: [
      "Requires annual commitment",
      "Customization consultation"
    ],
    recommended: false,
    icon: <Globe className="h-6 w-6 text-green-500" />
  }
];

const features = [
  {
    icon: Zap,
    title: "AI-Powered Creation",
    description: "Generate unique content with advanced AI algorithms",
    size: "one"
  },
  {
    icon: TrendingUp,
    title: "Engaging Content",
    description: "Generate and view engaging content with seamless integration and advanced visualization tools",
    size: "two"
  },
  {
    icon: Award,
    title: "Professional Quality",
    description: "Industry-standard output that meets the highest standards of professional content creation",
    size: "two"
  },
  {
    icon: Clock,
    title: "Real-time Generation",
    description: "Get instant results as you create",
    size: "one"
  },
  {
    icon: Download,
    title: "Easy Export",
    description: "Download your content in multiple formats with just a single click",
    size: "one"
  },
  {
    icon: MessageSquare,
    title: "Community Feedback",
    description: "Get insights and collaborative input from a vibrant community of creators worldwide",
    size: "two"
  },
];

const faqs = [
  {
    question: "How does the AI content generation work?",
    answer: "Our AI-powered platform uses advanced machine learning algorithms to analyze your input and generate unique, high-quality content tailored to your needs. Whether it's music or comedy, the AI understands context and style to create engaging content.",
  },
  {
    question: "What type of content can I create?",
    answer: "You can create various types of content including music tracks, comedy scripts, short videos, and live show materials. Our platform supports multiple formats and styles to suit your creative needs.",
  },
  {
    question: "How do I get started?",
    answer: "Simply sign up for a free account, choose your content type, and start creating! Our intuitive interface guides you through the process, and our AI assists you at every step.",
  },
  {
    question: "Can I collaborate with other creators?",
    answer: "Yes! Our platform includes collaboration features that allow you to work with other creators, share projects, and create content together in real-time.",
  },
]

const testimonials = [
  {
    name: "Alex Thompson",
    role: "Professional Musician",
    content: "This platform has revolutionized my creative process. The AI-powered tools are incredible!",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 5,
  },
  {
    name: "Olivia Brown",
    role: "Freelance Writer",
    content: "It’s like having an AI assistant guiding me through every creative block.",
    image: "https://randomuser.me/api/portraits/women/25.jpg",
    rating: 5,
  },
  {
    name: "Benjamin Davis",
    role: "Video Producer",
    content: "The tools offered are intuitive and cater to every aspect of content creation.",
    image: "https://randomuser.me/api/portraits/men/15.jpg",
    rating: 5,
  },
  {
    name: "Emma Wilson",
    role: "Social Media Influencer",
    content: "This platform makes it super easy to generate unique and trendy content ideas.",
    image: "https://randomuser.me/api/portraits/women/64.jpg",
    rating: 4,
  },
  {
    name: "James White",
    role: "Entrepreneur",
    content: "It’s an all-in-one solution for marketing, creativity, and branding.",
    image: "https://randomuser.me/api/portraits/men/36.jpg",
    rating: 5,
  },
  {
    name: "Amelia Clark",
    role: "SEO Analyst",
    content: "The AI-powered insights improved my content’s visibility like never before.",
    image: "https://randomuser.me/api/portraits/women/18.jpg",
    rating: 4,
  },

  {
    name: "Michael Adams",
    role: "Startup Founder",
    content: "An excellent resource for branding and pitching to investors.",
    image: "https://randomuser.me/api/portraits/men/91.jpg",
    rating: 5,
  },
  {
    name: "Chloe Rivera",
    role: "Photographer",
    content: "The AI tools inspire unique concepts for my photography projects.",
    image: "https://randomuser.me/api/portraits/women/60.jpg",
    rating: 5,
  },
];


export default function HomePage() {
  const pricingSectionRef = useRef<HTMLDivElement | null>(null);
  const [isYearly, setIsYearly] = useState(false);


  const handleFocus = () => {
    if (pricingSectionRef.current) {
      pricingSectionRef.current.focus();
      pricingSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const TestimonialCard = ({ review }: any) => (
    <figure
      className={cn(
        "relative w-72 md:w-96 shrink-0 cursor-pointer overflow-hidden rounded-xl border p-4 md:p-6 mx-3 md:mx-4",
        "border-gray-300/10 bg-gray-900/30 hover:bg-gray-800/40",
        "transition-all duration-300 ease-in-out backdrop-blur-sm",
        "hover:border-gray-500/30 hover:shadow-lg hover:shadow-gray-500/10"
      )}
    >
      <div className="flex flex-row items-center gap-2 md:gap-3">
        <div className="relative">
          <img
            className="h-10 w-10 md:h-12 md:w-12 rounded-full ring-2 ring-purple-500/20"
            alt={review.name}
            src={review.image}
          />
          <div className="absolute -bottom-1 -right-1 h-4 w-4 md:h-4 md:w-4 rounded-full bg-purple-500 ring-2 ring-purple-950">
            <div className="h-full w-full animate-pulse rounded-full bg-purple-400/50" />
          </div>
        </div>
        <div className="flex flex-col">
          <figcaption className="text-sm md:text-base font-medium text-white">
            {review.name}
          </figcaption>
          <p className="text-xs md:text-sm font-medium text-purple-200/60">{review.role}</p>
        </div>
      </div>
      <blockquote className="mt-3 md:mt-4 text-xs md:text-sm leading-relaxed text-purple-100/90">
        {review.content}
      </blockquote>
      <div className="flex mt-3 md:mt-4 items-center gap-1">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
    </figure>
  );

  return (
    <Layout>
      {/* Hero Section */}
      <HeroHighlight>
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
        >

          <Highlight className="text-black dark:text-white">
            Create.
            Perform.
            Entertain.
          </Highlight>
          <TextGenerateEffect words={words} />
        </motion.h1>
      </HeroHighlight>

      {/* Stats Section */}
      <section className="py-16 px-8 bg-muted/50">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Users, label: "Active Users", value: "50K+" },
            { icon: Calendar, label: "Daily Visits", value: "100K+" },
            { icon: Video, label: "Videos Created", value: "1M+" },
            { icon: Music2, label: "Songs Generated", value: "2M+" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-8 bg-background">
        <div className="max-w-screen-xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground">Powerful Features</h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Everything you need to create amazing content
            </p>
          </div>
          <div className="space-y-8">
            {/* One in line */}
            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="w-full max-w-xl"
              >
                <Card>
                  <CardHeader>
                    <div className="p-3 bg-primary/10 rounded-full w-fit">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="mt-4">{features[0].title}</CardTitle>
                    <CardDescription>{features[0].description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </div>

            {/* Two in line */}
            <div className="grid grid-cols-2 gap-8">
              {features.slice(1, 3).map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card>
                    <CardHeader>
                      <div className="p-3 bg-primary/10 rounded-full w-fit">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="mt-4">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Two in line */}
            <div className="grid grid-cols-2 gap-8">
              {features.slice(3, 5).map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card>
                    <CardHeader>
                      <div className="p-3 bg-primary/10 rounded-full w-fit">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="mt-4">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* One in line */}
            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="w-full max-w-xl"
              >
                <Card>
                  <CardHeader>
                    <div className="p-3 bg-primary/10 rounded-full w-fit">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="mt-4">{features[5].title}</CardTitle>
                    <CardDescription>{features[5].description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing section */}
      <section className="py-16 px-4 sm:px-6 relative overflow-hidden">
        <FlickeringGrid
          className="absolute inset-0"
          squareSize={4}
          gridGap={6}
          color="#5C2B7F"
          maxOpacity={0.5}
          flickerChance={0.1}
        />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Flexible Pricing for Every Creator
            </h2>
            <p className="text-muted-foreground mb-8">
              Choose the perfect plan for your needs. Save up to 20% with yearly billing.
            </p>

            <div className="flex justify-center w-full">
              <div className="relative flex items-center rounded-full bg-purple-950/50 p-1 w-fit">
                <motion.div
                  className="absolute inset-y-1 rounded-full bg-purple-800"
                  initial={false}
                  animate={{ x: isYearly ? '92%' : '0%' }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{ width: '50%' }}
                />
                <button
                  className={`relative z-10 px-6 py-1.5 text-sm rounded-full transition-colors min-w-[100px] flex items-center justify-center
            ${!isYearly ? 'text-white' : 'text-purple-300'}`}
                  onClick={() => setIsYearly(false)}
                >
                  <span className="text-center">Monthly</span>
                </button>
                <button
                  className={`relative z-10 px-6 py-1.5 text-sm rounded-full transition-colors min-w-[100px] flex items-center justify-center
            ${isYearly ? 'text-white' : 'text-purple-300'}`}
                  onClick={() => setIsYearly(true)}
                >
                  <span className="text-center">Yearly (-20%)</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {Plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative transform transition-all duration-300 ${plan.recommended ? 'border-primary shadow-lg' : ''
                  }`}
              >
                {plan.recommended && (
                  <Badge className="absolute -top-2 right-4 bg-primary">
                    Most Popular
                  </Badge>
                )}

                <CardHeader>
                  <div className="flex items-center gap-4">
                    {plan.icon}
                    <div>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{isYearly ? 'Billed yearly' : 'Billed monthly'}</CardDescription>
                    </div>
                  </div>

                  <div className="mt-4 flex items-baseline text-4xl font-bold">
                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      /{isYearly ? 'year' : 'month'}
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Features</h4>
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm mb-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Limitations</h4>
                      {plan.limitations.map((limitation) => (
                        <div key={limitation} className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Star className="h-3 w-3 opacity-50 flex-shrink-0" />
                          <span>{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    variant={plan.recommended ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => {
                      if (plan.name === "Enterprise") {
                        window.location.href = "/contact";
                      } else {
                        const features = encodeURIComponent(plan.features.join('|'));
                        const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
                        const billing = isYearly ? 'yearly' : 'monthly';
                        window.location.href = `/checkout?plan=${encodeURIComponent(plan.name)}&price=${price}&billing=${billing}&features=${features}`;
                      }
                    }}
                  >
                    {plan.name === "Enterprise" ? "Contact Us" : `Choose ${plan.name}`}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative min-h-screen w-full bg-gradient-to-b from-gray-950 to-black py-24">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-indigo-900/10 blur-3xl" />
          <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-indigo-800/5 blur-2xl" />
          <div className="absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-indigo-700/5 blur-2xl" />
        </div>

        <div className="relative max-w-screen-2xl mx-auto px-4">
          {/* Enhanced Header with Decorative Line */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center space-x-4 mb-6">
              <div className="h-px w-8 bg-indigo-500/30" />
              <span className="text-indigo-400 uppercase tracking-wider text-sm font-medium">
                Testimonials
              </span>
              <div className="h-px w-8 bg-indigo-500/30" />
            </div>
            <h2 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-gray-200 to-indigo-300 bg-clip-text text-transparent">
              What Creators Say
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join thousands of creators who are transforming their content creation journey
            </p>
          </div>

          {/* Main Container with Enhanced Depth */}
          <div className="relative h-[500px] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl shadow-black/50">
            {/* Globe Container */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm">
              <div className="relative h-full w-full">
                <Globemap className="h-full w-full opacity-40" />
              </div>
            </div>

            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-950/95 to-transparent" />

            {/* Testimonials Container with Improved Layout */}
            <div className="absolute bottom-0 left-0 right-0 h-[400px] flex flex-col items-center justify-end gap-8 pb-12">
              <Marquee pauseOnHover className="[--duration:65s]">
                {testimonials.map((review) => (
                  <TestimonialCard key={review.name} review={review} />
                ))}
              </Marquee>

              <Marquee reverse pauseOnHover className="[--duration:65s]">
                {testimonials.map((review) => (
                  <TestimonialCard key={review.name} review={review} />
                ))}
              </Marquee>

              {/* Enhanced Side Gradients */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black via-gray-950/90 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-black via-gray-950/90 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Get answers to common questions about our platform
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-8 bg-primary/5">
        <div className="max-w-screen-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold">Ready to Start Creating?</h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our community of creators and start making amazing content today.
              No credit card required.
            </p>
            <div className="flex gap-4 justify-center mt-8">
              <Link href="/login">
                <Button size="lg" className="gap-2" onClick={() => { }}>
                  <Sparkles className="h-4 w-4" />
                  Get Started Free
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2" onClick={handleFocus}>
                <Gift className="h-4 w-4" />
                View Plans
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Free trial available. No credit card required.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-8">
        <div className="max-w-screen-xl mx-auto">
          <Card className="bg-primary/5">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold">Stay Updated</h3>
                  <p className="mt-2 text-muted-foreground">
                    Get the latest updates, tips, and inspiration delivered to your inbox.
                  </p>
                </div>
                <div className="flex gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button>Subscribe</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </ Layout>
  )
}