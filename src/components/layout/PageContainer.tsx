import type { ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';

interface PageContainerProps {
  title?: string;
  showBackButton?: boolean;
  showBottomNav?: boolean;
  children: ReactNode;
  className?: string;
}

export function PageContainer({
  title,
  showBackButton = false,
  showBottomNav = true,
  children,
  className = '',
}: PageContainerProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AppHeader title={title} showBackButton={showBackButton} />
      <main className={`flex-1 px-4 py-4 ${showBottomNav ? 'pb-20' : ''} ${className}`}>
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
