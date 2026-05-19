import { useNavigate } from 'react-router';
import { Search, Pill, Camera, Apple, ClipboardList } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionCard } from '@/components/common/SectionCard';
import { RiskBadge } from '@/components/common/RiskBadge';
import { useUserContext } from '@/contexts/UserContext';

const actionCards = [
  { label: '약 검색', path: '/search', icon: Pill, color: 'bg-blue-50 text-blue-600' },
  { label: '처방전 촬영', path: '/ocr', icon: Camera, color: 'bg-green-50 text-green-600' },
  { label: '음식·영양제 체크', path: '/combine', icon: Apple, color: 'bg-orange-50 text-orange-600' },
  { label: '내 복용 목록', path: '/mypage', icon: ClipboardList, color: 'bg-purple-50 text-purple-600' },
] as const;

export default function HomePage() {
  const navigate = useNavigate();
  const { state } = useUserContext();

  const recentSessions = state.savedSessions.slice(-3).reverse();

  return (
    <PageContainer showBottomNav>
      <div className="space-y-6">
        {/* Search bar (read-only, navigates to /search on click) */}
        <div className="relative cursor-pointer" onClick={() => navigate('/search')}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            readOnly
            placeholder="약품명을 검색하세요"
            className="cursor-pointer pl-10"
          />
        </div>

        {/* Action cards grid */}
        <div className="grid grid-cols-2 gap-3">
          {actionCards.map(({ label, path, icon: Icon, color }) => (
            <Card
              key={path}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => navigate(path)}
            >
              <CardContent className="flex flex-col items-center gap-3 p-5">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent analysis records */}
        <SectionCard title="최근 분석 기록">
          {recentSessions.length === 0 ? (
            <p className="text-sm text-gray-400">분석 기록이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {recentSessions.map((saved) => {
                const session = saved.session;
                const date = new Date(session.createdAt);
                const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
                return (
                  <div
                    key={saved.id}
                    className="flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50"
                    onClick={() => navigate('/results')}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{dateStr}</p>
                      <p className="text-xs text-gray-500">
                        약물 {session.items.filter((i) => i.type === 'drug').length}개 · 결과 {session.results.length}건
                      </p>
                    </div>
                    <RiskBadge severity={session.overallSeverity} />
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>
    </PageContainer>
  );
}
