import { useNavigate } from 'react-router';
import { ArrowLeft, Pill } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export function AppHeader({ title = '약 조심', showBackButton = false }: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center border-b border-gray-200 bg-white px-4">
      {showBackButton ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <Pill className="h-6 w-6 text-blue-600" />
        </div>
      )}
      <h1 className="flex-1 text-center text-lg font-semibold">{title}</h1>
      {/* 오른쪽 균형을 위한 빈 공간 */}
      <div className="w-10" />
    </header>
  );
}
