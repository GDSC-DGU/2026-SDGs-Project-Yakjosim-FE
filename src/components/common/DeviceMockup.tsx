interface IPhoneMockupProps {
  src: string;
  alt: string;
  className?: string;
}

export function IPhoneMockup({ src, alt, className = '' }: IPhoneMockupProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <div className="relative rounded-[40px] bg-[#1a1a2e] p-[10px] shadow-[var(--shadow-xl)]">
        <div className="absolute left-1/2 top-[10px] z-10 h-[22px] w-[90px] -translate-x-1/2 rounded-full bg-[#1a1a2e]" />
        <div className="overflow-hidden rounded-[30px] bg-background">
          <img src={src} alt={alt} className="block w-[220px]" loading="lazy" />
        </div>
      </div>
    </div>
  );
}

interface MacBookMockupProps {
  src: string;
  alt: string;
  className?: string;
}

export function MacBookMockup({ src, alt, className = '' }: MacBookMockupProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <div className="rounded-t-[12px] bg-[#2a2a3e] px-[6px] pt-[6px] pb-0 shadow-[var(--shadow-xl)]">
        <div className="relative">
          <div className="absolute left-1/2 top-[4px] z-10 h-[6px] w-[6px] -translate-x-1/2 rounded-full bg-[#3a3a4e]" />
          <div className="overflow-hidden rounded-t-[6px] bg-background">
            <img src={src} alt={alt} className="block w-[560px]" loading="lazy" />
          </div>
        </div>
      </div>
      <div className="h-[14px] rounded-b-[6px] bg-gradient-to-b from-[#3a3a50] to-[#2a2a3e] shadow-[var(--shadow-md)]" />
      <div className="mx-auto h-[4px] w-[30%] rounded-b-[4px] bg-[#2a2a3e]" />
    </div>
  );
}
