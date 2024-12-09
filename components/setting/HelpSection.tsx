import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from '@/hooks/use-toast';

// Help and Support Section Component
const renderHelpSection = () => {
    const [supportTicket, setSupportTicket] = useState({
        name: '',
        email: '',
        category: '',
        description: ''
    });

    const supportCategories = [
        'Account Issues',
        'Billing',
        'Technical Problem',
        'Feature Request',
        'Other'
    ];

    const faqs = [
        {
            question: "How do I reset my password?",
            answer: "You can reset your password in the Profile section under 'Reset Password'. Ensure you have access to the email associated with your account."
        },
        {
            question: "Can I change my channel handle?",
            answer: "Yes, you can change your channel handle in the Profile section. Make sure the new handle is unique and follows our guidelines."
        },
        {
            question: "How do privacy settings work?",
            answer: "Privacy settings allow you to control who can see your profile, content, and interact with you. You can customize these in the Privacy section."
        },
        {
            question: "What are hidden words?",
            answer: "Hidden words are terms you can add to filter out specific content. When a hidden word appears, it will be automatically masked or removed."
        }
    ];

    const handleSupportTicketSubmit = () => {
        // Validate form
        if (!supportTicket.name || !supportTicket.email || !supportTicket.category || !supportTicket.description) {
            toast({
                title: "Submission Failed",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }

        // Simulate ticket submission
        toast({
            title: "Support Ticket Submitted",
            description: "Our team will review your ticket and respond within 24-48 hours",
            variant: "default"
        });

        // Reset form
        setSupportTicket({
            name: '',
            email: '',
            category: '',
            description: ''
        });
    };

    return (
        <div className="space-y-6">
            {/* Support Resources Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Support Resources</CardTitle>
                    <CardDescription>Find answers and get help quickly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <Card className="hover:bg-accent transition-colors">
                            <CardContent className="pt-6 text-center">
                                <h3 className="font-semibold mb-2">Help Center</h3>
                                <p className="text-sm text-muted-foreground">Browse comprehensive guides and tutorials</p>
                            </CardContent>
                        </Card>
                        <Card className="hover:bg-accent transition-colors">
                            <CardContent className="pt-6 text-center">
                                <h3 className="font-semibold mb-2">Community Forum</h3>
                                <p className="text-sm text-muted-foreground">Connect with other users and get advice</p>
                            </CardContent>
                        </Card>
                        <Card className="hover:bg-accent transition-colors">
                            <CardContent className="pt-6 text-center">
                                <h3 className="font-semibold mb-2">Status Page</h3>
                                <p className="text-sm text-muted-foreground">Check platform and service status</p>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            {/* Frequently Asked Questions */}
            <Card>
                <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible>
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger>{faq.question}</AccordionTrigger>
                                <AccordionContent>{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>

            {/* Support Ticket Submission */}
            <Card>
                <CardHeader>
                    <CardTitle>Submit a Support Ticket</CardTitle>
                    <CardDescription>Need more help? Our support team is here for you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Name</label>
                            <Input
                                placeholder="Your Name"
                                value={supportTicket.name}
                                onChange={(e) => setSupportTicket(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Email</label>
                            <Input
                                type="email"
                                placeholder="Your Email"
                                value={supportTicket.email}
                                onChange={(e) => setSupportTicket(prev => ({ ...prev, email: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Category</label>
                            <Select
                                value={supportTicket.category}
                                onValueChange={(value) => setSupportTicket(prev => ({ ...prev, category: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {supportCategories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2">Description</label>
                        <Textarea
                            placeholder="Describe your issue in detail"
                            rows={4}
                            value={supportTicket.description}
                            onChange={(e) => setSupportTicket(prev => ({ ...prev, description: e.target.value }))}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        onClick={handleSupportTicketSubmit}
                    >
                        Submit Support Ticket
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default renderHelpSection;