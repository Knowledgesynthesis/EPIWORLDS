import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  BookMarked,
  BookOpen,
  Calculator,
  CheckCircle2,
  FlaskConical,
  GraduationCap,
  Home,
  Library,
  Menu,
  Microscope,
  Monitor,
  Moon,
  Network,
  Scale,
  Sigma,
  Sun,
  X,
} from 'lucide-react';
import { modules } from '../../data/curriculum';
import { cn } from '../../lib/utils';
import { useProgressStore } from '../../stores/useProgressStore';
import { useThemeStore } from '../../stores/useThemeStore';

const labs = [
  { to: '/dag-builder', label: 'DAG Lab', icon: Network },
  { to: '/confounding-lab', label: 'Confounding & EM Lab', icon: FlaskConical },
  { to: '/bias-lab', label: 'Bias Lab', icon: Microscope },
  { to: '/study-sandbox', label: 'Study Simulator', icon: Sigma },
  { to: '/calculators', label: 'Calculators', icon: Calculator },
];

const reference = [
  { to: '/study-designs', label: 'Study designs', icon: BookOpen },
  { to: '/ethics', label: 'Ethics clinic', icon: Scale },
  { to: '/glossary', label: 'Glossary', icon: BookMarked },
  { to: '/reference', label: 'Formulas & sources', icon: Library },
];

function ThemeButton() {
  const { theme, cycleTheme } = useThemeStore();
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  const label = theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System';
  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      aria-label={`Theme: ${label}. Click to change.`}
    >
      <Icon className="h-4 w-4" aria-hidden />
      Theme: {label}
    </button>
  );
}

const linkCls = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
    isActive ? 'bg-accent font-medium text-accent-foreground' : 'text-foreground/80 hover:bg-accent/60 hover:text-foreground'
  );

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const completed = useProgressStore((s) => s.completed);
  return (
    <nav aria-label="Main" className="flex h-full min-h-0 flex-col" onClick={(e) => (e.target as HTMLElement).closest('a') && onNavigate?.()}>
      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          <NavLink to="/" end className={linkCls}>
            <Home className="h-4 w-4" aria-hidden /> Home
          </NavLink>
          <NavLink to="/assessments" className={linkCls}>
            <GraduationCap className="h-4 w-4" aria-hidden /> Practice & exams
          </NavLink>
        </div>
        <div>
          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Link to="/learn" className="hover:text-foreground">Course</Link>
          </p>
          <ol className="space-y-0.5">
            {modules.map((m) => (
              <li key={m.id}>
                <NavLink to={`/learn/${m.id}`} className={linkCls}>
                  <span
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold',
                      completed.includes(m.id) ? 'bg-good/15 text-good' : 'bg-muted text-muted-foreground'
                    )}
                    aria-hidden
                  >
                    {completed.includes(m.id) ? <CheckCircle2 className="h-3.5 w-3.5" /> : m.n}
                  </span>
                  <span className="truncate">{m.title}</span>
                  {completed.includes(m.id) && <span className="sr-only">(completed)</span>}
                </NavLink>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Labs</p>
          <ul className="space-y-0.5">
            {labs.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink to={to} className={linkCls}>
                  <Icon className="h-4 w-4" aria-hidden /> {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reference</p>
          <ul className="space-y-0.5">
            {reference.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink to={to} className={linkCls}>
                  <Icon className="h-4 w-4" aria-hidden /> {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t p-3">
        <ThemeButton />
      </div>
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <img src="/favicon.svg" alt="" className="h-8 w-8" />
      <span className="leading-tight">
        <span className="block text-base font-bold tracking-tight">EpiWorlds</span>
        <span className="block text-[11px] text-muted-foreground">Study design → causation</span>
      </span>
    </Link>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Reset scroll on navigation (the drawer closes itself when a link is tapped).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only z-50 rounded bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r bg-card lg:flex">
        <div className="border-b px-5 py-4">
          <Brand />
        </div>
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-card/95 px-4 backdrop-blur lg:hidden">
        <Brand />
        <button type="button" onClick={() => setOpen(true)} className="rounded-md p-2 hover:bg-accent" aria-label="Open menu" aria-expanded={open}>
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[85%] max-w-xs flex-col bg-card shadow-xl">
            <div className="flex h-14 items-center justify-between border-b px-4">
              <span className="font-semibold">Menu</span>
              <button type="button" onClick={() => setOpen(false)} className="rounded-md p-2 hover:bg-accent" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-72">
        <main id="main" className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-10">
          {children}
        </main>
        <footer className="mx-auto max-w-5xl border-t px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:px-10">
          All datasets are synthetic. Every method and claim is sourced — see{' '}
          <Link to="/reference" className="underline underline-offset-2 hover:text-foreground">
            Formulas & sources
          </Link>
          .
        </footer>
      </div>
    </div>
  );
}
