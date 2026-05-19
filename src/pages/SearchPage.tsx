import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { PageContainer } from '@/components/layout/PageContainer';
import { SearchInput } from '@/components/common/SearchInput';
import { MedicineCard } from '@/components/common/MedicineCard';
import { useMedicineSearch } from '@/hooks/useMedicineSearch';

export default function SearchPage() {
  const navigate = useNavigate();
  const {
    query,
    results,
    isSearching,
    selectedMedicines,
    setQuery,
    selectMedicine,
    removeMedicine,
  } = useMedicineSearch();

  return (
    <PageContainer title="약 검색" showBackButton showBottomNav>
      <div className="space-y-4">
        {/* Search input with autocomplete */}
        <SearchInput
          value={query}
          onChange={setQuery}
          results={results}
          onSelect={selectMedicine}
          isLoading={isSearching}
          placeholder="약품명, 제조사, 성분명으로 검색"
        />

        {/* Selected medicines */}
        {selectedMedicines.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              선택된 약 ({selectedMedicines.length}개)
            </p>
            <div className="space-y-2">
              {selectedMedicines.map((med) => (
                <MedicineCard
                  key={med.id}
                  medicine={med}
                  onRemove={removeMedicine}
                  selected
                />
              ))}
            </div>
          </div>
        )}

        {selectedMedicines.length === 0 && !query && (
          <div className="flex flex-col items-center py-12 text-center">
            <p className="text-sm text-gray-400">
              약품명을 검색하여 분석할 약을 추가하세요
            </p>
          </div>
        )}
      </div>

      {/* Bottom fixed button */}
      {selectedMedicines.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 border-t bg-white p-4">
          <div className="mx-auto max-w-lg">
            <Button
              className="w-full"
              size="lg"
              onClick={() => navigate('/combine')}
            >
              조합 분석하기 ({selectedMedicines.length}개 선택)
            </Button>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
