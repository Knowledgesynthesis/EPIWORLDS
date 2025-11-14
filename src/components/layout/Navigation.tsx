import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Microscope,
  Network,
  FlaskConical,
  GraduationCap,
  BookMarked,
  Scale,
  Moon,
  Sun,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useThemeStore } from '../../stores/useThemeStore';
import { Button } from '../ui/Button';

const navigationItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/study-designs', label: 'Study Designs', icon: BookOpen },
  { path: '/bias-lab', label: 'Bias Lab', icon: Microscope },
  { path: '/dag-builder', label: 'DAG Builder', icon: Network },
  { path: '/confounding-lab', label: 'Confounding Lab', icon: FlaskConical },
  { path: '/study-sandbox', label: 'Study Sandbox', icon: GraduationCap },
  { path: '/assessments', label: 'Assessments', icon: GraduationCap },
  { path: '/glossary', label: 'Glossary', icon: BookMarked },
  { path: '/ethics', label: 'Ethics', icon: Scale },
];

export function Navigation() {
  const location = useLocation();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <nav className="fixed left-0 top-0 h-full w-64 border-r bg-card shadow-sm">
      <div className="flex h-full flex-col">
        {/* Logo/Header */}
        <div className="border-b p-6">
          <h1 className="text-2xl font-bold text-primary">EpiWorlds</h1>
          <p className="text-sm text-muted-foreground">
            From Study Design to Causation
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                      'hover:bg-accent hover:text-accent-foreground',
                      isActive && 'bg-accent text-accent-foreground font-medium'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Theme Toggle */}
        <div className="border-t p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="w-full"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="mr-2 h-4 w-4" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="mr-2 h-4 w-4" />
                Dark Mode
              </>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}
