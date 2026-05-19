import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Checkbox } from '@/app/components/ui/checkbox';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionCard } from '@/components/common/SectionCard';
import { MedicineCard } from '@/components/common/MedicineCard';
import { RiskBadge } from '@/components/common/RiskBadge';
import { useUserContext } from '@/contexts/UserContext';
import { useAnalysisContext } from '@/contexts/AnalysisContext';
import type { Sex } from '@/types';

const sexLabels: Record<Sex, string> = {
  male: '남성',
  female: '여성',
  other: '기타',
};

export default function MyPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useUserContext();
  const { dispatch: analysisDispatch } = useAnalysisContext();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  // Profile form state
  const [formBirthYear, setFormBirthYear] = useState<string>(
    state.profile.birthYear?.toString() ?? ''
  );
  const [formSex, setFormSex] = useState<Sex | ''>(state.profile.sex ?? '');
  const [formPregnant, setFormPregnant] = useState(state.profile.isPregnant);
  const [formElderly, setFormElderly] = useState(state.profile.isElderly);

  const handleSaveProfile = () => {
    dispatch({
      type: 'SET_PROFILE',
      payload: {
        birthYear: formBirthYear ? parseInt(formBirthYear) : undefined,
        sex: formSex || undefined,
        isPregnant: formPregnant,
        isElderly: formElderly,
      },
    });
    setProfileDialogOpen(false);
  };

  const handleSessionClick = (session: typeof state.savedSessions[0]) => {
    analysisDispatch({ type: 'SET_SESSION', payload: session.session });
    navigate('/results');
  };

  return (
    <PageContainer title="내 복용 목록" showBottomNav>
      <div className="space-y-4">
        {/* Saved medicines */}
        <SectionCard title="저장된 약">
          {state.savedMedicines.length === 0 ? (
            <p className="text-sm text-gray-400">
              저장된 약이 없습니다. 검색하여 추가하세요.
            </p>
          ) : (
            <div className="space-y-2">
              {state.savedMedicines.map((saved) => (
                <MedicineCard
                  key={saved.id}
                  medicine={saved.medicine}
                  onRemove={() =>
                    dispatch({ type: 'REMOVE_SAVED_MEDICINE', payload: saved.id })
                  }
                />
              ))}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => navigate('/search')}
          >
            <Plus className="mr-1 h-4 w-4" />
            약 추가
          </Button>
        </SectionCard>

        {/* Analysis history */}
        <SectionCard title="이전 분석 기록">
          {state.savedSessions.length === 0 ? (
            <p className="text-sm text-gray-400">분석 기록이 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {state.savedSessions
                .slice()
                .reverse()
                .map((saved) => {
                  const session = saved.session;
                  const date = new Date(session.createdAt);
                  const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
                  return (
                    <div
                      key={saved.id}
                      className="flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50"
                      onClick={() => handleSessionClick(saved)}
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{dateStr}</p>
                        <p className="text-xs text-gray-500">
                          약물 {session.items.filter((i) => i.type === 'drug').length}개 · 결과{' '}
                          {session.results.length}건
                        </p>
                      </div>
                      <RiskBadge severity={session.overallSeverity} />
                    </div>
                  );
                })}
            </div>
          )}
        </SectionCard>

        {/* Health profile */}
        <SectionCard title="건강 정보">
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span className="text-gray-400">나이대</span>
              <span>
                {state.profile.birthYear
                  ? `${new Date().getFullYear() - state.profile.birthYear}세`
                  : '미설정'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">성별</span>
              <span>
                {state.profile.sex ? sexLabels[state.profile.sex] : '미설정'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">임신 여부</span>
              <span>{state.profile.isPregnant ? '예' : '아니오'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">고령자 여부</span>
              <span>{state.profile.isElderly ? '예' : '아니오'}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => setProfileDialogOpen(true)}
          >
            수정
          </Button>
        </SectionCard>
      </div>

      {/* Profile edit dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>건강 정보 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="birthYear">출생연도</Label>
              <Input
                id="birthYear"
                type="number"
                placeholder="예: 1990"
                value={formBirthYear}
                onChange={(e) => setFormBirthYear(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>성별</Label>
              <div className="mt-1 flex gap-2">
                {(['male', 'female', 'other'] as Sex[]).map((sex) => (
                  <Button
                    key={sex}
                    variant={formSex === sex ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormSex(sex)}
                  >
                    {sexLabels[sex]}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="pregnant"
                checked={formPregnant}
                onCheckedChange={(checked) => setFormPregnant(checked === true)}
              />
              <Label htmlFor="pregnant">임신 중</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="elderly"
                checked={formElderly}
                onCheckedChange={(checked) => setFormElderly(checked === true)}
              />
              <Label htmlFor="elderly">고령자 (65세 이상)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProfileDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSaveProfile}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
