import type { ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';
import { DesktopSidebar } from './DesktopSidebar';

interface PageContainerProps {
  title?: string;
  showBackButton?: boolean;
  showBottomNav?: boolean;
  wide?: boolean;
  children: ReactNode;
  className?: string;
}

export function PageContainer({
  title,
  showBackButton = false,
  showBottomNav = true,
  wide = false,
  children,
  className = '',
}: PageContainerProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />

      <div className="flex min-h-screen flex-1 flex-col lg:ml-[240px]">
        <AppHeader title={title} showBackButton={showBackButton} wide={wide} />
        <main
          data-slot="app-main"
          className={`flex-1 ${showBottomNav ? 'pb-24 lg:pb-6' : ''} ${className}`}
        >
          <div className={`mx-auto w-full py-6 ${wide ? 'max-w-6xl px-5 lg:px-8' : 'max-w-2xl px-5'}`}>
            {children}
          </div>
        </main>
      </div>

      {showBottomNav && <BottomNav />}
    </div>
  );
}
