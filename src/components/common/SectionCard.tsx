import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function SectionCard({ title, children, className = '' }: SectionCardProps) {
  return (
    <div className={`surface-card p-5 ${className}`}>
      <p className="mb-4 text-[15px] font-bold tracking-tight text-foreground">{title}</p>
      {children}
    </div>
  );
}
