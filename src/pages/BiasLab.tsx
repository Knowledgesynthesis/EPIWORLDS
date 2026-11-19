import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Tabs } from '../components/TabbedPage';
import { useTab } from '../lib/useTab';
import { Misclassification } from '../components/interactives/Misclassification';
import { SelectionSim } from '../components/interactives/SelectionSim';
import { ImmortalTime, LeadTime } from '../components/interactives/TimeBiases';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const tabs = ['selection', 'misclassification', 'time', 'map'] as const;

const biasMap: { structure: string; mechanism: string; named: string; module: string }[] = [
  { structure: 'Confounding', mechanism: 'Open backdoor path (common cause of exposure and outcome)', named: 'Confounding by indication, healthy-user effect, channelling, residual confounding', module: 'confounding' },
  { structure: 'Selection bias', mechanism: 'Conditioning on a common effect (collider) of exposure and outcome or their causes', named: "Berkson's bias, differential loss to follow-up, non-response, healthy worker effect, survivor bias", module: 'selection-bias' },
  { structure: 'Measurement bias', mechanism: 'Error in measuring exposure, outcome or confounders', named: 'Recall, interviewer, detection, misclassification, regression dilution', module: 'information-bias' },
  { structure: 'Time-related', mechanism: 'Misaligned time zero or exposure defined after follow-up starts', named: 'Immortal time, prevalent-user, protopathic, lead-time, length-time', module: 'clinical-biases' },
  { structure: 'Reporting', mechanism: 'What is published depends on the results', named: 'Publication bias, outcome switching, selective analysis reporting', module: 'appraisal' },
];

export default function BiasLab() {
  const [tab, setTab] = useTab(tabs, 'selection');
  return (
    <div>
      <PageHeader eyebrow="Lab" title="Bias Lab">
        Every bias here is computed, not asserted: set the mechanism and the lab shows the true and observed estimates side by side.
      </PageHeader>
      <Tabs
        label="Bias type"
        tab={tab}
        setTab={setTab}
        options={[
          { value: 'selection', label: 'Selection' },
          { value: 'misclassification', label: 'Misclassification' },
          { value: 'time', label: 'Time-related' },
          { value: 'map', label: 'Bias map' },
        ]}
      />
      {tab === 'selection' && <SelectionSim />}
      {tab === 'misclassification' && <Misclassification />}
      {tab === 'time' && (
        <div className="space-y-8">
          <Card>
            <CardHeader><CardTitle>Immortal time bias</CardTitle></CardHeader>
            <CardContent><ImmortalTime /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Lead-time bias in screening</CardTitle></CardHeader>
            <CardContent><LeadTime /></CardContent>
          </Card>
        </div>
      )}
      {tab === 'map' && (
        <div className="space-y-4">
          <p className="text-sm leading-6 text-muted-foreground">
            Dozens of named biases reduce to a few structures (Hernán & Robins). Identify the structure and you know the fix.
          </p>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[40rem] text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Structure</th>
                  <th className="px-3 py-2 text-left font-semibold">Mechanism</th>
                  <th className="px-3 py-2 text-left font-semibold">Named biases</th>
                </tr>
              </thead>
              <tbody>
                {biasMap.map((b) => (
                  <tr key={b.structure} className="border-t align-top">
                    <td className="px-3 py-2 font-medium">
                      <Link to={`/learn/${b.module}`} className="text-primary underline underline-offset-2">{b.structure}</Link>
                    </td>
                    <td className="px-3 py-2">{b.mechanism}</td>
                    <td className="px-3 py-2 text-muted-foreground">{b.named}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">
            Random error is not on this map: it shrinks with sample size, bias does not. See the <Link to="/study-sandbox" className="underline underline-offset-2">Study Simulator</Link>.
          </p>
        </div>
      )}
    </div>
  );
}
