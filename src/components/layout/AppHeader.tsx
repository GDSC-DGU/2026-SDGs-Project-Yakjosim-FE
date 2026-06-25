import { useNavigate } from 'react-router';
import { ArrowLeft, Pill } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  wide?: boolean;
}

export function AppHeader({ title = '약 조심', showBackButton = false, wide = false }: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <header
      data-slot="app-header"
      className="glass sticky top-0 z-30 border-b border-border/40"
    >
      <div className={`mx-auto flex h-14 items-center ${wide ? 'max-w-6xl px-5 lg:px-8' : 'max-w-2xl px-5'}`}>
        {showBackButton ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
            className="h-9 w-9 rounded-xl"
          >
            <ArrowLeft className="h-[18px] w-[18px]" />
          </Button>
        ) : (
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Pill className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
        )}
        <h1 className="flex-1 text-center text-[15px] font-semibold tracking-tight lg:text-left">
          {title}
        </h1>
        <div className="w-9 lg:hidden" />
      </div>
    </header>
  );
}
