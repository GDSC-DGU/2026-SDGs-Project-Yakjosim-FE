import { useLocation, useNavigate } from 'react-router';
import { Home, Search, ClipboardList, Settings } from 'lucide-react';
import { ROUTES } from '@/routes';

const navItems = [
  { path: ROUTES.HOME, label: '홈', icon: Home },
  { path: ROUTES.SEARCH, label: '검색', icon: Search },
  { path: ROUTES.ANALYZE, label: '분석', icon: ClipboardList },
  { path: ROUTES.SETTINGS, label: '설정', icon: Settings },
] as const;

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      data-slot="bottom-nav"
      className="glass fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div
        data-slot="bottom-nav-inner"
        className="mx-auto flex h-16 max-w-lg items-center justify-around"
      >
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <button
              data-slot="bottom-nav-button"
              key={path}
              onClick={() => navigate(path)}
              className={`relative flex flex-col items-center gap-1 px-4 py-2 text-[11px] font-medium transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-105' : ''}`} />
              <span>{label}</span>
              {isActive && (
                <span className="absolute -top-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
