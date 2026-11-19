import { useSearchParams } from 'react-router-dom';

/** Tabs whose selection lives in ?tab= so every view is linkable. */
export function useTab<T extends string>(tabs: readonly T[], fallback: T): [T, (t: T) => void] {
  const [params, setParams] = useSearchParams();
  const raw = params.get('tab') as T | null;
  const tab = raw && tabs.includes(raw) ? raw : fallback;
  const setTab = (t: T) => {
    const next = new URLSearchParams(params);
    if (t === fallback) next.delete('tab');
    else next.set('tab', t);
    setParams(next, { replace: true });
  };
  return [tab, setTab];
}
