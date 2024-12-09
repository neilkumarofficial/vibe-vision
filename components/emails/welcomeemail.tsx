import * as React from 'react';
import {
    Html,
    Body,
    Container,
    Heading,
    Text,
    Section,
    Img,
    Link,
} from '@react-email/components';
import { Star, Sparkles, Music, Laugh } from 'lucide-react';

interface WelcomeEmailProps {
    firstName: string;
    verificationLink: string;
}

export default function WelcomeEmail({
    firstName,
}: WelcomeEmailProps) {
    return (
        <Html lang="en">
            <Body style={body}>
                <Container style={container}>
                    <Section style={headerSection}>
                        <Img 
                            src="/logo.png" 
                            alt="VibeVision Logo" 
                            style={logo} 
                            width={180}
                            height={60}
                        />
                    </Section>

                    <Section style={contentSection}>
                        <Heading style={h1}>
                            <Sparkles 
                                color="#007bff" 
                                size={28} 
                                style={{ marginRight: '10px', verticalAlign: 'middle' }} 
                            />
                            Welcome to VibeVision, {firstName}!
                        </Heading>

                        <Text style={paragraph}>
                            We're thrilled to have you join VibeVision - the cutting-edge AI platform 
                            that's revolutionizing content creation for musicians and comedians.
                        </Text>

                        <Section style={featuresSection}>
                            <Text style={featureText}>
                                <Music 
                                    color="#28a745" 
                                    size={20} 
                                    style={{ marginRight: '10px', verticalAlign: 'middle' }} 
                                />
                                AI-Powered Music Creation
                            </Text>
                            <Text style={featureText}>
                                <Laugh 
                                    color="#dc3545" 
                                    size={20} 
                                    style={{ marginRight: '10px', verticalAlign: 'middle' }} 
                                />
                                Comedy Content Innovations
                            </Text>
                            <Text style={featureText}>
                                <Star 
                                    color="#ffc107" 
                                    size={20} 
                                    style={{ marginRight: '10px', verticalAlign: 'middle' }} 
                                />
                                Seamless Performance Tools
                            </Text>
                        </Section>
                        

                        <Text style={paragraph}>
                            Ready to unleash your creative potential? Click the button above 
                            to verify your account and start your VibeVision journey!
                        </Text>
                    </Section>

                    <Section style={footerSection}>
                        <Text style={footerText}>
                            © {new Date().getFullYear()} VibeVision. 
                            Create, Perform, Entertain.
                        </Text>
                        <Text style={disclaimerText}>
                            If you didn't create this account, please ignore this email.
                        </Text>
                        <Text style={supportText}>
                            Need help? Contact our{' '}
                            <Link href="https://vibevision.com/support" style={linkStyle}>
                                Support Team
                            </Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

// Enhanced Styles
const body = {
    backgroundColor: '#f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    lineHeight: '1.6',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '30px',
    maxWidth: '600px',
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e9ecef',
};

const headerSection = {
    textAlign: 'center' as const,
    marginBottom: '25px',
    borderBottom: '1px solid #e9ecef',
    paddingBottom: '20px',
};

const logo = {
    maxWidth: '180px',
    height: 'auto',
    margin: '0 auto',
};

const contentSection = {
    padding: '0 15px',
};

const h1 = {
    color: '#333',
    fontSize: '28px',
    textAlign: 'center' as const,
    marginBottom: '25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const paragraph = {
    color: '#666',
    fontSize: '16px',
    lineHeight: '1.7',
    marginBottom: '20px',
    textAlign: 'center' as const,
};

const featuresSection = {
    backgroundColor: '#f1f3f5',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '25px',
};

const featureText = {
    color: '#333',
    fontSize: '16px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
};


const footerSection = {
    textAlign: 'center' as const,
    borderTop: '1px solid #e9ecef',
    paddingTop: '20px',
    marginTop: '25px',
};

const footerText = {
    color: '#6c757d',
    fontSize: '14px',
    margin: '10px 0',
};

const disclaimerText = {
    color: '#868e96',
    fontSize: '12px',
    margin: '10px 0',
};

const supportText = {
    color: '#6c757d',
    fontSize: '12px',
    margin: '10px 0',
};

const linkStyle = {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
};