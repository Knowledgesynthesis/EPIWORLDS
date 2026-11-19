import type { ReactNode } from 'react';
import { Segmented } from './ui/controls';

export function Tabs<T extends string>({ tab, setTab, options, label }: { tab: T; setTab: (t: T) => void; options: { value: T; label: ReactNode }[]; label: string }) {
  return <Segmented label={label} value={tab} onChange={setTab} options={options} className="mb-6" />;
}
