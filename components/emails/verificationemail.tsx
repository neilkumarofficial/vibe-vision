import * as React from 'react';
import {
    Html,
    Body,
    Container,
    Heading,
    Text,
    Section,
    Button,
    Link,
} from '@react-email/components';
import { ShieldCheck, Clock, AlertTriangle, Mail } from 'lucide-react';

interface EmailVerificationProps {
    firstName: string;
    userId: string;
    verificationToken: string;
}

export default function EmailVerification({
    firstName,
    userId,
    verificationToken
}: EmailVerificationProps) {
    // Construct the full verification URL
    const verificationLink = `https://vibevision.com/verify?userId=${userId}&token=${verificationToken}`;

    return (
        <Html lang="en">
            <Body style={body}>
                <Container style={container}>
                    <Section style={headerSection}>
                        <Mail 
                            color="#007bff" 
                            size={50} 
                            style={{ margin: '0 auto 20px', display: 'block' }} 
                        />
                        <Heading style={h1}>
                            <ShieldCheck 
                                color="#28a745" 
                                size={28} 
                                style={{ marginRight: '10px', verticalAlign: 'middle' }} 
                            />
                            Verify Your VibeVision Account
                        </Heading>
                    </Section>

                    <Section style={contentSection}>
                        <Text style={paragraph}>
                            Hi {firstName}, 

                            Welcome to VibeVision! To activate your account and start creating, 
                            performing, and entertaining, please verify your email address.
                        </Text>

                        <Section style={ctaSection}>
                            <Button href={verificationLink} style={button}>
                                Verify My Account
                            </Button>
                        </Section>

                        <Section style={warningSection}>
                            <Text style={warningText}>
                                <Clock 
                                    color="#ffc107" 
                                    size={20} 
                                    style={{ marginRight: '10px', verticalAlign: 'middle' }} 
                                />
                                This verification link will expire in 24 hours.
                            </Text>
                        </Section>

                        <Section style={alternativeMethodSection}>
                            <Text style={alternativeMethod}>
                                <AlertTriangle 
                                    color="#dc3545" 
                                    size={20} 
                                    style={{ marginRight: '10px', verticalAlign: 'middle' }} 
                                />
                                Alternative Verification:
                            </Text>
                            <Text style={linkText}>
                                If the button doesn't work, copy and paste this link in your browser:
                            </Text>
                            <Link href={verificationLink} style={directLinkStyle}>
                                {verificationLink}
                            </Link>
                        </Section>

                        <Text style={disclaimerText}>
                            If you didn't create an account, please ignore this email or{' '}
                            <Link href="https://vibevision.com/support" style={supportLinkStyle}>
                                contact our support
                            </Link>
                            .
                        </Text>
                    </Section>

                    <Section style={footerSection}>
                        <Text style={footerText}>
                            © {new Date().getFullYear()} VibeVision. 
                            Create, Perform, Entertain.
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

const h1 = {
    color: '#333',
    fontSize: '28px',
    textAlign: 'center' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const contentSection = {
    padding: '0 15px',
};

const paragraph = {
    color: '#666',
    fontSize: '16px',
    lineHeight: '1.7',
    marginBottom: '25px',
    textAlign: 'center' as const,
};

const ctaSection = {
    textAlign: 'center' as const,
    margin: '25px 0',
};

const button = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
    display: 'inline-block',
    transition: 'background-color 0.3s ease',
};

const warningSection = {
    backgroundColor: '#fff3cd',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '25px',
    textAlign: 'center' as const,
};

const warningText = {
    color: '#856404',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const alternativeMethodSection = {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '25px',
    textAlign: 'center' as const,
};

const alternativeMethod = {
    color: '#dc3545',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
};

const linkText = {
    color: '#666',
    fontSize: '14px',
    marginBottom: '10px',
};

const directLinkStyle = {
    backgroundColor: '#e9ecef',
    color: '#333',
    padding: '10px',
    borderRadius: '6px',
    display: 'block',
    wordBreak: 'break-all' as const,
    fontSize: '12px',
    textDecoration: 'none',
};

const disclaimerText = {
    color: '#6c757d',
    fontSize: '14px',
    textAlign: 'center' as const,
    marginTop: '20px',
};

const supportLinkStyle = {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
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
};