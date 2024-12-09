import * as React from 'react';
import {
    Html,
    Body,
    Container,
    Heading,
    Text,
    Section,
    Row,
    Column,
    Hr,
} from '@react-email/components';

interface SubscriptionReceiptProps {
    firstName: string;
    planName: string;
    billingType: string;
    totalAmount: string;
    features: string[];
}

export default function SubscriptionReceipt({
    firstName,
    planName,
    billingType,
    totalAmount,
    features
}: SubscriptionReceiptProps) {
    return (
        <Html>
            <Body style={body}>
                <Container style={container}>
                    <Heading style={h1}>VibeDream Subscription Receipt</Heading>

                    <Text style={paragraph}>
                        Hello {firstName},
                    </Text>

                    <Text style={paragraph}>
                        Thank you for your subscription to VibeDream. Below are the details of your recent purchase:
                    </Text>

                    <Section style={invoiceSection}>
                        <Row>
                            <Column style={invoiceDetailsColumn}>
                                <Text style={invoiceDetailsLabel}>Plan Name</Text>
                                <Text style={invoiceDetailsValue}>{planName}</Text>
                            </Column>
                            <Column style={invoiceDetailsColumn}>
                                <Text style={invoiceDetailsLabel}>Billing Type</Text>
                                <Text style={invoiceDetailsValue}>{billingType}</Text>
                            </Column>
                            <Column style={invoiceDetailsColumn}>
                                <Text style={invoiceDetailsLabel}>Total Amount</Text>
                                <Text style={invoiceDetailsValue}>${totalAmount}</Text>
                            </Column>
                        </Row>
                    </Section>

                    <Section style={featuresSection}>
                        <Heading style={h2}>Included Features</Heading>
                        {features.length > 0 ? (
                            <ul style={featuresList}>
                                {features.map((feature, index) => (
                                    <li key={index} style={featuresListItem}>{feature}</li>
                                ))}
                            </ul>
                        ) : (
                            <Text style={paragraph}>No specific features listed.</Text>
                        )}
                    </Section>

                    <Hr style={hr} />

                    <Text style={footer}>
                        © {new Date().getFullYear()} VibeDream. All rights reserved.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

// Styles
const body = {
    backgroundColor: '#f4f4f4',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px',
    maxWidth: '600px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
};

const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    margin: '20px 0',
};

const h2 = {
    color: '#333',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '15px 0',
};

const paragraph = {
    color: '#666',
    fontSize: '16px',
    lineHeight: '24px',
};

const invoiceSection = {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '6px',
    margin: '20px 0',
};

const invoiceDetailsColumn = {
    textAlign: 'center' as const,
    padding: '0 10px',
};

const invoiceDetailsLabel = {
    color: '#888',
    fontSize: '14px',
    fontWeight: 'bold',
    margin: '0',
};

const invoiceDetailsValue = {
    color: '#333',
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '5px 0 0',
};

const featuresSection = {
    margin: '20px 0',
};

const featuresList = {
    paddingLeft: '20px',
    margin: '10px 0',
};

const featuresListItem = {
    color: '#666',
    fontSize: '14px',
    marginBottom: '5px',
};

const hr = {
    borderTop: '1px solid #e0e0e0',
    margin: '20px 0',
};

const footer = {
    color: '#888',
    fontSize: '12px',
    textAlign: 'center' as const,
};