import { useNavigate } from 'react-router';
import { Home } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { ROUTES } from '@/routes';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <p className="text-[80px] font-bold leading-none tracking-tighter text-primary/20">404</p>
      <p className="mt-4 text-lg font-semibold text-foreground">페이지를 찾을 수 없어요</p>
      <p className="mt-2 text-sm text-muted-foreground">요청한 주소가 올바른지 확인해봐요.</p>
      <Button className="mt-8 h-12 rounded-xl px-6" onClick={() => navigate(ROUTES.HOME, { replace: true })}>
        <Home className="mr-2 h-4 w-4" />
        홈으로 돌아가기
      </Button>
    </div>
  );
}
