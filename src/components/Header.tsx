'use client';

import { Landmark, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/expenses', label: 'Expenses' },
  { href: '/budget', label: 'Budget' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <Landmark className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline sm:inline-block">
              Gemini Finance Pilot
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === item.href ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserCircle className="h-5 w-5" />
            <span>USR-1a7b3c</span>
          </div>
        </div>
      </div>
    </header>
  );
}
