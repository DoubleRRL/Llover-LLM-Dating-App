import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
      title: 'Llover - LLM Dating App Simulation',
    description: 'A Hinge-style dating app where you chat with multiple AI-powered personalities, each with unique styles and backgrounds. Built as a portfolio demonstration of LLM integration.',
  keywords: ['llm', 'dating-app', 'chat', 'ai', 'personalities', 'portfolio'],
  authors: [{ name: 'Security Researcher' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
          {children}
        </div>
      </body>
    </html>
  );
} 