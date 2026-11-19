import { PageHeader } from '../components/PageHeader';
import { Tabs } from '../components/TabbedPage';
import { useTab } from '../lib/useTab';
import { EValueCalculator } from '../components/interactives/EValueCalculator';
import { OrVsRr } from '../components/interactives/OrVsRr';
import { PowerCalculator } from '../components/interactives/PowerCalculator';
import { TwoByTwoCalculator } from '../components/interactives/TwoByTwoCalculator';

const tabs = ['2x2', 'or-rr', 'evalue', 'power'] as const;

export default function Calculators() {
  const [tab, setTab] = useTab(tabs, '2x2');
  return (
    <div>
      <PageHeader eyebrow="Tools" title="Calculators">
        Standard large-sample methods with the arithmetic shown. All formulas are listed with their sources under Formulas & sources.
      </PageHeader>
      <Tabs
        label="Calculator"
        tab={tab}
        setTab={setTab}
        options={[
          { value: '2x2', label: '2×2 table' },
          { value: 'or-rr', label: 'OR vs RR' },
          { value: 'evalue', label: 'E-value' },
          { value: 'power', label: 'Sample size' },
        ]}
      />
      <div className="rounded-xl border bg-card p-4 sm:p-6">
        {tab === '2x2' && <TwoByTwoCalculator />}
        {tab === 'or-rr' && <OrVsRr />}
        {tab === 'evalue' && <EValueCalculator />}
        {tab === 'power' && <PowerCalculator />}
      </div>
    </div>
  );
}
