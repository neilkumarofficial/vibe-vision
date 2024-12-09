'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input2";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { SparklesCore } from '@/components/ui/sparkles';
import { z } from "zod";
import { PhoneInput } from "@/components/ui/phone-input"; // Assuming a custom phone input component
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from 'next/link';

// Enhanced Form Validation Schema
const ContactSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters")
        .regex(/^[A-Za-z\s]+$/, "Name can only contain letters"),
    email: z.string().email("Invalid email address"),
    phone: z.string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
        .optional(),
    subject: z.string()
        .min(3, "Subject must be at least 3 characters")
        .max(100, "Subject cannot exceed 100 characters"),
    message: z.string()
        .min(10, "Message must be at least 10 characters")
        .max(500, "Message cannot exceed 500 characters"),
    inquiry: z.enum(["General", "Support", "Sales", "Partnership", "Technical", "Billing"]),
    preferredContactMethod: z.enum(["Email", "Phone", "Both"]),
    company: z.string().optional(),
    urgency: z.enum(["Low", "Medium", "High", "Urgent"])
});

const EnhancedContactPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiry: 'General',
        preferredContactMethod: 'Email',
        company: '',
        urgency: 'Low'
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [showFAQDialog, setShowFAQDialog] = useState(false);
    const characterCount = formData.message.length;

    // File attachment state
    const [attachments, setAttachments] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Validation function
    const validateForm = () => {
        try {
            ContactSchema.parse(formData);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMap = error.flatten().fieldErrors;
                const mappedErrors: { [key: string]: string } = {};
                Object.keys(errorMap).forEach(key => {
                    mappedErrors[key] = errorMap[key][0] || '';
                });
                setErrors(mappedErrors);
            }
            return false;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            const filteredFiles = newFiles.filter(file =>
                file.size <= 5 * 1024 * 1024 && // 5MB max
                ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'].includes(file.type)
            );

            if (filteredFiles.length !== newFiles.length) {
                toast.warning('Some files were not added', {
                    description: 'Only JPG, PNG, GIF, PDF, and TXT files under 5MB are allowed.'
                });
            }

            setAttachments(prevFiles => [...prevFiles, ...filteredFiles].slice(0, 3)); // Limit to 3 files
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });

            attachments.forEach(file => {
                formDataToSend.append('attachments', file);
            });

            const response = await fetch('/api/contact', {
                method: 'POST',
                body: formDataToSend
            });

            if (response.ok) {
                setFormSubmitted(true);
                toast.success('Message Sent', {
                    description: 'We will get back to you soon!',
                    duration: 3000
                });
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: '',
                    inquiry: 'General',
                    preferredContactMethod: 'Email',
                    company: '',
                    urgency: 'Low'
                });
                setAttachments([]);
            } else {
                toast.error('Submission Failed', {
                    description: 'Please try again later.'
                });
            }
        } catch (error) {
            toast.error('Network Error', {
                description: 'Check your internet connection.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const faqItems = [
        {
            question: "How long does it take to get a response?",
            answer: "We typically respond within 24 hours for most inquiries. Urgent matters are prioritized."
        },
        {
            question: "Can I attach files to my message?",
            answer: "Yes! You can attach up to 3 files (JPG, PNG, GIF, PDF, TXT) with a maximum size of 5MB each."
        },
        {
            question: "What contact methods do you support?",
            answer: "We offer support via email, phone, and through this contact form. Choose your preferred method."
        }
    ];

    return (
        <div className="relative w-full min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-black via-purple-950 to-black overflow-hidden">
            <div className="absolute inset-0 z-0">
                <SparklesCore
                    id="contact-sparkles"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={500}
                    particleColor="#FFFFFF"
                />
            </div>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-6xl relative z-10"
            >
                <div className="flex justify-between items-center mb-8">
                    <Link href="/" passHref>
                        <Button
                            variant="ghost"
                            className="text-white hover:text-purple-300"
                        >
                            <Icon icon="mdi:home" className="mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        className="text-white hover:text-purple-300"
                        onClick={() => setShowFAQDialog(true)}
                    >
                        <Icon icon="mdi:help-circle" className="mr-2" />
                        Frequently Asked Questions
                    </Button>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Information Section */}
                    <Card className="bg-black/80 backdrop-blur-xl border border-purple-500/30 text-white shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
                                Get in Touch
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                {[
                                    { icon: 'mdi:map-marker', text: '123 Tech Lane, Innovation City' },
                                    { icon: 'mdi:email', text: 'support@yourcompany.com' },
                                    { icon: 'mdi:phone', text: '+1 (555) 123-4567' }
                                ].map(({ icon, text }) => (
                                    <div key={icon} className="flex items-center space-x-4">
                                        <Icon icon={icon} className="text-purple-500 h-7 w-7" />
                                        <span className="text-gray-300">{text}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex space-x-5 mt-6">
                                {[
                                    { name: 'linkedin', link: 'https://linkedin.com' },
                                    { name: 'twitter', link: 'https://twitter.com' },
                                    { name: 'instagram', link: 'https://instagram.com' },
                                    { name: 'github', link: 'https://github.com' }
                                ].map(({ name, link }) => (
                                    <TooltipProvider key={name}>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <a
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-white hover:text-purple-400 transition-colors duration-300"
                                                >
                                                    <Icon icon={`mdi:${name}`} className="h-9 w-9" />
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {name.charAt(0).toUpperCase() + name.slice(1)}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </div>
                            <div className="mt-6 bg-purple-900/30 p-4 rounded-lg">
                                <p className="text-sm text-gray-300 italic">
                                    Our team typically responds within 24 hours. We look forward to hearing from you!
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Form Section */}
                    <Card className="bg-black/80 backdrop-blur-xl border border-purple-500/30 text-white shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
                                Send Us a Message
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AnimatePresence mode="wait">
                                {!formSubmitted ? (
                                    <motion.form
                                        key="contact-form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
                                    >
                                        {/* Name Input */}
                                        <div>
                                            <Input
                                                type="text"
                                                name="name"
                                                placeholder="Your Name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full bg-gray-800 border-none text-white"
                                                prefix={<Icon icon="mdi:account" />}
                                            />
                                            {errors.name && (
                                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                            )}
                                        </div>

                                        {/* Email and Phone Inputs */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    placeholder="Your Email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-800 border-none text-white"
                                                    prefix={<Icon icon="mdi:email" />}
                                                />
                                                {errors.email && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                                )}
                                            </div>
                                            <div>
                                                <PhoneInput
                                                    name="phone"
                                                    placeholder="Phone Number"
                                                    value={formData.phone}
                                                    onChange={(value) => setFormData(prev => ({
                                                        ...prev,
                                                        phone: value
                                                    }))}
                                                    className="w-full bg-gray-800 border-none text-white"
                                                />
                                            </div>
                                        </div>

                                        {/* Company and Subject */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Input
                                                    type="text"
                                                    name="company"
                                                    placeholder="Company (Optional)"
                                                    value={formData.company}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-800 border-none text-white"
                                                    prefix={<Icon icon="mdi:office-building" />}
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    type="text"
                                                    name="subject"
                                                    placeholder="Subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-800 border-none text-white"
                                                    prefix={<Icon icon="mdi:text" />}
                                                />
                                                {errors.subject && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Inquiry and Urgency */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Select
                                                    name="inquiry"
                                                    value={formData.inquiry}
                                                    onValueChange={(value) => setFormData(prev => ({
                                                        ...prev,
                                                        inquiry: value
                                                    }))}
                                                >
                                                    <SelectTrigger className="w-full bg-gray-800 border-none text-white">
                                                        <SelectValue placeholder="Inquiry Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {[
                                                            'General',
                                                            'Support',
                                                            'Sales',
                                                            'Partnership',
                                                            'Technical',
                                                            'Billing'
                                                        ].map((type) => (
                                                            <SelectItem key={type} value={type}>
                                                                {type}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Select
                                                    name="urgency"
                                                    value={formData.urgency}
                                                    onValueChange={(value) => setFormData(prev => ({
                                                        ...prev,
                                                        urgency: value
                                                    }))}
                                                >
                                                    <SelectTrigger className="w-full bg-gray-800 border-none text-white">
                                                        <SelectValue placeholder="Urgency Level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {['Low', 'Medium', 'High', 'Urgent'].map((level) => (
                                                            <SelectItem key={level} value={level}>
                                                                {level}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        {/* Preferred Contact Method */}
                                        <div>
                                            <Select
                                                name="preferredContactMethod"
                                                value={formData.preferredContactMethod}
                                                onValueChange={(value) => setFormData(prev => ({
                                                    ...prev,
                                                    preferredContactMethod: value
                                                }))}
                                            >
                                                <SelectTrigger className="w-full bg-gray-800 border-none text-white">
                                                    <SelectValue placeholder="Preferred Contact Method" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {['Email', 'Phone', 'Both'].map((method) => (
                                                        <SelectItem key={method} value={method}>
                                                            {method}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Message with Character Count */}
                                        <div>
                                            <div className="relative">
                                                <Textarea
                                                    name="message"
                                                    placeholder="Your Message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-800 border-none text-white min-h-[120px] pr-12"
                                                />
                                                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                                                    {characterCount}/500
                                                </div>
                                            </div>
                                            {errors.message && (
                                                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                                            )}
                                        </div>

                                        {/* File Attachments */}
                                        <div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileUpload}
                                                multiple
                                                accept=".jpg,.jpeg,.png,.gif,.pdf,.txt"
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full text-white border-purple-500 hover:bg-purple-500/20"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <Icon icon="mdi:paperclip" className="mr-2" />
                                                Attach Files (Max 3, 5MB each)
                                            </Button>
                                            {attachments.length > 0 && (
                                                <div className="mt-2 flex space-x-2">
                                                    {attachments.map((file, index) => (
                                                        <div
                                                            key={file.name}
                                                            className="flex items-center bg-gray-800 px-2 py-1 rounded text-sm"
                                                        >
                                                            <Icon icon="mdi:file" className="mr-1" />
                                                            {file.name}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="ml-2"
                                                                onClick={() => removeAttachment(index)}
                                                            >
                                                                <Icon icon="mdi:close" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                                        >
                                            {isSubmitting ? (
                                                <Icon icon="mdi:loading" className="mr-2 animate-spin" />
                                            ) : (
                                                <Icon icon="mdi:send" className="mr-2" />
                                            )}
                                            {isSubmitting ? 'Sending...' : 'Send Message'}
                                        </Button>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        key="success-message"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="text-center space-y-6 py-12"
                                    >
                                        <Icon
                                            icon="mdi:check-circle"
                                            className="mx-auto text-green-500 h-24 w-24"
                                        />
                                        <h2 className="text-2xl font-bold text-white">
                                            Message Sent Successfully!
                                        </h2>
                                        <p className="text-gray-300">
                                            We've received your message and will get back to you soon.
                                        </p>
                                        <Button
                                            onClick={() => setFormSubmitted(false)}
                                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                        >
                                            Send Another Message
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>

            {/* FAQ Dialog */}
            <Dialog open={showFAQDialog} onOpenChange={setShowFAQDialog}>
                <DialogContent className="bg-black/80 backdrop-blur-xl border border-purple-500/30 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
                            Frequently Asked Questions
                        </DialogTitle>
                        <DialogDescription className="text-gray-300">
                            Find answers to common questions about our contact process.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {faqItems.map((faq, index) => (
                            <div
                                key={index}
                                className="p-4 bg-gray-800 rounded-lg"
                            >
                                <h3 className="font-semibold text-purple-300 mb-2">
                                    <Icon icon="mdi:help-circle" className="inline mr-2" />
                                    {faq.question}
                                </h3>
                                <p className="text-gray-300">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EnhancedContactPage;