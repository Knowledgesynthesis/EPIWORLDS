import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { DagWorkbench } from '../components/interactives/DagWorkbench';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { dagLabStore } from '../stores/useDagStore';

export default function DagLab() {
  return (
    <div>
      <PageHeader eyebrow="Lab" title="DAG Lab">
        Draw your causal assumptions, mark the exposure and outcome, and the lab enumerates every path, tells you which are open, and finds the minimal sufficient adjustment sets (backdoor criterion). Your diagram is saved in this browser.
      </PageHeader>
      <DagWorkbench store={dagLabStore} height={440} />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>How to use</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm leading-6">
            <ol className="list-decimal space-y-1.5 pl-5">
              <li>Load an example, or type variable names and press <strong>Add</strong>.</li>
              <li>Switch to <strong>Draw arrows</strong>; tap a cause, then its effect. Cycles are refused.</li>
              <li>In <strong>Select / move</strong>, tap a variable to set it as exposure or outcome, adjust for it (drawn as a box), or mark it unmeasured (dashed).</li>
              <li>Press <strong>Check my adjustment set</strong>. Tap any path to highlight it.</li>
            </ol>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Rules the lab applies</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm leading-6">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>A path is blocked by an adjusted non-collider, or by a collider when neither it nor any descendant is adjusted.</li>
              <li>Valid set (total effect): no descendant of the exposure, and every backdoor path blocked.</li>
              <li>Unmeasured variables can never be in an adjustment set.</li>
              <li>Results are only as good as the DAG — the lab checks logic, not your assumptions.</li>
            </ul>
            <p>
              New to DAGs? Start with <Link to="/learn/causal-dags" className="font-medium text-primary underline underline-offset-2">Module 4</Link>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
