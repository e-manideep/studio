'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/hooks/useAppContext';
import { useToast } from '@/hooks/use-toast';
import { financialChatAction } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { Loader2, Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  content: { text: string }[];
}

export function ChatCard() {
  const { expenses, budget, savingsGoals } = useAppContext();
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isPending]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: Message = { role: 'user', content: [{ text: input }] };
    setHistory((prev) => [...prev, userMessage]);
    
    startTransition(async () => {
      const chatInput = {
        expenses: expenses.map(({ amount, description, category }) => ({ amount, description, category })),
        monthlyBudget: budget,
        savingsGoals: savingsGoals.map(({ name, targetAmount }) => ({ goalName: name, targetAmount })),
        history: history,
        message: input,
      };

      const result = await financialChatAction(chatInput);
      
      if (result.error) {
        toast({
          title: 'Chat Error',
          description: result.error,
          variant: 'destructive',
        });
        setHistory(prev => prev.slice(0, -1));
      } else {
        const modelMessage: Message = { role: 'model', content: [{ text: result.response }] };
        setHistory((prev) => [...prev, modelMessage]);
      }
    });

    setInput('');
  };

  return (
    <Card className="w-full flex flex-col">
      <CardHeader>
        <CardTitle>Financial Chat</CardTitle>
        <CardDescription>Ask me anything about your finances.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <div className="flex-grow h-96 overflow-y-auto pr-4 space-y-4">
            {history.length === 0 && !isPending && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
                    <Bot className="h-10 w-10 mb-2"/>
                    <p>Hello! How can I help you with your finances today?</p>
                </div>
            )}
            {history.map((msg, index) => (
              <div
                key={index}
                className={cn('flex items-start gap-3', {
                  'justify-end': msg.role === 'user',
                })}
              >
                {msg.role === 'model' && (
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div
                  className={cn('max-w-[80%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap', {
                    'bg-primary text-primary-foreground': msg.role === 'user',
                    'bg-muted': msg.role === 'model',
                  })}
                >
                  {msg.content[0].text}
                </div>
                {msg.role === 'user' && (
                  <div className="p-2 bg-muted rounded-full">
                    <User className="h-5 w-5 text-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isPending && (
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-2">
                        <Loader2 className="h-5 w-5 animate-spin text-primary"/>
                    </div>
                </div>
            )}
           <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., How much did I spend on food?"
            disabled={isPending}
          />
          <Button type="submit" size="icon" disabled={isPending}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
