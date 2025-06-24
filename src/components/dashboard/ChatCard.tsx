'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/hooks/useAppContext';
import { useToast } from '@/hooks/use-toast';
import { financialChatAction, textToSpeechAction } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { Loader2, Send, Bot, User, Volume2 } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  content: { text: string }[];
}

interface AudioState {
  [key: number]: {
    loading: boolean;
    audio?: HTMLAudioElement;
  };
}

export function ChatCard() {
  const { expenses, budget, savingsGoals } = useAppContext();
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [audioState, setAudioState] = useState<AudioState>({});
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
        savingsGoals: savingsGoals.map(({ goalName, targetAmount }) => ({ goalName, targetAmount })),
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

  const handleTextToSpeech = async (text: string, index: number) => {
    setAudioState(prev => ({ ...prev, [index]: { loading: true } }));

    const result = await textToSpeechAction(text);

    if (result.error) {
      toast({ title: 'Audio Error', description: result.error, variant: 'destructive' });
      setAudioState(prev => ({ ...prev, [index]: { loading: false } }));
      return;
    }

    const audio = new Audio(result.media);
    audio.play();
    audio.onended = () => {
       setAudioState(prev => ({ ...prev, [index]: { loading: false, audio: undefined } }));
    };

    setAudioState(prev => ({ ...prev, [index]: { loading: false, audio } }));
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
              <Bot className="h-10 w-10 mb-2" />
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
                className={cn('max-w-[80%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap flex items-center gap-2', {
                  'bg-primary text-primary-foreground': msg.role === 'user',
                  'bg-muted': msg.role === 'model',
                })}
              >
                {msg.content[0].text}
                {msg.role === 'model' && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 shrink-0"
                    onClick={() => handleTextToSpeech(msg.content[0].text, index)}
                    disabled={audioState[index]?.loading}
                  >
                    {audioState[index]?.loading ? (
                       <Loader2 className="h-4 w-4 animate-spin"/>
                    ) : (
                       <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                )}
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
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
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
          <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
