import { useLocation, useNavigate } from 'react-router';
import { Home, Search, ClipboardList, Settings, Pill } from 'lucide-react';
import { ROUTES } from '@/routes';

const navItems = [
  { path: ROUTES.HOME, label: '홈', icon: Home },
  { path: ROUTES.SEARCH, label: '검색', icon: Search },
  { path: ROUTES.ANALYZE, label: '분석', icon: ClipboardList },
  { path: ROUTES.SETTINGS, label: '설정', icon: Settings },
] as const;

export function DesktopSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[240px] flex-col border-r border-border/50 bg-sidebar lg:flex">
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
          <Pill className="h-4.5 w-4.5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-[15px] font-bold tracking-tight text-foreground">약 조심</p>
          <p className="text-[11px] text-muted-foreground">복약 안전 가이드</p>
        </div>
      </div>

      <nav className="flex-1 px-3 pt-2">
        <ul className="space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <li key={path}>
                <button
                  onClick={() => navigate(path)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-primary'
                      : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border/50 px-4 py-4">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          이 서비스는 의료 진단을 대체하지 않아요.
        </p>
      </div>
    </aside>
  );
}
