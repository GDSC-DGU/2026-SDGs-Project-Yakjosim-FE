import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Pill, Search, Camera, ShieldCheck } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Checkbox } from '@/app/components/ui/checkbox';
import { useUserContext } from '@/contexts/UserContext';

const features = [
  {
    icon: Search,
    title: '약물 상호작용을 쉽게 확인하세요',
    description: '복용 중인 약과 음식, 영양제의 상호작용을 한눈에 확인합니다.',
  },
  {
    icon: Camera,
    title: '처방전 사진으로 한번에 분석',
    description: '처방전이나 약봉투 사진을 찍으면 약 목록을 자동으로 인식합니다.',
  },
  {
    icon: ShieldCheck,
    title: '전문 데이터 기반 안전 정보',
    description: '약학정보원, 식품의약품안전처 DUR 데이터를 기반으로 안내합니다.',
  },
] as const;

export default function OnboardingPage() {
  const [agreed, setAgreed] = useState(false);
  const { dispatch } = useUserContext();
  const navigate = useNavigate();

  const handleStart = () => {
    dispatch({ type: 'COMPLETE_ONBOARDING' });
    navigate('/home');
  };

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 py-10">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 mb-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
          <Pill className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">약 조심</h1>
        <p className="text-sm text-gray-500">안전한 복약을 위한 상호작용 안내</p>
      </div>

      {/* Feature cards */}
      <div className="flex flex-col gap-4 mb-8 flex-1">
        {features.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="border-gray-200">
            <CardContent className="flex items-start gap-4 p-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{title}</p>
                <p className="mt-1 text-sm text-gray-500">{description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Disclaimer + Start */}
      <div className="space-y-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
              className="mt-0.5"
            />
            <label htmlFor="agree" className="text-sm leading-relaxed text-amber-800 cursor-pointer">
              본 서비스는 의료 진단이나 처방을 대체하지 않으며, 복약 안전 정보를
              안내하는 서비스입니다. 약 복용 관련 결정은 반드시 의사·약사와
              상담하세요.
            </label>
          </div>
        </div>

        <Button
          onClick={handleStart}
          disabled={!agreed}
          className="w-full"
          size="lg"
        >
          시작하기
        </Button>
      </div>
    </div>
  );
}
