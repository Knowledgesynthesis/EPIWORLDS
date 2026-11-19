import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Tabs } from '../components/TabbedPage';
import { useTab } from '../lib/useTab';
import { ConfoundingSim } from '../components/interactives/ConfoundingSim';
import { EffectModification } from '../components/interactives/EffectModification';

const tabs = ['confounding', 'em'] as const;

export default function ConfoundingLab() {
  const [tab, setTab] = useTab(tabs, 'confounding');
  return (
    <div>
      <PageHeader eyebrow="Lab" title="Confounding & Effect Modification Lab">
        Confounding is a bias you remove; effect modification is a result you report. Change one causal ingredient at a time and watch crude, stratified and pooled estimates respond.
      </PageHeader>
      <Tabs label="Lab section" tab={tab} setTab={setTab} options={[{ value: 'confounding', label: 'Confounding & stratification' }, { value: 'em', label: 'Effect modification' }]} />
      {tab === 'confounding' ? <ConfoundingSim /> : <EffectModification />}
      <p className="mt-8 text-sm text-muted-foreground">
        Theory: <Link to="/learn/confounding" className="underline underline-offset-2">Module 5 — Confounding</Link> · <Link to="/learn/effect-modification" className="underline underline-offset-2">Module 8 — Effect modification</Link>
      </p>
    </div>
  );
}
