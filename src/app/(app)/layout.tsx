'use client';
import { AppProvider } from '@/components/AppProvider';
import { Header } from '@/components/Header';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <div className="relative flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </AppProvider>
  );
}
