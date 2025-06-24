import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Landmark, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
        <div className="p-4 bg-primary/10 rounded-full mb-6 border border-primary/20">
          <Landmark className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter mb-4 animate-fade-in-up">
          Welcome to Gemini Finance Pilot
        </h1>
        <p className="text-lg text-muted-foreground mb-8 animate-fade-in-up delay-200">
          Your modern, interactive, and AI-powered assistant for mastering your personal finances. Track expenses, plan budgets, and gain intelligent insights to achieve your financial goals.
        </p>
        <div className="animate-fade-in-up delay-400">
          <Button asChild size="lg" className="font-bold text-lg group">
            <Link href="/dashboard">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

// Add some keyframes for animations in globals.css if they don't exist
// This is just a comment for the developer. Let's assume they are added via tailwind config.
